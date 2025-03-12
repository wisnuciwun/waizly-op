import React from 'react';
import Create from './styles';
import { Button, Head} from '@/components';
import { styles } from './styles';
import TableDataDetailInventory from '@/components/organism/tabledata-inventory';
import { useRouter } from 'next/router';
import { InboundData } from '@/utils/type/inventory';
import StatusBadge from '@/components/organism/status-badge-inbound';
import moment from 'moment';
import colors from '@/utils/colors';

interface DetailInventoryOutboundProps {
    formData: InboundData | [] | any;
}

function DetailInventoryOutbound ({formData} :DetailInventoryOutboundProps) {
    const route = useRouter();
    const { outbound , outbound_detail } = formData;

    return (
        <Create.Container>
            <Head title="Detail Outbound" />
            <Create.WrapperHeader>
                <Create.Breadcrumb>
                <Create.MainPage>{'INVENTORI'}</Create.MainPage>
                <Create.MainPage>{'/'}</Create.MainPage>
                <Create.MainPage>{'OUTBOUND'}</Create.MainPage>
                <Create.MainPage>{'/'}</Create.MainPage>
                <Create.SubsPage>{'Detail Outbound'}</Create.SubsPage>
                </Create.Breadcrumb>
            </Create.WrapperHeader>

            <Create.ContainerWithLineBottom>
                <div className="product-info me-xxl-5 mt-4">
                    <Create.HeaderTitle>
                        {outbound?.outbound_code}
                    </Create.HeaderTitle>
                    <div style={{display:'flex', gap:16}}>
                        <Create.LocationTitle className="text-truncate">
                            Gudang Asal: {outbound?.from_location_name
                            }
                        </Create.LocationTitle>
                        <Create.LocationTitle className="text-truncate">
                            Gudang Tujuan: {outbound?.to_location_name}
                        </Create.LocationTitle>
                    </div>
                </div>

            <div className="product-meta">
                <Create.UnorderedListResponsive className="d-flex" style={{gap:32}}>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle style={{width:110}}>
                            Status Outbound
                        </Create.SubTitle>
                        <StatusBadge status={outbound?.status} />
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle>
                            Jumlah
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {outbound?.total_quantity}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle style={{width:100}}>
                            Waktu Dipesan
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {moment.utc(outbound?.ordered_at).format('DD/MM/YY')}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive>
                        <Create.SubTitle style={{width:100}}>
                            Waktu Dibuat 
                        </Create.SubTitle>
                        <Create.SubTitle fontWeight={'700'}>
                            {moment.utc(outbound?.created_at).format('DD/MM/YY HH:mm')}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                    <Create.ListUnorderedResponsive width="600px">
                        <Create.SubTitle>
                            Dibuat Oleh
                        </Create.SubTitle>
                        <Create.SubTitle className="text-truncate" fontWeight={'700'}>
                           {outbound?.created_by}
                        </Create.SubTitle>
                    </Create.ListUnorderedResponsive>
                </Create.UnorderedListResponsive>
            </div>

            <div>
            <ul className="d-flex g-1 gx-4">
                <li style={styles.WrapperInboundNotes}>
                <Create.SubTitle marginTop={'1rem'}>
                    Catatan Outbound:
                </Create.SubTitle>
                <Create.SubTitle marginBottom={'1rem'}>
                    {outbound?.notes}
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
                            Barang Keluar Normal
                        </th>
                        <th style={styles.listHeader}>
                            Barang Keluar Rusak
                        </th>
                    </tr>
                </thead>

                <TableDataDetailInventory dataList={outbound_detail}/>
                </Create.Table>
            </div>
            
            <Create.ContainerRightFooter>
              <Create.TextFooterRight>
                {`Jumlah barang yang akan keluar: ${outbound?.total_quantity}`}
              </Create.TextFooterRight>
              <Create.TextFooterRight>
                {`Total SKU: ${outbound?.total_sku}`}
              </Create.TextFooterRight>
            </Create.ContainerRightFooter>

                <Create.ContainerRightFooter className="mt-4">
                    <Button
                        onClick={() => route.back()}
                        style={{width:120, fontSize:14, color:colors.blue}}
                    >
                        Kembali
                    </Button>
                </Create.ContainerRightFooter>
            </div>
        </div>
        </Create.Container>
    );
}

export default DetailInventoryOutbound;