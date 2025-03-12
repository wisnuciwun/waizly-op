import styled from 'styled-components';
import colors from '@/utils/colors';

const ListProduct = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 16px;
        gap: 16px;
        border-bottom: 2px solid ${colors.gray};
    `,
    ImageProduct: styled.img.attrs(({src}) => ({
        alt: 'image-product',
        src: src
    }))`
        width: 48px;
        height: 48px;
    `,
    Info: styled.div`
        width: 76%;
        display: flex;
        flex-direction: column;
        gap: 4px;
        white-space: nowrap;
        
    `,
    ContainerStore: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px
    `,
    ImageStore: styled.img.attrs(({src}) => ({
        alt: 'image-store',
        src: src
    }))`
        width: 12px;
        height: 12px;
    `,
    StoreName: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black}
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
    CheckBox: styled.div`
        width: 24px;
        height: 24px;
        margin-left: auto;
        cursor: pointer;
    `
};

export default ListProduct;