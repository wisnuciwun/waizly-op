/* eslint-disable react-hooks/exhaustive-deps */
import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import AddProductSku from '@/layout/order/add-product-sku';
import CreateOrder from '@/layout/order/create';
import { createOrder } from '@/services/order';
import { UseDelay, checkStatus } from '@/utils/formater';
import { CreateOrderPayload, ProductList } from '@/utils/type/order';
import { ProductSingelProps } from '@/utils/type/product';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';

const Create = () => {
    const router = useRouter();
    const [listProductSku, setListProductSku] = useState<ProductSingelProps[] | null>(null);
    const [addProduct, setAddProduct] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [temporyOnchangeWeight, setTemporyOnchangeWeight] = useState<boolean>(true);
    const [errorOrderCode, setErrorOrderCode] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateOrderPayload>({
        store_id: null,
        channel: '',
        channel_id: null,
        location_id: null,
        order_code: '',
        checkout_at: null,
        payment_method_type_id: null,
        remarks: null,
        created_via: '',
        buyer_info:{
            buyer_name: null,
            buyer_phone: null,
            buyer_email: ''
        },
        package_info: {
            package_weight: null,
            package_length: null,
            package_width: null,
            package_height: null,
        },
        delivery_info: {
            delivery_method_id: 1,
            logistic_provider_name: '',
            logistic_service_name: '',
            logistic_carrier: '',
            tracking_number: ''
        },
        recipient_info: {
            recipient_name: null,
            recipient_phone: null,
            sub_district_id: null,
            origin_district_id: null,
            recipient_postal_code: null,
            recipient_full_address: null,
            city_name: null,
            recipient_remarks: ''
        },
        price_info: {
            sub_total_price: null,
            shipping_price: null,
            other_price: null,
            total_discount_price: null,
            grand_total_order_price: null,
            shipping_price_buyer: false,
            is_insurance: false,
            insurance_amount: null,
            cod_fee: null,
            cod_price: null,
            cod_percentage: null,
            discount_seller: null,
            discount_shipping: null,
            packing_price: null
        },
        items: null
    });

    useEffect(() => {
        if(formData?.order_code && errorOrderCode) {
            setErrorOrderCode(null);
        }
    },[formData?.order_code]);
    const handleSaveSyncProduct = (value: ProductSingelProps[]) => {
        setListProductSku(value);
        if(temporyOnchangeWeight) {
            console.log('----- set form 36 -----');
            const totalWeight = value?.reduce((acc, data) => acc + data.weight, 0);
            setFormData({
                ...formData,
                package_info: {
                  ...formData.package_info,
                  package_weight: totalWeight,
                    
                },
              });
        }
        setAddProduct(false);

    };

    const handleSetQuantity = (index: number, value: number) => {
        if(listProductSku){
            let datas = [...listProductSku];
            datas[index].quantity = isNaN(value) ? null : value;
            setListProductSku(datas);
        }
    };

    const handleSetWeightProduct = (index: number, value: number) => {
        // Calculate the total weight
        if(listProductSku){
            let datas = [...listProductSku];
            datas[index].weight =  isNaN(value) ? null : value;
            // if(temporyOnchangeWeight) {
            //     const totalWeight = listProductSku?.reduce((acc, data) => acc + data.weight, 0);
               
            // }
            setListProductSku(datas);
        }
    };

    const handleSetPrice = (index: number, value: number) => {
        if(listProductSku){
            let datas = [...listProductSku];
            datas[index].price =  isNaN(value) ? '' : value.toString();
            setListProductSku(datas);
        }
    };

    const onDeleteProduct = (id: number) => {
        let list = [...listProductSku];
        const listDeleted = list.filter((data) => data.id != id);
        if(temporyOnchangeWeight) {
            console.log('----- set form 37 -----');
            const totalWeight = listDeleted?.reduce((acc, data) => acc + data.weight, 0);
            setFormData({
            ...formData,
            package_info: {
              ...formData.package_info,
              package_weight: totalWeight,
            }
          });
        }
        setListProductSku(listDeleted);
    };

    const handleCreateOrder = async () => {
        setLoading(true);
        let listProduct: ProductList[] = [];

        listProductSku.forEach((data) => {
            listProduct.push({
                product_id: data.id,
                qty: data.quantity || 0,
                unit_weight: data.weight || 0,
                unit_price: parseInt(data.price) || 0,
            });
        });

        const payload = {
            store_id: formData?.store_id || 0,
            channel: formData?.channel,
            channel_id: formData?.channel_id,
            location_id: formData?.location_id || 0,
            order_code: formData?.order_code,
            checkout_at: formData?.checkout_at || 0,
            payment_method_type_id: formData?.payment_method_type_id || 0, 
            remarks: formData?.remarks,
            created_via: 'MANUAL', 
            buyer_info: {
                buyer_name: formData?.buyer_info.buyer_name,
                buyer_phone: formData?.buyer_info.buyer_phone ? `+62${formData?.buyer_info.buyer_phone}` : '',
                buyer_email: formData?.buyer_info.buyer_email
            },
            package_info: formData?.package_info,
            delivery_info: {
                delivery_method_id: formData?.delivery_info.delivery_method_id,
                logistic_provider_name: formData?.delivery_info.logistic_provider_name,
                logistic_service_name: formData?.delivery_info.logistic_service_name,
                logistic_carrier: formData?.delivery_info.logistic_carrier,
                tracking_number: formData?.delivery_info.tracking_number
            },
            recipient_info:{
                recipient_name: formData?.recipient_info.recipient_name,
                recipient_phone: formData?.recipient_info.recipient_phone ? '+62' + formData?.recipient_info.recipient_phone : '',
                sub_district_id: formData?.recipient_info.sub_district_id || null,
                recipient_postal_code: formData?.recipient_info.recipient_postal_code,
                recipient_full_address: formData?.recipient_info.recipient_full_address || '',
                recipient_remarks: formData?.recipient_info.recipient_remarks
            },
            price_info:{
                sub_total_price: formData?.price_info?.sub_total_price,
                shipping_price: formData?.price_info.shipping_price || 0,
                other_price: formData?.price_info.other_price || 0 ,
                // todo next sprint (discount_seller + discount_shipping)
                total_discount_price: formData?.price_info.total_discount_price || 0,
                cod_fee: formData?.price_info.cod_fee || 0,
                cod_price: formData?.price_info?.grand_total_order_price || 0,
                grand_total_order_price: formData?.price_info?.grand_total_order_price || 0,
                discount_seller: formData?.price_info.discount_seller || 0,
                discount_shipping: formData?.price_info.discount_shipping || 0,
                packing_price: formData?.price_info?.packing_price || 0,
                insurance_price: formData?.price_info?.insurance_amount ||  0,
                discount_shipping_by_seller: formData?.price_info.shipping_price_buyer
            },
            items:listProduct,
        };

        const response = await createOrder(payload);

        if(checkStatus(response?.data?.status)) {
            setModalSuccess(true);
            await UseDelay(2500);
            router.back();
            setModalSuccess(false);
        }else {
            if(response?.error?.type === 'ORDER_CODE_ALREADY_USED'){
                setErrorOrderCode(response?.error?.type || null);
            }
        }
        setLoading(false);
    };

    // handle set list product sku parse data
    const handleSetListProductSku = (items: ProductSingelProps[]) => {
        setListProductSku(items);
      };


    const renderFormCreate = () => {
        return (
            <CreateOrder
                title={'Tambah Pesanan'}
                listProductSku={listProductSku}
                setListProductSku={handleSetListProductSku}
                onAddProduct={() => setAddProduct(true)}
                formData={formData}
                setFormData={(data) => setFormData(data)}
                setQuantity={(index, value) => handleSetQuantity(index, value)}
                setWeightProduct={(index, value) => handleSetWeightProduct(index, value)}
                setPrice={(index, value) => handleSetPrice(index, value)}
                onDeleteProduct={(id) => onDeleteProduct(id)}
                // subTotal={countSubtotal()}
                handleSave={handleCreateOrder}
                loadingButton={loading}
                errorOrderCode={errorOrderCode}
                setTemporyOnchangeWeight={setTemporyOnchangeWeight}
            />
        );
    };

    const renderAddSku = () => {
        return (
            <AddProductSku 
                listSelected={listProductSku}
                onSaveProduct={(value) => handleSaveSyncProduct(value)}
                onCancel={() => setAddProduct(false)}
            />
        );
    };

    useEffect(() => {
        if(listProductSku) {
            let totalWeight: number = 0;
            let subTotal: number = 0;
            listProductSku.forEach((data) => {
                if(data.quantity && data.weight) {
                    totalWeight += (data.quantity * data.weight);
                }
                subTotal += (data.quantity * parseInt(data.price));
            });

            const fee = (formData?.price_info?.cod_percentage || 0) * (formData?.price_info.shipping_price + subTotal + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0));
            const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
            const dataCodForm = subTotal + formData?.price_info.shipping_price + (formData?.price_info.other_price || 0) - (formData?.price_info.total_discount_price || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0);
              
            if(temporyOnchangeWeight) {
                console.log('----- set form 38 -----');
                setFormData({
                    ...formData,
                    package_info: {
                        ...formData.package_info,
                        package_weight: totalWeight,
                    },
                    delivery_info: {
                        ...formData.delivery_info,
                        logistic_carrier: '',
                    },
                    price_info: {
                        ...formData.price_info,
                        sub_total_price: subTotal,
                        shipping_price: formData?.delivery_info?.delivery_method_id == 2 ? formData?.price_info?.shipping_price : 0,
                        cod_fee: 0,
                        cod_percentage: 0,
                        shipping_price_buyer: false,
                        is_insurance: false,
                        insurance_amount: 0,
                        discount_shipping: formData?.delivery_info?.delivery_method_id == 2 ? formData?.price_info?.discount_shipping : 0,
                        grand_total_order_price: subTotal + formData?.price_info.other_price + (formData?.delivery_info?.delivery_method_id == 2 ? (formData?.price_info?.shipping_price || 0) : 0) +  (formData?.price_info?.packing_price || 0)
                    }
                });
            } else {
                console.log('----- set form 39 -----');
                setFormData({
                    ...formData,
                    price_info: {
                        ...formData.price_info,
                        sub_total_price: subTotal,
                        cod_price: dataCodForm,
                        cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
                        is_insurance: false,
                        insurance_amount: 0,
                        grand_total_order_price: subTotal + (formData?.price_info.shipping_price || 0) + formData?.price_info.other_price - (formData?.price_info.total_discount_price || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info?.packing_price || 0),
                    }
                });
            }
        }
        
    }, [listProductSku]);


    return (
        <>
             <Head title="Pesanan" />
             <Content>
                {addProduct ? renderAddSku() : renderFormCreate()}

                {modalSuccess && (
                    <ModalConfirm
                        icon={successGif}
                        widthImage={350}
                        heightImage={320}
                        modalContentStyle={styles.ModalContentStyle}
                        modalBodyStyle={styles.ModalConfirm}
                        title={'Berhasil Menambahkan Pesanan!'}
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
        borderBottomLeftRadius: '60%',
        borderBottomRightRadius: '60%',
        marginTop: '-100px',
        height: '135px',
    },
    ModalContentStyle: {
        width: '350px'
    }
};

export default Create;