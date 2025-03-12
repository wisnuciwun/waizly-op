import React from 'react';
import Create from './styles';
import { Button, Head, Icon } from '@/components';
import { styles } from './styles';
import TableDataDetailInventory from '@/components/organism/tabledata-inventory';
import { useRouter } from 'next/router';
import { InboundData } from '@/utils/type/inventory';
import StatusBadge, { StatusBadgeSource } from '@/components/organism/status-badge-inbound';
import moment from 'moment';
import { usePermissions } from '@/utils/usePermissions';

interface DetailInventoryInboundProps {
    handleChangePageToConfirm: () => void;
    formData: InboundData | [] | any;
}

function DetailInventoryInbound ({handleChangePageToConfirm, formData} :DetailInventoryInboundProps) {
    const route = useRouter();
    const permissions = usePermissions();

    const { inbound , inbound_detail } = formData;

    return (
        <Create.Container>
            <Head title="Detail Inbound" />
            <Create.WrapperHeader>
                <Create.Breadcrumb>
                <Create.MainPage>{'INVENTORI'}</Create.MainPage>
                <Create.MainPage>{'/'}</Create.MainPage>
                <Create.MainPage>{'INBOUND'}</Create.MainPage>
                <Create.MainPage>{'/'}</Create.MainPage>
                <Create.SubsPage>{'Detail Inbound'}</Create.SubsPage>

                </Create.Breadcrumb>
                {inbound?.status !== 'Selesai' && (
                    <Button
                        color="primary"
                        style={styles.ButtonAction}
                        onClick={handleChangePageToConfirm}
                        className={
                            !permissions?.includes('Terima Inbound') &&
                            'btn-disabled'
                          }
                          disabled={
                            !permissions?.includes('Terima Inbound') 
                          }
                        >
                        <Icon 
                            className="ni-check-c" 
                            style={styles.IconCheckStyle}
                        />
                        Terima
                    </Button>
                )}
            </Create.WrapperHeader>

            <Create.ContainerWithLineBottom>
                <div className="product-info me-xxl-5 mt-4">
                    <Create.HeaderTitle>
                        {inbound?.inbound_code}
                    </Create.HeaderTitle>
                    <Create.SubTitle>
                        Gudang Tujuan: {inbound?.location_name}
                    </Create.SubTitle>
                </div>

            <div className="product-meta">
                <Create.UnorderedListResponsive className="d-flex" style={{gap:32}}>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle>
                            No. Referensi
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {inbound?.reference_code}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle style={{width:100}}>
                            Status Inbound
                        </Create.SubTitle>
                        <StatusBadge status={inbound?.status} />
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle>
                            Jumlah
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {inbound?.total_quantity}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle style={{textWrap:'nowrap'}}>
                            Sumber Barang
                        </Create.SubTitle>
                        <StatusBadgeSource status={inbound?.source_name}/>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle style={{width:100}}>
                            Waktu Dipesan
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {inbound?.reference_date ? moment.utc(inbound?.reference_date).format('DD/MM/YY') : '-'}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive >
                        <Create.SubTitle style={{width:100}}>
                            Waktu Dibuat 
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {moment.utc(inbound?.created_at).format('DD/MM/YY HH:mm')}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle style={{textWrap:'nowrap'}}>
                            Dibuat Oleh
                        </Create.SubTitle>
                        <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                           {inbound?.created_by}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle style={{textWrap:'nowrap'}}>
                            Diterima Oleh
                        </Create.SubTitle>
                        <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                           {inbound?.received_by}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                </Create.UnorderedListResponsive>
            </div>

            <div>
            <ul className="d-flex g-1 gx-4">
                <li style={styles.WrapperInboundNotes}>
                <Create.SubTitle marginTop={'1rem'}>
                    Catatan Inbound:
                </Create.SubTitle>
                <Create.SubTitle marginBottom={'1rem'}>
                    {inbound?.notes}
                </Create.SubTitle>
                </li>
            </ul>
            </div>
        </Create.ContainerWithLineBottom>

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
                            Jumlah
                        </th>
                        <th style={styles.listHeader}>
                            Barang Normal
                        </th>
                        <th style={styles.listHeader}>
                            Barang Rusak
                        </th>
                    </tr>
                </thead>

                <TableDataDetailInventory dataList={inbound_detail}/>
                </Create.Table>
            </div>
            
            <Create.ContainerRightFooter>
              <Create.TextFooterRight>
                {`Jumlah barang yang akan datang: ${inbound?.total_quantity}`}
              </Create.TextFooterRight>
              <Create.TextFooterRight>
                {`Total SKU: ${inbound?.total_sku}`}
              </Create.TextFooterRight>
            </Create.ContainerRightFooter>

                <Create.ContainerRightFooter className="mt-4">
                    <Button
                        onClick={() => route.back()}
                        style={{width:120, fontSize:14}}
                    >
                        Kembali
                    </Button>
                </Create.ContainerRightFooter>
            </div>
        </div>
        </Create.Container>
    );
}

export default DetailInventoryInbound;