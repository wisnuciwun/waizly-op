/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import SyncProductStore from '@/layout/master-sku/sync-product-store';
import { changeInfoBundling, getDetailBundling } from '@/services/master';
import { UseDelay, checkStatus, lastPath } from '@/utils/formater';
import { ImagesUploadState } from '@/utils/type/masterSku';
import { ProductListingProps, ProductSingelProps } from '@/utils/type/product';
import CreateBundleSku from '@/layout/master-sku/create-bundle-sku';

import { useSelector } from 'react-redux';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';

// routing
import { useRouter } from 'next/navigation';
import AddProductSingle from '@/layout/master-sku/add-product-single';
import { Spinner } from 'reactstrap';
import colors from '@/utils/colors';
import { createFormDataBundlingSku } from '@/utils/convertToFormData';

const EditBundling = () => {
  const router = useRouter();
  const { client_id } = useSelector((state: any) => state?.auth.user);

  const [listSyncProduct, setListSyncProduct] = useState<
    ProductListingProps[] | null
  >(null);
  const [listSingleProduct, setListSingleProduct] = useState<
    ProductSingelProps[] | null
  >(null);
  
  const [formData, setFormData] = useState<any>({
    skuName: '',
    skuCode: '',
    skuDescription:'',
    skuBrand:'',
    referencePrice: null,
    weightProduct: null,
    lengthProduct: null,
    widthProduct: null,
    heightProduct: null,
    managedByEthix:'no',
    managedByProduct:'fifo',
    categorySku:'',
    outboundExp: '',
    inboundExp: '',
    barcode:'',
    outerBarcode: '',
    conversionUnit: '',
    advanceQc: false,
    productionBatch: false,
    created: '',
    updated: ''
  });
  const [formEdit, setFormEdit] = useState<string>('');
  const [viewActive, setViewActive] = useState<'form' | 'sync' | 'single'>(
    'form'
  );
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<
    'NAME_IS_EXIST' | 'SKU_IS_EXIST' | null
  >(null);
  const [dataImagesUpload, setDataImagesUpload] = useState<ImagesUploadState[]>([
    {id:null, imageBase64:null, fileType: null},
    {id:null, imageBase64:null, fileType: null},
    {id:null, imageBase64:null, fileType: null},
    {id:null, imageBase64:null, fileType: null},
    {id:null, imageBase64:null, fileType: null}
]);
const [imagesFromApiLength,setImagesFromApiLength] = useState<number>(null);

  const handleSaveSyncProduct = (value: ProductListingProps[]) => {
    setListSyncProduct(value);
    setViewActive('form');
  };

  const handleSaveSingleProduct = (value: ProductSingelProps[]) => {
    setListSingleProduct(value);
    setViewActive('form');
  };

  const onDeleteList = (id: number) => {
    let listSync = [...listSyncProduct];

    const listDeleted = listSync.filter(
      (data) => data.child_product_listing_id != id
    );
    setListSyncProduct(listDeleted);
  };

  const onDeleteSingleList = (id: number) => {
    let listSingle = [...listSingleProduct];

    const listDelted = listSingle.filter((data) => data.id != id);
    setListSingleProduct(listDelted);
  };

  const renderSyncProduct = () => {
    return (
      <SyncProductStore
        listSelected={listSyncProduct}
        onSaveProduct={(value) => handleSaveSyncProduct(value)}
        onCancel={() => setViewActive('form')}
      />
    );
  };

  const renderAddSingle = () => {
    return (
      <AddProductSingle
        listSelected={listSingleProduct}
        onSaveProduct={(value) => handleSaveSingleProduct(value)}
        onCancel={() => setViewActive('form')}
        edit
      />
    );
  };

  const handleUpdate = async () => {
    setLoadingButton(true);
    let bundling: Array<object> = [];
    const id = parseInt(lastPath(window.location.href));
    listSingleProduct.forEach((data) => {
      bundling.push({
        product_id: data.product_id,
        quantity: data.quantity ?? 0,
      });
    });
    const getLastPart = formData.categorySku.match(/[^/]*$/).toString().trim();
    const payload = {
      bundling_name: formData.skuName,
        sku: formData.skuCode,
        barcode: formData.barcode || 0,
        publish_price: formData.referencePrice || 0,
        weight_in_gram: formData.weightProduct || 0,
        dimension: {
          length: formData.lengthProduct || 0,
          width: formData.widthProduct || 0,
          height: formData.heightProduct || 0,
        },
        client_id: client_id,
        bundling_detail: bundling,
        mapping: listSyncProduct
        ? listSyncProduct.map((data) => data.child_product_listing_id)
        : [],
        brand: formData.skuBrand,
        description: formData.skuDescription,
        managed_by: formData.managedByEthix === 'yes' ? true : false,
        product_management_type: formData.managedByProduct.toUpperCase(),
        inbound_expired: formData.inboundExp || 0,
        outbound_expired: formData.outboundExp || 0,
        outer_barcode: formData.outerBarcode ||  0,
        conversion_unit: formData.conversionUnit || 0,
        is_production_batch: formData.productionBatch,
        is_advance_qc: formData.advanceQc,
        category: getLastPart,
        images: dataImagesUpload.filter(fileImages => fileImages.fileType !== null || (fileImages.imageBase64 === null && fileImages.id)).map(fileImages => ({images: fileImages.fileType ? fileImages.fileType : '', id: fileImages.id ? fileImages.id : '' }))
    };

    const response = await changeInfoBundling(id, createFormDataBundlingSku(payload,true));
    if (checkStatus(response?.data?.status)) {
      setModalSuccess(true);
      await UseDelay(2500);
      router.push('/master-sku');
      setModalSuccess(false);
    } else {
      setErrorType(response?.error?.type || null);
    }

    setLoadingButton(false);
  };

  const getDataDetail = async () => {
    setLoading(true);
    const id = parseInt(lastPath(window.location.href));

    const response = await getDetailBundling(id);
    if (checkStatus(response?.status)) {
      const dataResponse = response?.data?.bundling;
      console.log(dataResponse);
      const dataForm = {
        skuName: dataResponse.name,
        skuCode: dataResponse.sku,
        referencePrice:
          dataResponse.reference_price == 0
            ? null
            : dataResponse.reference_price,
        skuBrand: dataResponse.brand,
        weightProduct: dataResponse.weight == 0 ? null : dataResponse.weight,
        lengthProduct: dataResponse.length == 0 ? null : dataResponse.length,
        widthProduct: dataResponse.width == 0 ? null : dataResponse.width,
        heightProduct: dataResponse.height == 0 ? null : dataResponse.height,
        created: dataResponse.created_at,
        updated: dataResponse.updated_at,
        managedByEthix: dataResponse.managed_by === 'false' ? 'no' : 'yes',
        managedByProduct: dataResponse.product_management_type === 'FIFO' ? 'fifo' : 'fefo',
        outboundExp: dataResponse.outbound_expired == 0 ? '' : dataResponse.outbound_expired,
        inboundExp:  dataResponse.inbound_expired  == 0 ? '' : dataResponse.inbound_expired,
        barcode: dataResponse.barcode,
        outerBarcode: dataResponse.outer_barcode,
        conversionUnit: dataResponse.conversion_unit == 0 ? '' : dataResponse.conversion_unit,
        advanceQc: !dataResponse.is_advance_qc ? false : true,
        productionBatch: !dataResponse.is_production_batch ? false : true,
        skuDescription: dataResponse.description,
        categorySku: dataResponse.category,
      };

      const setDataImageDetail = dataResponse?.product_images?.map((image) => ({
        id: image.product_image_id,
        imageBase64: image.image_url,
        fileType: null 
      }));

      while (setDataImageDetail.length < 5) {
          setDataImageDetail.push({ id: null, imageBase64: null, fileType: null });
      }   

      const setToJsonValidation = dataResponse?.product_images?.filter(fileImages => fileImages.image_url !== null).map(fileImages => fileImages.image_url);

      setImagesFromApiLength(setToJsonValidation.length);
      setDataImagesUpload(setDataImageDetail);
      setFormData(dataForm);
      setListSyncProduct(dataResponse.product_listing);
      setListSingleProduct(response?.data?.items);
      const editData = `${JSON.stringify(dataForm)}${JSON.stringify(
        dataResponse.product_listing
      )}${JSON.stringify(response?.data?.items)}${JSON.stringify(setToJsonValidation)}`;
      setFormEdit(editData);
    }

    setLoading(false);
  };

  const handleSetValueSingle = (index: number, value: string) => {
    if (listSingleProduct) {
      let dataCheked = [...listSingleProduct];
      dataCheked[index].quantity = parseInt(value);
      setListSingleProduct(dataCheked);
    }
  };

  const renderFormCreate = () => {
    return (
      <CreateBundleSku
        title={'Detail Master SKU'}
        listProductSync={listSyncProduct}
        listProductSingle={listSingleProduct}
        setValueSingle={(index, value) => handleSetValueSingle(index, value)}
        onAddSingle={() => setViewActive('single')}
        onDeleteSingle={(id) => onDeleteSingleList(id)}
        onAddProduct={() => setViewActive('sync')}
        onDeleteProduct={(id) => onDeleteList(id)}
        onSave={handleUpdate}
        dataForm={formData}
        setDataForm={(data) => setFormData(data)}
        loading={loading}
        loadingButton={loadingButton}
        formEdit={formEdit}
        edit
        errorField={errorType}
        setDataImagesUpload={setDataImagesUpload}
        dataImagesUpload={dataImagesUpload}
      />
    );
  };

  useEffect(() => {
    getDataDetail();
  }, []);

  if (loading)
    return (
      <Content>
        <div style={styles.Container}>
          <Spinner size={'lg'} color={colors.darkBlue} />
        </div>
      </Content>
    );

  return (
    <>
      <Head title="Master SKU" />
      <Content>
        {viewActive === 'sync'
          ? renderSyncProduct()
          : viewActive === 'single'
          ? renderAddSingle()
          : renderFormCreate()}
        {modalSuccess && (
          <ModalConfirm
            icon={successGif}
            widthImage={350}
            heightImage={320}
            modalContentStyle={styles.ModalContentStyle}
            modalBodyStyle={styles.ModalConfirm}
            title={'Berhasil Memperbarui Master SKU!'}
            subtitle={''}
            useTimer={false}
            buttonConfirmation={false}
            handleClickYes={() => {}}
            handleClickCancelled={() => {}}
            textSubmit={''}
            toggle={false}
            stylesCustomTitle={{
              paddingTop: 0
            }}
            singleButtonConfirmation={false}
            textSingleButton={''}
          />
        )}
      </Content>
    </>
  );
};

export const styles = {
  Container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonSecondary: {
    height: 43,
    width: 180,
    fontSize: 14,
    color: '#203864',
  },
  ButtonPrimary: {
    height: 43,
    width: 180,
    fontSize: 14,
  },
  ModalConfirm: {
    borderTopLeftRadius: '60%',
    borderTopRightRadius: '60%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: '-100px',
    height: '135px',
  },
  ModalContentStyle: {
    width: '350px',
  },
};

export default EditBundling;
