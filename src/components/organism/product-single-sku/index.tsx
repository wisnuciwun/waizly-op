/* eslint-disable no-unused-vars */
import React from 'react';
import Product from './styles';
import { ProductSingelProps } from '@/utils/type/product';
import { CardAddProduct } from '@/components';
import { Col, Row } from 'reactstrap';
import EmptyData from './EmptyData';
import CardSingleProduct from '@/components/molecules/card-single-product';

interface Props {
    list?: ProductSingelProps[] | null;
    edit: boolean;
    setValueSingle: (index: number, value: string) => void;
    border?: 'dashed' |'solid';
    onAddSingle: ()=> void;
    onDeleteSingle: (data: number)=> void;
}
const ProductSingleSku = ({
    list,
    border,
    edit,
    setValueSingle,
    onAddSingle,
    onDeleteSingle
}: Props) => {

    return (
        <Product.Container border={border}>
            {list && list.length > 0 ? (
                <Row xs={2}>
                    {!edit && (
                         <Col xs={6} lg={4} className={'mb-2'}>
                            <CardAddProduct single title={'Tambahkan Single SKU'} onClick={onAddSingle}/>
                        </Col>
                    )}
                   
                   {list.map((data, index) => (
                        <Col key={index} xs={6} lg={4} className={'mb-4'}>
                            <CardSingleProduct
                                image={''}
                                edit={edit}
                                productName={data.name}
                                productCode={data.sku}
                                totalSku={data.quantity}
                                setTotalSku={(value) => setValueSingle(index, value)}
                                onDelete={()=> onDeleteSingle(data.id)}
                            />
                        </Col>
                   ))}
                </Row>
            ): <EmptyData titleButton={'Tambah Single SKU'} onClick={onAddSingle}/>}
        </Product.Container>
    );
};

export default ProductSingleSku;