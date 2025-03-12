import React from 'react';
import Courier from './styles';
import { curencyRupiah } from '@/utils/formater';

interface Props {
    title: string;
    subtitle: string;
    price: number;
    onClick: () => void;
}
const ListCourier = ({
    title,
    subtitle,
    price,
    onClick
}: Props) => {
    
    return (
        <Courier.Container onClick={onClick}>
            <Courier.Info>
                <Courier.Title>{title}</Courier.Title>
                <Courier.Estimation>{subtitle}</Courier.Estimation>
            </Courier.Info>
            <Courier.Estimation>{'Rp '+ curencyRupiah(price)}</Courier.Estimation>
        </Courier.Container>
    );
};

export default ListCourier;
