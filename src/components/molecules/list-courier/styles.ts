import colors from '@/utils/colors';
import styled from 'styled-components';

const Courier = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 16px;
        background-color: ${colors.white};
        border-bottom: 1px solid ${colors.gray};
        cursor: pointer;
        &:hover {
            background-color: ${colors.gray100};
        }
    `,
    Info: styled.div`
        display: flex;
        flex-direction: column;
    `,
    Title: styled.text`
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${colors.black};
    `,
    Estimation: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black}
    `
};

export default Courier;