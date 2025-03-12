/* eslint-disable no-unused-vars */
// react & nect import
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// component & style
import { Button, Head, Icon, BlockHeadContent, InfoWarning } from '@/components';
import Create from './style';
import { styles } from './style';
import TableDataDetailTransfer from '@/components/organism/table-inventory-transfer/table-detail';
import StatusBadge from '@/components/organism/table-inventory-transfer/status-badge';
import { TableHistoryBody, TableHistoryHead } from '@/components/molecules/table/table-inventory';

// utils
import { TransferData } from '@/utils/type/inventory';
import colors from '@/utils/colors';
import { getTransferStatus } from '@/utils/getStatus';

// third party
import moment from 'moment';
import { Label, Spinner } from 'reactstrap';
import classNames from 'classnames';
import { usePermissions } from '@/utils/usePermissions';

interface DetailInventoryTransferProps {
    formData: TransferData | [] | any;
    acceptTransfer: (value: boolean) => void;
    cancelTransfer: (value: boolean) => void;
    loading: boolean;
}

function DetailInventoryTransfer ({formData, acceptTransfer, cancelTransfer, loading} :DetailInventoryTransferProps) {
    const route = useRouter();
    const permissions = usePermissions();
    const { transfer } = formData;

    const [isDamages, setIsDamages] = useState(false);
    
    const tableClass = classNames({
        table: true,
    });   
    
    // handle go to form edit
    const handleClickEditTransfer = (id) => {
        route.push({
        pathname: '/inventory/transfer/form',
        query: { action: 'edit', id },
        });
    };

    useEffect(() => {
        if(transfer?.source_stock === 'damages') {
            setIsDamages(true);
        } else if (transfer?.source_stock === 'goods') {
            setIsDamages(false);
        }   
    }, [transfer]);


    return (
        <>
            <Create.Container>
                <Head title="Detail Transfer" />
                {loading ? 
                        <>
                            <Create.LoadingWrapper>
                                <Spinner color="primary" />
                            </Create.LoadingWrapper>
                        </> 
                        : 
                        <>
                           <Create.WrapperHeader className="d-md-flex">
                            <Create.Breadcrumb>
                            <Create.MainPage>{'INVENTORI'}</Create.MainPage>
                            <Create.MainPage>{'/'}</Create.MainPage>
                            <Create.MainPage>{'TRANSFER'}</Create.MainPage>
                            <Create.MainPage>{'/'}</Create.MainPage>
                            <Create.SubsPage>{'Detail Transfer'}</Create.SubsPage>
                            </Create.Breadcrumb>
                            <Create.WrapperButtonAction>
                                <Button
                                    hidden={
                                        transfer?.status == 'Approved' || transfer?.status == 'Cancelled'
                                    }
                                    className={`btn-outline-primary-v2 justify-content-center ${!permissions?.includes('Ubah Transfer') &&'btn-disabled'}`}
                                    style={{ width: 104, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => handleClickEditTransfer(transfer.transfer_header_id)}
                                    disabled={
                                        !permissions?.includes('Ubah Transfer') 
                                    }
                                >
                                <Icon name="edit"/>
                                    &nbsp;&nbsp;Edit
                                </Button>
                                <Button
                                    hidden={
                                        transfer?.status == 'Approved' || transfer?.status == 'Cancelled'
                                    }
                                    className={`btn-primary justify-content-center ${!permissions?.includes('Setujui Transfer') &&'btn-disabled'}`}
                                    style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => acceptTransfer(true)}
                                    disabled={
                                        !permissions?.includes('Setujui Transfer') 
                                    }
                                >
                                    <Icon name="check-c text-white" />
                                    &nbsp;&nbsp;Setujui
                                </Button>
                                <Button
                                    hidden={
                                        transfer?.status == 'Approved' || transfer?.status == 'Cancelled'
                                    }
                                    className={`btn-danger justify-content-center ${!permissions?.includes('Batalkan Transfer') &&'btn-disabled'}`}
                                    style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => cancelTransfer(true)}
                                    disabled={
                                        !permissions?.includes('Batalkan Transfer') 
                                    }
                                >
                                    Batalkan
                                </Button>
                            </Create.WrapperButtonAction> 
                        </Create.WrapperHeader>

                        <Create.ContainerWithLineBottom>
                            <div className="product-info me-xxl-5 mt-4">
                                <Create.HeaderTitle>
                                    {transfer?.transfer_code ?? '-'}
                                </Create.HeaderTitle>
                                <div style={{display:'flex', gap:16}}>
                                    <Create.LocationTitle className="text-truncate">
                                        Gudang Asal: {transfer?.origin_name ?? '-'}
                                    </Create.LocationTitle>
                                    <Create.LocationTitle className="text-truncate">
                                        Gudang Tujuan: {transfer?.destination_name ?? '-'}
                                    </Create.LocationTitle>
                                </div>
                            </div>

                        <div className="product-meta">
                            <Create.UnorderedListResponsive className="d-flex gx-4">
                                <Create.ListUnorderedResponsive width={transfer && transfer?.external_id?.length > 30 
                                            ? 
                                            '250px' 
                                            : transfer?.external_id?.length < 10 
                                            ? '100px' 
                                            : '160px'
                                            }
                                        >
                                    <Create.SubTitle style={{width:150}}>
                                        External ID
                                    </Create.SubTitle>
                                    <Create.SubTitleExternalId
                                        style={{
                                            fontWeight: '700',
                                            width: transfer && transfer?.external_id?.length > 30 
                                            ? 
                                            '250px' 
                                            : transfer?.external_id?.length < 10 
                                            ? '70px' 
                                            : '150px',
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            display: 'block',
                                            lineHeight: '1.6em',
                                            height: '5em', 
                                            overflowY: 'hidden',
                                    }}>
                                        {transfer?.external_id ? transfer?.external_id : '-'}
                                    </Create.SubTitleExternalId>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width={transfer?.outbound_code === null ? '170px' : '200px'}>
                                    <Create.SubTitle>
                                        Outbound ID
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                        {transfer?.outbound_code ?? '-'}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width={transfer?.status == 'Awaiting Approval' ? '250px' : '150PX'}>
                                    <Create.SubTitle style={{width:150}}>
                                        Status Transfer
                                    </Create.SubTitle>
                                    <StatusBadge status={getTransferStatus(transfer?.status ?? '-')} />
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="230px">
                                    <Create.SubTitle style={{width:150}}>
                                        Status Outbound
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                        <StatusBadge status={getTransferStatus(transfer?.outbound_status ?? '-')} />
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="150px">
                                    <Create.SubTitle>
                                        Jumlah
                                    </Create.SubTitle>
                                    <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                                        {transfer?.item_quantity}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="170px">
                                    <Create.SubTitle style={{width:100}}>
                                        Sumber Stok
                                    </Create.SubTitle>
                                    <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                                        <StatusBadge status={getTransferStatus(transfer?.source_stock ?? '-')} />
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                            </Create.UnorderedListResponsive>
                            
                            <Create.UnorderedListResponsive className="d-flex g-2 gx-4 mt-4">
                            <Create.ListUnorderedResponsive width="150px">
                                    <Create.SubTitle style={{width:150}}>
                                        Waktu Ditransfer
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                        {transfer?.transfer_date ? moment(transfer?.transfer_date).format('DD/MM/YY') : '-'}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="150px">
                                    <Create.SubTitle style={{width:150}}>
                                        Waktu Dibuat
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                        {transfer?.created_at ? moment(transfer?.created_at).format('DD/MM/YY HH:mm') : '-'}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width={transfer && transfer?.created_by_name?.length > 30 
                                            ? 
                                            '33%' 
                                            : transfer?.created_by_name?.length < 10 
                                            ? '150px' 
                                            : '160px'
                                            }
                                        >
                                    <Create.SubTitle >
                                        Dibuat Oleh
                                    </Create.SubTitle>
                                    <Create.LocationTitle  className="text-truncate" fontWeight={'700'}>
                                        {transfer?.created_by_name ?? '-'}
                                    </Create.LocationTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="33%">
                                    <Create.SubTitle>
                                        Disetujui Oleh
                                    </Create.SubTitle>
                                    <Create.LocationTitle className="text-truncate" fontWeight={'700'}>
                                        {transfer?.approved_by_name ?? '-'}
                                    </Create.LocationTitle>
                                </Create.ListUnorderedResponsive>
                            </Create.UnorderedListResponsive>
                        </div>

                        <div>
                        <ul className="d-flex g-1 gx-4">
                            <li style={styles.WrapperInboundNotes}>
                            <Create.SubTitle marginTop={'1rem'}>
                                Catatan Transfer:
                            </Create.SubTitle>
                            <Create.SubTitle marginBottom={'1rem'}>
                                {transfer?.notes ? transfer?.notes : '-'}
                            </Create.SubTitle>
                            </li>
                        </ul>
                        </div>
                        </Create.ContainerWithLineBottom>
                    
                        <Create.ContainerWithLineBottom>
                        <div className="product-details entry mt-1">
                            <Create.SubTitle
                                fontSize={'20px'}
                                fontWeight={'700'}
                            >
                                Detail SKU
                            </Create.SubTitle>
                            
                            <div className="mt-3">
                            <div style={{ overflowX: 'auto' }}>
                                <Create.Table>
                                <thead
                                    className="table-primary"
                                    style={{ border: '1px solid #E9E9EA' }}
                                >
                                    <tr style={styles.header}>
                                        <th style={styles.listHeader}>
                                            Informasi SKU
                                        </th>
                                        <th style={styles.listHeader}>
                                            Stok Saat Ini
                                        </th>
                                        <th style={styles.listHeader}>
                                            Stok Transfer
                                        </th>
                                    </tr>
                                </thead>

                                <TableDataDetailTransfer dataList={transfer?.items} isDamages={isDamages} />
                                </Create.Table>
                            </div>
                            
                            <Create.ContainerRightFooter className="mb-2 mt-1">
                            <Create.TextFooterRight>
                                {`Total SKU: ${transfer?.sku_quantity}`}
                            </Create.TextFooterRight>
                            </Create.ContainerRightFooter>
                            </div>
                        </div>
                        </Create.ContainerWithLineBottom>

                        <div>
                            <BlockHeadContent>
                                <Label
                                    className="form-label"
                                    htmlFor="fv-topics"
                                    style={{ fontWeight: 'bold', fontSize: '20px', color: '#4C4F54' }}
                                >
                                    Riwayat Aktivitas
                                </Label>
                                <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                                    <table className={`${tableClass}`}>
                                    <TableHistoryHead />
                                    <TableHistoryBody produkData={transfer?.transfer_histories} />
                                    </table>
                                </div>
                            </BlockHeadContent>
                        </div>
                    
                        <Create.ContainerRightFooter className="mt-4">
                                    <Button
                                        onClick={() => route.back()}
                                        style={{width:120, fontSize:14, color:colors.blue}}
                                    >
                                        Kembali
                                    </Button>
                        </Create.ContainerRightFooter>
                        </>
                    }
                </Create.Container>
        </>
    );
}

export default DetailInventoryTransfer;