import colors from '@/utils/colors';
import styled from 'styled-components';

const Tracking = {
    Container: styled.div`
        padding: 0px;
        display: flex;
        flex-direction: column;
    `,
    Title: styled.text`
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        color: ${colors.black};
        text-align: center;
    `,
    Subtitle: styled.text`
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: ${colors.black};
        text-align: center;
        margin-top: 8px;
    `,
    ContainerList: styled.div`
        margin-top: 24px;
        height: 200px;
        overflow: auto;
    `
};

export default Tracking;