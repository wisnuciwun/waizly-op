/* eslint-disable no-unused-vars */
import { ProductSingelProps } from '@/utils/type/product';
import React, { memo } from 'react';
import ProductSku from './styles';
import { EmptyDataProductSku, ListProductSku, LoadingProductSku } from '@/components';

interface Props {
    list: ProductSingelProps[] | null;
    listSelected:  Array<number>;
    border?: 'dashed' |'solid';
    loading?: boolean;
    withDelete: boolean;
    onClick: (data: ProductSingelProps)=> void;
}

const MappingProductSku = ({
    list,
    listSelected,
    border,
    loading,
    withDelete,
    onClick
}: Props) => {

    if(loading) 
        return (
            <ProductSku.Container overflow={'hidden'} border={'solid'}>
                <LoadingProductSku />
            </ProductSku.Container> 
        ); 
    
    return (
        <ProductSku.Container overflow={list && list.length > 4 ? 'scroll' : 'hidden'} border={border}>
            {list && list.length > 0 ? (
                <>
                    {list.map((data, index) => (
                        <ListProductSku
                            key={index}
                            image=""
                            productName={data.name}
                            productCode={data.sku}
                            productType={data.product_type === 'SINGLE' ? 'SINGLE' : 'BUNDLING'}
                            withDelete={withDelete}
                            isChecked={listSelected.includes(data.id)}
                            onClick={()=> onClick(data)}
                        />
                    ))}
                </>
            ): (
                <EmptyDataProductSku
                    type={withDelete ? 'sku' : 'product'}
                    text={withDelete ? 'Kamu belum menambahkan SKU Pesanan apa pun' : 'Data tidak ditemukan'}
                />
            )}
        </ProductSku.Container>
    );
};

export default memo(MappingProductSku);