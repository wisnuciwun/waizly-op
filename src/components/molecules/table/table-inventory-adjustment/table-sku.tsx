/* eslint-disable no-unused-vars */
import React from 'react';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import { inputNumberAllowZeroNumberWithoutDoubleZero } from '@/utils/formater';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import { Input } from 'reactstrap';
import TableProduct, { styles } from './styles';

interface Props {
  image: string;
  productName: string;
  productCode: string;
  currentStock: number | null;
  adjustmentStock?: number | null;
  setAdjustmentStock?: (value: number | string) => void;
  onDelete: () => void;
}

const ListTableProduct = ({
  image,
  productName,
  productCode,
  adjustmentStock,
  setAdjustmentStock,
  currentStock,
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
              id={'adjustmentStock'}
              invalid={adjustmentStock === null || isNaN(adjustmentStock)}
              value={isNaN(adjustmentStock) ? '' : adjustmentStock}
              style={{ ...styles.input, width: 155 }}
              // placeholder={"Jumlah"}
              maxLength={6}
              onChange={(event: any) =>
                setAdjustmentStock(inputNumberAllowZeroNumberWithoutDoubleZero(event.target.value, 6))
              }
            />
          </TableProduct.ContainerInput>
        </td>
        <td
          // hidden={price == null}
          className="table-activity-history-body-text text-truncate"
        >
          <TableProduct.ContainerInput>
              <TableProduct.SubTitle style={{
                color: isNaN(adjustmentStock) || isNaN(currentStock)
                ? 'black'
                : (adjustmentStock - currentStock) < 0
                ? 'red'
                : (adjustmentStock - currentStock) > 0
                ? 'green'
                : 'black'
              }}>
                {isNaN(adjustmentStock) || isNaN(currentStock)
                ? ''
                : (adjustmentStock - currentStock) > 0
                ? `+${adjustmentStock - currentStock}`
                : adjustmentStock - currentStock}
              </TableProduct.SubTitle>
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
