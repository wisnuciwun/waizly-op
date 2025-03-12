/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SideForm, { styles } from './styles';
import { curencyRupiah } from '@/utils/formater';
import { FormFeedback, Input } from 'reactstrap';
import UseCurrencyInput from '@/utils/useCurrencyInput';

interface Props {
    income: number | null;
    subTotal: number | null;
    totalShipping: number | null;
    setTotalShipping: (value: number) => void;
    otherCost: number | null;
    setOtherCost: (value: number) => void;
    expend: number | null;
    discount: number | null;
    setDiscount: (value: number) => void;
    totalOrder: number | null;
    setTotalOrder: (value: number) => void;
    edit: boolean;
    deliveryMethod: number;
    paymentMethod: number;
    isShippingWithBuyer: boolean;
    setShippingWithBuyer: (value: boolean) => void;
    codPrice: number;
    codFee: number;
    codPercentage: number;
    courier: string;
    packingPrice: number | null;
    setPackingPrice: (value: number) => void;
    discountShipping: number | null;
    isInsurance: boolean;
    setInsurance: (value: boolean) => void;
    setDiscountShipping: (value: number) => void;
    insuranceAmount: number | null;
    loadingInsurance: boolean;
}

const FormSide = ({
    income,
    subTotal,
    totalShipping,
    setTotalShipping,
    otherCost,
    setOtherCost,
    expend,
    setDiscount,
    discount,
    totalOrder,
    setTotalOrder,
    deliveryMethod,
    edit,
    paymentMethod,
    isShippingWithBuyer,
    setShippingWithBuyer,
    isInsurance,
    setInsurance,
    codPrice,
    codFee,
    codPercentage,
    courier,
    packingPrice,
    setPackingPrice,
    discountShipping,
    setDiscountShipping,
    insuranceAmount,
    loadingInsurance
}: Props) => {
    const incomes = (subTotal || 0) + (isShippingWithBuyer ? 0 : (totalShipping || 0)) + (otherCost || 0) + (codFee);

    const [discounts, setDiscounts] = useState<number>(discount);

    const handleChangeDiscount = (value) => {
        setDiscounts(value);
    };

    useEffect(() => {
        const timeout = setTimeout(() => handleSetDiscount(discounts), 500);
        return () => {
            clearTimeout(timeout);
        };
    }, [discounts]);

    const handleSetDiscount = (value) => {
        setDiscount(value);
    };
    
    return (
        <div>
            <SideForm.Container>
                {/* <SideForm.ContainerList>
                    <SideForm.TitleBold>{'Pemasukan'}</SideForm.TitleBold>
                    <SideForm.TitleBlue>{'Rp ' + curencyRupiah(incomes || 0)}</SideForm.TitleBlue>
                </SideForm.ContainerList> */}
                <SideForm.ContainerList>
                    <SideForm.Title>{'Subtotal'}</SideForm.Title>
                    <SideForm.Title>{'Rp ' + curencyRupiah(subTotal || 0)}</SideForm.Title>
                </SideForm.ContainerList>
               
                <SideForm.ContainerList>
                    <SideForm.Title>{'Total Biaya Pengiriman'}</SideForm.Title>
                    {deliveryMethod == 1 || edit ? (
                        <SideForm.Title>{'Rp ' + curencyRupiah(totalShipping || 0)}</SideForm.Title>
                    ):(
                        <Input
                            id="ongkir"
                            placeholder={'Biaya Pengiriman'}
                            defaultValue={totalShipping}
                            onChange={(event) => setTotalShipping(parseFloat(event.target.value.replaceAll('.', '')))}
                            style={styles.input}
                            maxLength={12}
                            onInput={(event) => {
                                UseCurrencyInput(event, ()=> {}, 'ongkir', 12);
                            }}
                        />
                    )}
                </SideForm.ContainerList>
                {isInsurance && (
                    <SideForm.ContainerList>
                        <SideForm.Title>{'Biaya Asuransi'}</SideForm.Title>
                        {loadingInsurance ? <SideForm.Title>{'Counting...'}</SideForm.Title> : <SideForm.Title>{'Rp ' + curencyRupiah(insuranceAmount || 0)}</SideForm.Title>}
                    </SideForm.ContainerList>
                )}
                
                <SideForm.ContainerList>
                    <SideForm.Title>{'Biaya Lainnya'}</SideForm.Title>
                    {edit ? (
                        <SideForm.Title>{'-Rp ' + curencyRupiah(otherCost || 0)}</SideForm.Title>
                    ):(
                        // <Input
                        //     id="other"
                        //     placeholder={'Biaya Lainnya'}
                        //     value={otherCost}
                        //     onChange={(event) => {
                        //         setOtherCost(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)
                        //     }}
                        //     style={styles.input}
                        //     maxLength={12}
                        //     onInput={(event) => {
                        //         UseCurrencyInput(event, ()=> {}, 'other', 12);
                        //     }}
                        // />
                        <Input
                            id="other"
                            placeholder={'Biaya Lainnya'}
                            defaultValue={otherCost}
                            onChange={(event) => setOtherCost(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)}
                            style={styles.input}
                            maxLength={12}
                            onInput={(event) => {
                                UseCurrencyInput(event, ()=> {}, 'other', 12);
                            }}
                        />
                    )}
                </SideForm.ContainerList>
                <SideForm.ContainerList>
                    <div className="form-group">
                        <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'cost-shipping'}
                                checked={isShippingWithBuyer}
                                // disabled={deliveryMethod == 2}
                                onChange={() => setShippingWithBuyer(!isShippingWithBuyer)}
                            />
                            <label
                                className="custom-control-label"
                                htmlFor={'cost-shipping'}
                                style={{ color: '#4C4F54', paddingLeft: 4}}
                                >
                                {'Biaya Pengiriman Ditanggung Penjual'}
                            </label>
                        </div>
                    </div>
                </SideForm.ContainerList>
                <SideForm.ContainerList>
                    <div className="form-group">
                        <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'cost-insurance'}
                                checked={isInsurance}
                                disabled={!subTotal || subTotal == 0 || !totalShipping || totalShipping == 0 || !courier.toLowerCase().includes('jnt') || deliveryMethod == 2}
                                onChange={() => setInsurance(!isInsurance)}
                            />
                            <label
                                className="custom-control-label"
                                htmlFor={'cost-insurance'}
                                style={{ color: '#4C4F54', paddingLeft: 4}}
                                >
                                {'Gunakan Asuransi Pengiriman'}
                            </label>
                        </div>
                    </div>
                </SideForm.ContainerList>
            </SideForm.Container>
                    
            <SideForm.Container>
                {/* <SideForm.ContainerList>
                    <SideForm.TitleBold>{'Pengeluaran'}</SideForm.TitleBold>
                    <SideForm.TitleBlue>{'-Rp ' +  curencyRupiah(discount || 0)}</SideForm.TitleBlue>
                </SideForm.ContainerList> */}
                
                
                
                {/* {deliveryMethod == 1 ? (
                    <SideForm.ContainerList>
                        <SideForm.Title>{`Biaya COD ${courier && codFee ? `(${courier.split(" ")[0]} - ${codPercentage * 100}%)` : '' }`}</SideForm.Title>
                        <SideForm.Title>{'Rp ' + curencyRupiah(codFee || 0)}</SideForm.Title>
                    </SideForm.ContainerList>
                ): null} */}

                {isShippingWithBuyer && (
                    <SideForm.ContainerList>
                        <SideForm.Title>{'Diskon Pengiriman'}</SideForm.Title>
                        <SideForm.Title>{'-Rp ' +  curencyRupiah(discountShipping || 0)}</SideForm.Title>
                    </SideForm.ContainerList>
                )}
                <SideForm.ContainerList>
                    <SideForm.Title>{'Diskon Pesanan'}</SideForm.Title>
                    {/* <FormGroup>
                        <Input
                            id="discount"
                            placeholder={'Diskon Pesanan'}
                            defaultValue={discount}
                            invalid={discount > incomes}
                            onChange={(event) => setDiscount(event.target.value.length > 0  ? parseFloat(event.target.value.replaceAll('.', '')) : 0)}
                            style={styles.input}
                            maxLength={12}
                            onInput={(event) => {
                                UseCurrencyInput(event, ()=> {}, 'discount', 12);
                            }}
                        />
                        <FormFeedback>
                            <span
                                className="text-danger position-absolute mb-8"
                                style={{marginBottom: 16}}
                            >
                                {discount > incomes ? 'Diskon tidak boleh lebih dari pemasukan' : ''}
                            </span>
                        </FormFeedback>
                    </FormGroup> */}
                    {edit ? (
                         <SideForm.Title>{'-Rp ' +  curencyRupiah(discount || 0)}</SideForm.Title>
                    ):(
                        <div style={{marginBottom: discount > incomes ? 32 : 0}}>
                            {/* <Input
                                id="discount"
                                placeholder={'Diskon Pesanan'}
                                value={discount}
                                invalid={discount > incomes}
                                onChange={(event) => setDiscount(event.target.value.length > 0  ? parseFloat(event.target.value.replaceAll('.', '')) : 0)}
                                style={styles.input}
                                maxLength={12}
                                onInput={(event) => {
                                    UseCurrencyInput(event, ()=> {}, 'discount', 12);
                                }}
                            /> */}
                            <Input
                                id="discount-seler"
                                placeholder={'Diskon Pesanan'}
                                defaultValue={discounts}
                                // value={discount}
                                invalid={discounts > incomes}
                                onChange={(event) => handleChangeDiscount(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)}
                                style={styles.input}
                                maxLength={12}
                                onInput={(event) => {
                                    UseCurrencyInput(event, ()=> {}, 'discount', 12);
                                }}
                            />
                            <FormFeedback>
                                <span
                                    className="text-danger position-absolute mb-8"
                                    style={{marginBottom: 16}}
                                >
                                    {discount > incomes ? 'Diskon tidak boleh lebih dari pemasukan' : ''}
                                </span>
                            </FormFeedback>
                        </div>
                    )}
                </SideForm.ContainerList>
                <SideForm.ContainerList>
                    <SideForm.Title>{'Biaya Packing (Kayu/Kardus/dll.)'}</SideForm.Title>
                    {edit ? (
                        <SideForm.Title>{'-Rp ' + curencyRupiah(packingPrice || 0)}</SideForm.Title>
                    ):(
                        // <Input
                        //     id="packing"
                        //     placeholder={'Biaya Packing'}
                        //     value={packingPrice}
                        //     onChange={(event) => {
                        //         setPackingPrice(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)
                        //     }}
                        //     style={styles.input}
                        //     maxLength={12}
                        //     onInput={(event) => {
                        //         UseCurrencyInput(event, ()=> {}, 'packing', 12);
                        //     }}
                        // />
                        <Input
                            id="packing"
                            placeholder={'Biaya Packing'}
                            defaultValue={packingPrice}
                            onChange={(event) => setPackingPrice(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)}
                            style={styles.input}
                            maxLength={12}
                            onInput={(event) => {
                                UseCurrencyInput(event, ()=> {}, 'ongkir', 12);
                            }}
                        />
                    )}
                </SideForm.ContainerList>
                
                
            </SideForm.Container>
            
            <SideForm.ContainerList>
                <SideForm.TitleBold>{paymentMethod == 2 ? 'Total Pesanan COD' : 'Total Pesanan'}</SideForm.TitleBold>
                {/* {paymentMethod == 2 && deliveryMethod == 1 ? (
                    <Input
                        id="grand"
                        placeholder={'Biaya Lainnya'}
                        value={paymentMethod == 2 ? codPrice : totalOrder}
                        onChange={(event) => {
                            setTotalOrder(event.target.value.length > 0 ?  parseFloat(event.target.value.replaceAll('.', '')) : 0)
                        }}
                        style={styles.input}
                        maxLength={12}
                        onInput={(event) => {
                            UseCurrencyInput(event, ()=> {}, 'other', 12);
                        }}
                    />
                ):( */}
                    <SideForm.TitleBold>{'Rp ' + curencyRupiah(totalOrder)}</SideForm.TitleBold>
                {/* )} */}
                
            </SideForm.ContainerList>

        </div>
    );
};

export default FormSide;