import React from 'react';
import Empty from './styles';
import Nodata from '@/assets/images/illustration/no-data.svg';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';

import Image from 'next/image';

interface Props {
    type: 'product' | 'sku';
    text: React.ReactNode;
    iconHeight?: number;
    iconWidth?: number;
    customStyle?: React.CSSProperties;
}
const EmptyDataProductSku = ({
    type,
    text,
    iconHeight,
    iconWidth,
    customStyle = {}
}: Props) => {

    return (
        <Empty.Container style={customStyle}>
            <Image
                width={iconWidth}
                height={iconHeight}
                src={type === 'product' ? Nodata : NodataSKU}
                alt="image-no-data"
            />
            <Empty.Text>{text}</Empty.Text>
        </Empty.Container>
    );
};

export default EmptyDataProductSku;