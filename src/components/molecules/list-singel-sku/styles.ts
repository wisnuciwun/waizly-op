import styled from 'styled-components';
import colors from '@/utils/colors';

const ListSingelProduct = {
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
    TextInput: styled.div`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        margin-right: 2px;
        color: ${colors.black}
    `,
    Input: styled.div`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,
    Message: styled.text`
        font-size: 10px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.red}
    `,
    CheckBox: styled.div`
        width: 24px;
        height: 24px;
        margin-left: auto;
        cursor: pointer;
    `
};

export const styles = {
    textRequired: {
        color: colors.red
    }
};

export default ListSingelProduct;