/* eslint-disable no-unused-vars */
import React from 'react';
import Product from './styles';
import { ProductListingProps } from '@/utils/type/product';
import { CardAddProduct, CardSyncProduct } from '@/components';
import { Col, Row } from 'reactstrap';
import { getVariantProduct } from '@/utils/formater';
import EmptyData from './EmptyData';

interface Props {
    list: ProductListingProps[] | null;
    border?: 'dashed' |'solid';
    onAddProduct: ()=> void;
    onDeleteProduct: (data: number)=> void;
}
const ProductSku = ({
    list,
    border,
    onAddProduct,
    onDeleteProduct
}: Props) => {

    return (
        <Product.Container border={border}>
            {list && list.length > 0 ? (
                <Row xs={2}>
                    <Col xs={6} lg={4} className={'mb-2'}>
                        <CardAddProduct single={false} title={'Tambah Hubungan Produk Toko'} onClick={onAddProduct}/>
                    </Col>
                   {list.map((data, index) => (
                        <Col key={index} xs={6} lg={4} className={'mb-4'}>
                            <CardSyncProduct
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
                                onDelete={()=> onDeleteProduct(data.child_product_listing_id)}
                            />
                        </Col>
                   ))}
                </Row>
            ): <EmptyData titleButton={'Hubungkan Produk Toko'} onClick={onAddProduct}/>}
        </Product.Container>
    );
};

export default ProductSku;