/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PackageInfo from './styles';
import { Col, Row } from 'reactstrap';
import { Input } from '@/components';
import { ProductSkuTable } from '@/components/organism';
import { ProductSingelProps } from '@/utils/type/product';

// utils
import { inputDecimal } from '@/utils/formater';
import colors from '@/utils/colors';

interface Props {
    weight: number;
    setWeight: (value: number) => void;
    length: any;
    setLength: (value: any) => void;
    width: any;
    setWidth: (value: any) => void;
    height: any;
    setHeight: (value: any) => void;
    listProduct: ProductSingelProps[] | null;
    isOverWeight: boolean;
    setQuantity: (index: number, value: number) => void;
    setWeightProduct: (index: number, value: number) => void;
    setPrice: (index: number, value: number) => void;
    onAddProduct: ()=> void;
    onDeleteProduct: (data: number)=> void;
    edit: boolean;
    complete: boolean;
}

const FormInfoPackage = ({
    weight,
    setWeight,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    listProduct,
    onAddProduct,
    isOverWeight,
    setQuantity,
    setWeightProduct,
    setPrice,
    onDeleteProduct,
    edit,
    complete
}: Props) => {
    const [errorWeight, setErrorWeight] = useState<'IS_NULL' | null>(null);
    // const [errorLength, setErrorLength] = useState<'IS_NULL' | null>(null);
    // const [errorWidth, setErrorWidth] = useState<'IS_NULL' | null>(null);
    // const [errorHeight, setErrorHeight] =  useState<'IS_NULL' | null>(null);

    const handleChange = (value: string, type: 'weight' | 'length' | 'width' | 'height') => {

        switch(type) {
            case 'weight':
                if(!value) setErrorWeight('IS_NULL');
                else setErrorWeight(null);
                
                setWeight(parseInt(value));
                break;
            case 'length':
                // if(!value) setErrorLength('IS_NULL')
                // else setErrorLength(null)
                
                setLength(value);
                break;
            case 'width':
                // if(!value) setErrorWidth('IS_NULL')
                // else setErrorWidth(null)
                
                setWidth(value);
                break;
            case 'height':
                // if(!value) setErrorHeight('IS_NULL')
                // else setErrorHeight(null)
                
                setHeight(value);
                break;
            default:
                if(!value) setErrorWeight('IS_NULL');
                else setErrorWeight(null);
                
                setWeight(parseInt(value));
                break;
        }
       
    };

    const marginInfoPackage = isOverWeight ? 44 : errorWeight ? 12 : 0;

    useEffect(()=> {
        if(weight && weight > 0) {
            setErrorWeight(null);
        }
    },[weight]);

    return (
        <PackageInfo.Container>
            <p className="mb-4" style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Informasi Paket'}</p>
            <Row className={'mt-4'}>
                <Col lg={3} sm={6} style={{marginBottom: marginInfoPackage}}>
                    <Input
                        id={'weight'}
                        label={'Berat Paket'}
                        required
                        register={null}
                        disabled={complete}
                        invalid={errorWeight === 'IS_NULL' || isOverWeight}
                        placeholder={'Masukkan Berat Paket'}
                        value={weight == 0 ? '' : weight}
                        onChange={(value: string)=> handleChange(value, 'weight')}
                        stickyLabel={'gram'}
                        stickyPosition={'right'}
                        maxLength={6}
                        onInput={(e) => {
                            let inputValue = e.target.value;
                            inputValue = inputValue
                              .replace(/[^0-9]/g, '');
                            e.target.value = inputValue;
                        }}
                        message={isOverWeight ? 'Berat Paket tidak boleh lebih kecil dari total Berat Satuan' : errorWeight === 'IS_NULL' ? 'Harap mengisi Berat Paket' : ''}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <Input
                        id={'length'}
                        label={'Panjang Paket'}
                        // required
                        register={null}
                        disabled={complete}
                        // invalid={errorLength === 'IS_NULL'}
                        placeholder={'Masukkan Panjang Paket'}
                        value={length}
                        onChange={(value: string)=> handleChange(value, 'length')}
                        stickyLabel={'cm'}
                        maxLength={6}
                        stickyPosition={'right'}
                        type="text"
                        onInput={(e) => {
                            const inputValue = e.target.value;
                            const validDecimal = inputDecimal(inputValue);
                            e.target.value = validDecimal;
                        }}
                        // message={errorLength === 'IS_NULL' ? 'Harap mengisi Panjang Paket' : ''}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <Input
                        id={'width'}
                        label={'Lebar Paket'}
                        // required
                        register={null}
                        disabled={complete}
                        // invalid={errorWidth === 'IS_NULL'}
                        placeholder={'Masukkan Lebar Paket'}
                        maxLength={6}
                        value={width}
                        onChange={(value: string)=> handleChange(value, 'width')}
                        stickyLabel={'cm'}
                        stickyPosition={'right'}
                        type="text"
                        onInput={(e) => {
                            const inputValue = e.target.value;
                            const validDecimal = inputDecimal(inputValue);
                            e.target.value = validDecimal;
                        }}
                        // message={errorWidth === 'IS_NULL' ? 'Harap mengisi Lebar Paket' : ''}
                    />
                </Col>
                <Col lg={3} sm={6}>
                    <Input
                        id={'height'}
                        label={'Tinggi Paket'}
                        // required
                        register={null}
                        disabled={complete}
                        maxLength={6}
                        // invalid={errorHeight === 'IS_NULL'}
                        placeholder={'Masukkan Tinggi Paket'}
                        value={height}
                        onChange={(value: string)=> handleChange(value, 'height')}
                        stickyLabel={'cm'}
                        type="text"
                        stickyPosition={'right'}
                        onInput={(e) => {
                            const inputValue = e.target.value;
                            const validDecimal = inputDecimal(inputValue);
                            e.target.value = validDecimal;
                        }}            
                        // message={errorHeight === 'IS_NULL' ? 'Harap mengisi Tinggi Paket' : ''}
                    />
                </Col>
            </Row>

            <ProductSkuTable
                list={listProduct}
                onAddProduct={onAddProduct}
                setQuantity={(index, value) => setQuantity(index, value)}
                setPrice={(index, value) => setPrice(index, value)}
                setWeight={(index, value) => setWeightProduct(index, value)}
                onDeleteProduct={(id) => onDeleteProduct(id)}
                edit={complete}
            />
        </PackageInfo.Container>
    );
};

export default FormInfoPackage;