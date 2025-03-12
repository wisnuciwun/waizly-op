/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import { inputNumber } from '@/utils/formater';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import { Input } from 'reactstrap';
import TableProduct, { styles } from './styles';

interface Props {
  image: string;
  productName: string;
  productCode: string;
  currentStock: number | null;
  transferStock?: number | null;
  setTransferStock?: (value: number) => void;
  weight?: number | null;
  setWeight?: (value: number) => void;
  // totalProduct: number;
  withTotalPerItem?: boolean;
  onDelete: () => void;
}

const ListTableProduct = ({
  image,
  productName,
  productCode,
  transferStock,
  setTransferStock,
  currentStock,
  onDelete,
}: Props) => {
  return (
    <tbody style={{ whiteSpace: 'nowrap' }}>
      <tr style={{ border: '1px solid #E9E9EA' }}>
        <td
          className="table-activity-history-body-text"
          style={{
            width: '60%',
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
        <td
          // hidden={price == null}
          className="table-activity-history-body-text text-truncate"
        >
          <TableProduct.ContainerInput>
              <TableProduct.SubTitle>
                {currentStock}
              </TableProduct.SubTitle>
          </TableProduct.ContainerInput>
        </td>
        <td className="table-activity-history-body-text text-truncate">
          <TableProduct.ContainerInput>
            <Input
              id={'transferStock'}
              invalid={!transferStock}
              value={isNaN(transferStock) ? '' : transferStock}
              register={null}
              style={{ ...styles.input, width: 150 }}
              // placeholder={"Jumlah"}
              maxLength={6}
              onChange={(event) =>
                setTransferStock(parseInt(inputNumber(event.target.value, 8)))
              }
            />
          </TableProduct.ContainerInput>
        </td>
        <td>
          <div
            style={{
              // marginLeft: 10,
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
