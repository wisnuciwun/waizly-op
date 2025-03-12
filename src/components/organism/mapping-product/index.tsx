/* eslint-disable no-unused-vars */
import React, { memo } from 'react';
import Product from './styles';
import { EmptyDataProductSku, ListMappingProduct, LoadingMappingProduct } from '@/components/molecules';

import { ProductListingProps } from '@/utils/type/product';
import { getVariantProduct } from '@/utils/formater';

interface Props {
    list: ProductListingProps[] | null;
    listSelected:  Array<number>;
    sku?: boolean;
    border?: 'dashed' |'solid';
    loading?: boolean;
    onClick: (data: ProductListingProps)=> void;
}

const MappingProduct = ({
    list,
    listSelected,
    sku,
    border,
    loading,
    onClick
}: Props) => {

    if(loading) 
        return (
            <Product.Container overflow={'hidden'} border={'solid'}>
                <LoadingMappingProduct />
            </Product.Container> 
        ); 

    return (
        <Product.Container overflow={list && list.length > 4 ? 'scroll' : 'hidden'} border={border}>
            {list && list.length > 0 ? (
                <>
                    {list.map((data, index) => (
                         <ListMappingProduct
                            key={index}
                            storeName={data.store_name}
                            storeImage={data.channel_name}
                            image={''}
                            productName={data.product_name}
                            productCode={data.sku}
                            productVariant={
                                getVariantProduct(
                                    data.variant ? data.variant.variant_name_1 : data.variant_name_1 , 
                                        data.variant ? data.variant.variant_name_2 : data.variant_name_2 , 
                                        data.variant ? data.variant.variant_name_3 : data.variant_name_3 , 
                                )
                            }
                            disabled={false}
                            isChecked={listSelected.includes(data.child_product_listing_id)}
                            withDelete={sku}
                            onClick={()=> onClick(data)}
                        />
                    ))}
                </>
            ):(
                <EmptyDataProductSku
                    type={sku ? 'sku' : 'product'}
                    text={sku ? 'Kamu belum menghubungkan SKU Toko apa pun ke Master Produk' : 'Data tidak ditemukan'}
                />
            )}
        </Product.Container>
    );
};

export default memo(MappingProduct);
