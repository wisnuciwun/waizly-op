import React from 'react';
import Empty from './styles';
import Nodata from '@/assets/images/illustration/no-data.svg';
import IlustrationNoData from '@/assets/images/illustration/ilustration-nodata.svg';

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
                src={type === 'product' ? Nodata : IlustrationNoData}
                alt="Image Product"
            />
            <Empty.Text>{'Data tidak ditemukan.'}</Empty.Text>
        </Empty.Container>
    );
};

export default EmptyData;