/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Create, {styles} from './styles';
import {  Input, InputSelect , Button, Head, ModalConfirmPopup, ModalConfirm} from '@/components';
import CalendarIcon from '@/assets/images/icon/calendar.svg';
import Image from 'next/image';
import {Col, Row, Spinner } from 'reactstrap';
import TableDataDetailInventory from '@/components/organism/tabledata-inventory';
import gifAnxiety from '@/assets/gift/Anxiety.gif';
import { InboundData, InboundDetail } from '@/utils/type/inventory';
import moment from 'moment';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import { confirmationInbound } from '@/services/inventory';
import successGif from '@/assets/gift/success-create-sku.gif';
import { UseDelay } from '@/utils/formater';
import { useRouter } from 'next/router';

export interface HandleInputChange {
    (id: string, field: keyof InboundDetail, value: string): void;
}
interface ConfirmationInventoryProps {
    formData: InboundData | [] | any;
    setFormData: (data: InboundData | any) => void
    handleChangePageToDetail: () => void;
    comparisonData: InboundData | [] | any;
}

function ConfirmationInventory ({formData,setFormData,handleChangePageToDetail,comparisonData} :ConfirmationInventoryProps) {
    const router = useRouter();
    const { inbound , inbound_detail } = formData;
    const { query, pathname, replace } = router;

    const [modalConfirm, setModalConfirm] = useState<boolean>(false);
    const [modalError, setModalError] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);

    const handleInputChange: HandleInputChange = (id : string, field: string, value:string) => {
        const updatedData = inbound_detail?.map((item: { inbound_detail_id: string; }) =>
            item.inbound_detail_id === id ? { ...item, [field]: value } : item
        );
        setFormData(prevState => ({
            ...prevState,
            inbound_detail: updatedData
        }));
        areAllFieldsFilled(); 
    };

    const areAllFieldsFilled = (): boolean => {
        return inbound_detail?.every(item => (item?.good_quantity != '' && item?.good_quantity != null) && (item?.damage_quantity != '' && item?.damage_quantity != null ));
    };

    const handleBackButton = () => {
        const { inbound , inbound_detail } = comparisonData;

        const modifiedDetailData = {
            inbound: formData.inbound,
            inbound_detail: formData?.inbound_detail.map(item => {
                return {
                    ...item,
                    good_quantity: item.good_quantity === null ? 0 : item.good_quantity,
                    damage_quantity: item.damage_quantity === null ? 0 : item.damage_quantity
                };
            })
        };
        const defaultData = `${JSON.stringify(inbound)}${JSON.stringify(inbound_detail)}`;
        
        const temporaryChanged = `${JSON.stringify(modifiedDetailData.inbound)}${JSON.stringify(modifiedDetailData.inbound_detail)}`;
        
        if(temporaryChanged !== defaultData) {
            setModalConfirm(true);
        } else {
            if(query.listType === 'true') {
                router.back();
            } else {
                replace({
                    pathname: pathname,
                    query: {
                        ...query,
                        type: 'detail'
                    },
                });
            }
        }
    };

    const handleSubmitButton = async () => {
        try {
            setLoadingButton(true);
            const received = inbound_detail.map(item => ({
                inbound_detail_id: item.inbound_detail_id,
                good_quantity: Number(item.good_quantity),
                damage_quantity: Number(item.damage_quantity)
              }));

            const payload = {
                'inbound_id': inbound?.inbound_id,
                received
            };
            await confirmationInbound(payload);
            setModalSuccess(true);
            await UseDelay(2500);
            handleChangePageToDetail();

        } catch (error) {
            const errorValitdationNotMatchValue = 'Barang normal + barang rusak harus sesuai jumlah barang';
            if(error?.response?.data?.error?.type === errorValitdationNotMatchValue) {
                setModalError(true);
            }
        } finally {
            setLoadingButton(false);
        }
    };

    return (
        <Create.Container>
            <Head title="Konfirmasi Inbound" />
            <Create.WrapperHeader>
                <Create.Breadcrumb>
                    <Create.MainPage>{'INVENTORI'}</Create.MainPage>
                    <Create.MainPage>{'/'}</Create.MainPage>
                    <Create.MainPage>{'INBOUND'}</Create.MainPage>
                    <Create.MainPage>{'/'}</Create.MainPage>
                    <Create.SubsPage>{'Konfirmasi Inbound'}</Create.SubsPage>
                </Create.Breadcrumb>
            </Create.WrapperHeader>

            <div className="product-info me-xxl-5 mt-4">
                <Create.HeaderTitle>
                    Konfirmasi Inbound
                </Create.HeaderTitle>
            </div>
            <Row className={'mt-4'}>
                <Col lg={6} sm={12}>
                    <Input
                        id={'time_inbound'}
                        value={moment.utc(inbound?.reference_date).format('DD/MM/YY')}
                        label={'Waktu Inbound'}
                        register={null}
                        disabled
                        stickyLabel={
                            <Image src={CalendarIcon} height={20} width={20} alt="..." />
                        }
                        stickyPosition={'right'}
                        />
                </Col>
                <Col lg={6} sm={12}>
                    <InputSelect
                        id={'destination_warehouse'}
                        value={inbound?.location_name}
                        label={'Gudang Tujuan'}
                        placeholder=""
                        disabled
                        required
                        onChange={() => {}}
                        options={[
                            {
                                label: inbound?.location_name,
                                value: inbound?.location_name
                            }
                        ]}
                        />
                </Col>
                <Col lg={6} sm={12}>
                    <Input
                        id={'resi_number'}
                        value={inbound?.tracking_number}
                        label={'Nomor Resi'}
                        register={null}
                        disabled
                        />
                </Col>
                <Col lg={6} sm={12}>
                    <Input
                        id={'external_id'}
                        value={inbound?.external_id}
                        label={'External ID'}
                        register={null}
                        disabled
                        />
                </Col>
                <Col lg={6} sm={12}>
                    <Input
                        id={'supplier'}
                        value={inbound?.supplier_name}
                        label={'Pemasok'}
                        register={null}
                        disabled
                        />
                </Col>
                <Col lg={6} sm={12}>
                    <InputSelect
                        id={'delivery_service'}
                        value={inbound?.courier}
                        label={'Jasa Kirim'}
                        placeholder=""
                        disabled
                        onChange={() => {}}
                        options={[
                            {
                                label: inbound?.courier,
                                value: inbound?.courier
                            }
                        ]}
                        />
                </Col>
            </Row>

            <div className="product-details entry  mt-1">
            <Create.SubTitle
                fontWeight={'700'}
                color="#203864"
            >
                Master SKU<span style={styles.RequiredStyle}>*</span>
            </Create.SubTitle>
            
            <div className="mt-3">
                <div style={{ overflowX: 'auto' }}>
                    <Create.Table>
                        <thead
                            className="table-primary"
                            style={{ border: '1px solid #E9E9EA' }}
                        >
                            <tr style={styles.header}>
                                <th style={{...styles.listHeader}}>
                                    Informasi SKU
                                </th>
                                <th style={{...styles.listHeader}}>
                                    Jumlah Barang Sampai<span style={styles.RequiredStyle}>*</span>
                                </th>
                                <th style={{...styles.listHeader}}>
                                    Barang Normal<span style={styles.RequiredStyle}>*</span>
                                </th>
                                <th style={{...styles.listHeader}}>
                                    Barang Rusak<span style={styles.RequiredStyle}>*</span>
                                </th>
                            </tr>
                        </thead>

                        <TableDataDetailInventory 
                            inputMode 
                            handleInputChange={handleInputChange}
                            dataList={inbound_detail}
                        />
                    </Create.Table>
                </div>
                    
                    <Create.ContainerRightFooter>
                        <Create.TextFooterRight>
                            {`Total SKU: ${inbound_detail?.length}`}
                        </Create.TextFooterRight>
                    </Create.ContainerRightFooter>
            </div>

            <Row className="mt-3">
                <Col lg={12} sm={12}>
                    <Input
                        id={'notes'}
                        value={inbound?.notes}
                        label={'Catatan'}
                        register={null}
                        disabled
                        type="textarea"
                        />
                </Col>
            </Row>
                <Create.ContainerRightFooter className="mt-4">
                    <Button
                        style={{width:180,fontSize:14}}
                        onClick={handleBackButton}
                    >
                        Kembali
                    </Button>
                    <Button
                        className={`${areAllFieldsFilled() || loadingButton ? 'btn-primary' : 'btn-disabled'} justify-center`}
                        disabled={!areAllFieldsFilled() || loadingButton}
                        onClick={areAllFieldsFilled() && handleSubmitButton}
                        style={{width:180,fontSize:14}}
                    >
                        {loadingButton ? <Spinner size="sm" color="light" /> : 'Simpan'}
                    </Button>
                </Create.ContainerRightFooter>
            </div>

            {modalConfirm && (
                <ModalConfirmPopup
                icon={gifConfirm}
                buttonConfirmation={true}
                handleClickYes={() => {
                    handleChangePageToDetail();
                    setFormData(comparisonData);
                }}
                handleClickCancelled={() => setModalConfirm(false)}
                modalContentStyle={styles.ModalContentStyle}
                modalBodyStyle={styles.ModalConfirm}
                title={'Apakah Kamu Yakin?'}
                subtitle={
                    'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
                }
                />
            )}

            {modalError &&
                <ModalConfirm
                icon={gifAnxiety}
                widthImage={400}
                heightImage={360}
                modalContentStyle={{ width: 400, height: 360 }}
                modalBodyStyle={{
                    width: 600,
                    borderTopLeftRadius: '70%',
                    borderTopRightRadius: '70%',
                    borderBottomLeftRadius: '70%',
                    borderBottomRightRadius: '70%',
                    paddingLeft: 140,
                    paddingRight: 140,
                    marginTop: '-100px',
                    paddingTop: 48,
                    marginLeft: '-100px',
                    height: '300px',
                }}
                title={'Jumlah Barang Yang Diterima Belum Sesuai!'}
                subtitle={'Jumlah barang yang kamu masukkan tidak sesuai dengan jumlah barang sampai yang seharusnya. Mohon periksa kembali dan masukkan jumlah barang yang benar.'}
                toggle={false}
                singleButtonConfirmation={true}
                useTimer={false}
                textSingleButton={'Mengerti'}
                hideCallback={() => setModalError(false)}
                handleClickYes={() => setModalError(false)}
                />
            }

            {modalSuccess && (
                <ModalConfirm
                    icon={successGif}
                    widthImage={350}
                    heightImage={320}
                    modalContentStyle={styles.ModalContentStyle}
                    modalBodyStyle={styles.ModalBodyStyle}
                    title={'Berhasil Mengonfirmasi Inbound!'}
                    subtitle={''}
                    useTimer={false}
                    buttonConfirmation={false}
                    handleClickYes={()=>{}}
                    handleClickCancelled={()=> {}}
                    textSubmit={''}
                    toggle={false}
                />
                )}      
        </Create.Container>
    );
}

export default ConfirmationInventory;