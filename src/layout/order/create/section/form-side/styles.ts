import colors from '@/utils/colors';
import styled from 'styled-components';

const SideForm = {
    Container: styled.div`
        padding-bottom: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid ${colors.gray}
    `,
    ContainerList: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    `,
    Line: styled.div`
        height: 2px;
        width: 40px;
        background-color: ${colors.black},
        margin-bottom: 16px;
        margin-top: 8px;
    `,
    Title: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black}
    `,
    TitleBold: styled.text`
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${colors.darkBlue}
    `,
    TitleBlue: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.darkBlue}
    `,
    
};

export const styles = {
    input: {
        width: 154,
    },
};

export default SideForm;