import React, { useState } from 'react';
import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import SyncProductStore from '@/layout/master-sku/sync-product-store';
import { createBundling } from '@/services/master';
import { UseDelay, checkStatus } from '@/utils/formater';
import { FormDataSingleSku, ImagesUploadState } from '@/utils/type/masterSku';
import { ProductListingProps, ProductSingelProps } from '@/utils/type/product';
import CreateBundleSku from '@/layout/master-sku/create-bundle-sku';

import { useSelector } from 'react-redux';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';
// routing
import { useRouter } from 'next/navigation';
import AddProductSingle from '@/layout/master-sku/add-product-single';

import {createFormDataBundlingSku} from '@/utils/convertToFormData';

const CreateBundling = () => {
    const router = useRouter();
    const { client_id } = useSelector((state: any) => state?.auth.user);

    const [listSyncProduct, setListSyncProduct] = useState<ProductListingProps[] | null>(null);
    const [listSingleProduct, setListSingleProduct] = useState<ProductSingelProps[] | null>(null);
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
    const [viewActive, setViewActive] = useState<'form' | 'sync' | 'single'>('form');
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
        setViewActive('form');
    };

    const handleSaveSingleProduct = (value: ProductSingelProps[]) => {
        setListSingleProduct(value);
        setViewActive('form');
    };

    const onDeleteList = (id: number) => {
        let listSync = [...listSyncProduct];

        const listDeleted = listSync.filter((data) => data.child_product_listing_id != id);
        setListSyncProduct(listDeleted);
    };

    const onDeleteSingleList = (id: number) => {
        let listSingle = [...listSingleProduct];
        
        const listDeleted = listSingle.filter((data) => data.id != id);
        setListSingleProduct(listDeleted);
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
            />
        );
    };

    const handleCreate = async () => {
        setLoading(true);
        let bundling: Array<object> = [];

        listSingleProduct.forEach((data) => {
            bundling.push({
                product_id: data.id,
                quantity: data.quantity?? 0
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

        const response = await createBundling(createFormDataBundlingSku(payload));
        if(checkStatus(response?.data?.status)) {
            setModalSuccess(true);
            await UseDelay(2500);
            router.push('/master-sku');
            setModalSuccess(false);
        }else {
            setErrorType(response?.error?.type || null);
        }

        setLoading(false);

    };

    const handleSetValueSingle = (index: number, value: string) => {
        if(listSingleProduct) {
            let dataCheked = [...listSingleProduct];
            dataCheked[index].quantity = parseInt(value);
            setListSingleProduct(dataCheked);
        }
    };

    const renderFormCreate = () => {
        return (
            <CreateBundleSku
                title={'Tambah Bundling SKU'}
                listProductSync={listSyncProduct}
                listProductSingle={listSingleProduct}
                setValueSingle={(index, value) => handleSetValueSingle(index, value)}
                onAddSingle={()=> setViewActive('single')}
                onDeleteSingle={(id) => onDeleteSingleList(id)}
                onAddProduct={()=> setViewActive('sync')}
                onDeleteProduct={(id) => onDeleteList(id)}
                onSave={handleCreate}
                dataForm={formData}
                setDataForm={(data) => setFormData(data)}
                loading={loading}
                loadingButton={loading}
                edit={false}
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
                {viewActive === 'sync' ? renderSyncProduct() : 
                viewActive === 'single' ? renderAddSingle() : 
                renderFormCreate()}
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

export default CreateBundling;