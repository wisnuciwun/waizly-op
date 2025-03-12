// next & react import
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';

// component
import { Block, BlockContent, Button, SkeletonLoading, ModalCancel, ModalConfirm } from '@/components';
import { DataTableTitle, DataTableItem, DataTableRow, DataTableBody, DataTableHead, DataTableRowChild } from '@/components/molecules/table/table-master-sku';
import StatusBadge from '@/components/organism/table-inventory-transfer/status-badge';
import ButtonMore from '@/components/atoms/buttonmore';
import { styles } from './style';

// third party
import moment from 'moment';
import { Input } from 'reactstrap';

// service
import { approveTransfer, cancelTransfer } from '@/services/inventory';

// assets
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifHeavyBox from '@/assets/gift/heavy-box.gif';
import successGif from '@/assets/gift/success-create-sku.gif';
import Warning from '@/assets/gift/Anxiety.gif';

// utils
import colors from '@/utils/colors';
import { getTransferStatus } from '@/utils/getStatus';
import { usePermissions } from '@/utils/usePermissions';

function TableTransfer ({dataTransfer, loading}) {
    const route = useRouter();
    const permissions = usePermissions();
    const typeTabs = route.query.tab;
    const inputRef = useRef<any>(null);

    const arrayHeaderTable = [
        {
            header : 'Nomor Transfer'
        },
        {
            header : 'Status Transfer'
        },
        {
            header : 'Gudang Asal'
        },
        {
            header : 'Gudang Tujuan'
        },
        {
            header : 'Jumlah'
        },
        {
            header : 'Jumlah SKU'
        },
        {
            header : 'Dibuat Oleh'
        },
        {
            header : 'Disetujui Oleh'
        },
        // ...(typeTabs !== 'waiting-approvel' && typeTabs !== 'canceled' ? [{ header: 'Disetujui Oleh' }] : []),
        ...(typeTabs === 'waiting-approvel' ? [{ header: 'Aksi' }] : [])
    ];

    const [ismodalSuccess, setismodalSuccess] = useState(false);
    const [isModalCancel, setisModalCancel] = useState(false);
    const [cancelReason, setcancelReason] = useState('');
    const [successModalText, setsuccessModalText] = useState('');
    const [acceptTransfer, setAcceptTransfer] = useState(false);
    const [showModalError, setShowModalError] = useState(false);
    const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null);
    const [selectedTransferIdError, setSelectedTransferIdError] = useState<number | null>(null);

    const handleCancelTransfer = async () => {
        const payload = {
            cancel_reason: cancelReason,
        };
            setsuccessModalText('Berhasil Membatalkan\nTransfer');
            setisModalCancel(false);
            await cancelTransfer(selectedTransferId, payload).then((res) => {
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
          const res = await approveTransfer(selectedTransferId);
          
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
                setSelectedTransferIdError(selectedTransferId);
              } else {
                console.error(error);
              }
        }
      };  

    const handleClickDetail = (id:number) => {
        if(!permissions?.includes('Hanya Lihat')) {
            route.push({
                pathname: '/inventory/transfer/detail-transfer',
                query: {
                    id: id
                }
            });
        }
    };

    const handleClickEdit = (id:number) => {
        if(permissions?.includes('Ubah Transfer')) {
            route.push({
            pathname: '/inventory/transfer/form',
            query: { action: 'edit', id },
            });
        }
      };

      const handleClickEditsError = () => {
        if(permissions?.includes('Batalkan Transfer')) {
            route.push({
            pathname: '/inventory/transfer/form',
            query: { action: 'edit', id: selectedTransferIdError },
            });
        }
      };

    return (
        <>
            <div style={{ marginTop: -25 }}>
            <BlockContent>
                <Block>
                    <div className="card-inner-group">
                    <div className="card-inner p-0 border-0 overflow-x-auto">
                        <DataTableBody 
                            compact={false} 
                            bodyclass={false} 
                            className="master-sku-nk-tb-list is-separate my-3"
                        >
                            <DataTableHead
                                className="nk-tb-col-check"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {arrayHeaderTable.map((header, index) => (
                                    <DataTableRow className="" key={index}>
                                        <DataTableTitle>
                                            <span
                                                style={styles.HeaderTitleTable}
                                            >
                                            {header.header}
                                            </span>
                                        </DataTableTitle>
                                    </DataTableRow>
                                ))}
                                
                            </DataTableHead>
                            {loading ? (
                                <>
                                    {[...Array(10)].map((_, index) => (
                                        <DataTableItem className="" key={index}>
                                            {[...Array(9)].map((_, index) => (
                                                <DataTableRow 
                                                    size="md" 
                                                    className="p-0" 
                                                    key={index}
                                                    >
                                                    <SkeletonLoading
                                                        width={'100%'}
                                                        height={'100px'}
                                                        className="rounded-0"
                                                        />
                                                </DataTableRow>
                                            ))}
                                        </DataTableItem>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {dataTransfer?.map((item, index) => (
                                        <DataTableItem className="" key={index}>
                                            <DataTableRowChild className="">
                                                <div
                                                    style={{ 
                                                        minWidth: '10rem', 
                                                        maxWidth: '10rem' 
                                                    }}
                                                    onClick={() => handleClickDetail(item?.transfer_header_id)}
                                                >
                                                        <div 
                                                            className="text-primary text-truncate"
                                                            style={styles.TransferNumberColumns}
                                                        >
                                                        {item?.transfer_code ?? '-'}
                                                        </div>
            
                                                        <div style={{ 
                                                            color: colors.gray300,
                                                            maxWidth:200, 
                                                            minWidth:100,
                                                            fontSize: 12 
                                                        }}>
                                                        {moment(item?.created_time).format(
                                                        'DD/MM/YY HH:mm'
                                                        )}
                                                        </div>
                                                </div>
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    <StatusBadge status={getTransferStatus(item?.status)} />
                                                </div>
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.origin_location ?? '-'}
                                                </div>
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.destination_location ?? '-'}
                                                </div>
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.total_quantity ?? '-'}
                                                </div>  
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.total_sku ?? '-'}
                                                </div>
                                            </DataTableRowChild>
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.created_by ?? '-'}
                                                </div>
                                            </DataTableRowChild>
                                            {/* {typeTabs !== 'waiting-approvel'  && typeTabs !== 'canceled' && 
                                                <DataTableRowChild className="">
                                                    <div
                                                        className="text-truncate"
                                                        style={styles.TextTruncateConfig}
                                                    >
                                                        {item?.approved_by ?? '-'}
                                                    </div>
                                                </DataTableRowChild>
                                            } */}
                                            <DataTableRowChild className="">
                                                <div
                                                    className="text-truncate"
                                                    style={styles.TextTruncateConfig}
                                                >
                                                    {item?.approved_by ?? '-'}
                                                </div>
                                            </DataTableRowChild>
                                            {typeTabs === 'waiting-approvel' &&
                                                <DataTableRowChild className="d-flex center">
                                                    <Button
                                                        color="primary"
                                                        style={styles.RedirectButton}
                                                        onClick={() => {
                                                            setAcceptTransfer(true);
                                                            setSelectedTransferId(item?.transfer_header_id);
                                                        }}
                                                        className={
                                                            !permissions?.includes('Setujui Transfer') &&
                                                            'btn-disabled'
                                                        }
                                                        disabled={
                                                            !permissions?.includes('Setujui Transfer') 
                                                        }
                                                        >
                                                        Setujui
                                                    </Button>
                                                    <ButtonMore id="more-option">
                                                        <div
                                                            style={{
                                                            cursor: 'pointer',
                                                            fontSize: 12
                                                            }}
                                                            className={
                                                                !permissions?.includes('Ubah Transfer') &&
                                                                'btn-disabled'
                                                            }
                                                            onClick={() => handleClickEdit(item?.transfer_header_id)}                                                >
                                                            Ubah Transfer
                                                        </div>
                                                        <div
                                                            style={{
                                                            cursor: 'pointer',
                                                            fontSize: 12
                                                            }}
                                                            className={`mt-1 ${!permissions?.includes('Batalkan Transfer') && 'btn-disabled'}`}
                                                            onClick={() => {
                                                                if(permissions?.includes('Batalkan Transfer')) {
                                                                    setisModalCancel(true);
                                                                    setSelectedTransferId(item?.transfer_header_id);
                                                                    setTimeout(() => {
                                                                        inputRef.current.click();
                                                                    }, 200);
                                                                }
                                                            }}
                                                        >
                                                            Batalkan Transfer
                                                        </div>
                                                    </ButtonMore>
                                                </DataTableRowChild>
                                            }
                                        </DataTableItem>
                                    ))}
                                </>
                            )}
                        </DataTableBody>
                    </div>
                    </div>
                </Block>
            </BlockContent>
            </div>

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
        </>
    );
}


export default TableTransfer;