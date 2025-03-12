/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Input, InputSelect } from '@/components';
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';
import React, { useEffect, useState } from 'react';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import OrderInfo, { styles } from './styles';
import { useSelector } from 'react-redux';
import { getStoreListV2 } from '@/services/master';
import { getLocationDropdown } from '@/services/order';
import { paymentMethod } from './constants';
import { checkSapace, clearSpace, convertDate, emailValidation, formatPhone, formateTime, getDeferentTime, reductionDate } from '@/utils/formater';

import DatePicker from 'react-datepicker';
import { LocationList } from '@/utils/type/order';
interface Props {
    store: number;
    storeName: string;
    channelName: string;
    setStore: (value: number, channelId: number, channel: string) => void;
    warehouse: number;
    warehouseName: string;
    setWarehouse: (originId: number, city: string, value: number) => void;
    name: string;
    setName: (value: string) => void;
    checkoutAt: number;
    setCheckoutAt: (value: number, date: Date, time: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    orderCode: string;
    setOrderCode: (value: string) => void;
    payment: number;
    paymentName: string;
    setPayment: (value: number) => void;
    note: string;
    setNote: (value: string) => void;
    time: string | null;
    date: Date | null;
    errorOrder: string | null;
    edit: boolean;
    complete: boolean;
}
const FormInfoOrder = ({
    store,
    storeName,
    channelName,
    setStore,
    warehouse,
    warehouseName,
    setWarehouse,
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    checkoutAt,
    setCheckoutAt,
    orderCode,
    setOrderCode,
    payment, 
    paymentName,
    setPayment,
    note,
    setNote,
    date,
    time,
    edit,
    complete,
    errorOrder
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [listStore, setListStore] = useState<SelectItemOptionsType>([]);
    const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
    const [errorName, setErrorName] = useState<boolean>(false);
    const [errorOrderCode, setErrorOrderCode] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [errorNote, setErrorNote] = useState<boolean>(false);
    const [dateOrder, setDateOrder] = useState<Date | null>(date ? new Date(date) : date );
    const [timeOrder, setTimeOrder] = useState<string>(time);
    const [invalidTime, setInvalidTime] = useState<boolean>(false);
    const [listLocation, setListLocation] = useState<LocationList[] | null>(null);
    const [openDate, setOpenDate] = useState<boolean>(false);
    const getListStore = async() => {
        if(!edit && !complete) {
            const response = await getStoreListV2(client_id, '11,14');
            if(response && response.data) {
                let datas: SelectItem[] = [];

                response.data.forEach((data) => {
                    datas.push({
                        value: data.store_id.toString(),
                        label: data.store_name,
                        title: data.channel_id,
                        className: data.channel_name
                    });
                });

                setListStore(datas);
            }
        }
    };

    const getListLocation = async() => {
        if(!complete) {
            const response = await getLocationDropdown(client_id);
            if(response && response.data) {
                setListLocation(response.data);
                let datas: SelectItem[] = [];

                response.data.forEach((data) => {
                    datas.push({
                        value: data.location_id.toString(),
                        label: data.location_name,
                    });
                });

                setListWarehouse(datas);
            }
        }
        
    };

    const handleSetOrigin = (value: number) => {

        if(listLocation) {
            const datas = listLocation.filter((data) => data.location_id === value);
            const originSubdistricId = datas[0].sub_district_id;
            setWarehouse(originSubdistricId, datas[0].city_name, value);
            
        }
    };

    const onChangeEmail = (value: string) => {
        setEmail(value);
        setErrorEmail(value.length > 0 && !emailValidation(value));
    };

    useEffect(() => {
        getListStore();
        getListLocation();
    },[]);

    const handleSetTime = () => {
        if(timeOrder && dateOrder) {
            const date = new Date(`${convertDate(dateOrder)} ${timeOrder}`);
            const timeDif = getDeferentTime(new Date(), date);
            if(timeDif <= 0) {
                setCheckoutAt(date.getTime()/1000, dateOrder, timeOrder);
                setInvalidTime(false);
            } else {
                setInvalidTime(true);
            }
            // setCheckoutAt(date.getTime()/1000, dateOrder, timeOrder)
        }
    };

    const handleSetStore = (value: number) => {
        if(listStore) {
            const datas = listStore.filter((data) => data.value === value.toString());
            const channelId = datas[0].title;
            const channelName = datas[0].className;
            setStore(value, channelId, channelName);
        }
      
    };

    const dateFormate = new Date(date).toLocaleDateString('en-US');
    const timeFormate = `${formateTime(new Date(date).getHours())}:${formateTime(new Date(date).getMinutes())}`;
    useEffect(() => {
        if(!edit) {
            handleSetTime();
        }
    },[timeOrder, dateOrder]);
    return (
        <OrderInfo.Container>
            <Row>
                <Col lg={4} sm={12}>
                    {edit || complete ? (
                        <Input
                            id={'store'}
                            label={'Toko'}
                            required
                            type={'text'}
                            disabled
                            maxLength={255}
                            register={null}
                            placeholder={'Toko'}
                            value={storeName || ''}
                            onChange={(value: string)=> {
                            }}
                        />
                    ):(
                        <InputSelect
                            id={'store'}
                            label={'Toko'}
                            required
                            placeholder={'Pilih Toko'}
                            value={store ? store.toString() : null}
                            onChange={(value) => handleSetStore(parseInt(value))}
                            options={listStore}
                        />
                    )}
                    
                </Col>
                <Col lg={4} sm={12}>
                    <Input
                        id={'channel'}
                        label={'Channel'}
                        required
                        register={null}
                        placeholder={''}
                        value={channelName || 'Channel Name'}
                        onChange={()=>{}}
                        disabled
                    />
                </Col>
                <Col lg={4} sm={12}>
                    {complete ? (
                        <Input
                            id={'warehouse'}
                            label={'Gudang Asal'}
                            required
                            type={'text'}
                            disabled
                            maxLength={255}
                            register={null}
                            placeholder={'Gudang Asal'}
                            value={warehouseName || ''}
                            onChange={(value: string)=> {
                            }}
                        />
                    ):(
                        <InputSelect
                            id={'warehouse'}
                            label={'Gudang Asal'}
                            required
                            disabled={complete}
                            placeholder={'Pilih Gudang Asal'}
                            value={warehouse.toString()}
                            onChange={(value) =>{
                                handleSetOrigin(parseInt(value));
                            }}
                            options={listWarehouse}
                        />
                    )}
                    
                </Col>
                <Col lg={4} sm={12}>
                    <Input
                        id={'name'}
                        label={'Nama Pembeli'}
                        required
                        disabled={complete}
                        invalid={errorName}
                        register={null}
                        placeholder={'Masukkan Nama Pembeli'}
                        value={name}
                        onChange={(value: string)=> {
                            setErrorName(!value);
                            setName(checkSapace(value));
                        }}
                        maxLength={100}
                        message={errorName ? 'Nama Pembeli harus diisi' : ''}
                    />
                </Col>
                <Col lg={4} sm={12}>
                    <Input
                        id={'phone-number'}
                        label={'No. Handphone Pembeli'}
                        register={null}
                        disabled={complete}
                        placeholder={'Masukkan No Handphone'}
                        value={phoneNumber.replaceAll('+62', '')}
                        onChange={(value: string)=> setPhoneNumber(value.replaceAll('+62', ''))}
                        stickyLabel={'+62'}
                        maxLength={11}
                        message={''}
                        onInput={(e) => {
                            formatPhone(e);
                        }}
                    />
                </Col>
                <Col lg={4} sm={12}>
                    <Input
                        id={'email'}
                        type={'email'}
                        label={'Email Pembeli'}
                        disabled={complete}
                        invalid={errorEmail}
                        register={null}
                        placeholder={'Masukkan Email'}
                        value={email}
                        maxLength={100}
                        onChange={(value: string)=>  onChangeEmail(checkSapace(value))}
                        message={errorEmail ? 'Email tidak valid' : ''}
                    />
                </Col>
                <Col lg={4} sm={12}>
                    <Input
                        id={'order-code'}
                        label={'Nomor Pesanan'}
                        required
                        invalid={errorOrderCode || errorOrder !== null}
                        disabled={edit || complete}
                        register={null}
                        maxLength={50}
                        placeholder={'Masukkan Nomor Pesanan'}
                        value={orderCode}
                        onChange={(value: string)=>{
                            setErrorOrderCode(!value);
                            setOrderCode(checkSapace(value));
                        }}
                        onInput={(e) => {
                            clearSpace(e);
                        }}
                        message={errorOrder !== null  ? 'Nomor Pesanan tidak boleh sama.' : errorOrderCode ? 'Nomor Pesanan harus diisi' : ''}
                    />
                </Col>
                <Col lg={4} sm={12}>
                    {edit ? (
                        <FormGroup className="">
                            <Label htmlFor="werehouse_name" className="fw-bold">
                            Waktu Pemesanan<span style={{ color: '#FF6E5D' }}>*</span>
                            </Label>
                            <div className="form-control-wrap">
                                <OrderInfo.ContainerTime>
                                    <Input
                                        id={'date'}
                                        label={''}
                                        required
                                        style={{width:'100%'}}
                                        disabled={edit || complete}
                                        register={null}
                                        placeholder={''}
                                        value={dateFormate}
                                        onChange={(value: string)=>{}}
                                        message={''}
                                    />
                                    <Input
                                        id={'time'}
                                        label={''}
                                        required
                                        style={{width:'100%'}}
                                        type={'time'}
                                        disabled={edit || complete}
                                        register={null}
                                        placeholder={''}
                                        value={timeFormate}
                                        onChange={(value: string)=>{}}
                                        message={''}
                                    />
                                </OrderInfo.ContainerTime>
                            </div>

                        </FormGroup>
                    ):(
                        <FormGroup className="">
                            <Label htmlFor="werehouse_name" className="fw-bold">
                            Waktu Pemesanan<span style={{ color: '#FF6E5D' }}>*</span>
                            </Label>
                            <div className="form-control-wrap">
                                <OrderInfo.ContainerDate>
                                    <OrderInfo.ContainerTime>
                                        <DatePicker
                                            name="name"
                                            register={null}
                                            disabled={edit || complete}
                                            className={`form-control ${invalidTime ? 'border-danger' : ''}`}
                                            selected={dateOrder}
                                            onChange={(date) => {
                                                setDateOrder(date);
                                                setOpenDate(false);
                                            }}
                                            placeholderText={'Date'}
                                            minDate={reductionDate(365)}
                                            maxDate={new Date()}
                                            showIcon={dateOrder == null}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                            onFocus={()=> setOpenDate(true)}
                                            onClickOutside={() => setOpenDate(false)}
                                            open={openDate}
                                        
                                            icon={
                                                <svg
                                                    viewBox="0 0 18 17"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    onClick={()=> setOpenDate(true)}
                                                >
                                                <path
                                                    d="M4 11.6602C4 11.4388 4.07812 11.25 4.23438 11.0938C4.40365 10.9245 4.60547 10.8398 4.83984 10.8398H7.33984C7.5612 10.8398 7.75 10.9245 7.90625 11.0938C8.07552 11.25 8.16016 11.4388 8.16016 11.6602C8.16016 11.8945 8.07552 12.0964 7.90625 12.2656C7.75 12.4219 7.5612 12.5 7.33984 12.5H4.83984C4.60547 12.5 4.40365 12.4219 4.23438 12.2656C4.07812 12.0964 4 11.8945 4 11.6602ZM10.25 12.5H13.5898C13.8112 12.5 14 12.4219 14.1562 12.2656C14.3255 12.0964 14.4102 11.8945 14.4102 11.6602C14.4102 11.4388 14.3255 11.25 14.1562 11.0938C14 10.9245 13.8112 10.8398 13.5898 10.8398H10.25C10.0156 10.8398 9.8138 10.9245 9.64453 11.0938C9.48828 11.25 9.41016 11.4388 9.41016 11.6602C9.41016 11.8945 9.48828 12.0964 9.64453 12.2656C9.8138 12.4219 10.0156 12.5 10.25 12.5ZM17.3398 5V14.1602C17.3398 14.8503 17.0924 15.4427 16.5977 15.9375C16.1159 16.4193 15.5299 16.6602 14.8398 16.6602H3.16016C2.47005 16.6602 1.8776 16.4193 1.38281 15.9375C0.901042 15.4427 0.660156 14.8503 0.660156 14.1602V5C0.660156 4.3099 0.901042 3.72396 1.38281 3.24219C1.8776 2.7474 2.47005 2.5 3.16016 2.5H4.83984V1.66016C4.83984 1.4388 4.91797 1.25 5.07422 1.09375C5.24349 0.924479 5.4388 0.839844 5.66016 0.839844C5.89453 0.839844 6.08984 0.924479 6.24609 1.09375C6.41536 1.25 6.5 1.4388 6.5 1.66016V2.5H11.5V1.66016C11.5 1.4388 11.5781 1.25 11.7344 1.09375C11.9036 0.924479 12.1055 0.839844 12.3398 0.839844C12.5612 0.839844 12.75 0.924479 12.9062 1.09375C13.0755 1.25 13.1602 1.4388 13.1602 1.66016V2.5H14.8398C15.5299 2.5 16.1159 2.7474 16.5977 3.24219C17.0924 3.72396 17.3398 4.3099 17.3398 5ZM2.33984 7.5H15.6602V5C15.6602 4.76562 15.5755 4.57031 15.4062 4.41406C15.25 4.24479 15.0612 4.16016 14.8398 4.16016H13.1602V5C13.1602 5.23438 13.0755 5.4362 12.9062 5.60547C12.75 5.76172 12.5612 5.83984 12.3398 5.83984C12.1055 5.83984 11.9036 5.76172 11.7344 5.60547C11.5781 5.4362 11.5 5.23438 11.5 5V4.16016H6.5V5C6.5 5.23438 6.41536 5.4362 6.24609 5.60547C6.08984 5.76172 5.89453 5.83984 5.66016 5.83984C5.4388 5.83984 5.24349 5.76172 5.07422 5.60547C4.91797 5.4362 4.83984 5.23438 4.83984 5V4.16016H3.16016C2.9388 4.16016 2.74349 4.24479 2.57422 4.41406C2.41797 4.57031 2.33984 4.76562 2.33984 5V7.5ZM15.6602 9.16016H2.33984V14.1602C2.33984 14.3945 2.41797 14.5964 2.57422 14.7656C2.74349 14.9219 2.9388 15 3.16016 15H14.8398C15.0612 15 15.25 14.9219 15.4062 14.7656C15.5755 14.5964 15.6602 14.3945 15.6602 14.1602V9.16016Z"
                                                    fill="#203864"
                                                />
                                                </svg>
                                            }
                                        />
                                        
                                        <Input
                                            id={'time'}
                                            label={''}
                                            required
                                            type={'time'}
                                            invalid={invalidTime}
                                            disabled={edit || complete}
                                            register={null}
                                            placeholder={''}
                                            value={timeOrder}
                                            onChange={(value: string)=>{ setTimeOrder(value);}}
                                            message={''}
                                            noMargin
                                        />
                                   
                                    </OrderInfo.ContainerTime>
                                    <span
                                        className="text-danger"
                                        style={styles.textSmall}
                                    >
                                        {invalidTime ? 'Waktu tidak boleh melebihi dari waktu saat ini' : ''}
                                    </span>
                                </OrderInfo.ContainerDate>
                                
                            </div>

                            </FormGroup>
                        )}
                    
                </Col>
                <Col lg={4} sm={12}>
                    {edit || complete ? (
                        <Input
                            id={'payment-method'}
                            label={'Metode Pembayaran'}
                            required
                            type={'text'}
                            disabled
                            maxLength={255}
                            register={null}
                            placeholder={'Metode Pembayaran'}
                            value={paymentName || ''}
                            onChange={(value: string)=> {
                            }}
                        />
                    ):(
                        <InputSelect
                            id={'payment'}
                            label={'Metode Pembayaran'}
                            required
                            disabled={edit || complete}
                            placeholder={'Pilih Metode Pembayaran'}
                            value={payment.toString()}
                            onChange={(value) => setPayment(parseInt(value))}
                            options={paymentMethod}
                        />
                    )}
                    
                </Col>
                <Col lg={12} sm={12}>
                    <Input
                        id={'note'}
                        label={'Catatan Pemesanan'}
                        // required
                        type={'textarea'}
                        disabled={complete}
                        // invalid={note && note.length > 0 ? validateRange(note, 'Detail Alamat', 10).length != 0 : false}
                        maxLength={255}
                        register={null}
                        placeholder={'Masukkan Catatan Pemesanan'}
                        value={note || ''}
                        onChange={(value: string)=> {
                            setNote(checkSapace(value));
                        }}
                        // message={note && note.length > 0 ? validateRange(note, 'Catatan Pemesanan', 10) : ''}
                    />
                </Col>
            </Row>
        </OrderInfo.Container>
        
    );
};

export default FormInfoOrder;