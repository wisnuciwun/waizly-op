import React from 'react';
import Empty from './styles';
import Nodata from '@/assets/images/illustration/no-data.svg';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';

import Image from 'next/image';

interface Props {
    type: 'product' | 'sku';
}
const EmptyData = ({
    type
}: Props) => {

    return (
        <Empty.Container>
            <Image
                width={120}
                height={80}
                src={type === 'product' ? Nodata : NodataSKU}
                alt="image-no-data"
            />
            <Empty.Text>{type === 'product' ? 'Data tidak ditemukan.' : 'Kamu belum menghubungkan SKU Toko apa pun ke Master Produk'}</Empty.Text>
        </Empty.Container>
    );
};

export default EmptyData;