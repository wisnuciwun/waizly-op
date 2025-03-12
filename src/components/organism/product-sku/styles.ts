import colors from '@/utils/colors';
import styled from 'styled-components';

const Product = {
    Container: styled.div<{border: 'dashed' | 'solid'}>`
        width: 100%;
        padding: 16px 16px 0px 16px;
        border: ${props => props.border} 1px ${colors.gray};
        overflow-y: scroll;
        height: 251px;
        border-radius: 4px;
    `
};

export default Product;