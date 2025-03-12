import colors from '@/utils/colors';
import styled from 'styled-components';

const Select = {
    Container: styled.button<{disabled: boolean, invalid: boolean}>`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 36px;
        border: 1px solid ${props => props.invalid ? colors.red : colors.gray};
        background-color: ${props => props.disabled ? '#F5F6FA' : colors.white};
        border-radius: 4px;
        padding: 8px 16px;
        cursor: ${props => props.disabled ? '' : 'pointer'};
        width: 100%;
        &:focus {
        outline: none;
        border-color: ${props => props.disabled ? '' : '#204680'}; 
    } 
    `,
    Title: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black};
    `,

};

export default Select;

export const styles = {
    icon: {
        height: 14,
        width: 14
    },
    required: {
        // position:"absolute !important",
        color: colors.red
    },
    textSmall: {
        fontSize: 12
    }
};
