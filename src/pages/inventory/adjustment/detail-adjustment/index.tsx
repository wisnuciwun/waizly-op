/* eslint-disable react-hooks/exhaustive-deps */
// react & nect import
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// component & layout
import { InfoWarning, ModalCancel, ModalConfirm } from '@/components';
import DetailInventoryAdjustment from '@/layout/inventory/inventory-adjustment/detail-inventory-adjustment';
import Content from '@/layout/content/Content';

// service
import { getAdjustmentDetail, approveAdjustment, cancelAdjustment } from '@/services/inventory';

// utils
import { AdjustmentData } from '@/utils/type/inventory';

// third party
import { Input } from 'reactstrap';

// assets
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifHeavyBox from '@/assets/gift/heavy-box.gif';
import successGif from '@/assets/gift/success-create-sku.gif';


function DetailAdjustment () {
    const route = useRouter();
    const { query } = route;
    const idData = query.id;
    const inputRef = useRef<any>(null);

    const [detailAdjustment, setDetailAdjustment] = useState<AdjustmentData | []>([]);
    const [detailId, setDetailId] = useState<any>(null);
    const [ismodalSuccess, setismodalSuccess] = useState(false);
    const [successModalText, setsuccessModalText] = useState('');
    const [cancelReason, setcancelReason] = useState('');
    const [isModalCancel, setisModalCancel] = useState(false);
    const [acceptAdjustment, setAcceptAdjustment] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchDataDetail = async () => {
        try {
            setLoading(true);
            const { data: detailData } = await getAdjustmentDetail(idData);
            setDetailAdjustment(detailData);
            setLoading(false);
            setDetailId(detailData.adjustment_header_id);
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleCancelAdjustment = async () => {
        const payload = {
            reject_reason: cancelReason,
        };
            setsuccessModalText('Berhasil Membatalkan\nAdjustment');
            setisModalCancel(false);
            await cancelAdjustment(detailId, payload).then((res) => {
            if (res?.status == 200 || res?.status == 201) {
                    setismodalSuccess(true);
                    setTimeout(() => {
                    route.push('/inventory/adjustment');
                }, 3000);
            }
        });
    };

    const handleApproveAdjustment = async () => {
        setsuccessModalText('Berhasil Menyetujui\nAdjustment');
        setAcceptAdjustment(false);

        try {
            const res = await approveAdjustment(detailId);
            
            if (res?.status === 200 || res?.status === 201) {
            setismodalSuccess(true);
            setTimeout(() => {
                route.push('/inventory/adjustment');
            }, 3000);
            }
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error?.type === 'INSUFFICIENT_STOCK') {
                setAcceptAdjustment(false);
            } else {
                console.error(error);
            }
        }
    };


    useEffect(() => {
        if (query.id) {
            fetchDataDetail();
        }
    },[query.id]);


    return (
        <Content>
            <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
            <DetailInventoryAdjustment 
                formData={detailAdjustment}
                acceptAdjustment={setAcceptAdjustment}
                cancelAdjustment={setisModalCancel}
                loading={loading}
            />

            {isModalCancel && (
                <ModalCancel
                icon={gifConfirm}
                toggle={false}
                iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
                buttonConfirmation={true}
                textCancel="Kembali"
                textSubmit="Konfirmasi Pembatalan"
                useTimer={false}
                btnSubmitWidth={'65%'}
                btnCancelWidth={'35%'}
                separatedRound
                modalBodyStyle={{
                    width: 400,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    marginTop: '-115px',
                    height: 365.413,
                }}
                footerStyle={{ marginTop: 30 }}
                modalContentStyle={{ width: 400, height: 650 }}
                widthImage={400}
                heightImage={333}
                title={'Apakah Kamu Yakin?'}
                disableBtnSubmit={
                    cancelReason == '' 
                    // || cancelReason.trim().length < 10 ||
                    //   cancelReason.trim().length > 200
                      ? true
                      : false
                  }
                handleClickCancelled={() => setisModalCancel(false)}
                handleClickYes={handleCancelAdjustment}
                buttonConfirmStyle={{
                    backgroundColor: cancelReason == '' 
                    // || cancelReason.trim().length < 10 || 
                    // cancelReason.trim().length > 200 
                    ? '#E9E9EA' : '#FF6E5D',
                    color: 'white',
                    border: 'none',
                    height: 46,
                }}
                subtitle={
                    'Apakah kamu yakin ingin membatalkan adjustment? Silakan isi alasan pembatalan adjustment'
                }
                >
                <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
                    Alasan Pembatalan<span style={{ color: 'red' }}>*</span>
                </div>
                <Input
                    innerRef={inputRef}
                    type="textarea"
                    value={cancelReason}
                    maxLength={200}
                    style={{ padding: 8, marginTop: 10, fontSize: 12 }}
                    onChange={(e: any) => setcancelReason(e.target.value)}
                />
                </ModalCancel>
            )}

            {acceptAdjustment && (
                <ModalCancel
                toggle={false}
                icon={gifHeavyBox}
                buttonConfirmStyle={{ height: 46 }}
                textSubmit="Setuju"
                modalContentStyle={{ width: 400, height: 474 }}
                iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
                footerStyle={{ marginTop: 25 }}
                widthImage={400}
                heightImage={333}
                separatedRound
                modalBodyStyle={{
                    width: 400,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    marginTop: '-120px',
                    height: 194.413,
                }}
                title={'Apakah Kamu Yakin?'}
                subtitle={
                    'Jika kamu setujui adjustment, status adjustment tidak dapat diubah kembali'
                }
                buttonConfirmation
                useTimer={false}
                handleClickCancelled={() => setAcceptAdjustment(false)}
                handleClickYes={handleApproveAdjustment}
                />
            )}

            {ismodalSuccess && (
                <ModalConfirm
                hideCallback={() => {
                    setismodalSuccess(false);
                }}
                subtitle=""
                useTimer={true}
                toggle={false}
                icon={successGif}
                widthImage={350}
                heightImage={320}
                modalContentStyle={{ width: 350 }}
                buttonConfirmation={false}
                modalBodyStyle={{
                    width: 400,
                    borderTopLeftRadius: '50%',
                    borderTopRightRadius: '50%',
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    marginTop: '-100px',
                    height: '120px',
                    marginLeft: '-25px',
                    buttonConfirmation: true,
                    marginBottom: 13,
                }}
                title={successModalText}
                stylesCustomTitle={{
                    paddingTop: 0,
                    whiteSpace: 'pre-line',
                }}
                singleButtonConfirmation={false}
                textSingleButton={''}
                />
            )}
        </Content>
    );
}

export default DetailAdjustment;