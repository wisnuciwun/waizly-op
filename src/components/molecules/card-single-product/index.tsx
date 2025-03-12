/* eslint-disable no-unused-vars */
import React, {memo} from 'react';
import CardProduct, {styles} from './styles';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import {changeEmptyToDash} from '@/utils/formater';
import {IconTrashOutlined} from '@/assets/images/icon/trash-outlined';
import {Input} from 'reactstrap';

interface Props {
  image: string;
  productName: string;
  productCode: string;
  totalSku: number | null;
  edit: boolean;
  setTotalSku: (value: string) => void;
  onDelete: () => void;
}

const CardSyncProduct = ({image, productName, productCode, totalSku, edit, setTotalSku, onDelete}: Props) => {
  return (
    <CardProduct.Container height={edit ? 110 : 124}>
      <CardProduct.Product>
        <Image width={40} height={40} src={ilustrationCamera} alt="Image Product" />

        <CardProduct.Info>
          <CardProduct.Title>{changeEmptyToDash(productName)}</CardProduct.Title>
        </CardProduct.Info>
        {!edit && (
          <CardProduct.Action onClick={onDelete}>
            <IconTrashOutlined />
          </CardProduct.Action>
        )}
      </CardProduct.Product>

      <CardProduct.ContainerDesc>
        <CardProduct.ProductCode>{'Kode SKU : ' + changeEmptyToDash(productCode)}</CardProduct.ProductCode>
        <CardProduct.ContainerInput>
          <CardProduct.ContainerInput>
            {edit ? (
              <CardProduct.TextInput>{'Jumlah: ' + totalSku}</CardProduct.TextInput>
            ) : (
              <>
                <CardProduct.TextInput>
                  {'Jumlah'}
                  <span style={styles.textRequired}>*</span>
                </CardProduct.TextInput>
                <CardProduct.Input>
                  <Input invalid={totalSku < 1} value={totalSku || ''} width={200} height={32} maxLength={6} placeholder={'Jumlah SKU'} onChange={(event) => setTotalSku(event.target.value)} />
                  {totalSku < 1 && <CardProduct.Message>{'Jumlah SKU Minimal 1'}</CardProduct.Message>}
                </CardProduct.Input>
              </>
            )}
          </CardProduct.ContainerInput>
        </CardProduct.ContainerInput>
      </CardProduct.ContainerDesc>
    </CardProduct.Container>
  );
};

export default memo(CardSyncProduct);
