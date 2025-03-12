import React from 'react';
import CardProductAdd from './styles';
import Image from 'next/image';
import ilustrationClicked from '@/assets/images/illustration/ilustration-card-clicked.svg';
import { IconCircleClose } from '@/assets/images/icon/circle-close';

interface Props {
    single: boolean;
    title: string;
    onClick: ()=> void;
}

const CardAddProduct = ({
    single,
    title,
    onClick
}: Props) => {
    return(
        <CardProductAdd.Container height={single ? 124 : 110}>
            <CardProductAdd.Info>
                <CardProductAdd.Product>
                    <Image
                        src={ilustrationClicked}
                        width={50}
                        height={43}
                        alt="illustration"
                    />
                        <CardProductAdd.Title>{title}</CardProductAdd.Title>
                </CardProductAdd.Product>
                <CardProductAdd.Subtitle>
                    {'Klik tombol ”+” untuk menambahkan'}
                </CardProductAdd.Subtitle>
            </CardProductAdd.Info>

            <CardProductAdd.Icon onClick={onClick}>
                <IconCircleClose />
            </CardProductAdd.Icon>
        </CardProductAdd.Container>
    );
};

export default CardAddProduct;