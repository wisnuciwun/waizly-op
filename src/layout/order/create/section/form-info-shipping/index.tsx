/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState} from 'react';
import ShippingInfo, {styles} from './styles';
import {Col, Label, Row, Spinner, FormGroup} from 'reactstrap';
import {Input as InputReactStrap} from 'reactstrap';
import {Input, ListCourier, Select, SelectCustom, TabForm} from '@/components';
import {listShippingMethod} from './constants';
import {changeFirtChar, checkSapace, checkStatus, countWeight, formatPhone, getEstimationDate, getTimeStampDate, inputNumber} from '@/utils/formater';
import {getAreaSearch, getCODPriceByCourier, getCourier, getShippingRate} from '@/services/order';
import {AreaSearchProps, ListShippingRate} from '@/utils/type/order';
import {validateInputNull, validateRange} from '@/utils/validation';
import {debounce} from 'lodash';
import {SelectItemOptionsType} from 'primereact/selectitem';
import colors from '@/utils/colors';
import { useSelector } from 'react-redux';

interface Props {
  name: string;
  setName: (value: string | null) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string | null) => void;
  address: string;
  setAddress: (value: AreaSearchProps | null) => void;
  setAreaName: (value: string | null) => void;
  postalCode: string;
  setPostalCode: (value: string | null) => void;
  detailAddress: string;
  setDetailAddress: (value: string | null) => void;
  note: string;
  setNote: (value: string | null) => void;
  courier: string;
  setCourier: (value: string | null) => void;
  resi: string;
  setResi: (value: string | null) => void;
  deliveryMethod: number;
  paymentMethod: number;
  handleClickShipping: (value: number | null, courier: string | null, providerName: string | null, serviceName: string | null, codPrice: number | null) => void;
  originSubdistric: number;
  subdistric: number;
  checkoutAt: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  resetFormShipping: (value: number, existingName: string, existingPhoneNum: string) => void;
  cityName: string;
  edit: boolean;
  completed?: boolean;
  editProcess?: boolean;
  buyerName?: string;
  buyerPhoneNumber?: string;
  setPhoneAndName?: (name: string, phone: string) => void;
}
const FormInfoShipping = ({
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  setAreaName,
  postalCode,
  setPostalCode,
  detailAddress,
  setDetailAddress,
  note,
  setNote,
  courier,
  setCourier,
  subdistric,
  originSubdistric,
  resi,
  setResi,
  deliveryMethod,
  paymentMethod,
  weight,
  length,
  width,
  height,
  handleClickShipping,
  checkoutAt,
  cityName,
  resetFormShipping,
  edit,
  completed,
  editProcess,
  buyerName,
  buyerPhoneNumber,
  setPhoneAndName,
}: Props) => {
  const [areaList, setAreaList] = useState<AreaSearchProps[] | null>(null);
  const [listSelected, setListSelected] = useState<string>('');
  const [listCourier, setListCourier] = useState<SelectItemOptionsType>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingComponent, setLoadingComponent] = useState<boolean>(false);
  const [sameIdentity, setsameIdentity] = useState<any>((edit || completed) && (buyerName != name || buyerPhoneNumber != phoneNumber) ? null : true);
  const [listShippingRate, setListShippingRate] = useState<ListShippingRate[] | null>(null);
  const [loadingShipping, setLoadingShipping] = useState<boolean>(false);
  const [disableRate, setDisableRate] = useState<boolean>(false);
  const [showListRate, setShowListRate] = useState<boolean>(false);
  const [showSearchLocation, setShowSearchLocation] = useState<boolean>(false);
  const { client_id } = useSelector((state: any) => state.auth.user);
  const debounced = useRef(debounce((value) => searchLocation(value), 700));

  const areaName = (value: string) => {
    setListSelected('');
    setAreaName(value);
    setShowSearchLocation(value.length > 0);
    debounced.current(value);
  };

  const searchLocation = async (value: string) => {
    if (value.length > 2) {
      setLoading(true);
      const response = await getAreaSearch(value);

      if (checkStatus(response.status)) {
        setAreaList(response.data.areas);
      }

      setLoading(false);
    }
  };

  const handleSearchEnter = async (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && subdistric) {
      setAreaName('');
      setAddress({
        sub_district_id: null,
        sub_district_name: null,
        area_name: null,
        district_name: null,
        city_name: null,
        country_name: null,
        province_name: null,
      });
    }
    if (event.key === 'Enter') {
      // searchLocation
    }
  };

  const getShipping = async () => {
    if (subdistric && originSubdistric && weight && checkoutAt) {
      setLoadingShipping(true);
      // PxLxT (cm) / 6000 = xx kg x 1000 = xx gr
      const volume = ((length || 0) * (width || 0) * (height || 0)) / 6000;
      const volumeGram = volume * 1000;
      const payload = {
        origin_sub_district_id: originSubdistric,
        destination_sub_district_id: subdistric,
        dimension: {
          width,
          length,
          height
        },
        weight: volumeGram > weight ? volumeGram : weight,
      };
      const response = await getShippingRate(payload);

      setListShippingRate(response.data);
      setLoadingShipping(false);
    }
  };

  const handleSelectList = (data: AreaSearchProps) => {
    setAddress(data);
    setShowSearchLocation(false);
  };

  const handleClickRate = async () => {
    if (!disableRate) {
      setShowListRate(true);
      await getShipping();
      document.getElementById('search-shipping').focus();
    }
  };

  const handleClickShippingRate = async (data: ListShippingRate) => {
    let totalCOD = await handleGetCodPrice(data.courier);
    
    const courier = `${data.courier} ${data.service_type}`;
    // todo cod in complete
    // console.log('----- SDHHDDH -----', totalCOD)
    
    handleClickShipping(data.estimate_price, courier, data.courier, data.service_type,  completed ? 0 : totalCOD);
    setShowListRate(false);
    handleGetCodPrice(data.courier);
  };

  const handleGetCodPrice = async(courier: string) => {
    const response = await getCODPriceByCourier(client_id, courier);
    return parseFloat(response.data[0].cod_percentage);
  };

  const handleSetDeliveryMethod = (value: number) => {
    if (!edit && !completed && deliveryMethod != value) {
      resetFormShipping(value, name, phoneNumber);
    }
  };

  const handleGetCourier = async () => {
    const response = await getCourier();

    if (response?.status == 200) {
      let datas = [];

      response.data.forEach((data) => {
        datas.push({
          value: data.logistic_carrier_id,
          label: data.logistic_carrier,
        });
      });

      setListCourier(datas);
    }
  };

  useEffect(() => {
    if(deliveryMethod == 1){
      handleClickShipping(null, null, null, null, null);
    }
    handleGetCourier();
  }, []);

  // useEffect(() => {
  //     handleClickShipping(null, null, null, null);
  // },[originSubdistric, checkoutAt, weight]);

  useEffect(() => {
    if (subdistric && originSubdistric && weight && checkoutAt) setDisableRate(false);
    else {
      if(deliveryMethod == 1){
        handleClickShipping(null, null, null, null, null);
      }
      
      setDisableRate(true);
    }
  }, [subdistric, originSubdistric, weight, checkoutAt]);

  useEffect(() => {
    if (sameIdentity && (buyerName || buyerPhoneNumber)) {
      setPhoneAndName(buyerName, buyerPhoneNumber);
    } else if(sameIdentity && !buyerPhoneNumber){
      setPhoneAndName(buyerName, buyerPhoneNumber);
    } else if(sameIdentity && buyerPhoneNumber == ''){
      setPhoneAndName(buyerName, '');
    } else if (sameIdentity != null && !sameIdentity &&
      name == buyerName && phoneNumber == buyerPhoneNumber) {
      setPhoneAndName('', '');
    }
  }, [sameIdentity, buyerName, buyerPhoneNumber]);

  if (loadingComponent)
    return (
      <ShippingInfo.Container>
        <div style={styles.Container}>
          <Spinner size={'lg'} color={colors.darkBlue} />
        </div>
      </ShippingInfo.Container>
    );

  return (
    <ShippingInfo.Container>
      <p className="mb-4" style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Informasi Pengiriman'}</p>
      <div className="d-flex align-items-center">
        <div style={{alignSelf: 'center'}}>
          <FormGroup style={{margin: 0}} check inline>
            <InputReactStrap type="checkbox" checked={sameIdentity ? true : false} style={{marginTop: 7, width: 15, height: 15, marginRight: 5}} onChange={() => setsameIdentity(!sameIdentity)} />
          </FormGroup>
        </div>
        <span style={{fontSize: 12, fontWeight: 400, color: '#4C4F54'}}>Nama dan No. Handphone sama dengan Pembeli</span>
      </div>
      <Label className={'mb-2 mt-4'}>
        {'Pilih Metode Pengiriman'} <span style={styles.required}>*</span>
      </Label>
      <TabForm edit={edit || completed} selected={deliveryMethod.toString()} list={listShippingMethod} onClick={(value) => handleSetDeliveryMethod(parseInt(value))} />
      
      <Row className={'mt-4'}>
        <Col lg={6} sm={12}>
          <Input
            id={'name-received'}
            label={'Nama Penerima'}
            required
            disabled={editProcess}
            invalid={validateInputNull(name, 'Nama Penerima').length != 0}
            register={null}
            maxLength={100}
            placeholder={'Masukkan Nama Penerima'}
            value={name || ''}
            onChange={(value: string) => {
              setName(value);
              sameIdentity && setsameIdentity(null);
            }}
            message={validateInputNull(name, 'Nama Penerima')}
          />
        </Col>
        <Col lg={6} sm={12}>
          <Input
            id={'phone-received'}
            label={'No. Handphone Penerima'}
            register={null}
            disabled={editProcess}
            required={deliveryMethod == 1}
            invalid={deliveryMethod == 1 ? validateRange(phoneNumber, 'Handphone Penerima', 7).length != 0 : false}
            placeholder={'Masukkan No. Handphone Penerima'}
            value={phoneNumber?.replaceAll('+62', '')}
            maxLength={11}
            onChange={(value: string) => {
              setPhoneNumber(value.replaceAll('+62', ''));
              sameIdentity && setsameIdentity(null);
            }}
            stickyLabel={'+62'}
            message={deliveryMethod == 1 ? validateRange(phoneNumber, 'Handphone Penerima', 7) : ''}
            onInput={(e) => {
              formatPhone(e);
            }}
          />
        </Col>
        <Col lg={6} sm={12} style={{paddingBottom: subdistric === null && completed ? '2.5rem' : 0 , position:'relative'}}>
          <Input
            id={'address'}
            label={'Daerah Pengiriman'}
            placeholder={'Pilih Daerah Pengiriman'}
            value={address || ''}
            invalid={subdistric === null && completed}
            disabled={editProcess}
            required={deliveryMethod == 1}
            register={null}
            onChange={areaName}
            onKeyDown={(event) => handleSearchEnter(event)}
            onBlur={() => {}}
            message={subdistric === null && completed ? 'Kami tidak dapat menemukan Daerah Pengirimanmu. Pastikan kamu telah mengisi Daerah Pengiriman dengan benar' : ''}
            maxLength={255}
          />

          {/* TODO COMPONENT  */}
          {showSearchLocation && !listSelected && (
            <ShippingInfo.ContainerSearch tabIndex={0} id={'search-location'} onBlur={() => setShowSearchLocation(false)}>
              {address.length > 2 ? (
                <>
                  {loading ? (
                    <Spinner color={'primary'} style={styles.loading} />
                  ) : (
                    <>
                      {areaList && areaList.length > 0 ? (
                        <>
                          {areaList.map((data, index) => (
                            <ShippingInfo.ContainerList onClick={() => handleSelectList(data)} key={index}>
                              <ShippingInfo.Title>{data.area_name}</ShippingInfo.Title>
                            </ShippingInfo.ContainerList>
                          ))}
                        </>
                      ) : (
                        <ShippingInfo.ContainerList>
                          <ShippingInfo.Title>{'Data tidak ditemukan'}</ShippingInfo.Title>
                        </ShippingInfo.ContainerList>
                      )}
                    </>
                  )}
                </>
              ) : (
                <ShippingInfo.ContainerList>
                  <ShippingInfo.Title>{'Minimal 3 karakter'}</ShippingInfo.Title>
                </ShippingInfo.ContainerList>
              )}
            </ShippingInfo.ContainerSearch>
          )}
        </Col>

        <Col lg={6} sm={12}>
          <Input
            id={'postal-code'}
            label={'Kode Pos'}
            register={null}
            disabled={editProcess}
            invalid={deliveryMethod == 1 ? validateRange(postalCode, 'Nama Kode Pos', 5).length != 0 : false}
            required={deliveryMethod == 1}
            placeholder={'Masukkan Kode Pos'}
            value={postalCode || ''}
            onChange={(value: string) => setPostalCode(inputNumber(checkSapace(value), 8))}
            message={deliveryMethod == 1 ? validateRange(postalCode, 'Nama Kode Pos', 5) : ''}
            maxLength={5}
          />
        </Col>
        <Col lg={6} sm={12}>
          <Input
            id={'detail-address'}
            label={'Detail Alamat'}
            disabled={editProcess}
            register={null}
            invalid={deliveryMethod == 1 ? validateRange(detailAddress, 'Detail Alamat', 10).length != 0 : false}
            type={'textarea'}
            required={deliveryMethod == 1}
            placeholder={'Masukkan Detail Alamat'}
            value={detailAddress || ''}
            onChange={(value: string) => setDetailAddress(checkSapace(value))}
            message={deliveryMethod == 1 ? validateRange(detailAddress, 'Detail Alamat', 10) : ''}
            maxLength={255}
          />
        </Col>
        <Col lg={6} sm={12}>
          <Input id={'notes'} label={'Catatan Pengiriman'} register={null} disabled={editProcess} type={'textarea'} placeholder={'Masukkan Catatan Pengiriman'} value={note || ''} onChange={(value: string) => setNote(checkSapace(value))} message={''} maxLength={255} />
        </Col>
        <Col lg={6} sm={12}>
          {deliveryMethod == 1 ? (
            <SelectCustom
              styleMessage={{position:'absolute'}}
              id={'corier'}
              label={'Jasa Kirim'}
              required
              value={courier ? courier : 'Pilih Jasa Kirim'}
              disabled={disableRate}
              onClick={() => handleClickRate()}
              invalid={completed && !subdistric ? true : false}
              message={completed && !subdistric ? `Jasa Kirim ${courier || ''} tidak tersedia pada Platform kami` : ''}
            />
          ) : (
            <FormGroup>
              <Label htmlFor="courier">{'Jasa Kirim'}</Label>
              <Select
                value={listCourier.find((option) => option.label === courier)}
                options={listCourier}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                onChange={(selectedOption) => {
                  setCourier(selectedOption.label);
                }}
                placeholderText={'Pilih Jasa Kirim'}
                isValid={false}
              />
            </FormGroup>
          )}
          {/* todo component */}

          {showListRate && (
            <Col lg={6} sm={12}>
              <ShippingInfo.ContainerSearchCourier id={'search-shipping'} tabIndex={0} onBlur={() => setShowListRate(false)}>
                <ShippingInfo.ContainerHeaderSearch>
                  <ShippingInfo.TitleSearch>{'Dikirim dari ' + changeFirtChar(cityName || '')}</ShippingInfo.TitleSearch>
                  <ShippingInfo.dot></ShippingInfo.dot>
                  <ShippingInfo.TitleSearch>{`Berat ${countWeight(weight)} Kg`} </ShippingInfo.TitleSearch>
                </ShippingInfo.ContainerHeaderSearch>
                {loadingShipping ? (
                  <Spinner color={'primary'} style={styles.loading} />
                ) : (
                  <>
                    {listShippingRate && listShippingRate.length > 0 ? (
                      <>
                        {listShippingRate.map((data, index) => (
                          <>
                            <ListCourier
                              key={index}
                              title={`${data.courier} ${data.service_type}`}
                              subtitle={`Estimasi Tiba ${
                                data.min_estimate_delivery == 0 && data.max_estimate_delivery == 0 ? '-' :
                                  `${getEstimationDate(edit || completed ? getTimeStampDate(checkoutAt.toString()) : checkoutAt, data.min_estimate_delivery)} - ${getEstimationDate(edit || completed ? getTimeStampDate(checkoutAt.toString()) : checkoutAt, data.max_estimate_delivery)}`}`}
                              price={data.estimate_price}
                              onClick={() => handleClickShippingRate(data)}
                            />
                          </>
                        ))}
                      </>
                    ) : (
                      <ShippingInfo.ContainerList>
                        <ShippingInfo.Title>{'Data tidak ditemukan'}</ShippingInfo.Title>
                      </ShippingInfo.ContainerList>
                    )}
                  </>
                )}
              </ShippingInfo.ContainerSearchCourier>
            </Col>
          )}
        </Col>

        <Col lg={6} sm={12}>
          <Input id={'resi'} label={'Resi'} register={null} disabled={deliveryMethod == 1} placeholder={'Masukkan Resi'} value={deliveryMethod == 1 ? 'Resi akan digenerate oleh system kami' : resi} maxLength={50} onChange={(value: string) => setResi(checkSapace(value))} message={''} />
        </Col>
      </Row>
    </ShippingInfo.Container>
  );
};

export default FormInfoShipping;
