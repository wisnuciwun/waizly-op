import colors from '@/utils/colors';
import styled from 'styled-components';

const FormTab = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        gap: 16px;
    `,
    Card: styled.div<{active: boolean , edit: boolean}>`
        padding: 8px 16px ;
        border-radius: 4px;
        border: 1px solid ${params => params.active ? colors.black : colors.gray};
        background-color: ${params => params.active ? '#E7EAEE' : colors.white};
        cursor: ${props => props.edit ? 'not-allowed' : 'pointer'};

    `,
    Text: styled.text`
        font-size: 12px;
        color: ${colors.black};
        font-weight: 400;
        line-height: 20px;
        text-align: center;
    `
};

export default FormTab;