import colors from '@/utils/colors';
import styled from 'styled-components';

const Filter = {
    Container: styled.div`
        display: flex;
        margin-left: 16px;
        flex-direction: row;
        gap: 4px;
        justify-content: center;
        cursor: pointer;
        padding-left: 4px;
    `,
    Text: styled.text`
        font-size: 14px;
        font-weight: 700;
        color: #203864;
    `,
};


export const  Styles = {
    icon: {
        marginTop: 1,
        fontSize: 20,
        color: colors.blue
    },
    modal: {
        width: 420,
        height: undefined,
        borderRadius: 16,
    },
    modalBody: {
        width: 420,
        height: undefined,
        padding: 16,
        backgroundColor: colors.white,
        borderRadius: 12,
    },
    textList: {
        paddingLeft: 10, 
        marginRight: 10,
        fontSize: 12
    }
};

export default Filter;