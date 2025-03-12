/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import ListSkuProduct from './styles';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import { changeEmptyToDash } from '@/utils/formater';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import { Input } from 'reactstrap';

interface Props {
    image: string;
    productName: string;
    productCode: string;
    productType: 'SINGLE' | 'BUNDLING';
    disabled?: boolean;
    isChecked?: boolean;
    withDelete?: boolean;
    onClick: ()=> void;
}

const ListProductSku = ({
    image,
    productName,
    productCode,
    productType,
    disabled,
    isChecked,
    withDelete,
    onClick
}: Props) => {

    return (
        <ListSkuProduct.Container>
            <Image
                width={48}
                height={48}
                src={ilustrationCamera}
                alt="image-product"
            />

            <ListSkuProduct.Info>
                <ListSkuProduct.ContainerType productType={productType}>
                    <ListSkuProduct.TextType productType={productType}>{productType}</ListSkuProduct.TextType>
                </ListSkuProduct.ContainerType>
                <ListSkuProduct.Title>{changeEmptyToDash(productName)}</ListSkuProduct.Title>
                <ListSkuProduct.ProductCode>{'Kode SKU: '+productCode}</ListSkuProduct.ProductCode>
            </ListSkuProduct.Info>

            {withDelete ? (
                <ListSkuProduct.CheckBox onClick={onClick}>
                    <IconTrashOutlined />
                </ListSkuProduct.CheckBox>
            ):(
                <ListSkuProduct.CheckBox>
                    <Input
                        width={16}
                        height={16}
                        type={'checkbox'}
                        disabled={disabled}
                        checked={isChecked}
                        onChange={onClick}
                    />
                    
                </ListSkuProduct.CheckBox>
            )}
        </ListSkuProduct.Container>
    );
};

export default memo(ListProductSku);