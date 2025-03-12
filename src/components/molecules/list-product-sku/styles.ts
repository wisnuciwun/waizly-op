import styled from 'styled-components';
import colors from '@/utils/colors';

const ListSkuProduct = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 16px;
        gap: 16px;
        border-bottom: 2px solid ${colors.gray};
    `,
    Info: styled.div`
        width: 76%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        white-space: nowrap;
    `,
    ContainerType: styled.div<{productType: 'SINGLE' | 'BUNDLING'}>`
        background-color: ${props => props.productType === 'SINGLE' ? '#E1EFFA' : '#D5FDFF'};
        border-radius: 2px;
        padding: 0px 8px 0px 8px;
        width:  ${props => props.productType === 'SINGLE' ? '68px' : '88px'} ;
    `,
    TextType: styled.text<{productType: 'SINGLE' | 'BUNDLING'}>`
        text-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${props => props.productType === 'SINGLE' ? '#0372D9' : '#00A7E1'}
    `,
    Title: styled.text`
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: ${colors.black};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
    `,
    ContainerDesc: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 40px;
    `,
    ProductCode: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
        color: ${colors.black}
    `,
    ContainerInput: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
    `,
    CheckBox: styled.div`
        width: 24px;
        height: 24px;
        margin-left: auto;
        cursor: pointer;
    `
};


export default ListSkuProduct;