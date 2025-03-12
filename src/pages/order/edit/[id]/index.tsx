/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Head, ModalConfirm } from '@/components';
import Content from '@/layout/content/Content';
import AddProductSku from '@/layout/order/add-product-sku';
import CreateOrder from '@/layout/order/create';
import {
  getCODPriceByCourier,
  getDetailOrder,
  updateAllOrder,
  updateOrder,
} from '@/services/order';
import {
  UseDelay,
  changeToFormatPhone,
  checkStatus,
  formateTime,
  getLastPath,
  getTimeStampDate,
  removeComa,
} from '@/utils/formater';
import { CreateOrderPayload, ProductList } from '@/utils/type/order';
import { ProductSingelProps } from '@/utils/type/product';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// assets
import successGif from '@/assets/gift/success-create-sku.gif';
import colors from '@/utils/colors';
import { Spinner } from 'reactstrap';
import { useSelector } from 'react-redux';

const Edit = () => {
  const id = getLastPath();
  const router = useRouter();
  const [listProductSku, setListProductSku] = useState<
    ProductSingelProps[] | null
  >(null);
  const [addProduct, setAddProduct] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [temporyOnchangeWeight, setTemporyOnchangeWeight] =
    useState<boolean>(true);
  const { client_id } = useSelector((state: any) => state.auth.user);
  const [dataEdit, setDataEdit] = useState<CreateOrderPayload>({
    store_id: null,
    channel: '',
    channel_id: null,
    location_id: null,
    order_code: '',
    checkout_at: null,
    payment_method_type_id: null,
    remarks: '',
    created_via: '',
    buyer_info: {
      buyer_name: '',
      buyer_phone: '',
      buyer_email: '',
    },
    package_info: {
      package_weight: 0,
      package_length: 0,
      package_width: 0,
      package_height: 0,
    },
    delivery_info: {
      delivery_method_id: 1,
      logistic_provider_name: '',
      logistic_service_name: '',
      logistic_carrier: '',
      tracking_number: '',
    },
    recipient_info: {
      recipient_name: '',
      recipient_phone: '',
      sub_district_id: null,
      origin_district_id: null,
      recipient_postal_code: '',
      recipient_full_address: '',
      city_name: null,
      recipient_remarks: '',
    },
    price_info: {
      sub_total_price: null,
      shipping_price: null,
      other_price: null,
      total_discount_price: null,
      grand_total_order_price: null,
      // todo
      shipping_price_buyer: false,
      is_insurance: false,
      insurance_amount: null,
      cod_fee: null,
      cod_price: null,
      cod_percentage: null,
      discount_seller: null,
      discount_shipping: null,
      packing_price: null,
    },
    items: [],
  });
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<CreateOrderPayload>({
    store_id: null,
    channel: '',
    channel_id: null,
    location_id: null,
    order_code: '',
    checkout_at: null,
    payment_method_type_id: null,
    remarks: '',
    created_via: '',
    buyer_info: {
      buyer_name: '',
      buyer_phone: '',
      buyer_email: '',
    },
    package_info: {
      package_weight: 0,
      package_length: 0,
      package_width: 0,
      package_height: 0,
    },
    delivery_info: {
      delivery_method_id: 1,
      logistic_provider_name: '',
      logistic_service_name: '',
      logistic_carrier: '',
      tracking_number: '',
    },
    recipient_info: {
      recipient_name: '',
      recipient_phone: '',
      sub_district_id: null,
      origin_district_id: null,
      recipient_postal_code: '',
      recipient_full_address: '',
      city_name: null,
      recipient_remarks: '',
    },
    price_info: {
      sub_total_price: null,
      shipping_price: null,
      other_price: null,
      total_discount_price: null,
      grand_total_order_price: null,
      // todo
      shipping_price_buyer: false,
      is_insurance: false,
      insurance_amount: null,
      cod_fee: null,
      cod_price: null,
      cod_percentage: null,
      discount_seller: null,
      discount_shipping: null,
      packing_price: null,
    },
    items: [],
  });
  const handleSaveSyncProduct = (value: ProductSingelProps[]) => {
    setListProductSku(value);
    setAddProduct(false);
  };

  const handleSetQuantity = (index: number, value: number) => {
    if (listProductSku) {
      let datas = [...listProductSku];
      datas[index].quantity = isNaN(value) ? null : value;
      setListProductSku(datas);
    }
  };

  const handleSetWeightProduct = (index: number, value: number) => {
    if (listProductSku) {
      let datas = [...listProductSku];
      datas[index].weight = isNaN(value) ? null : value;
      setListProductSku(datas);
    }
  };

  const handleSetPrice = (index: number, value: number) => {
    if (listProductSku) {
      let datas = [...listProductSku];
      datas[index].price = isNaN(value) ? '' : value.toString();
      setListProductSku(datas);
    }
  };

  const onDeleteProduct = (id: number) => {
    let list = [...listProductSku];

    const listDeleted = list.filter((data) => data.id != id);
    setListProductSku(listDeleted);
  };

  // const countSubtotal = () => {
  //     let total: number = 0
  //     let datas: ProductSingelProps[] | null = listProductSku
  //     if(datas)
  //     datas.forEach((data) => {
  //         total += (data.quantity * parseInt(data.price))
  //     })

  //     return total;
  // }

  const handleGetCodPrice = async (courier: string) => {
    const carier = courier ? courier.split(' ')[0] : '';
    const response = await getCODPriceByCourier(client_id, carier);

    if(response.data.length > 0) {
        return parseFloat(response.data[0].cod_percentage);
    }
    
    return 0;
  };

  const detailOrder = async () => {
    setLoading(true);
    const response = await getDetailOrder(id);
   
    const data = response?.data.order;
    const percent = await handleGetCodPrice(
      data?.delivery_info?.logistic_provider_name || '',
    );

    if (checkStatus(response?.status)) {
      let product: ProductSingelProps[] = [];
      let dataSKU: ProductSingelProps[] = [];
      data.items.forEach((data) => {
        product.push({
          id: data.internal_product_id,
          sku: data.sku,
          name: data.product_name,
          price: removeComa(data.unit_price).toString(),
          product_type: '',
          created_at: '',
          quantity: data.qty,
          weight: parseInt(data.unit_weight),
        });

        dataSKU.push({
          id: data.internal_product_id,
          sku: data.sku,
          name: data.product_name,
          price: removeComa(data.unit_price).toString(),
          product_type: '',
          created_at: '',
          quantity: data.qty,
          weight: parseInt(data.unit_weight),
        });
      });

      // const prcentFee = parseFloat((parseInt(data?.price_info?.cod_fee.substring(0, data?.price_info?.cod_fee.length - 3)) / parseInt(data?.price_info?.grand_total_order_price.substring(0, data?.price_info?.grand_total_order_price.length - 3))).toFixed(3))

      setFormData({
        store_id: data?.store_id,
        store_name: data?.store_name,
        channel: data?.channel_type,
        channel_id: data?.channel_id || null,
        location_id: data?.location_id || null,
        location_name: data?.location_name || null,
        order_code: data?.order_code,
        checkout_at: data?.checkout_at,
        date_checkout: data?.checkout_at,
        time_checkout: `${formateTime(new Date(data?.checkout_at).getHours())}:${formateTime(new Date(data?.checkout_at).getMinutes())}`,
        payment_method_type_id: data?.payment_method_id,
        payment_method_name: data?.payment_method || null,
        remarks: data?.remarks,
        created_via: data?.created_via,
        buyer_info: {
          buyer_name: data?.buyer_info?.buyer_name,
          buyer_phone: data?.buyer_info?.buyer_phone,
          buyer_email: data?.buyer_info?.buyer_email,
        },
        package_info: {
          package_weight: data?.package_info?.package_weight,
          package_length: data?.package_info.package_length,
          package_width: data?.package_info.package_width,
          package_height: data?.package_info.package_height,
        },
        delivery_info: {
          delivery_method_id: data?.delivery_info?.delivery_method_id,
          logistic_carrier: data?.delivery_info?.logistic_carrier || '',
          logistic_provider_name:
            data?.delivery_info?.logistic_provider_name || '',
          logistic_service_name:
            data?.delivery_info?.logistic_service_name || '',
          tracking_number: data?.delivery_info?.tracking_number,
        },
        recipient_info: {
          recipient_name: data?.recipient_info?.recipient_name,
          recipient_phone: data?.recipient_info?.recipient_phone,
          origin_district_id: data?.location_sub_district_id,
          sub_district_id: data?.recipient_info?.sub_district_id,
          area_name: data?.recipient_info?.recipient_area,
          recipient_postal_code: data?.recipient_info?.recipient_postal_code,
          recipient_full_address: data?.recipient_info?.recipient_full_address,
          recipient_remarks: data?.recipient_info?.recipient_remarks,
        },
        price_info: {
          sub_total_price: parseInt(
            data?.price_info?.sub_total_price.substring(
              0,
              data?.price_info?.sub_total_price.length - 3,
            ),
          ),
          shipping_price:
            parseInt(
              data?.price_info?.shipping_price.substring(
                0,
                data?.price_info?.shipping_price.length - 3,
              ),
            ) > 0
              ? parseInt(
                  data?.price_info?.shipping_price.substring(
                    0,
                    data?.price_info?.shipping_price.length - 3,
                  ),
                )
              : 0,
          other_price: parseInt(
            data?.price_info?.other_price.substring(
              0,
              data?.price_info?.other_price.length - 3,
            ),
          ),
          total_discount_price: parseInt(
            data?.price_info?.total_discount_price.substring(
              0,
              data?.price_info?.total_discount_price.length - 3,
            ),
          ),
          grand_total_order_price:
            data?.payment_method_id == 2
              ? parseFloat(data?.price_info?.cod_price)
              : parseFloat(data?.price_info?.grand_total_order_price),
          //todo
          is_insurance:
            parseInt(
              data?.price_info?.insurance_price?.substring(
                0,
                data?.price_info?.insurance_price?.length - 3,
              ),
            ) > 0
              ? true
              : false,
          insurance_amount: parseInt(
            data?.price_info?.insurance_price.substring(
              0,
              data?.price_info?.insurance_price.length - 3,
            ),
          ),
          shipping_price_buyer:
            parseInt(
              data?.price_info?.discount_shipping?.substring(
                0,
                data?.price_info?.discount_shipping?.length - 3,
              ),
            ) > 0
              ? true
              : false,
          cod_fee: parseFloat(data?.price_info?.cod_fee),
          cod_price: parseFloat(data?.price_info?.cod_price),
          cod_percentage: percent,
          discount_seller: parseInt(
            data?.price_info?.discount_seller?.substring(
              0,
              data?.price_info?.discount_seller?.length - 3,
            ),
          ),
          discount_shipping: parseInt(
            data?.price_info?.discount_shipping?.substring(
              0,
              data?.price_info?.discount_shipping?.length - 3,
            ),
          ),
          packing_price: parseInt(
            data?.price_info?.packing_price?.substring(
              0,
              data?.price_info?.packing_price?.length - 3,
            ),
          ),
        },
        items: [],
      });

      setDataEdit({
        store_id: data?.store_id,
        store_name: data?.store_name,
        channel: data?.channel_type,
        channel_id: data?.channel_id || null,
        location_id: data?.location_id || null,
        location_name: data?.location_name || null,
        order_code: data?.order_code,
        checkout_at: data?.checkout_at,
        date_checkout: data?.checkout_at,
        time_checkout: `${formateTime(new Date(data?.checkout_at).getHours())}:${formateTime(new Date(data?.checkout_at).getMinutes())}`,
        payment_method_type_id: data?.payment_method_id,
        payment_method_name: data?.payment_method || null,
        remarks: data?.remarks,
        created_via: data?.created_via,
        buyer_info: {
          buyer_name: data?.buyer_info?.buyer_name,
          buyer_phone: data?.buyer_info?.buyer_phone,
          buyer_email: data?.buyer_info?.buyer_email,
        },
        package_info: {
          package_weight: data?.package_info?.package_weight,
          package_length: data?.package_info.package_length,
          package_width: data?.package_info.package_width,
          package_height: data?.package_info.package_height,
        },
        delivery_info: {
          delivery_method_id: data?.delivery_info?.delivery_method_id,
          logistic_carrier: data?.delivery_info?.logistic_carrier || '',
          logistic_provider_name:
            data?.delivery_info?.logistic_provider_name || '',
          logistic_service_name:
            data?.delivery_info?.logistic_service_name || '',
          tracking_number: data?.delivery_info?.tracking_number,
        },
        recipient_info: {
          recipient_name: data?.recipient_info?.recipient_name,
          recipient_phone: data?.recipient_info?.recipient_phone,
          origin_district_id: data?.location_sub_district_id,
          sub_district_id: data?.recipient_info?.sub_district_id,
          area_name: data?.recipient_info?.recipient_area,
          recipient_postal_code: data?.recipient_info?.recipient_postal_code,
          recipient_full_address: data?.recipient_info?.recipient_full_address,
          recipient_remarks: data?.recipient_info?.recipient_remarks,
        },
        price_info: {
          sub_total_price: parseInt(
            data?.price_info?.sub_total_price.substring(
              0,
              data?.price_info?.sub_total_price.length - 3,
            ),
          ),
          shipping_price:
            parseInt(
              data?.price_info?.shipping_price.substring(
                0,
                data?.price_info?.shipping_price.length - 3,
              ),
            ) > 0
              ? parseInt(
                  data?.price_info?.shipping_price.substring(
                    0,
                    data?.price_info?.shipping_price.length - 3,
                  ),
                )
              : 0,
          other_price: parseInt(
            data?.price_info?.other_price.substring(
              0,
              data?.price_info?.other_price.length - 3,
            ),
          ),
          total_discount_price: parseInt(
            data?.price_info?.total_discount_price.substring(
              0,
              data?.price_info?.total_discount_price.length - 3,
            ),
          ),
          grand_total_order_price:
            data?.payment_method_id == 2
              ? parseFloat(data?.price_info?.cod_price)
              : parseFloat(data?.price_info?.grand_total_order_price),
          //todo
          is_insurance:
            parseInt(
              data?.price_info?.insurance_price?.substring(
                0,
                data?.price_info?.insurance_price?.length - 3,
              ),
            ) > 0
              ? true
              : false,
          insurance_amount: parseInt(
            data?.price_info?.insurance_price.substring(
              0,
              data?.price_info?.insurance_price.length - 3,
            ),
          ),
          shipping_price_buyer:
            parseInt(
              data?.price_info?.discount_shipping?.substring(
                0,
                data?.price_info?.discount_shipping?.length - 3,
              ),
            ) > 0
              ? true
              : false,
          cod_fee: parseFloat(data?.price_info?.cod_fee),
          cod_price: parseFloat(data?.price_info?.cod_price),
          cod_percentage: percent,
          discount_seller: parseInt(
            data?.price_info?.discount_seller?.substring(
              0,
              data?.price_info?.discount_seller?.length - 3,
            ),
          ),
          discount_shipping: parseInt(
            data?.price_info?.discount_shipping?.substring(
              0,
              data?.price_info?.discount_shipping?.length - 3,
            ),
          ),
          packing_price: parseInt(
            data?.price_info?.packing_price?.substring(
              0,
              data?.price_info?.packing_price?.length - 3,
            ),
          ),
        },
        items: dataSKU,
      });
      setListProductSku(product);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleEditOrder = async () => {
    setLoadingButton(true);

    if (router.query.status === 'DIPROSES') {
      const payload = {
        logistic_carrier: formData?.delivery_info.logistic_carrier,
        tracking_number: formData?.delivery_info.tracking_number,
      };

      const response = await updateOrder(id, payload);
      if (checkStatus(response?.status)) {
        setModalSuccess(true);
        await UseDelay(2500);
        router.back();
        setModalSuccess(false);
      }
    } else {
      let listSku: ProductList[] = [];
      listProductSku.forEach((data) => {
        listSku.push({
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
        checkout_at: getTimeStampDate(formData?.checkout_at) || 0,
        payment_method_type_id: formData?.payment_method_type_id || 0,
        remarks: formData?.remarks,
        created_via: 'MANUAL',
        buyer_info: {
          buyer_name: formData?.buyer_info.buyer_name,
          buyer_phone: formData?.buyer_info.buyer_phone
            ? changeToFormatPhone(formData?.buyer_info.buyer_phone)
            : '',
          buyer_email: formData?.buyer_info.buyer_email,
        },
        package_info: formData?.package_info,
        delivery_info: {
          delivery_method_id: formData?.delivery_info.delivery_method_id,
          logistic_provider_name:
            formData?.delivery_info.logistic_provider_name,
          logistic_service_name: formData?.delivery_info.logistic_service_name,
          logistic_carrier: formData?.delivery_info.logistic_carrier,
          tracking_number: formData?.delivery_info.tracking_number,
        },
        recipient_info: {
          recipient_name: formData?.recipient_info.recipient_name,
          recipient_phone: formData?.recipient_info.recipient_phone
            ? changeToFormatPhone(formData?.recipient_info.recipient_phone)
            : '',
          sub_district_id: formData?.recipient_info.sub_district_id || null,
          recipient_postal_code: formData?.recipient_info.recipient_postal_code,
          recipient_full_address:
            formData?.recipient_info.recipient_full_address || '',
          recipient_remarks: formData?.recipient_info.recipient_remarks,
        },
        price_info: {
          sub_total_price: formData?.price_info?.sub_total_price,
          shipping_price: formData?.price_info.shipping_price || 0,
          other_price: formData?.price_info.other_price || 0,
          // todo next sprint (discount_seller + discount_shipping)
          total_discount_price:
            (formData?.price_info.discount_seller || 0) +
            (formData?.price_info.discount_shipping || 0),
          cod_fee: formData?.price_info.cod_fee || 0,
          cod_price: formData?.price_info?.grand_total_order_price || 0,
          grand_total_order_price:
            formData?.price_info?.grand_total_order_price || 0,
          discount_seller: formData?.price_info.discount_seller || 0,
          discount_shipping: formData?.price_info.discount_shipping || 0,
          packing_price: formData?.price_info?.packing_price || 0,
          insurance_price: formData?.price_info?.insurance_amount || 0,
          discount_shipping_by_seller:
            formData?.price_info.shipping_price_buyer,
        },
        items: listSku,
      };

    //   console.log('payload', payload);

      const response = await updateAllOrder(id, payload);
      if (checkStatus(response?.status)) {
        setModalSuccess(true);
        await UseDelay(2500);
        router.back();
        setModalSuccess(false);
      }
    }

    setLoadingButton(false);
  };

  const renderFormCreate = () => {
    return (
      <CreateOrder
        title={'Edit Pesanan'}
        edit
        editProcess={router.query.status === 'DIPROSES'}
        listProductSku={listProductSku}
        onAddProduct={() => setAddProduct(true)}
        formData={formData}
        setFormData={(data) => setFormData(data)}
        setQuantity={(index, value) => handleSetQuantity(index, value)}
        setWeightProduct={(index, value) =>
          handleSetWeightProduct(index, value)
        }
        setPrice={(index, value) => handleSetPrice(index, value)}
        onDeleteProduct={(id) => onDeleteProduct(id)}
        // subTotal={countSubtotal()}
        handleSave={handleEditOrder}
        loadingButton={loadingButton}
        errorOrderCode={null}
        dataEdit={dataEdit}
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
    detailOrder();
  }, []);

  // useEffect(() => {
  //     let subTotal: number = 0
  //     if(listProductSku) {

  //         listProductSku.forEach((data) => {
  //             subTotal += (data.quantity * parseInt(data.price))
  //         })
  //     }

  //     console.log('---- test40 ----');
  //     setFormData({
  //         ...formData,
  //         price_info: {
  //             ...formData.price_info,
  //             sub_total_price: subTotal
  //         }
  //     })

  // }, [listProductSku])

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
            title={'Berhasil Memperbarui Pesanan!'}
            subtitle={''}
            useTimer={false}
            buttonConfirmation={false}
            handleClickYes={() => {}}
            handleClickCancelled={() => {}}
            textSubmit={''}
            toggle={false}
            stylesCustomTitle={{
              paddingTop: 0,
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
    borderBottomLeftRadius: '60%',
    borderBottomRightRadius: '60%',
    marginTop: '-100px',
    height: '135px',
  },
  ModalContentStyle: {
    width: '350px',
  },
};

export default Edit;
