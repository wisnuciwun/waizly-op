/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import {
  inputNumber,
} from '@/utils/formater';
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
  withTotalPerItem?: boolean;
  onDelete: () => void;
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
  onDelete,
}: Props) => {
  return (
    <tbody style={{ whiteSpace: 'nowrap' }}>
      <tr style={{ border: '1px solid #E9E9EA' }}>
        <td
          className="table-activity-history-body-text"
          style={{
            width: '50%',
            maxWidth: 550,
            minWidth: 225,
            paddingRight: 50,
          }}
        >
          <TableProduct.ContainerInfo>
            <Image
              width={44}
              height={44}
              src={image.length != 0 ? image : ilustrationCamera}
              alt="Image Product"
              className="ms-1"
            />
            <TableProduct.Info>
              <TableProduct.Title>{productName}</TableProduct.Title>
              <TableProduct.SubTitle>
                {'Kode SKU: ' + productCode}
              </TableProduct.SubTitle>
            </TableProduct.Info>
          </TableProduct.ContainerInfo>
        </td>
        <td className="table-activity-history-body-text text-truncate">
          <TableProduct.ContainerInput>
            <Input
              id={'quantity'}
              invalid={!quantity}
              value={isNaN(quantity) ? '' : quantity}
              register={null}
              style={{ ...styles.input, width: 150 }}
              placeholder={'Jumlah'}
              maxLength={6}
              onChange={(event) =>
                setQuantity(parseInt(inputNumber(event.target.value, 8)))
              }
            />
          </TableProduct.ContainerInput>
        </td>
        <td
          hidden={price == null}
          className="table-activity-history-body-text text-truncate"
        >
          <TableProduct.ContainerInput>
            <Input
              id={'price'}
              style={{ ...styles.input, width: 196 }}
              invalid={false}
              value={isNaN(price) ? '' : price}
              register={null}
              placeholder={'Harga'}
              onChange={(event) =>
                setPrice(
                  parseFloat(
                    inputNumber(event.target.value.replaceAll('.', ''), 12)
                  )
                )
              }
              onInput={(event) => {
                UseCurrencyInput(event, () => {}, 'price', 12);
              }}
              maxLength={12}
            />
          </TableProduct.ContainerInput>
        </td>
        <td>
          <div
            style={{
              marginLeft: 10,
              cursor: 'pointer',
            }}
            onClick={onDelete}
          >
            <IconTrashOutlined />
          </div>
        </td>
      </tr>
    </tbody>
  );
};

export default ListTableProduct;
