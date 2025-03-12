/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Col, FormGroup, Label, Row, Spinner } from 'reactstrap';
import Upload, { styles } from './styles';
import { BlockTitle, Button, Icon, Input, InputSelect, ModalConfirm, ModalConfirmPopup } from '@/components';

import { TableUploadOrder } from '@/components/organism';
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';
import { useSelector } from 'react-redux';
import { getStoreListV2 } from '@/services/master';
import { getLocationDropdown, uploadFileOrder } from '@/services/order';
import { LocationList } from '@/utils/type/order';
import { useRouter } from 'next/router';

import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import successGif from '@/assets/gift/success-create-sku.gif';

interface Props {
    formData: any;
}
const UploadOrder = ({
    formData,
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const inputFile = useRef(null);
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [channel, setChannel] = useState<SelectItem | null>(null);
    const [listStore, setListStore] = useState<SelectItemOptionsType>([]);
    const [store, setStore] = useState<string>('');
    const [listLocation, setListLocation] = useState<LocationList[] | null>(null);
    const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
    const [warehouse, setWarehouse] = useState<string>('');
    const [file, setFile] = useState<any>('');
    const [valueFile, setValueFile] = useState<string>('');
    const [storeData, setStoreData] = useState<any>(null);
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [reloadData, setReloadData] = useState<boolean>(false);
    const [errorUpload, setErrorUpload] = useState<string>('');

    const handleFileUpload = async(e: any) => {
        const { files } = e.target;
        if (files && files.length) {
        //   const filename = files[0].name;
    
        //   var parts = filename.split('.');
        //   const fileType = parts[parts.length - 1];
          let fileData = files[0];
          setErrorUpload('');
          setFile(fileData);
        //   setImageChange(URL.createObjectURL(files[0]));
        //   const resFile = await postUploadData(files[0]);
        //   if(resFile?.data.url){
            
        //     setImageUrl(resFile?.data.url);
        //   }
          
        }
    };
    
    const handleDisableButton = () => {
        if(!store || !warehouse || !channel || !file) 
            setDisableButton(true);
        else setDisableButton(false);
    };

    const handleBack = () => {
        if(store || warehouse || channel || file) 
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
    },[store, warehouse, file]);

    const onChangeFile = () => {
        inputFile?.current?.click();
    };

    const getListStore = async() => {
        
        const response = await getStoreListV2(client_id, '11,14');
        if(response && response.data) {
            setStoreData(response.data);
            let datas: SelectItem[] = [];

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

    const handleSelectStore = (value: string) => {
        setStore(value);
        const dataSelected = storeData.filter((data: any) => data.store_id == parseInt(value));

        if(dataSelected?.length > 0) {
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

    const resetData = () => {
        setStore('');
        setWarehouse('');
        setChannel(null);
        setFile(null);
        setErrorUpload('');
    };

    const handleUpload = async () => {
        setLoadingButton(true);
        const formData = new FormData();
        formData.append('upload_file', file);
        formData.append('store_id', store);
        formData.append('location_id', warehouse);
        const response = await uploadFileOrder(formData);
        
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
        } else {
            if(response?.error?.type.includes('500'))
                setErrorUpload('Maksimal 500 baris dalam 1 file');
            else 
                setErrorUpload('File yang diunggah tidak sesuai dengan template unggah pesanan dari bebas kirim');
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
                        <Upload.SubsPage>{'Unggah Pesanan'}</Upload.SubsPage>
                    </Upload.Breadcrumb>
                    <BlockTitle className={'mb-4'} fontSize={32}>{'Unggah Pesanan'}</BlockTitle>
                    
                    <Row>
                        <Col lg={4} sm={12}>
                            <InputSelect
                                id={'store'}
                                label={'Toko'}
                                required
                                placeholder={'Pilih Toko'}
                                value={store}
                                onChange={(value) =>  handleSelectStore(value)}
                                options={listStore}
                            />
                        </Col>
                        <Col lg={4} sm={12}>
                            <Input
                                id={'chanel'}
                                label={'Channel'}
                                required
                                type={'text'}
                                disabled
                                maxLength={255}
                                register={null}
                                placeholder={'Channel'}
                                value={channel ? channel.label : ''}
                                onChange={()=> {
                                   
                                }}
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
                    <Col lg={12} sm={12}>
                        <input
                            style={{ display: 'none' }}
                            ref={inputFile}
                            onChange={handleFileUpload}
                            type="file"
                            accept=".xls,.xlsx"
                            value={valueFile}
                            onClick={()=> setValueFile('')}
                        />
                        <FormGroup className="mb-4">
                            <Label htmlFor={''}>
                                {'Unggah File'} <span style={{color: 'red'}}>*</span>
                            </Label>
                            <Upload.ContainerUpload error={errorUpload.length > 0}>
                                <Upload.ValueUpload active={file?.name?.length > 0}>
                                    {file ? file.name : 'Pilih File'}
                                </Upload.ValueUpload>
                                <Upload.ContainerButton onClick={onChangeFile}>
                                    <Upload.TextButton>{'Telusuri'}</Upload.TextButton>
                                </Upload.ContainerButton>
                            </Upload.ContainerUpload>
                            <Upload.Description error={errorUpload.length > 0}>{errorUpload.length > 0 ? errorUpload : 'Hanya dapat mengunggah maksimal 500 baris dalam 1 file dan tipe file berupa .xls, .xlsx'}</Upload.Description>
                        </FormGroup>
                    </Col>
                    <Upload.ContainerAction>
                        <Upload.ContainerRow>
                            <Upload.ButtonDownload>
                                <Icon name={'download-cloud'}></Icon>
                                <a href={'/files/Template-Upload-Order-Bulk.xlsx'} download={'Template Upload Order'}>
                                    <Upload.TextDownload>{'Unduh Template'}</Upload.TextDownload>
                                </a>
                            </Upload.ButtonDownload>
                            <a href={'/files/Bebas-Kirim-Regions.xlsx'} download={'Daerah Pengiriman Bebas Kirim'}>
                                <Upload.TextUnderline>{'Unduh Daerah Pengiriman Bebas Kirim'}</Upload.TextUnderline>
                            </a>
                        </Upload.ContainerRow>

                        <Upload.ContainerRow>
                            <Button type={'button'} className={'justify-center'} style={styles.ButtonSecondary} onClick={handleBack}>
                                {'Kembali'}
                            </Button>
                            <Button type={'button'} className={`justify-center ${disableButton || loadingButton ? 'btn-disabled' : ''}`} style={styles.ButtonPrimary} color={'primary'} disabled={disableButton || loadingButton} onClick={handleUpload}>
                                {loadingButton ? <Spinner size="sm" color="light" /> : 'Unggah Pesanan'}
                            </Button>
                        </Upload.ContainerRow>
                    </Upload.ContainerAction>
                </Upload.Container>
            </Col>
            <Col lg={12} sm={12}>
                <Upload.Container>
                    <TableUploadOrder reload={reloadData}/>
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
                    title={'Berhasil Mengunggah Pesanan!'}
                    subtitle={'Proses unggah file pesanan telah berhasil! Silakan periksa dengan mengunduh hasil unggah file pesanan.'}
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

export default UploadOrder;