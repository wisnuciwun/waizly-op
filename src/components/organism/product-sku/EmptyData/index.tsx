import React from 'react';
import Empty, { styles } from './styles';
import Nodata from '@/assets/images/illustration/no-data.svg';

import Image from 'next/image';
import { Button } from '@/components';

interface Props {
    titleButton: string;
    onClick: ()=> void;
}
const EmptyData = ({
    titleButton,
    onClick
}: Props) => {

    return (
        <Empty.Container>
            <Image
                width={150}
                height={100}
                src={Nodata}
                alt="image-no-data"
            />
            <Empty.Text>{'Kamu belum menghubungkan SKU Toko apa pun ke Master Produk ini'}</Empty.Text>
            <Button
                type={'button'}
                color={'primary'}
                style={styles.button}
                onClick={onClick}
            >
                {titleButton}
            </Button>
        </Empty.Container>
    );
};

export default EmptyData;