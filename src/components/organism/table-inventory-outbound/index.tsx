import { CSSProperties } from 'react';
import { Block, BlockContent, Button, SkeletonLoading } from '@/components';
import moment from 'moment';
import { useRouter } from 'next/router';
import { DataTableTitle, DataTableItem, DataTableRowChild, DataTableBody, DataTableHead,DataTableRow } from '@/components/molecules/table/table-master-sku';
import colors from '@/utils/colors';
import StatusBadge from '../status-badge-inbound';

function TableOutbound ({dataOrder, loading}) {
    const route = useRouter();
    const typeTabs = route.query.tab;

    const arrayHeaderTable = [
        {
            header : 'Nomor Outbound'
        },
        {
            header : 'Status Outbound'
        },
        {
            header : 'Gudang Asal'
        },
        {
            header : 'Gudang Tujuan'
        },
        {
            header : 'Jumlah Barang'
        },
        {
            header : 'Diterima Oleh'
        },
     ];

    const handleClickAccept = (id:number) => {
        route.push({
            pathname: '/inventory/outbound/detail-outbound',
            query: {
                id,
            }
        });
    };

    return (
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
                                        {[...Array(7)].map((_, index) => (
                                            <DataTableRowChild 
                                                size="md" 
                                                className="p-0" 
                                                key={index}
                                                >
                                                <SkeletonLoading
                                                    width={'100%'}
                                                    height={'100px'}
                                                    className="rounded-0"
                                                    />
                                            </DataTableRowChild>
                                        ))}
                                    </DataTableItem>
                                ))}
                            </>
                        ) : (
                            <>
                                {dataOrder?.map((item,index) => (
                                    <DataTableItem className="" key={index}>
                                        <DataTableRowChild className="">
                                            <div
                                                style={{ 
                                                    minWidth: '10rem', 
                                                    maxWidth: '10rem' 
                                                }}
                                                onClick={() => handleClickAccept(item?.outbound_id)}
                                            >
                                                    <div 
                                                        className="text-primary text-truncate"
                                                        style={styles.InboundNumberColumns}
                                                    >
                                                    {item?.outbound_code ?? '-'}
                                                    </div>
        
                                                    <div 
                                                        style={{ 
                                                            color: colors.gray300, 
                                                            maxWidth:200, 
                                                            minWidth:100,
                                                            fontSize: 12 
                                                        }}>
                                                    {moment.utc(item?.created_at).format('DD/MM/YY HH:mm')}
                                                    </div>
                                            </div>
                                        </DataTableRowChild>
                                        <DataTableRowChild className="">
                                            <div
                                                style={styles.TextTruncateConfig}
                                            >
                                                <StatusBadge status={item.status} />
                                            </div>
                                        </DataTableRowChild>
                                        <DataTableRowChild className="">
                                            <div
                                                className="text-truncate"
                                                style={styles.TextTruncateConfig}
                                            >
                                                {item.from_location_name ?? '-'}
                                            </div>
                                        </DataTableRowChild>
                                        <DataTableRowChild className="">
                                            <div
                                                className="text-truncate"
                                                style={styles.TextTruncateConfig}
                                            >
                                                {item.to_location_name ?? '-'}
                                            </div>
                                        </DataTableRowChild>
                                        <DataTableRowChild className="">
                                            <div
                                                className="text-truncate"
                                                style={styles.TextTruncateConfig}
                                            >
                                                {item.total_quantity ?? '-'}
                                            </div>  
                                        </DataTableRowChild>
                                        <DataTableRowChild className="">
                                            <div
                                                className="text-truncate"
                                                style={styles.TextTruncateConfig}
                                            >
                                                {item.received_by ?? '-'}
                                            </div>
                                        </DataTableRowChild>
                                        {typeTabs === 'waiting-inbound' &&
                                            <DataTableRowChild className="">
                                                <Button
                                                    color="primary"
                                                    style={styles.RedirectButton}
                                                    onClick={() => handleClickAccept(item?.outbound_id)}
                                                    >
                                                    Terima
                                                </Button>
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
    );
}

const styles: { [key: string]: CSSProperties } = {
    IconSearch: {
        color: colors.darkBlue,
        backgroundColor: '#ffffff',
    },
    WrapperParentSortData: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 8,
        marginBottom: 4,
        gap: 8,
        flexWrap: 'wrap',
    },
    WrapperDatePicker: {
        width: 240,
    },
    WrapperFilterStore: {
        marginLeft: -16,
    },
    HeaderTitleTable: {
        fontWeight: 'normal', 
        color: colors.black, 
        fontSize:12
    },
    InboundNumberColumns: {
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 12
    },
    RedirectButton: {
        fontWeight: 400,
        width: 80,
        marginRight: 10,
        justifyContent: 'center',
        fontSize: 12
    },
    TextTruncateConfig: {
        maxWidth:200, 
        minWidth:100,
        fontSize: 12,
        color: colors.black
    }
};

export default TableOutbound;