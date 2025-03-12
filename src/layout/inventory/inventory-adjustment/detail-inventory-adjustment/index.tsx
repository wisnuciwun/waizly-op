/* eslint-disable no-unused-vars */
// react & nect import
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// component & style
import { Button, Head, Icon, BlockHeadContent } from '@/components';
import Create from './style';
import { styles } from './style';
import TableDataDetailAdjustment from '@/components/organism/table-inventory-adjustment/table-detail';
import StatusBadge from '@/components/organism/table-inventory-transfer/status-badge';
import { TableHistoryBody, TableHistoryHead } from '@/components/molecules/table/table-inventory';

// utils
import { AdjustmentData } from '@/utils/type/inventory';
import colors from '@/utils/colors';
import { getAdjustmentStatus } from '@/utils/getStatus';

// third party
import moment from 'moment';
import { Label, Spinner } from 'reactstrap';
import classNames from 'classnames';
import { usePermissions } from '@/utils/usePermissions';

interface DetailInventoryAdjustmentProps {
    formData: AdjustmentData | [] | any;
    acceptAdjustment: (value: boolean) => void;
    cancelAdjustment: (value: boolean) => void;
    loading: boolean;
}

function DetailInventoryAdjustment ({formData, acceptAdjustment, cancelAdjustment, loading} :DetailInventoryAdjustmentProps) {
    const route = useRouter();
    const permissions = usePermissions();
    const adjustment = formData;

    const [isDamages, setIsDamages] = useState(false);
    
    const tableClass = classNames({
        table: true,
    });   
    
    // handle go to form edit
    const handleClickEditAdjustment = (id) => {
        route.push({
        pathname: '/inventory/adjustment/form',
        query: { action: 'edit', id },
        });
    };

    useEffect(() => {
        if(adjustment?.source_stock === 'damages') {
            setIsDamages(true);
        } else if (adjustment?.source_stock === 'goods') {
            setIsDamages(false);
        }   
    }, [adjustment]);
    
    return (
        <>
            <Create.Container>
                <Head title="Detail Adjustment" />
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
                            <Create.MainPage>{'ADJUSTMENT'}</Create.MainPage>
                            <Create.MainPage>{'/'}</Create.MainPage>
                            <Create.SubsPage>{'Detail Adjustment'}</Create.SubsPage>
                            </Create.Breadcrumb>
                            <Create.WrapperButtonAction>
                                <Button
                                    hidden={
                                        adjustment?.status == 'Approve' || adjustment?.status == 'Reject'
                                    }
                                    className={`btn-outline-primary justify-content-center ${!permissions?.includes('Ubah Adjustment') &&'btn-disabled'}`}
                                    style={{ width: 104, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => handleClickEditAdjustment(adjustment.adjustment_header_id)}
                                    disabled={
                                        !permissions?.includes('Ubah Adjustment') 
                                    }
                                >
                                <Icon name="edit" />
                                    &nbsp;&nbsp;Edit
                                </Button>
                                <Button
                                    hidden={
                                        adjustment?.status == 'Approve' || adjustment?.status == 'Reject'
                                    }
                                    className={`btn-primary justify-content-center ${!permissions?.includes('Setujui Adjustment') &&'btn-disabled'}`}
                                    style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => acceptAdjustment(true)}
                                    disabled={
                                        !permissions?.includes('Setujui Adjustment') 
                                    }
                                >
                                    <Icon name="check-c text-white" />
                                    &nbsp;&nbsp;Setujui
                                </Button>
                                <Button
                                    hidden={
                                        adjustment?.status == 'Approve' || adjustment?.status == 'Reject'
                                    }
                                    className={`btn-danger justify-content-center ${!permissions?.includes('Batalkan Adjustment') &&'btn-disabled'}`}
                                    style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                                    onClick={() => cancelAdjustment(true)}
                                    disabled={
                                        !permissions?.includes('Batalkan Adjustment') 
                                    }
                                >
                                    Batalkan
                                </Button>
                            </Create.WrapperButtonAction> 
                        </Create.WrapperHeader>

                        <Create.ContainerWithLineBottom>
                            <div className="product-info me-xxl-5 mt-4">
                                <Create.HeaderTitle>
                                    {adjustment?.code ?? '-'}
                                </Create.HeaderTitle>
                                <div style={{display:'flex', gap:16}}>
                                    <Create.LocationTitle className="text-truncate">
                                        Gudang : {adjustment?.location ?? '-'}
                                    </Create.LocationTitle>
                                </div>
                            </div>

                        <div className="product-meta">
                            <Create.UnorderedListResponsive className="d-flex gx-4">
                                <Create.ListUnorderedResponsive width={adjustment && adjustment?.external_id?.length > 30 
                                            ? 
                                            '250px' 
                                            : adjustment?.external_id?.length < 10 
                                            ? '100px' 
                                            : '160px'
                                            }>
                                    <Create.SubTitle style={{width:150}}>
                                        External ID
                                    </Create.SubTitle>
                                    <Create.SubTitleExternalId 
                                        style={{
                                            fontWeight: '700',
                                            width: adjustment && adjustment?.external_id?.length > 30 
                                            ? 
                                            '250px' 
                                            : adjustment?.external_id?.length < 10 
                                            ? '70px' 
                                            : '150px',
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            display: 'block',
                                            lineHeight: '1.6em',
                                            height: '5em',  
                                            overflowY: 'hidden',
                                        }}
                                    >
                                        {adjustment?.external_id ? adjustment?.external_id : '-'}
                                    </Create.SubTitleExternalId>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="200px">
                                    <Create.SubTitle style={{width:150}}>
                                        Status Adjustment
                                    </Create.SubTitle>
                                    <StatusBadge status={getAdjustmentStatus(adjustment?.status ?? '-')} />
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="180px">
                                    <Create.SubTitle style={{width:250}}>
                                        Jumlah SKU Adjustment
                                    </Create.SubTitle>
                                    <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                                        {adjustment?.total_stock_adjustment}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="110px">
                                    <Create.SubTitle style={{width:150}}>
                                        Sumber Stok
                                    </Create.SubTitle>
                                    <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                                        <StatusBadge status={getAdjustmentStatus(adjustment?.stock_source ?? '-')} />
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="140px">
                                    <Create.SubTitle style={{width: 150}}>
                                        Waktu Adjustment
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                    {adjustment?.adjustment_date ? adjustment?.adjustment_date : '-'}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="120px">
                                    <Create.SubTitle style={{width:150}}>
                                        Waktu Dibuat
                                    </Create.SubTitle>
                                    <Create.SubTitle fontWeight={'700'}>
                                    {adjustment?.created_at ? moment.utc(adjustment?.created_at).format('DD/MM/YY HH:mm') : '-'}
                                    </Create.SubTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="140px">
                                    <Create.SubTitle style={{width:100}}>
                                        Dibuat Oleh
                                    </Create.SubTitle>
                                    <Create.LocationTitle className="text-truncate" fontWeight={'700'}>
                                        {adjustment?.created_by ?? '-'}
                                    </Create.LocationTitle>
                                </Create.ListUnorderedResponsive>
                                <Create.ListUnorderedResponsive width="200px">
                                    <Create.SubTitle style={{width:100}}>
                                        Disetujui Oleh
                                    </Create.SubTitle>
                                    <Create.LocationTitle className="text-truncate" fontWeight={'700'}>
                                        {adjustment?.approved_by ?? '-'}
                                    </Create.LocationTitle>
                                </Create.ListUnorderedResponsive>
                            </Create.UnorderedListResponsive>
                        </div>

                        <div>
                        <ul className="d-flex g-1 gx-4">
                            <li style={styles.WrapperInboundNotes}>
                            <Create.SubTitle marginTop={'1rem'}>
                                Catatan Adjustment:
                            </Create.SubTitle>
                            <Create.SubTitle marginBottom={'1rem'}>
                                {adjustment?.notes ? adjustment?.notes : '-'}
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
                                            Stok Adjustment
                                        </th>
                                        <th style={styles.listHeader}>
                                            Perubahan
                                        </th>
                                    </tr>
                                </thead>

                                <TableDataDetailAdjustment dataList={adjustment?.adjustment_details} isDamages={isDamages} />
                                </Create.Table>
                            </div>
                            
                            <Create.ContainerRightFooter className="mb-2 mt-1">
                            <Create.TextFooterRight>
                                {`Total SKU: ${adjustment?.total_sku}`}
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
                                    <TableHistoryBody produkData={adjustment.adjustment_history} />
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

export default DetailInventoryAdjustment;