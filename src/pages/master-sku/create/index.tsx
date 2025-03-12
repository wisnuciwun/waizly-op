import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import CreateSku from '@/layout/master-sku/create-sku';
import SyncProductStore from '@/layout/master-sku/sync-product-store';
import { createSingle } from '@/services/master';
import { UseDelay, checkStatus } from '@/utils/formater';
import { FormDataSingleSku, ImagesUploadState } from '@/utils/type/masterSku';
import { ProductListingProps } from '@/utils/type/product';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';
// routing
import { useRouter } from 'next/navigation';
import { createFormDataSingleSku } from '@/utils/convertToFormData';

const Create = () => {
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
        managedByEthix:'',
        managedByProduct:'',
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
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorType, setErrorType] = useState<'NAME_IS_EXIST' | 'SKU_IS_EXIST' | null>(null);
    const [dataImagesUpload, setDataImagesUpload] = useState<ImagesUploadState[]>([
        {id:1, imageBase64:null, fileType: null},
        {id:2, imageBase64:null, fileType: null},
        {id:3, imageBase64:null, fileType: null},
        {id:4, imageBase64:null, fileType: null},
        {id:5, imageBase64:null, fileType: null}
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

    const handleCreate = async () => {
        setLoading(true);
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
            managed_by: formData.managedByEthix === '' || formData.managedByEthix === 'no' ? false : true,
            product_management_type: formData.managedByProduct ? formData.managedByProduct.toUpperCase() : 'FIFO',
            inbound_expired: formData.inboundExp || 0,
            outbound_expired: formData.outboundExp || 0,
            outer_barcode: formData.outerBarcode || 0,
            conversion_unit: formData.conversionUnit || 0,
            is_production_batch: formData.productionBatch,
            is_advance_qc: formData.advanceQc,
            category: getLastPart,
            images: dataImagesUpload.filter(fileImages => fileImages.fileType !== null).map(fileImages => fileImages.fileType)
        };
        const response = await createSingle(createFormDataSingleSku(payload));
        if(checkStatus(response?.data?.status)) {
            setModalSuccess(true);
            await UseDelay(2500);
            router.push('/master-sku');
            setModalSuccess(false);
        } else {
            setErrorType(response?.error?.type || null);
        }

        setLoading(false);
    };

    useEffect(() => {
        setErrorType(null);
    }, [formData]);

    const renderSyncProduct = () => {
        return (
            <SyncProductStore
              listSelected={listSyncProduct}
              onSaveProduct={(value) => handleSaveSyncProduct(value)}
              onCancel={() => setSyncProduct(false)}
            />
        );
    };

    const renderFormCreate = () => {
        return (
            <CreateSku 
                title={'Tambah Single SKU'}
                listProductSync={listSyncProduct}
                onAddProduct={()=> setSyncProduct(true)}
                onDeleteProduct={(id) => onDeleteList(id)}
                onSave={handleCreate}
                dataForm={formData}
                setDataForm={(data) => setFormData(data)}
                loading={loading}
                loadingButton={loading}
                errorField={errorType}
                setDataImagesUpload={setDataImagesUpload}
                dataImagesUpload={dataImagesUpload}
            />
        );
    };

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
                        title={'Berhasil Menambahkan Master SKU!'}
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

// styles
const styles = {
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

export default Create;