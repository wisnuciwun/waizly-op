/* eslint-disable no-unused-vars */
import React, {memo} from 'react';
import ListSingelProduct, {styles} from './styles';
import {IconTrashOutlined} from '@/assets/images/icon/trash-outlined';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import {changeEmptyToDash} from '@/utils/formater';
import {Input} from 'reactstrap';

interface Props {
  image: string;
  productName: string;
  productCode: string;
  totalSku: number | null;
  setTotal: (value: string) => void;
  isChecked?: boolean;
  disabled?: boolean;
  withDelete?: boolean;
  onClick: () => void;
}

const LisSingelSku = ({image, productName, productCode, totalSku, setTotal, isChecked, disabled, withDelete, onClick}: Props) => {
  const isValid = () => {
    if (totalSku != null) {
      if (totalSku < 1) return true;
      else return false;
    } else return false;
  };

  return (
    <ListSingelProduct.Container>
      <Image width={48} height={48} src={ilustrationCamera} alt="Image Product" />
      <ListSingelProduct.Info>
        <ListSingelProduct.Title>{changeEmptyToDash(productName)}</ListSingelProduct.Title>
        <ListSingelProduct.ContainerDesc>
          <ListSingelProduct.ProductCode>{'Kode SKU: ' + productCode}</ListSingelProduct.ProductCode>
          {withDelete && (
            <ListSingelProduct.ContainerInput>
              <ListSingelProduct.ContainerInput>
                <ListSingelProduct.TextInput>
                  {'Jumlah'}
                  <span style={styles.textRequired}>*</span>
                </ListSingelProduct.TextInput>
                <ListSingelProduct.Input>
                  <Input invalid={isValid()} value={totalSku || ''} disabled={disabled} width={200} height={32} placeholder={'Jumlah SKU'} maxLength={6} onChange={(event) => setTotal(event.target.value)} />
                  {isValid() && <ListSingelProduct.Message>{'Jumlah SKU Minimal 1'}</ListSingelProduct.Message>}
                </ListSingelProduct.Input>
              </ListSingelProduct.ContainerInput>
            </ListSingelProduct.ContainerInput>
          )}
        </ListSingelProduct.ContainerDesc>
      </ListSingelProduct.Info>
      {withDelete ? (
        <ListSingelProduct.CheckBox onClick={onClick}>
          <IconTrashOutlined />
        </ListSingelProduct.CheckBox>
      ) : (
        <ListSingelProduct.CheckBox>{!disabled && <Input width={16} height={16} type={'checkbox'} disabled={disabled} checked={isChecked} onChange={onClick} />}</ListSingelProduct.CheckBox>
      )}
    </ListSingelProduct.Container>
  );
};

export default memo(LisSingelSku);
