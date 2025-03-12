import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import CreateSku from '@/layout/master-sku/create-sku';
import SyncProductStore from '@/layout/master-sku/sync-product-store';
import { getDetailMasterSku, updateMasterSku } from '@/services/master';
import { UseDelay, checkStatus, lastPath } from '@/utils/formater';
import { FormDataSingleSku, ImagesUploadState } from '@/utils/type/masterSku';
import { ProductListingProps } from '@/utils/type/product';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';
// styles
import { useRouter } from 'next/navigation';
import { Spinner } from 'reactstrap';
import colors from '@/utils/colors';
import { createFormDataSingleSku } from '@/utils/convertToFormData';
// routing


const Edit = () => {
    const router = useRouter();
    const { client_id } = useSelector((state: any) => state?.auth.user);

    const [listSyncProduct, setListSyncProduct] = useState<ProductListingProps[] | null>(null);
    const [formData, setFormData] = useState<FormDataSingleSku>({
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
    const [syncProduct, setSyncProduct] = useState<boolean>(false);
    const [formEdit, setFormEdit] = useState<string>('');
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [errorType, setErrorType] = useState<'NAME_IS_EXIST' | 'SKU_IS_EXIST' | null>(null);
    const [dataImagesUpload, setDataImagesUpload] = useState<ImagesUploadState[]>([
        {id:null, imageBase64:null, fileType: null},
        {id:null, imageBase64:null, fileType: null},
        {id:null, imageBase64:null, fileType: null},
        {id:null, imageBase64:null, fileType: null},
        {id:null, imageBase64:null, fileType: null}
    ]);

    const handleSaveSyncProduct = (value: ProductListingProps[]) => {
        setListSyncProduct(value);
        setSyncProduct(false);
    };

    const onDeleteList = (id: number) => {
        let listSync = [...listSyncProduct];

        const listDeleted = listSync.filter((data) => data.child_product_listing_id != id);
        setListSyncProduct(listDeleted);
    };

    const renderSyncProduct = () => {
        return (
            <SyncProductStore
              listSelected={listSyncProduct}
              onSaveProduct={(value) => handleSaveSyncProduct(value)}
              onCancel={() => setSyncProduct(false)}
            />
        );
    };
    
    const handleEdit = async () => {
        setLoadingButton(true);
        const id = parseInt(lastPath(window.location.href));
        const getLastPart = formData.categorySku.match(/[^/]*$/).toString().trim();

        const payload = {
            name: formData.skuName,
            sku: formData.skuCode,
            barcode: formData.barcode || 0,
            reference_price: formData.referencePrice || 0,
            weight_in_gram: formData.weightProduct || 0,
            length: formData.lengthProduct || 0,
            width: formData.widthProduct || 0,
            height: formData.heightProduct || 0,
            client_id: client_id,
            mapping: listSyncProduct ? listSyncProduct.map((data) => data.child_product_listing_id) : [],
            brand: formData.skuBrand,
            description: formData.skuDescription,
            managed_by: formData.managedByEthix === 'yes' ? true : false,
            product_management_type: formData.managedByProduct.toUpperCase(),
            inbound_expired: formData.inboundExp || 0,
            outbound_expired: formData.outboundExp || 0,
            outer_barcode: formData.outerBarcode || 0,
            conversion_unit: formData.conversionUnit || 0,
            is_production_batch: formData.productionBatch,
            is_advance_qc: formData.advanceQc,
            category: getLastPart,
            images: dataImagesUpload.filter(fileImages => fileImages.fileType !== null || (fileImages.imageBase64 === null && fileImages.id)).map(fileImages => ({images: fileImages.fileType ? fileImages.fileType : '', id: fileImages.id ? fileImages.id : '' }))
        };
        const response = await updateMasterSku(id,createFormDataSingleSku(payload,true));
        if(checkStatus(response?.data?.status)) {
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
        const response = await getDetailMasterSku(id);

        if(checkStatus(response?.status)) {
            const data = response.data.product;
            const dataForm = {
                skuName: data.product_name,
                skuCode: data.sku,
                referencePrice: data.price == 0 ? null : data.price,
                weightProduct: data.weight_in_gram == 0 ? null : data.weight_in_gram,
                lengthProduct: data.dimension.length == 0 ? null : data.dimension.length,
                widthProduct: data.dimension.width == 0 ? null : data.dimension.width,
                heightProduct: data.dimension.height == 0 ? null : data.dimension.height,
                categorySku: data.category,
                skuBrand: data.brand,
                created: data.created_at,
                updated: data.updated_at,
                managedByEthix: data.managed_by === 'false' ? 'no' : 'yes',
                managedByProduct: data.product_management_type === 'FIFO' ? 'fifo' : 'fefo',
                outboundExp: data.outbound_expired == 0 ? '' : data.outbound_expired,
                inboundExp:  data.inbound_expired == 0 ? '' : data.inbound_expired,
                barcode: data.barcode,
                outerBarcode: data.outer_barcode,
                conversionUnit: data.conversion_unit == 0 ? '' : data.conversion_unit,
                advanceQc: !data.is_advance_qc ? false : true,
                productionBatch: !data.is_production_batch ? false : true,
                skuDescription: data.description
            };

            const setDataImageDetail = data?.images?.map((image) => ({
                id: image.product_image_id,
                imageBase64: image.image_url,
                fileType: null 
            }));

            while (setDataImageDetail.length < 5) {
                setDataImageDetail.push({ id: null, imageBase64: null, fileType: null });
            }   

            const setToJsonValidation = data?.images?.filter(fileImages => fileImages.image_url !== null).map(fileImages => fileImages.image_url);

            setDataImagesUpload(setDataImageDetail);
            setFormData(dataForm);
            setListSyncProduct(data.product_listing);
            const editData = `${JSON.stringify(dataForm)}${JSON.stringify(data.product_listing)}${JSON.stringify(setToJsonValidation)}`;
            setFormEdit(editData);
        }

        setLoading(false);

    };
    
    useEffect(() => {
        getDataDetail();
    },[]);

    const renderFormCreate = () => {
        return (
            <CreateSku 
                title={'Detail Master SKU'}
                listProductSync={listSyncProduct}
                onAddProduct={()=> setSyncProduct(true)}
                onDeleteProduct={(id) => onDeleteList(id)}
                onSave={handleEdit}
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

    
    if(loading) 
        return (
            <Content>
                <div style={styles.Container}>
                    <Spinner size={'lg'} color={colors.darkBlue}/>
                </div>
            </Content>
        ); 

    return (
        <>
             <Head title="Master SKU" />
             <Content>
                {syncProduct ? renderSyncProduct() : renderFormCreate()}
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
                        handleClickYes={()=>{}}
                        handleClickCancelled={()=> {}}
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
        alignItems: 'center'
    },
    ButtonSecondary: {
        height: 43,
        width: 180,
        fontSize: 14,
        color: '#203864'
    },
    ButtonPrimary: {
        height: 43,
        width: 180,
        fontSize: 14
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
        width: '350px'
    }
};

export default Edit;
