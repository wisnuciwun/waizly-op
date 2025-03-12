/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import Create, {styles} from './styles';
import {Col, Row, Spinner} from 'reactstrap';
import {Button, ModalConfirmPopup} from '@/components';
import ModalCancel from '@/components/atoms/modal/modal-confirm/modalCancel';
import FormSide from './section/form-side';
import FormInfoOrder from './section/form-info-order';
import FormInfoShipping from './section/form-info-shipping';
import FormInfoPackage from './section/form-info-package';
import FormModalParseData from './section/form-modal-parse-data';
import {CreateOrderPayload, PayloadEditOrder} from '@/utils/type/order';
import {ProductSingelProps} from '@/utils/type/product';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import fine from '@/assets/gift/fine.gif';
import {checkNotEmptyValueInObject} from '@/utils/formater';

import {validateRange} from '@/utils/validation';
import colors from '@/utils/colors';
import { calculateInsurance } from '@/services/order';
import { debounce } from 'lodash';
interface Props {
  title: string;
  formData: CreateOrderPayload;
  listProductSku: ProductSingelProps[] | null;
  setListProductSku?: (items: ProductSingelProps[]) => void;
  setFormData: (data: CreateOrderPayload) => void;
  setQuantity: (index: number, value: number) => void;
  setWeightProduct: (index: number, value: number) => void;
  setPrice: (index: number, value: number) => void;
  onAddProduct: () => void;
  onDeleteProduct: (data: number) => void;
  // subTotal: number;
  handleSave: () => void;
  loadingButton: boolean;
  edit?: boolean;
  editProcess?: boolean;
  completed?: boolean;
  dataEdit?: PayloadEditOrder;
  errorOrderCode: string | null;
  setTemporyOnchangeWeight?: (value: boolean) => void;
}

