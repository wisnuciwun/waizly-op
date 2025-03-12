import styled from 'styled-components';
import colors from '@/utils/colors';

const Product = {
    Container: styled.div<{border: 'dashed' | 'solid', overflow: 'scroll' | 'hidden'}>`
        width: 100%;
        border: ${props => props.border} 1px ${colors.gray};
        overflow-y: ${props => props.overflow};
        height: 500px;
    `
};

export default Product;