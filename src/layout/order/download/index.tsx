/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import { Col, FormGroup, Label, Row, Spinner } from 'reactstrap';
import Upload, { styles } from './styles';
import { BlockTitle, Button, Input, InputSelect, ModalConfirm, ModalConfirmPopup } from '@/components';

import { TableDownloadOrder } from '@/components/organism';
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';
import { useSelector } from 'react-redux';
import { getStoreListV2 } from '@/services/master';
import { getLocationDropdown, requestDownloadOrder } from '@/services/order';
import { LocationList } from '@/utils/type/order';
import { useRouter } from 'next/router';

import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import successGif from '@/assets/gift/success-create-sku.gif';
import gifAnxiety from '@/assets/gift/Anxiety.gif';
import DatePicker from 'react-datepicker';
import { convertDate, incraseDate } from '@/utils/formater';
import { listCodType, listPaymentType, listStatusOrder, listTypeFile } from '@/utils/constants';
import { MultiSelect } from 'primereact/multiselect';
import colors from '@/utils/colors';
import moment from 'moment';

interface Props {
    formData: any;
}
const DownloadOrder = ({
    formData,
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [listStore, setListStore] = useState<SelectItemOptionsType>([]);
    const [storeData, setStoreData] = useState<any>(null);
    const [store, setStore] = useState<string>('');
    const [typeFile, setTypeFile] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationList[] | null>(null);
    const [channel, setChannel] = useState<SelectItem | null>(null);
    const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
    const [warehouse, setWarehouse] = useState<string>('');
    const [rangeDate, setRangeDate] = useState({ start: null, end: null });
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalError, setModalError] = useState<boolean>(false);
    const [reloadData, setReloadData] = useState<boolean>(false);
    const [openDate, setOpenDate] = useState<boolean>(false);
    const [paymentMethod, setpaymentMethod] = useState<any>('ALL');
    const [codType, setcodType] = useState<any>('ALL');

    const [selectedStatusOrder, setSelectedStatusOrder] = useState<Array<number>>([]);

    let maxEndDate = new Date(rangeDate.start);
    maxEndDate.setDate(maxEndDate.getDate() + 90);

    const handleDisableButton = () => {
        if(!store || !warehouse || !channel || !typeFile || !rangeDate.end || !rangeDate.start || !paymentMethod || !codType) 
            setDisableButton(true);
        else setDisableButton(false);
    };

    const handleBack = () => {
        if(store || warehouse || channel) 
            setModalConfirm(true);
           
        else 
            router.back();
    };

    useEffect(() => {
        getListStore();
        getListLocation();
    },[]);

    useEffect(() => {
        handleDisableButton();
    },[store, warehouse, channel, rangeDate, typeFile, paymentMethod, codType]);

    const getListStore = async() => {
        
        const response = await getStoreListV2(client_id, 'ALL');
        if(response && response.data) {
            let datas: SelectItem[] = [];
            setStoreData(response.data);
            response.data.forEach((data) => {
                datas.push({
                    value: data.store_id.toString(),
                    label: data.store_name,
                    title: data.channel_id
                });
            });

            setListStore(datas);
        }
    };

    const getListLocation = async() => {
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
        
    };

    const onRangeChange = (dates: any) => {
        const [start, end] = dates;
        setRangeDate({ start, end });
    
        // const formattedStart = start ? formatDateForURL(start) : "";
        // const formattedEnd = end ? formatDateForURL(end) : "";
    
        if (start && end) {
            setOpenDate(false);
        //   dispatch(setStartDate(formattedStart));
        //   dispatch(setEndDate(formattedEnd));
        }
    };

    const handleSelectStore = (value: string) => {
        setStore(value);
        const dataSelected = storeData.filter((data: any) => data.store_id == parseInt(value));

        if(dataSelected.length > 0) {
            setChannel({
                value: dataSelected[0].channel_id,
                label: dataSelected[0].channel_name,
            });
        }else {
            setChannel({
                value: 11,
                label: 'OTHER',
            });
        }
       

    };

      // on calender close
    const handleCalendarClose = () => {
        if (rangeDate.start && !rangeDate.end) {
        const today = new Date();
        setRangeDate({ start: today, end: today });

        }
    };

    const handleGetListStatus = () => {
        let list: Array<any> = [];

        if(selectedStatusOrder?.length > 0) {
            selectedStatusOrder.map((value) => {
                const dataStatus = listStatusOrder.filter((data) => data.value == value);
                if(dataStatus.length > 0){
                    dataStatus[0].valueList.map((data) => {
                        list.push(data);
                    });
                    
                } 
            });
        }

        return list;
    };

    const difFromToday = () => {
        let dateFrom = moment(rangeDate.start).add(7, 'hours');
        let dateTo = moment(new Date());
        const diff =  dateTo.diff(dateFrom, 'days');
        if(diff > 30) {
            return 30;
        }
        return diff;
    };

    const resetData = () => {
        setStore('');
        setWarehouse('');
        setChannel(null);
        setSelectedStatusOrder([]);
        setTypeFile('');
        setRangeDate({start: null, end: null});
        
    };

    const handleRequestDownload = async () => {
        setLoadingButton(true);
        const dateStart = new Date(convertDate(rangeDate.start));
        const start = dateStart.getTime()/1000;
        const dateEnd = new Date(convertDate(rangeDate.end));
        dateEnd.setHours(23,59,59);
        const end = dateEnd.getTime()/1000;
        const payload = {
            channel_id: channel.value,
            location_id: parseInt(warehouse),
            store_id: parseInt(store),
            file_type: typeFile,
            start_date: start,
            end_date:end,
            status_id: handleGetListStatus(),
            client_id: client_id,
            payment_method_id: paymentMethod === 'ALL' ? [] : [paymentMethod],
            cod_price_type: codType === 'ALL' ? [] : [codType]
        };

        const response = await requestDownloadOrder(payload);
        if([200].includes(response.status)) {
            setModalSuccess(true);
            setTimeout(() => {
                setModalSuccess(false);
                setReloadData(true);
                setTimeout(() => {
                    setReloadData(false);
                }, 3000);
            }, 4000);

            resetData();
        }else {
            if([404].includes(response.status)) {
                setModalError(true);
                setTimeout(()=> {
                    setModalError(false);
                }, 4000);
            }
        }
        setLoadingButton(false);

    };
    
    return(
        <Fragment>
            <Col lg={12} sm={12} className="mb-4">
                <Upload.Container>
                    <Upload.Breadcrumb>
                        <Upload.MainPage>{'PESANAN'}</Upload.MainPage>
                        <Upload.MainPage>{'/'}</Upload.MainPage>
                        <Upload.SubsPage>{'Unduh File'}</Upload.SubsPage>
                    </Upload.Breadcrumb>
                    <BlockTitle className={'mb-4'} fontSize={18}>{'Unduh File'}</BlockTitle>
                    
                    <Row>
                        <Col lg={4} sm={12}>
                            <InputSelect
                                id={'store'}
                                label={'Toko'}
                                required
                                placeholder={'Pilih Toko'}
                                value={store}
                                onChange={(value) => {
                                    handleSelectStore(value);
                                }}
                                options={listStore}
                            />
                        </Col>
                        <Col lg={4} sm={12}>
                            <Input
                                id={'channel'}
                                label={'Channel'}
                                required
                                type={'text'}
                                disabled
                                maxLength={255}
                                register={null}
                                placeholder={'Channel'}
                                value={channel ? channel.label : ''}
                            />
                        </Col>
                        <Col lg={4} sm={12}>
                            <InputSelect
                                id={'warehouse'}
                                label={'Gudang Asal'}
                                required
                                placeholder={'Pilih Gudang Asal'}
                                value={warehouse}
                                onChange={(value) => setWarehouse(value)}
                                options={listWarehouse}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} sm={12}>
                            <FormGroup>
                                <Label className="fw-bold" htmlFor={''}>
                                    {'Rentang Tanggal'}<span style={styles.required}>*</span>
                                </Label>

                                <DatePicker
                                    selected={rangeDate.start}
                                    startDate={rangeDate.start}
                                    onChange={onRangeChange}
                                    onCalendarClose={handleCalendarClose}
                                    endDate={rangeDate.end}
                                    selectsRange
                                    placeholderText={'Pilih Rentang Tanggal'}
                                    showIcon={rangeDate.start == null}
                                    isClearable
                                    className="form-control"
                                    onChangeRaw={(e) => e.preventDefault()}
                                    maxDate={rangeDate.start ?  incraseDate(rangeDate.start, difFromToday()) : new Date()}
                                    // minDate={reductionDate(365)}
                                    dateFormat="dd/MM/yyyy"
                                    open={openDate}
                                    onFocus={()=> setOpenDate(true)}
                                    onClickOutside={() => setOpenDate(false)}
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
                            </FormGroup>
                        </Col>
                        <Col lg={4} sm={12}>
                            <FormGroup>
                                <Label className="fw-bold" htmlFor={''}>
                                    {'Status Pesanan'}
                                </Label>
                                <MultiSelect
                                    value={selectedStatusOrder}
                                    id={'status'}
                                    optionLabel="label"
                                    color={colors.black}
                                    placeholder={'Status Pesanan'}
                                    style={{ fontSize: 12 }}
                                    panelClassName="fullsize-panel"
                                    // maxSelectedLabels={4}
                                    onChange={(e) => setSelectedStatusOrder(e.value)}
                                    options={listStatusOrder}
                                    itemTemplate={(list) => (
                                        <div className="p-multiselect-representative">
                                            <span style={styles.textList}>{list.label}</span>
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </Col>
                        <Col lg={4} sm={12}>
                            <InputSelect
                                id={'store'}
                                label={'Type File'}
                                required
                                placeholder={'Type File'}
                                value={typeFile}
                                onChange={(value) => setTypeFile(value)}
                                options={listTypeFile}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} sm={12}>
                            <InputSelect
                                id={'payment'}
                                label={'Metode Pembayaran'}
                                required
                                placeholder={'Pilih Metode Pembayaran'}
                                value={paymentMethod}
                                onChange={(value) => setpaymentMethod(value)}
                                options={listPaymentType}
                            />
                        </Col>
                        <Col lg={6} sm={12}>
                            <InputSelect
                                id={'type_cod'}
                                label={'Tipe COD'}
                                required
                                disabled={paymentMethod === '1'}
                                placeholder={'Pilih Tipe COD'}
                                value={codType}
                                onChange={(value) => setcodType(value)}
                                options={listCodType}
                            />
                        </Col>
                    </Row>
                    <Upload.ContainerAction>
                        <Upload.ContainerRow>
                        </Upload.ContainerRow>
                        <Upload.ContainerRow>
                            <Button type={'button'} className={'justify-center'} style={styles.ButtonSecondary} onClick={handleBack}>
                                {'Kembali'}
                            </Button>
                            <Button type={'button'} className={`justify-center ${disableButton || loadingButton ? 'btn-disabled' : ''}`} style={styles.ButtonPrimary} color={'primary'} disabled={disableButton || loadingButton} onClick={handleRequestDownload}>
                                {loadingButton ? <Spinner size="sm" color="light" /> : 'Ajukan Unduh Pesanan'}
                            </Button>
                        </Upload.ContainerRow>
                    </Upload.ContainerAction>
                </Upload.Container>
            </Col>
            <Col lg={12} sm={12}>
                <Upload.Container>
                    <TableDownloadOrder reload={reloadData}/>
                </Upload.Container>
            </Col>
            {modalConfirm && (
                <ModalConfirmPopup
                    icon={gifConfirm}
                    buttonConfirmation={true}
                    handleClickYes={()=> router.back()}
                    handleClickCancelled={()=> setModalConfirm(false)}
                    modalContentStyle={styles.ModalContentStyle}
                    modalBodyStyle={styles.ModalConfirm}
                    title={'Apakah Kamu Yakin?'}
                    subtitle={'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'}
                />
            )}

            {modalSuccess && (
                <ModalConfirm
                    icon={successGif}
                    widthImage={350}
                    heightImage={320}
                    modalContentStyle={styles.ModalContentStyle}
                    modalBodyStyle={styles.ModalConfirmSuccess}
                    title={'Berhasil Ajukan Unduh Pesanan!'}
                    subtitle={'Proses pengajuan unduh pesanan telah berhasil! Silakan periksa riwayat unduh pesanan'}
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
            
            {modalError && (
                <ModalConfirm
                    icon={gifAnxiety}
                    widthImage={350}
                    heightImage={320}
                    modalContentStyle={styles.ModalContentStyle}
                    modalBodyStyle={styles.ModalConfirm}
                    title={'Data tidak ditemukan!'}
                    subtitle={'Tidak terdapat data pada pengajuan yang dilakukan. Silakan periksa kembali formulir pengajuan unduh pesanan Anda'}
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
        </Fragment>
    );
};

export default DownloadOrder;