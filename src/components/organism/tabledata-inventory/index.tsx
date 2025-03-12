/* eslint-disable no-unused-vars */
import React from 'react';
import TableProductInventoryInbound, {styles} from './styles';
import Image from 'next/image';
import { changeEmptyToDash, inputNumberAllowZeroNumber } from '@/utils/formater';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import { Input } from 'reactstrap';
import { InboundDetail } from '@/utils/type/inventory';

interface TableDataDetailInventory {
  inputMode?: boolean
  handleInputChange?: (id: string, field: keyof InboundDetail, value: string) => void;
  dataList: InboundDetail[] | []
}

function TableDataDetailInventory ({inputMode, handleInputChange, dataList}:TableDataDetailInventory) {
  
    return (
        <>
              <tbody style={{ whiteSpace: 'nowrap' }}>
                {dataList?.map((listProduct: any, index: any) =>
                  <tr style={{ border: '1px solid #E9E9EA' }} key={index}>
                    <td 
                      className="table-activity-history-body-text" 
                      style={{...styles.listHeader,maxWidth:500, minWidth:500}}
                    >
                        <TableProductInventoryInbound.ContainerInfo>
                            <Image
                                width={44}
                                height={44}
                                src={listProduct?.product_image ||ilustrationCamera}
                                alt="Image Product"
                                />
                                <div style={{width:'95%'}}>

                            <TableProductInventoryInbound.Info>
                                <TableProductInventoryInbound.Title width={'95%'}>
                                  {changeEmptyToDash(listProduct?.product_name)}
                                </TableProductInventoryInbound.Title>
                                <TableProductInventoryInbound.SubTitle>
                                  {'Kode SKU: '+ 
                                  changeEmptyToDash(listProduct?.product_sku)}
                                </TableProductInventoryInbound.SubTitle>
                            </TableProductInventoryInbound.Info>
                                  </div>
                        </TableProductInventoryInbound.ContainerInfo>
                    </td>

                    <td 
                      className="table-activity-history-body-text" 
                      style={{...styles.listHeader,width:'10%'}}
                    >
                      <TableProductInventoryInbound.SubTitle>
                        {listProduct.quantity}
                      </TableProductInventoryInbound.SubTitle>
                    </td>
                    <td 
                      className="table-activity-history-body-text"  
                      style={{...styles.listHeader,width:'20%'}}
                    >
                      {inputMode ?
                        <Input
                          id={'normall_stuff'}
                          invalid={listProduct.good_quantity === ''}
                          value={listProduct.good_quantity}
                          register={null}
                          style={styles.input}
                          placeholder={''}
                          onChange={(e) => handleInputChange(listProduct.inbound_detail_id, 'good_quantity', inputNumberAllowZeroNumber(e.target.value,6))}
                        /> 
                        :
                        <TableProductInventoryInbound.SubTitle>
                          {listProduct.good_quantity ?? 0}
                        </TableProductInventoryInbound.SubTitle>
                    }
                    </td>
                    <td 
                      className="table-activity-history-body-text"  
                      style={{...styles.listHeader,width:'20%'}}
                    >
                      {inputMode ?
                        <Input
                          id={'unnormall_stuff'}
                          invalid={listProduct.damage_quantity === ''}
                          value={listProduct.damage_quantity}
                          register={null}
                          style={styles.input}
                          placeholder={''}
                          onChange={(e) => handleInputChange(listProduct.inbound_detail_id, 'damage_quantity', inputNumberAllowZeroNumber(e.target.value,6))}
                        /> 
                        :
                        <TableProductInventoryInbound.SubTitle>
                          {listProduct.damage_quantity ?? 0}
                        </TableProductInventoryInbound.SubTitle>
                    }
                    </td>
                  </tr>
                )}
              </tbody>
             
        </>
    );
}

export default TableDataDetailInventory;