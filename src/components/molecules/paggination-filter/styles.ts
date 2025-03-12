import colors from '@/utils/colors';
import styled from 'styled-components';

const Paggination = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        padding-left: 0px !important;
    `,
    Label: styled.div`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black};
    `
};

export default Paggination;