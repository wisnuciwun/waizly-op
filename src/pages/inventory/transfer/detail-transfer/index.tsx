/* eslint-disable react-hooks/exhaustive-deps */
// react & nect import
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

// component & layout
import { InfoWarning, ModalCancel, ModalConfirm } from '@/components';
import DetailInventoryTransfer from '@/layout/inventory-transfer/detail-inventory-transfer';
import Content from '@/layout/content/Content';

// service
import { getTransferDetail, approveTransfer, cancelTransfer } from '@/services/inventory';

// utils
import { TransferData } from '@/utils/type/inventory';

// third party
import { Input } from 'reactstrap';

// assets
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifHeavyBox from '@/assets/gift/heavy-box.gif';
import successGif from '@/assets/gift/success-create-sku.gif';
import Warning from '@/assets/gift/Anxiety.gif';

function DetailTransfer () {
    const route = useRouter();
    const { query } = route;
    const idData = query.id;
    const inputRef = useRef<any>(null);

    const [detailTransfer, setDetailTransfer] = useState<TransferData[]>([]);  
    const [detailId, setDetailId] = useState<number | string | null>(null); 
    const [ismodalSuccess, setismodalSuccess] = useState<boolean>(false);
    const [successModalText, setsuccessModalText] = useState<string>('');
    const [cancelReason, setcancelReason] = useState<string>('');
    const [isModalCancel, setisModalCancel] = useState<boolean>(false);
    const [acceptTransfer, setAcceptTransfer] = useState<boolean>(false);
    const [showModalError, setShowModalError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchDataDetail = async () => {
        try {
            setLoading(true);
            const { data: detailData } = await getTransferDetail(idData);
            setDetailTransfer(detailData);
            setLoading(false);
            setDetailId(detailData.transfer.transfer_header_id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelTransfer = async () => {
        const payload = {
            cancel_reason: cancelReason,
        };
            setsuccessModalText('Berhasil Membatalkan\nTransfer');
            setisModalCancel(false);
            await cancelTransfer(detailId, payload).then((res) => {
            if (res?.status == 200 || res?.status == 201) {
                    setismodalSuccess(true);
                    setTimeout(() => {
                    route.push('/inventory/transfer');
                }, 3000);
            }
        });
    };

    const handleApproveTransfer = async () => {
        setsuccessModalText('Berhasil Menyetujui\nTransfer');
        setAcceptTransfer(false);

        try {
            const res = await approveTransfer(detailId);
            
            if (res?.status === 200 || res?.status === 201) {
            setismodalSuccess(true);
            setTimeout(() => {
                route.push('/inventory/transfer');
            }, 3000);
            }
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.error?.type === 'INSUFFICIENT_STOCK') {
                setShowModalError(true);
                setAcceptTransfer(false);
            } else {
                console.error(error);
            }
        }
    };

    const handleClickEditsError = () => {
        route.push({
          pathname: '/inventory/transfer/form',
          query: { action: 'edit', id: detailId },
        });
      };


    useEffect(() => {
        if (query.id) {
            fetchDataDetail();
        }
    },[query.id]);


    return (
        <Content>
            <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
            <DetailInventoryTransfer 
                formData={detailTransfer}
                acceptTransfer={setAcceptTransfer}
                cancelTransfer={setisModalCancel}
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
                      ? true
                      : false
                  }
                handleClickCancelled={() => setisModalCancel(false)}
                handleClickYes={handleCancelTransfer}
                buttonConfirmStyle={{
                    backgroundColor: cancelReason == '' ? '#E9E9EA' : '#FF6E5D',
                    color: 'white',
                    border: 'none',
                    height: 46,
                }}
                subtitle={
                    'Apakah kamu yakin ingin membatalkan transfer? Silakan isi alasan pembatalan transfer'
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

            {acceptTransfer && (
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
                    'Jika kamu setujui transfer, status transfer tidak dapat diubah kembali'
                }
                buttonConfirmation
                useTimer={false}
                handleClickCancelled={() => setAcceptTransfer(false)}
                handleClickYes={handleApproveTransfer}
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

            {showModalError && (
                <ModalCancel
                toggle={false}
                icon={Warning}
                buttonConfirmStyle={{ height: 46 }}
                textSubmit="Edit Transfer"
                textCancel='Kembali'
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
                title={'Oops! Barang Tidak Cukup!'}
                subtitle={
                    'Tidak dapat melakukan transfer karena jumlah stok yang ingin ditransfer, melebihi stok yang tersedia saat ini.'
                }
                buttonConfirmation
                useTimer={false}
                handleClickCancelled={() => setShowModalError(false)}
                handleClickYes={handleClickEditsError}
                />
            )}
        </Content>
    );
}

export default DetailTransfer;