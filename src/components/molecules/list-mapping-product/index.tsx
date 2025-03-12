import React, { memo } from 'react';
import ListProduct from './styles';
import { Input } from 'reactstrap';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import Image from 'next/image';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import getMarketplaceImage from '@/utils/marketplaceImage';
import { changeEmptyToDash } from '@/utils/formater';

interface Props {
    storeImage: string;
    storeName: string;
    image: string;
    productName: string;
    productCode: string;
    productVariant: string;
    isChecked?: boolean;
    disabled?: boolean;
    withDelete?: boolean;
    onClick: ()=> void;
}

const ListMappingProduct = ({
    storeImage,
    storeName,
    productName,
    productCode,
    productVariant,
    isChecked,
    disabled,
    withDelete,
    onClick
}: Props) => {

    return (
        <ListProduct.Container>
            <Image
                width={48}
                height={48}
                src={ilustrationCamera}
                alt="Image Product"
            />
            {/* <ListProduct.ImageProduct src={image}/> */}

            <ListProduct.Info>
                <ListProduct.ContainerStore>
                    <Image
                        width={12}
                        height={12}
                        src={getMarketplaceImage(storeImage ? storeImage.toLowerCase() : 'other')}
                        alt={'image-marketplace'}
                    />
                    {/* <ListProduct.ImageStore src={''}/> */}
                    <ListProduct.StoreName>{changeEmptyToDash(storeName)}</ListProduct.StoreName>
                </ListProduct.ContainerStore>

                <ListProduct.Title>{changeEmptyToDash(productName)}</ListProduct.Title>
                
                <ListProduct.ContainerDesc>
                    <ListProduct.ProductCode>{'Kode Produk: '+ changeEmptyToDash(productCode)}</ListProduct.ProductCode>
                    <ListProduct.ProductCode>{'Varian: '+ productVariant}</ListProduct.ProductCode>
                </ListProduct.ContainerDesc>
            </ListProduct.Info>

            {withDelete ? (
                <ListProduct.CheckBox onClick={onClick}>
                    <IconTrashOutlined />
                </ListProduct.CheckBox>
            ):(
                <ListProduct.CheckBox>
                    {!disabled && (
                        <Input
                            width={16}
                            height={16}
                            type={'checkbox'}
                            disabled={disabled}
                            checked={isChecked}
                            onChange={onClick}
                        />
                    )}
                    
                </ListProduct.CheckBox>
            )}
            
        </ListProduct.Container>
    );
};

export default memo(ListMappingProduct);