/* eslint-disable no-unused-vars */
  import React from 'react';
  import TableProductInventoryInbound, {styles} from './styles';
  import Image from 'next/image';
  import { changeEmptyToDash } from '@/utils/formater';
  import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';

  // utils
  import { TransferDetailItems } from '@/utils/type/inventory';

  interface TableDataDetailAdjustment {
    inputMode?: boolean
    dataList: TransferDetailItems[] | []
    isDamages?: boolean
  }

  function TableDataDetailAdjustment ({dataList, isDamages}:TableDataDetailAdjustment) { 
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
                                  src={listProduct?.images.length ? listProduct?.images : ilustrationCamera}
                                  alt="Image Product"
                                  />
                                  <div style={{width:'95%'}}>

                              <TableProductInventoryInbound.Info>
                                  <TableProductInventoryInbound.Title width={'95%'}>
                                    {changeEmptyToDash(listProduct?.product_name) ?? '-'}
                                  </TableProductInventoryInbound.Title>
                                  <TableProductInventoryInbound.SubTitle>
                                  {'Kode SKU: ' + (changeEmptyToDash(listProduct?.product_sku) ?? '-')}
                                  </TableProductInventoryInbound.SubTitle>
                              </TableProductInventoryInbound.Info>
                                    </div>
                          </TableProductInventoryInbound.ContainerInfo>
                      </td>
                      <td 
                        className="table-activity-history-body-text" 
                        style={{...styles.listHeader, width:'20%'}}
                      >
                        <TableProductInventoryInbound.SubTitle>
                          {/* {isDamages ? listProduct?.damages_quantity ?? '-' : listProduct?.quantity ?? '-'} */}
                          {listProduct?.current_stock}
                        </TableProductInventoryInbound.SubTitle>
                      </td>
                      <td 
                        className="table-activity-history-body-text"  
                        style={{...styles.listHeader, width:'20%'}}
                      >
                          <TableProductInventoryInbound.SubTitle>
                            {listProduct.quantity ?? '-'}
                          </TableProductInventoryInbound.SubTitle>
                      </td>
                      <td 
                        className="table-activity-history-body-text"  
                        style={{...styles.listHeader, width:'9%'}}
                      >
                          <TableProductInventoryInbound.SubTitleColors style={{color: listProduct.total_stock_changes ? 
                            listProduct.total_stock_changes.includes('-') ? '#FF6E5D' : 
                            listProduct.total_stock_changes.includes('+') ? '#36C068' : 'black' 
                            : 'black'
                          }}>
                            {listProduct.total_stock_changes !== undefined && listProduct.total_stock_changes !== null 
                              ? listProduct.total_stock_changes
                              : '-'
                            }
                          </TableProductInventoryInbound.SubTitleColors>
                      </td>
                    </tr>
                  )}
                </tbody>
              
          </>
      );
  }

  export default TableDataDetailAdjustment;