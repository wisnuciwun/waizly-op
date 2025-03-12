import React, { memo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import ListProduct from '../styles';

const LoadingProductSku= () => {
    return(
        <>
            {Array.from({length: 6}, (_, i) => (
                <ListProduct.Container key={i}>
                    <Skeleton width={'48px'} height={'48px'} shape={'circle'} />
                    <ListProduct.Info>
                        <Skeleton width={'60px'} height={'18px'} shape={'rectangle'} />
                        <Skeleton width={'full'} height={'16px'} shape={'rectangle'} />
                        <Skeleton width={'50%'} height={'16px'} shape={'rectangle'} />
                    </ListProduct.Info>
        
                    <ListProduct.CheckBox>
                        <Skeleton width={'16px'} height={'16px'} shape={'circle'} />
                    </ListProduct.CheckBox>
        
                </ListProduct.Container>
            ))}
        </>
        
    );
};

export default memo(LoadingProductSku);