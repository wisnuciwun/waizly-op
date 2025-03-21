import React, { memo } from 'react';
import { Skeleton } from 'primereact/skeleton';
import ListProduct from '../styles';

const LoadingMappingProduct = () => {
    return(
        <>
            {Array.from({length: 6}, (_, i) => (
                <ListProduct.Container key={i}>
                    <Skeleton width={'48px'} height={'48px'} shape={'circle'} />
                    <ListProduct.Info>
                        <ListProduct.ContainerStore>
                            <Skeleton width={'12px'} height={'12px'} shape={'circle'} />
                            <Skeleton width={'160px'} height={'12px'} shape={'rectangle'} />
                        </ListProduct.ContainerStore>
                        <Skeleton width={'full'} height={'16px'} shape={'rectangle'} />
                        <ListProduct.ContainerDesc>
                            <Skeleton width={'50%'} height={'14px'} shape={'rectangle'} />
                            <Skeleton width={'50%'} height={'14px'} shape={'rectangle'} />
                        </ListProduct.ContainerDesc>
                    </ListProduct.Info>
        
                    <ListProduct.CheckBox>
                        <Skeleton width={'16px'} height={'16px'} shape={'circle'} />
                    </ListProduct.CheckBox>
        
                </ListProduct.Container>
            ))}
        </>
        
    );
};

export default memo(LoadingMappingProduct);