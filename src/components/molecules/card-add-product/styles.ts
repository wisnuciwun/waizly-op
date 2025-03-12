import colors from '@/utils/colors';
import styled from 'styled-components';

const CardProductAdd = {
    Container: styled.div<{height: number}>`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 16px;
        height: ${params => params.height}px;
        border-radius: 8px;
        border: 1px dashed ${colors.gray};
    `,
    Info: styled.div`
        width: 70%;
    `,
    Product: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;

    `,
    Title: styled.text`
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: ${colors.black};

         @media (max-width: 768px) {
            width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; 
        }
    `,
    Subtitle: styled.text`
        font-size: 12px;
        font-weight: 4000;
        line-height: 20px;
        color: ${colors.black};
        width: 90%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis; 
        display: block;
    `,
    Icon: styled.div`
        width: 56px;
        height: 56px;
        cursor: pointer;
        margin-left: auto;
    `
};

export default CardProductAdd;