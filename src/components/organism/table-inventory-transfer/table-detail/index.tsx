import React from 'react';
import TableProductInventoryInbound, {styles} from './styles';
import Image from 'next/image';
import { changeEmptyToDash } from '@/utils/formater';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';

// utils
import { TransferDetailItems } from '@/utils/type/inventory';

interface TableDataDetailTransfer {
  inputMode?: boolean
  dataList: TransferDetailItems[] | []
  isDamages?: boolean
}

function TableDataDetailTransfer ({dataList, isDamages}:TableDataDetailTransfer) { 
    return (
        <>
              <tbody style={{ whiteSpace: 'nowrap' }}>
                {dataList?.map((listProduct, idx) =>
                  <tr key={idx} style={{ border: '1px solid #E9E9EA' }}>
                    <td 
                      className="table-activity-history-body-text" 
                      style={{...styles.listHeader,maxWidth:500, minWidth:500}}
                    >
                        <TableProductInventoryInbound.ContainerInfo>
                            <Image
                                width={44}
                                height={44}
                                src={listProduct?.image_path != null ? listProduct?.image_path  : ilustrationCamera}
                                alt="Image Product"
                                />
                                <div style={{width:'95%'}}>

                            <TableProductInventoryInbound.Info>
                                <TableProductInventoryInbound.Title width={'95%'}>
                                  {changeEmptyToDash(listProduct?.name) ?? '-'}
                                </TableProductInventoryInbound.Title>
                                <TableProductInventoryInbound.SubTitle>
                                  {'Kode SKU: ' + (changeEmptyToDash(listProduct?.sku) ?? '-')}
                                </TableProductInventoryInbound.SubTitle>
                            </TableProductInventoryInbound.Info>
                                  </div>
                        </TableProductInventoryInbound.ContainerInfo>
                    </td>
                    <td 
                      className="table-activity-history-body-text" 
                      style={{...styles.listHeader,width:'20%'}}
                    >
                      <TableProductInventoryInbound.SubTitle>
                        {isDamages ? listProduct?.damages_quantity ?? '-' : listProduct?.available_quantity ?? '-'}
                      </TableProductInventoryInbound.SubTitle>
                    </td>
                    <td 
                      className="table-activity-history-body-text"  
                      style={{...styles.listHeader,width:'20%'}}
                    >
                        <TableProductInventoryInbound.SubTitle>
                          {listProduct.quantity ?? '-'}
                        </TableProductInventoryInbound.SubTitle>
                    </td>
                  </tr>
                )}
              </tbody>
             
        </>
    );
}

export default TableDataDetailTransfer;