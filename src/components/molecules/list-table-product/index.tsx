/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import { changeEmptyToDash, curencyRupiah, inputNumber } from '@/utils/formater';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import UseCurrencyInput from '@/utils/useCurrencyInput';
import { Input } from 'reactstrap';
import TableProduct, { styles } from './styles';


interface Props {
    image: string;
    productName: string;
    productCode: string;
    quantity?: number | null;
    setQuantity?: (value: number) => void;
    weight?: number | null;
    setWeight?: (value: number) => void;
    price: number | null;
    setPrice: (value: number) => void;
    totalProduct: number;
    withInput: boolean;
    withTotalPerItem?: boolean;
    onDelete: () => void;
    trashBtnStyle?: React.CSSProperties,
    infoStyle?:  React.CSSProperties,
    quantityStyle?:  React.CSSProperties,
    priceStyle?:  React.CSSProperties,
}

const ListTableProduct = ({
    image,
    productName,
    productCode,
    quantity,
    setQuantity,
    weight,
    setWeight,
    price,
    setPrice,
    withInput,
    withTotalPerItem = true,
    totalProduct,
    onDelete,
    trashBtnStyle,
    infoStyle,
    quantityStyle,
    priceStyle
}: Props) => {
    return (
        <tbody style={{ whiteSpace: 'nowrap' }}>
            <tr style={{ border: '1px solid #E9E9EA' }}>
                <td className="table-activity-history-body-text" style={infoStyle}>
                    <TableProduct.ContainerInfo>
                        <Image
                            width={44}
                            height={44}
                            src={ilustrationCamera}
                            alt="Image Product"
                        />
                        <TableProduct.Info>
                            <TableProduct.Title>{changeEmptyToDash(productName)}</TableProduct.Title>
                            <TableProduct.SubTitle>{'Kode SKU: '+ changeEmptyToDash(productCode)}</TableProduct.SubTitle>
                        </TableProduct.Info>
                    </TableProduct.ContainerInfo>
                </td>
                <td className="table-activity-history-body-text text-truncate">
                    {withInput ? (
                        <TableProduct.ContainerInput>
                            <Input
                                id={'quantity'}
                                invalid={!quantity}
                                value={quantity ?? ''}
                                register={null}
                                style={{...styles.input, ...quantityStyle}}
                                placeholder={'Jumlah'}
                                maxLength={8}
                                onChange={(event) => setQuantity(parseInt(inputNumber(event.target.value, 8)))}
                            />
                        </TableProduct.ContainerInput>
                    ) : <TableProduct.SubTitle>{quantity}</TableProduct.SubTitle> }
                </td>
                <td className="table-activity-history-body-text text-truncate">
                    {withInput ? (
                        <TableProduct.ContainerInput>
                            <Input
                                id={'weight'}
                                invalid={!weight}
                                value={weight ?? ''}
                                register={null}
                                maxLength={6}
                                style={styles.input}
                                placeholder={'Berat'}
                                onChange={(event) => setWeight(parseInt(inputNumber(event.target.value, 8)))}
                            />
                        </TableProduct.ContainerInput>
                    ) : <TableProduct.SubTitle>{weight}</TableProduct.SubTitle> }
                </td>
                <td hidden={price == null} className="table-activity-history-body-text text-truncate">
                    {withInput ? (
                        <TableProduct.ContainerInput>
                            <Input
                                id={'price'}
                                style={{...styles.input, ...priceStyle}}
                                invalid={!price || price == 0}
                                value={isNaN(price) ? '' : price}
                                register={null}
                                placeholder={'Harga'}
                                onChange={(event) => setPrice(parseFloat(inputNumber(event.target.value.replaceAll('.', ''), 12)))}
                                onInput={(event) => {
                                    UseCurrencyInput(event, ()=> {}, 'price', 12);
                                }}
                                maxLength={12}
                            />
                        </TableProduct.ContainerInput>
                    ) :  <TableProduct.SubTitle>{'Rp ' +curencyRupiah(price || 0)}</TableProduct.SubTitle> }
                </td>
                {
                    withTotalPerItem &&
                    <td className="table-activity-history-body-text text-truncate">
                        <TableProduct.Title style={styles.subs}>{'Rp ' +  curencyRupiah(isNaN(quantity * price) ? 0 : (quantity * price) )}</TableProduct.Title>
                    </td>
                }
                {
                    withInput &&  
                     <td className="table-activity-history-body-text text-truncate">
                        {
                            trashBtnStyle ?
                            <div style={trashBtnStyle} onClick={onDelete}>
                                <IconTrashOutlined />
                            </div>
                            :
                            <TableProduct.Trash onClick={onDelete}>
                                <IconTrashOutlined />
                            </TableProduct.Trash>
                        }
                     </td>
                }
            </tr>
            {/* <TableProduct.Container>
                <TableProduct.ContainerInfo>
                    <Image
                        width={44}
                        height={44}
                        src={ilustrationCamera}
                        alt="Image Product"
                    />
                    <TableProduct.Info>
                        <TableProduct.Title>{changeEmptyToDash(productName)}</TableProduct.Title>
                        <TableProduct.SubTitle>{'Kode SKU: '+ changeEmptyToDash(productCode)}</TableProduct.SubTitle>
                    </TableProduct.Info>
                </TableProduct.ContainerInfo>
                {withInput ? (
                    <>
                        <TableProduct.ContainerInput>
                            <Input
                                id={'quantity'}
                                invalid={!quantity}
                                value={quantity ?? ''}
                                register={null}
                                style={styles.input}
                                placeholder={'Jumlah'}
                                maxLength={8}
                                onChange={(event) => setQuantity(parseInt(inputNumber(event.target.value, 8)))}
                            />
                        </TableProduct.ContainerInput>
                        <TableProduct.ContainerInput>
                            <Input
                                id={'weight'}
                                invalid={!weight}
                                value={weight ?? ''}
                                register={null}
                                maxLength={6}
                                style={styles.input}
                                placeholder={'Berat'}
                                onChange={(event) => setWeight(parseInt(inputNumber(event.target.value, 8)))}
                            />
                        </TableProduct.ContainerInput>
                        <TableProduct.ContainerInput>
                            <Input
                                id={'price'}
                                style={styles.input}
                                invalid={!price || price == 0}
                                value={isNaN(price) ? '' : price}
                                register={null}
                                placeholder={'Harga'}
                                onChange={(event) => setPrice(parseFloat(event.target.value.replaceAll('.', '')))}
                                onInput={(event) => {
                                    UseCurrencyInput(event, ()=> {}, 'price', 12);
                                }}
                                maxLength={12}
                            />
                        </TableProduct.ContainerInput>

                    </>
                ):(
                    <>
                        <TableProduct.SubTitle>{quantity}</TableProduct.SubTitle>
                        <TableProduct.SubTitle>{weight}</TableProduct.SubTitle>
                        <TableProduct.SubTitle>{'Rp ' +curencyRupiah(price || 0)}</TableProduct.SubTitle>
                    </>
                    
                )}
                <TableProduct.Title style={styles.subs}>{'Rp ' +  curencyRupiah(isNaN(quantity * price) ? 0 : (quantity * price) )}</TableProduct.Title>
                {withInput && (
                    <TableProduct.Trash onClick={onDelete}>
                        <IconTrashOutlined />
                    </TableProduct.Trash>
                )}
                

            </TableProduct.Container> */}
        </tbody>
        
    );
};

export default ListTableProduct;