/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import Product from './styles';
import { EmptyDataProductSku, ListSingelSku, LoadingListSingelSku } from '@/components/molecules';
import { ProductSingelProps } from '@/utils/type/product';

interface Props {
    list?: ProductSingelProps[] | null;
    listTemp?: ProductSingelProps[] | null;
    listSelected?:  Array<number>;
    sku?: boolean;
    border?: 'dashed' |'solid';
    loading?: boolean;
    onClick?: (data: ProductSingelProps)=> void;
    setTotal: (id: number, value: string) => void;
}

const MappingSingelProduct = ({
    list,
    listSelected,
    sku,
    border,
    loading,
    onClick,
    setTotal
}: Props) => {
    if(loading) 
        return (
            <Product.Container overflow={'hidden'} border={'solid'}>
                <LoadingListSingelSku />
            </Product.Container> 
        );

    return (
        <Product.Container overflow={list && list.length > 4 ? 'scroll' : 'hidden'} border={border}>
            {list && list.length > 0 ? (
                <>
                    {list.map((data, index) => (
                         <ListSingelSku
                            key={index}
                            image={''}
                            productName={data.name}
                            totalSku={data.quantity}
                            productCode={data.sku}
                            disabled={data.product_type !== 'SINGLE'}
                            isChecked={listSelected.includes(data.id)}
                            withDelete={sku}
                            onClick={()=> onClick(data)}
                            setTotal={(value) => setTotal(index, value)}
                        />
                    ))}
                </>
            ):(
                <EmptyDataProductSku
                    type={sku ? 'sku' : 'product'}
                    text={sku ? 'Kamu belum menambahkan Single SKU apapun ke Bundling SKU' : 'Data tidak ditemukan'}
                />
            )}
        </Product.Container>
    );
};

export default memo(MappingSingelProduct);
