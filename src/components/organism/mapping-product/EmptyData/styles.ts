import colors from '@/utils/colors';
import styled from 'styled-components';

const Empty = {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 170px;
    `,
    Text: styled.text`
        color: ${colors.black};
        font-size: 13px;
        margin-top: 8px;
    `
};

export default Empty;