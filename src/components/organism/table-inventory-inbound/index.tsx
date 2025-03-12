import { CSSProperties } from 'react';
import { Block, BlockContent, Button, SkeletonLoading } from '@/components';
import moment from 'moment';
import { useRouter } from 'next/router';
import { DataTableTitle, DataTableItem, DataTableRow, DataTableBody, DataTableHead, DataTableRowChild } from '@/components/molecules/table/table-master-sku';
import colors from '@/utils/colors';
import StatusBadge from '../status-badge-inbound';
import { usePermissions } from '@/utils/usePermissions';

function TableInbound ({dataOrder, loading}) {
    const route = useRouter();
    const permissions = usePermissions();
    const typeTabs = route.query.tab;

    const arrayHeaderTable = [
        {
            header : 'Nomor Inbound'
        },
        {
            header : 'Status Inbound'
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
            header : 'Diterima Oleh'
        },
        ...(typeTabs === 'waiting-inbound' ? [{ header: 'Aksi' }] : [])
    ];
    
    const handleClickAccept = (id:number, type:string, listType:string) => {
        if(!permissions?.includes('Hanya Lihat')) {
            route.push({
                pathname: '/inventory/inbound/detail-inbound',
                query: {
                    id,
                    type,
                    listType
                }
            });
        }
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
                                {dataOrder?.map((item,index) => (
                                    <DataTableItem className="" key={index}>
                                        <DataTableRowChild className="">
                                            <div
                                                style={{ 
                                                    minWidth: '10rem', 
                                                    maxWidth: '10rem' 
                                                }}
                                                onClick={() => handleClickAccept(item?.inbound_id,'detail','false')}
                                            >
                                                    <div 
                                                        className="text-primary text-truncate"
                                                        style={styles.InboundNumberColumns}
                                                    >
                                                    {item?.inbound_code ?? '-'}
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
                                                {item.location_name ?? '-'}
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
                                                {item.total_sku ?? '-'}
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
                                                    onClick={() => handleClickAccept(item?.inbound_id,'confirm','true')}
                                                    className={
                                                        !permissions?.includes('Terima Inbound') &&
                                                        'btn-disabled'
                                                      }
                                                      disabled={
                                                        !permissions?.includes('Terima Inbound') 
                                                      }
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

export default TableInbound;