const CreateOrder = ({
  title,
  formData,
  listProductSku,
  setListProductSku,
  setFormData,
  setQuantity,
  setWeightProduct,
  setPrice,
  onDeleteProduct,
  onAddProduct,
  // subTotal,
  loadingButton,
  edit,
  editProcess,
  handleSave,
  // editForm,
  dataEdit,
  // setDataEdit,
  errorOrderCode,
  completed,
  setTemporyOnchangeWeight,
}: Props) => {
  const route = useRouter();
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [modalChangeDetail, setModalChangeDetail] = useState<boolean>(false);
  const [enableChangeWidth, setEnableChangeWidth] = useState<boolean>(false);
  const [modalParseData, setModalParseData] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const [tempInsurance, setTempInsurance] = useState<number>(0);
  const [loadingInsurance, setLoadingInsurance] = useState<boolean>(false);
  const firstUpdate = useRef(true);
  const isOverWeight = () => {
    let weightTotal: number = 0;
    if (listProductSku) {
      listProductSku.forEach((data) => {
        weightTotal += (data.weight || 0) * (data.quantity || 0);
      });
    }

    if (formData?.package_info?.package_weight > 0) return formData?.package_info?.package_weight < weightTotal;

    return false;
  };

  const handleValidationList = () => {
    let valid: boolean = false;

    if (listProductSku && listProductSku.length > 0) {
      listProductSku.forEach((data) => {
        if (data.quantity === null || data.quantity == 0 || data.price.length == 0 || data.price === '0.00' || data.price === '0' || data.price == null || data.weight === null || data.weight == 0) valid = true;
        else valid = false;
      });
    } else {
      valid = true;
    }
    return valid;
  };

  const validateRemaks = () => {
    if (formData?.remarks?.length > 0) {
      return validateRange(formData?.remarks, '', 10).length != 0;
    } else return false;
  };
  
  const handleCalculateInsurance = async (isInsurance: boolean, courier: string, subtotal: number, other_price: number, discount: number) => {
    const carier = courier?.split(' ');
    const payload  = {
      courier: carier? carier[0] : '',
      subtotal,
      other_price,
      discount
    };

    if(isInsurance) {
      setLoadingInsurance(true);
      const response = await calculateInsurance(payload);
      setLoadingInsurance(false);
      if(response?.status == 200) {
        setTempInsurance(response.data?.insurance || 0);
        return response.data?.insurance || 0;
      }

      
    }
    return 0;
  };

  const handleDisable = () => {
    if (completed) {
      if (
        validateRange(formData?.recipient_info.recipient_phone, '', 7).length != 0 ||
        !formData?.recipient_info.sub_district_id ||
        !formData?.recipient_info.recipient_name ||
        validateRange(formData?.recipient_info.recipient_postal_code, '', 5).length != 0 ||
        validateRange(formData?.recipient_info.recipient_full_address, '', 10).length != 0 ||
        // validateRange(formData?.remarks, '', 10).length !=0 ||
        !formData?.delivery_info.logistic_carrier
      ) {
        setDisableButton(true);
      } else setDisableButton(false);
    } else if (editProcess) {
      if ((formData.delivery_info?.logistic_carrier || null) != (dataEdit?.delivery_info?.logistic_carrier || null) || (formData.delivery_info?.tracking_number || null) != (dataEdit.delivery_info?.tracking_number || null)) {
        setDisableButton(false);
      } else setDisableButton(true);
    } else {
      // if (edit) {
      //   if (
      //     !formData.location_id ||
      //     !formData.buyer_info.buyer_name ||
      //     !formData.package_info.package_weight ||
      //     !formData?.package_info.package_height ||
      //     !formData.package_info.package_length ||
      //     !formData.package_info.package_width ||
      //     !formData?.recipient_info.recipient_name ||
      //     (editForm.logistic_carrier || null) != (dataEdit?.logistic_carrier || null) ||
      //     (editForm.tracking_number || null) != (dataEdit.tracking_number || null) ||
      //     (editForm.location_id || null) != (dataEdit.location_id || null)
      //   ) {
      //     setDisableButton(false);
      //   } else setDisableButton(true);
      // } else
      const income =
        (formData?.price_info?.sub_total_price || 0) +
        (formData?.price_info?.shipping_price_buyer ? 0 : (formData?.price_info.shipping_price || 0)) +
        (formData?.price_info.other_price || 0);
      const isOverDiscount =
        income < (formData?.price_info.discount_seller || 0);
      if (
        !formData?.store_id ||
        !formData.location_id ||
        !formData.buyer_info.buyer_name ||
        !formData?.order_code ||
        !formData.checkout_at ||
        !formData.package_info.package_weight ||
        // !formData?.package_info.package_height ||
        // !formData.package_info.package_length ||
        // !formData.package_info.package_width ||
        !formData?.recipient_info.recipient_name ||
        !formData.checkout_at ||
        !formData.payment_method_type_id ||
        handleValidationList() ||
        isOverWeight() ||
        isOverDiscount ||
        !listProductSku
      ) {
        setDisableButton(true);
      } else {
        if (formData?.delivery_info.delivery_method_id == 1) {
          if (
            !formData?.delivery_info.logistic_carrier ||
            !formData?.recipient_info.sub_district_id ||
            !formData?.recipient_info.recipient_full_address ||
            !formData?.recipient_info.recipient_postal_code ||
            !formData?.recipient_info.recipient_phone ||
            validateRange(formData?.recipient_info.recipient_phone, '', 7).length != 0 ||
            !formData?.recipient_info.sub_district_id ||
            validateRange(formData?.recipient_info.recipient_postal_code, '', 5).length != 0 ||
            validateRange(formData?.recipient_info.recipient_full_address, '', 10).length != 0
            // validateRemaks()
          ) {
            setDisableButton(true);
          } else {
            if (edit) {
              if (JSON.stringify({...formData, items: listProductSku}) != JSON.stringify(dataEdit)) setDisableButton(false);
              else setDisableButton(true);
            } else setDisableButton(false);
          }
        } else {
          if (edit) {
            if (JSON.stringify({...formData, items: listProductSku}) != JSON.stringify(dataEdit)) setDisableButton(false);
            else setDisableButton(true);
          } else setDisableButton(false);
        }
      }
    }
  };

  const handleBack = () => {
    // const id = getLastPath();
    if (edit) {
      if (JSON.stringify({...formData, items: listProductSku}) != JSON.stringify(dataEdit)) {
        setModalConfirm(true);
      } else {
        route.back();
      }
    } else {
      if (
        checkNotEmptyValueInObject(formData.buyer_info) ||
        checkNotEmptyValueInObject(formData.package_info) ||
        checkNotEmptyValueInObject(formData.delivery_info) ||
        checkNotEmptyValueInObject(formData.recipient_info) ||
        checkNotEmptyValueInObject(formData.price_info) ||
        checkNotEmptyValueInObject({
          store_id: formData.store_id,
          channel: formData.channel,
          channel_id: formData.channel_id,
          location_id: formData.location_id,
          order_code: formData.order_code,
          checkout_at: formData.checkout_at,
          payment_method_type_id: formData.payment_method_type_id,
          remarks: formData.remarks,
          created_via: formData.created_via,
        }) ||
        checkNotEmptyValueInObject(listProductSku)
      ) {
        setModalConfirm(true);
      } else {
        route.back();
      }
    }
  };

  const handleClickYes = () => {
    route.back();
  };

  // handle parse data
  const handleClickParseData = async (res) => {
    let product: ProductSingelProps[] = [];
    res.items.forEach((data) => {
      product.push({
        id: data.product_id,
        sku: data.sku,
        name: data.name,
        price: data.price,
        product_type: '',
        created_at: '',
        quantity: data.qty,
        weight: data.weight,
      });
    });
    setListProductSku(product);
    console.log('----- set form 1 -----');
    setFormData({
      ...formData,
      payment_method_type_id: res?.delivery_info?.payment_method_id,
      buyer_info: {
        ...formData.buyer_info,
        buyer_name: res?.recipient_info?.recipient_name,
        buyer_phone: res?.recipient_info?.recipient_phone,
      },
      delivery_info: {
        ...formData.delivery_info,
        delivery_method_id: selectedOption,
      },
      recipient_info: {
        ...formData.recipient_info,
        recipient_name: res?.recipient_info?.recipient_name,
        recipient_phone: res?.recipient_info?.recipient_phone,
        sub_district_id: res?.recipient_info?.sub_district_id,
        area_name: res?.recipient_info?.full_district,
        recipient_postal_code: res?.recipient_info?.recipient_postal_code,
        recipient_full_address: res?.recipient_info?.recipient_full_address,
      },
      remarks: res?.remarks,
    });
    setModalParseData(false);
  };

  // handle open modal parse data
  const handleClickModalParseData = () => {
    setModalParseData(true);
  };

  const onClickSave = () => {
    if (edit) {
      setModalChangeDetail(true);
    } else {
      handleSave();
    }
  };

  // useEffect(() => {
  //   if (
  //     formData?.logistic_carrier != null ||
  //     formData?.tracking_number != null
  //   ) {
  //     handleDisable();
  //   }
  //   handleValidationList();
  // }, [editForm]);

  const handleCountWeight  = () => {
    if(listProductSku && edit) {
      let total:number = 0;
      let subTotal: number = 0;
      
      listProductSku.forEach((data) => {
        if(data.quantity && data.weight) {
            total += (data.quantity * data.weight);
        }
        subTotal += (data.quantity * parseInt(data.price));
      });
      if(!enableChangeWidth){
        setEnableChangeWidth(total == formData.package_info.package_weight);
      }

      const fee = (formData?.price_info?.cod_percentage || 0) * (subTotal + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0));
      const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
            
      const dataCodForm = (subTotal + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0);
      if (enableChangeWidth) {
        console.log('----- set form 2 -----');
        setFormData({
          ...formData,
          package_info: {
            ...formData.package_info,
            package_weight: total,
          },
          delivery_info: {
            ...formData.delivery_info,
            logistic_carrier: '',
          },
          price_info: {
            ...formData.price_info,
            sub_total_price: subTotal,
            shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
            cod_fee: 0,
            cod_percentage: 0,
            cod_price: dataCodForm,
            shipping_price_buyer: false,
            discount_shipping: 0,
            insurance_amount: 0,
            is_insurance: false,
            grand_total_order_price: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + subTotal + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData?.price_info?.packing_price),
          }
        });
      }else {
        console.log('----- set form 3 -----', formData?.items);
        setFormData({
          ...formData,
          price_info: {
            ...formData.price_info,
            sub_total_price: subTotal,
            cod_price: dataCodForm,
            // insurance_amount: 0,
            // is_insurance: false,
            cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
            // grand_total_order_price: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + subTotal + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData?.price_info?.packing_price) ,
            // cod_price: dataCodForm === dataEdit?.price_info.cod_price ? dataCodForm : dataEdit?.price_info.cod_price ,
            // cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
            // grand_total_order_price: ((formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + subTotal + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - (formData?.price_info.total_discount_price || 0)
          }
        });
      }
    }
  };

  const handleSetDiscount = async (value) => {
    const fee = (formData?.price_info?.cod_percentage || 0) * ((formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (value || 0) );
    const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
    const dataCodForm = (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (value || 0);
    const insurance = await handleCalculateInsurance(formData?.price_info?.is_insurance, formData?.delivery_info.logistic_carrier,  (formData?.price_info.sub_total_price || 0) , (formData?.price_info.other_price || 0) , (value || 0));
    console.log('----- set form 33 -----', value);
    setFormData({
      ...formData,
      price_info: {
        ...formData.price_info,
        total_discount_price: (value || 0) + (formData?.price_info?.discount_shipping || 0),
        discount_seller: (value || 0),
        cod_price: dataCodForm,
        insurance_amount: insurance,
        cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
        grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - ((value || 0) + (formData?.price_info?.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info?.packing_price) + insurance,
      },
    });
    
  };

  const handleSetOtherCost =  debounce(async (value) => {
    console.log('----- set form 32 -----');
    
    const fee = (formData?.price_info?.cod_percentage || 0) * ((value || 0) + (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) - (formData?.price_info.discount_seller || 0));
    const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
    const dataCodForm = (formData?.price_info.sub_total_price || 0) + (value || 0) + (formData?.price_info.shipping_price || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0);
    const insurance =  await handleCalculateInsurance(formData?.price_info?.is_insurance, formData?.delivery_info.logistic_carrier, (formData?.price_info.sub_total_price || 0), (value || 0), (formData?.price_info.discount_seller || 0));

    setFormData({
      ...formData,
      price_info: { 
        ...formData.price_info, 
        other_price: (value || 0),
        // cod_price: dataCodForm === dataEdit?.price_info.cod_price ? dataCodForm : dataEdit?.price_info.cod_price ,
        cod_price: dataCodForm,
        insurance_amount: insurance, 
        cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
        grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (value || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info?.packing_price) + insurance,
      },
    });
    
  }, 300);

  useEffect(() => {
    handleDisable();
    handleValidationList();
  }, [formData, listProductSku]);

  useEffect(() => {
    handleCountWeight();
  }, [listProductSku]);

  return (
    <Row>
      <Col lg={8} sm={12}>
        <Create.Container>
          <Create.Header>
            <Create.Breadcrumb>
              <Create.MainPage>{'PESANAN'}</Create.MainPage>
              <Create.MainPage>{'/'}</Create.MainPage>
              <Create.SubsPage>{title}</Create.SubsPage>
            </Create.Breadcrumb>
            <Button onClick={handleClickModalParseData} style={styles.ButtonTertiary} className={edit || completed ? 'd-none' : 'd-block'}>
              {'Parse Data'}
            </Button>
          </Create.Header>
          <p className="mb-4" style={{fontSize: 32 , fontWeight: '700', color: colors.darkBlue}}>
            {'Informasi Pesanan'}
          </p>
          <FormInfoOrder
            edit={edit}
            complete={completed || editProcess}
            errorOrder={errorOrderCode}
            store={formData?.store_id}
            storeName={formData?.store_name}
            channelName={formData?.channel}
            setStore={(value, channel, channelName) => {
              console.log('----- set form 4 -----');
              setFormData({
                ...formData,
                store_id: value,
                channel_id: channel,
                channel: channelName,
              });
            }}
            warehouse={formData?.location_id || 0}
            warehouseName={formData?.location_name}
            checkoutAt={formData?.checkout_at}
            date={formData?.date_checkout}
            time={formData?.time_checkout}
            setCheckoutAt={(value: number, date, time) => {
              console.log('----- set form 5 -----', value, date, time);
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              setFormData({
                ...formData,
                checkout_at: value,
                date_checkout: date,
                time_checkout: time,
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.price_info.other_price || 0)) + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) - (formData?.price_info.discount_seller|| 0) + (formData?.price_info?.packing_price),
                },
              });
            }}
            setWarehouse={(origin, city, value) => {
              // formData?.delivery_info.logistic_carrier;
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              console.log('----- set form 6 -----');
              setFormData({
                ...formData,
                location_id: value,
                recipient_info: {
                  ...formData.recipient_info,
                  city_name: city,
                  origin_district_id: origin,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
              });
            }}
            name={formData?.buyer_info.buyer_name || ''}
            setName={(value) => {
              console.log('----- set form 7 -----');
              setFormData({
                ...formData,
                buyer_info: {...formData.buyer_info, buyer_name: value},
              });
            }}
            phoneNumber={formData?.buyer_info.buyer_phone || ''}
            setPhoneNumber={(value) => {
              console.log('----- set form 8 -----');
              setFormData({
                ...formData,
                buyer_info: {...formData.buyer_info, buyer_phone: value},
              });
            }}
            email={formData?.buyer_info.buyer_email || ''}
            setEmail={(value) => {
              console.log('----- set form 9 -----');
              setFormData({
                ...formData,
                buyer_info: {...formData.buyer_info, buyer_email: value},
              });
            }}
            orderCode={formData?.order_code}
            setOrderCode={(value) =>{
              console.log('----- set form 10 -----');
              setFormData({...formData, order_code: value});}
            } 
            payment={formData?.payment_method_type_id || 0}
            paymentName={formData?.payment_method_name}
            setPayment={(value) => {
              console.log('----- set form 11 -----');
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));

              setFormData({
                ...formData, 
                payment_method_type_id: value,
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
              });}
            } 
            note={formData?.remarks}
            setNote={(value) => {
              console.log('----- set form 12 -----');
              setFormData({...formData, remarks: value});
            }}
          />

          <FormInfoPackage
            edit={edit}
            complete={completed || editProcess}
            listProduct={listProductSku}
            isOverWeight={isOverWeight()}
            weight={formData?.package_info.package_weight || 0}
            setWeight={(value) => {
              const isValueNaN = isNaN(Number(value));
              const isZero = value === 0;
              setTemporyOnchangeWeight(isValueNaN || isZero);
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              console.log('----- set form 13 -----');
              setFormData({
                ...formData,
                package_info: {
                  ...formData.package_info,
                  package_weight: value,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
              });
            }}
            length={formData?.package_info.package_length}
            setLength={(value) => {
              console.log('----- set form 14 -----');
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              setFormData({
                ...formData,
                package_info: {
                  ...formData.package_info,
                  package_length: value,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
              });
            }}
            width={formData?.package_info.package_width}
            setWidth={(value) => {
              console.log('----- set form 15 -----');
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              setFormData({
                ...formData,
                package_info: {
                  ...formData.package_info,
                  package_width: value,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
              });
            }}
            height={formData?.package_info.package_height}
            setHeight={(value) => {
              console.log('----- set form 16 -----');
              const dataCodForm = (formData?.price_info?.sub_total_price + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0)) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0));
              setFormData({
                ...formData,
                package_info: {
                  ...formData.package_info,
                  package_height: value,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: '',
                },
                price_info: {
                  ...formData.price_info,
                  shipping_price: formData?.delivery_info?.delivery_method_id == 1 ? 0 : formData?.price_info?.shipping_price,
                  cod_fee: 0,
                  cod_percentage: 0,
                  cod_price: dataCodForm,
                  shipping_price_buyer: false,
                  discount_shipping: 0,
                  insurance_amount: 0,
                  is_insurance: false,
                  grand_total_order_price: (formData?.price_info?.sub_total_price + (formData?.delivery_info?.delivery_method_id == 1 ? 0 : (formData?.price_info?.shipping_price || 0)) + (formData?.price_info.other_price || 0)) - (formData?.price_info.discount_seller || 0) + (formData?.price_info?.packing_price),
                },
                
              });
            }}
            onAddProduct={onAddProduct}
            setQuantity={(index, value) => setQuantity(index, value)}
            setPrice={(index, value) => setPrice(index, value)}
            setWeightProduct={(index, value) => setWeightProduct(index, value)}
            onDeleteProduct={(id) => onDeleteProduct(id)}
          />

          <FormInfoShipping
            edit={edit}
            completed={completed}
            editProcess={editProcess}
            checkoutAt={formData?.checkout_at}
            name={formData?.recipient_info.recipient_name}
            buyerName={formData?.buyer_info.buyer_name}
            buyerPhoneNumber={formData?.buyer_info.buyer_phone}
            setPhoneAndName={(name, phone) => {
              console.log('----- set form 17 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_name: name,
                  recipient_phone: phone,
                },
              });
            }}
            setName={(value) => {
              console.log('----- set form 18 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_name: value,
                },
              });
            }}
            phoneNumber={formData?.recipient_info.recipient_phone}
            setPhoneNumber={(value) => {
              console.log('----- set form 19 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_phone: value,
                },
              });
            }}
            address={formData?.recipient_info.area_name || ''}
            setAreaName={(value) => {
              console.log('----- set form 20 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  area_name: value,
                },
              });
            }}
            cityName={formData?.recipient_info.city_name}
            setAddress={(value) => {

              if (value){
                console.log('----- set form 22 -----');
                setFormData({
                  ...formData,
                  recipient_info: {
                    ...formData.recipient_info,
                    sub_district_id: value.sub_district_id,
                    area_name: value.area_name,
                  },
                  delivery_info: {
                    ...formData.delivery_info,
                    logistic_carrier: null,
                    logistic_provider_name: null,
                    logistic_service_name: null,
                  },
                  price_info: {
                    ...formData.price_info, 
                    shipping_price: null,
                    shipping_price_buyer: false,
                    discount_shipping: 0,
                    insurance_amount: 0,
                    is_insurance: false
                  },
                });
              } else {
                console.log('----- set form 23 -----');
                setFormData({
                  ...formData,
                  recipient_info: {
                    ...formData.recipient_info,
                    sub_district_id: null,
                    area_name: null,
                  },
                  delivery_info: {
                    ...formData.delivery_info,
                    logistic_carrier: null,
                    logistic_provider_name: null,
                    logistic_service_name: null,
                  },
                  price_info: {...formData.price_info, shipping_price: null},
                });
              }
            }}
            weight={formData?.package_info.package_weight || 0}
            length={formData?.package_info.package_length || 0}
            width={formData?.package_info.package_width || 0}
            height={formData?.package_info.package_height || 0}
            subdistric={formData?.recipient_info?.sub_district_id}
            originSubdistric={formData?.recipient_info?.origin_district_id}
            deliveryMethod={formData?.delivery_info?.delivery_method_id}
            paymentMethod={formData?.payment_method_type_id || 0}
            handleClickShipping={async (value, courier, provider, service, codPrice) => {
              console.log('----- set form 24 -----');
              if(value) {
                const fee = codPrice * ((formData?.price_info.sub_total_price + value + formData?.price_info.other_price - formData?.price_info.discount_seller));
                const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
                const dataCodForm = (formData?.price_info.sub_total_price || 0) + value + (formData?.price_info.other_price || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0);
                const insurance = formData?.price_info?.is_insurance ? await handleCalculateInsurance(formData?.price_info?.is_insurance, courier, (formData?.price_info.sub_total_price || 0), (formData?.price_info.other_price || 0), (formData?.price_info.discount_seller || 0)) : 0;

                setFormData({
                  ...formData,
                  delivery_info: {
                    ...formData.delivery_info,
                    logistic_carrier: courier,
                    logistic_provider_name: provider,
                    logistic_service_name: service,
                  },
                  price_info: { 
                    ...formData.price_info, 
                    shipping_price: value,
                    insurance_amount: insurance,
                    is_insurance: insurance > 0,
                    discount_shipping: formData?.price_info.shipping_price_buyer ? value : formData?.price_info.discount_shipping,
                    grand_total_order_price: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info.sub_total_price || 0) + value + (formData?.price_info.other_price || 0) - (formData?.price_info.shipping_price_buyer ? (value + formData?.price_info.discount_seller) : formData?.price_info?.discount_seller|| 0) + (formData?.price_info?.packing_price) + insurance,
                    cod_price: dataCodForm,
                    cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
                    cod_percentage: codPrice,
                  },
  
                });
              }
              
            }}
            postalCode={formData?.recipient_info.recipient_postal_code}
            setPostalCode={(value) => {
              console.log('----- set form 25 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_postal_code: value,
                },
              });
            }}
            detailAddress={formData?.recipient_info.recipient_full_address}
            setDetailAddress={(value) => {
              console.log('----- set form 26 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_full_address: value,
                },
              });
            }}
            note={formData?.recipient_info.recipient_remarks}
            setNote={(value) => {
              console.log('----- set form 27 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  ...formData.recipient_info,
                  recipient_remarks: value,
                },
              });
            }}
            courier={formData?.delivery_info.logistic_carrier}
            setCourier={(value) => {
              console.log('----- set form 28 -----');
              setFormData({
                ...formData,
                delivery_info: {
                  ...formData.delivery_info,
                  logistic_carrier: value,
                  logistic_provider_name: value,
                  logistic_service_name: value,
                },
              });
            }}
            resi={formData?.delivery_info.tracking_number}
            setResi={(value) => {
              console.log('----- set form 29 -----');
              setFormData({
                ...formData,
                delivery_info: {
                  ...formData.delivery_info,
                  tracking_number: value,
                },
              });
            }}
            resetFormShipping={(value, name, phoneNumber) => {
              console.log('----- set form 30 -----');
              setFormData({
                ...formData,
                recipient_info: {
                  recipient_name: name,
                  recipient_full_address: null,
                  recipient_phone: phoneNumber,
                  recipient_postal_code: null,
                  recipient_remarks: null,
                  sub_district_id: null,
                  area_name: null,
                  origin_district_id: formData?.recipient_info.origin_district_id,
                },
                delivery_info: {
                  ...formData.delivery_info,
                  delivery_method_id: value,
                  logistic_carrier: null,
                },
                price_info: {
                  ...formData.price_info, 
                  shipping_price: null,
                  insurance_amount: 0,
                  is_insurance: false,
                  shipping_price_buyer: value == 2 ? false : formData?.price_info?.shipping_price_buyer,
                  discount_shipping: value == 2 ? null : formData?.price_info?.discount_shipping,
                  grand_total_order_price: formData?.price_info.sub_total_price || 0,
                },
              });
            }}
          />

          <Create.ContainerButton>
            <Button 
            type={'button'} 
            className={'justify-center'} style={styles.ButtonSecondary} 
            onClick={handleBack}
            >
              {'Batal'}
            </Button>
            <Button 
              type={'button'} 
              className={`justify-center ${disableButton && 'btn-disabled'}`} style={styles.ButtonPrimary} color={'primary'} disabled={disableButton || loadingButton} 
              onClick={() => {
                if (disableButton || loadingButton) {
                  return; 
                } else {
                  onClickSave(); 
                }
              }}
              >
              {loadingButton ? <Spinner color="white" size={'sm'} /> : `${edit ? 'Ubah' : 'Simpan'} `}
            </Button>
          </Create.ContainerButton>
        </Create.Container>
      </Col>
      <Col lg={4} sm={12} className={'position-sticky end-0'}>
        <Create.Container>
          <FormSide
            edit={completed || editProcess}
            income={0}
            subTotal={formData?.price_info?.sub_total_price}
            deliveryMethod={formData?.delivery_info.delivery_method_id}
            totalShipping={formData?.price_info.shipping_price}
            setTotalShipping={(value) => {
              console.log('----- set form 31 -----', value);
              const fee = (formData?.price_info?.cod_percentage || 0) * ((value || 0) + (formData?.price_info.sub_total_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0));
              const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
              const dataCodForm = (formData?.price_info.sub_total_price || 0) + (value || 0) + (formData?.price_info.other_price || 0) - (formData?.delivery_info.delivery_method_id == 2 ? ((value || 0) + (formData?.price_info?.discount_seller || 0)) : (formData?.price_info?.discount_seller || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0);

              setFormData({
                ...formData,
                price_info: { 
                  ...formData.price_info, 
                  shipping_price: (value || 0),
                  cod_price: dataCodForm,
                  insurance_amount: 0,
                  is_insurance: false,
                  discount_shipping: formData?.price_info.shipping_price_buyer ? (value || 0) : 0,
                  total_discount_price: formData?.price_info.shipping_price_buyer ? (formData?.price_info?.discount_seller || 0) + (value || 0) : (formData?.price_info.discount_seller || 0),
                  cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
                  grand_total_order_price: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info.sub_total_price || 0) + (value || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.shipping_price_buyer ? (formData?.price_info?.discount_seller || 0) + value : (formData?.price_info.discount_seller || 0)) + (formData?.price_info?.packing_price),
                },
              });
            }}
            otherCost={formData?.price_info.other_price}
            setOtherCost={async (value) => {
              handleSetOtherCost((value || 0));
              
            }}
            expend={0}
            discount={formData?.price_info.discount_seller}
            setDiscount={(value) => {
              handleSetDiscount((value || 0));
            }}
            totalOrder={formData?.price_info?.grand_total_order_price || 0}
            codFee={formData?.price_info.cod_fee}
            codPercentage={formData?.price_info.cod_percentage}
            setTotalOrder={(value) => {
              console.log('----- set form 34 -----');
              setFormData({
                ...formData,
                price_info: {
                  ...formData.price_info,
                  cod_price: (value || 0)
                }
              });
            }}
            isShippingWithBuyer={formData?.price_info.shipping_price_buyer}
            loadingInsurance={loadingInsurance}
            setShippingWithBuyer={(value) => {
              // setFormData({
              //   ...formData,
              //   price_info: {
              //     ...formData.price_info,
              //     shipping_price_buyer: value,
              //     di
              //   }
              // })
              const fee = (formData?.price_info?.cod_percentage || 0) * ((formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0) );
              const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
              const dataCodForm = (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info.discount_seller || 0);

              console.log('----- set form 35 -----', value ? (formData?.price_info.shipping_price || 0) + (formData?.price_info.discount_seller || 0) : (formData?.price_info.discount_seller || 0));
              setFormData({
                ...formData,
                price_info: {
                  ...formData.price_info,
                  total_discount_price: value ? (formData?.price_info.shipping_price || 0) + (formData?.price_info.discount_seller || 0) : (formData?.price_info.discount_seller || 0),
                  discount_shipping: value ? formData?.price_info.shipping_price || null : 0,
                  shipping_price_buyer: value,
                  cod_price: dataCodForm,
                  cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
                  grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (value ? 0 : (formData?.price_info.shipping_price || 0)) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ?  dataCodFee : 0) + (formData?.price_info?.packing_price) + (formData?.price_info?.insurance_amount || 0)
                },
              });
            }}
            insuranceAmount={formData?.price_info?.insurance_amount || 0}
            isInsurance={formData?.price_info?.is_insurance}
            setInsurance={async (value) => {
              console.log('----- set form 35 isurance -----');

              const fee = (formData?.price_info?.cod_percentage || 0) * ((formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0) );
              const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
              const insurance = value ? await handleCalculateInsurance(value, formData?.delivery_info.logistic_carrier, (formData?.price_info.sub_total_price || 0),(formData?.price_info.other_price || 0),  (formData?.price_info.discount_seller || 0)) : 0;

              setFormData({
                ...formData,
                price_info: {
                  ...formData.price_info,
                  insurance_amount: insurance,
                  is_insurance: value,
                  grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0) - (formData?.price_info?.discount_shipping) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ?  dataCodFee : 0) + (formData?.price_info?.packing_price) + insurance,
                },
              });
                

            }}
            paymentMethod={formData?.payment_method_type_id || 0}
            codPrice={formData?.price_info?.cod_price || 0}
            courier={formData?.delivery_info.logistic_carrier || ''}
            packingPrice={formData?.price_info.packing_price}
            setPackingPrice={(value)=> {
              console.log('----- set form 36test -----');
              setFormData({
                ...formData,
                price_info: {
                  ...formData.price_info,
                  packing_price: (value || 0),
                  grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - ((formData?.price_info.discount_seller || 0) + (formData?.price_info.discount_shipping || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? formData?.price_info?.cod_fee : 0) + (value || 0) + formData?.price_info.insurance_amount,
                }
              });
            }}
            discountShipping={formData?.price_info?.discount_shipping}
            setDiscountShipping={(value) => {
              const fee = (formData?.price_info?.cod_percentage || 0) * ((formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - (formData?.price_info.discount_seller || 0) );
              const dataCodFee = (fee % 1) == 0 ? Math.trunc(fee) : Math.trunc(fee) + 1;
              const dataCodForm = (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0) + (formData?.price_info.discount_seller || 0);

              setFormData({
                ...formData,
                price_info: {
                  ...formData.price_info,
                  total_discount_price: (value || 0) + (formData?.price_info.discount_seller || 0),
                  discount_shipping: (value || 0),
                  cod_price: dataCodForm,
                  cod_fee: (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? dataCodFee : 0),
                  grand_total_order_price: (formData?.price_info.sub_total_price || 0) + (formData?.price_info.shipping_price || 0) + (formData?.price_info.other_price || 0) - ((value || 0) + (formData?.price_info.discount_seller || 0)) + (formData.payment_method_type_id == 2 && formData?.delivery_info?.delivery_method_id == 1 ? (dataCodFee) : 0) + (formData?.price_info?.packing_price) + (formData?.price_info?.insurance_amount || 0),
                },
              });
            }}
          />
        </Create.Container>
      </Col>

      {modalConfirm && (
        <ModalConfirmPopup
          icon={gifConfirm}
          buttonConfirmation={true}
          handleClickYes={handleClickYes}
          handleClickCancelled={() => setModalConfirm(false)}
          modalContentStyle={styles.ModalContentStyle}
          modalBodyStyle={styles.ModalConfirm}
          title={'Apakah Kamu Yakin?'}
          subtitle={'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'}
        />
      )}

      {modalChangeDetail && (
        <ModalCancel
          // eslint-disable-next-line react/no-children-prop
          children={<div></div>}
          toggle={false}
          icon={fine}
          separatedRound
          modalContentStyle={{width: 400}}
          widthImage={400}
          heightImage={272}
          iconStyle={{objectFit: 'cover'}}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
            marginTop: '-10px',
            height: '388px',
          }}
          title={'Apakah Kamu Yakin?'}
          textSubmit="Simpan"
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setModalChangeDetail(false)}
          handleClickYes={() => {
            setModalChangeDetail(false);
            handleSave();
          }}
          subtitle={
            <div className="text-start p-3">
              Jika kamu mengubah detail pesanan yang menggunakan <span style={{fontWeight: 700}}>pengiriman bebas kirim</span> seperti:
              <ul style={{listStyle: 'outside'}} className="ps-2">
                <li>Informasi pengiriman (Daerah Pengiriman dan Jasa Kirim)</li>
                <li>
                  Informasi Paket
                  <div className="ps-3">
                    <ol style={{listStyleType: 'lower-alpha'}}>
                      <li>Informasi SKU (Nama, Jumlah, dan Berat Satuan)</li>
                      <li>Informasi Berat dan Dimensi Paket</li>
                    </ol>
                  </div>
                </li>
              </ul>
              maka biaya pengiriman akan mengalami penyesuaian ulang
            </div>
          }
        />
      )}

      {modalParseData && (
        <FormModalParseData selectedOption={selectedOption} setSelectedOption={setSelectedOption} handleClickSubmit={handleClickParseData} handleClickCancelled={() => setModalParseData(false)} modalContentStyle={styles.ModalParseDataContentStyle} modalBodyStyle={styles.ModalParseDataBodyStyle} />
      )}
    </Row>
  );
};

export default CreateOrder;
