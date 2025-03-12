/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import CardProduct from './styles';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import { changeEmptyToDash } from '@/utils/formater';
import getMarketplaceImage from '@/utils/marketplaceImage';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';

interface Props {
    storeImage: string;
    storeName: string;
    image: string;
    productName: string;
    productCode: string;
    productVariant: string;
    onDelete: ()=> void;
}

const CardSyncProduct = ({
    image,
    storeImage,
    storeName,
    productName,
    productCode,
    productVariant,
    onDelete
}: Props) => {

    return (
        <CardProduct.Container>
            <CardProduct.Product>
                <Image
                    width={48}
                    height={48}
                    src={ilustrationCamera}
                    alt="Image Product"
                />

                <CardProduct.Info>
                    <CardProduct.Title>{changeEmptyToDash(productName)}</CardProduct.Title>
                    <CardProduct.ContainerStore>
                        <Image
                            width={12}
                            height={12}
                            src={getMarketplaceImage(storeImage ? storeImage.toLowerCase() : 'other')}
                            alt={'image-marketplace'}
                        />
                        <CardProduct.StoreName>{changeEmptyToDash(storeName)}</CardProduct.StoreName>
                    </CardProduct.ContainerStore>
                </CardProduct.Info>

                <CardProduct.Action onClick={onDelete}>
                    <IconTrashOutlined />
                </CardProduct.Action>
            </CardProduct.Product>

            <CardProduct.ContainerDesc>
                <CardProduct.ProductCode>{'Kode Produk: '+ changeEmptyToDash(productCode)}</CardProduct.ProductCode>
                <CardProduct.ProductCode>{'Varian: '+ productVariant}</CardProduct.ProductCode>
            </CardProduct.ContainerDesc>

        </CardProduct.Container>
    );
};

export default memo(CardSyncProduct);