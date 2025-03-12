import colors from '@/utils/colors';
import styled from 'styled-components';

const CardProduct = {
    Container: styled.div`
        padding: 16px;
        border: 1px solid ${colors.gray};
        border-radius: 8px;
        height: 110px;
    `,
    Product: styled.div`
        display: flex;
        flex-direction: row;
        gap: 4px;
    `,
    Info: styled.div`
        width: 76%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
    `,
    Title: styled.text`
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: ${colors.black};
    `,
    ContainerStore: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px
    `,
    StoreName: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black}
    `,
    ContainerDesc: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        gap: 8px;
       
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
    VariantName: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        width: 50%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
        color: ${colors.black}
    `,
    Action: styled.div`
        width: 24px;
        height: 24px;
        cursor: pointer;
        margin-left: auto;
    `

};

export default CardProduct;