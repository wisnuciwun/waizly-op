import colors from '@/utils/colors';
import styled from 'styled-components';

const SyncProduct = {
    Container: styled.div`
        background-color: white;
        padding: 20px;
        border: solid 1px ${colors.gray};
        border-radius: 4px;
    `,
    Breadcrumb: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 4px;
        margin-bottom: 8px;
        gap: 4px;
    `,
    MainPage: styled.text`
        font-size: 12px;
        color: #203864;
        font-weight: 400;
        line-height: 20px;
       
    `,
    SubsPage: styled.text`
        font-size: 12px;
        color: #BDC0C7;
        font-weight: 400;
        line-height: 20px;
    `,
    SubTitle: styled.text`
        color: ${colors.black};
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
    `,
    Selected: styled.text`
        color: ${colors.black};
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
    `,
    Button: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-top: 32px;
    `,
    ButtonBack: styled.text`
        color: ${colors.blue};
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        cursor: pointer;
    `
};

export const styles = {
    filterChanel: {
        height: '40px',
        width: '100%',
        padding: '10px',
        color: colors.black
    },
    image: {
        marginRight: '10px',
    },
    textList: {
        fontSize: '14px',
        fontWeight: '400',
        marginTop: '4px'
    },
    selectedCount: {
        display: 'flex',
        alignItems: 'center'
    }, 
    button: {
        height: 43,
        fontSize: 14,
    },
    IconSearch: {
        color: '#203864',
        cursor: 'pointer',
        backgroundColor: '#ffffff'
    },
    InputSearch: {
        width: 'auto'
    },
    ButtonSecondary: {
        height: 43,
        width: 180,
        fontSize: 14,
        color: '#203864'
    },
    ButtonPrimary: {
        height: 43,
        width: 180,
        fontSize: 14
    },
    ModalConfirm: {
        borderTopLeftRadius: '60%',
        borderTopRightRadius: '60%',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        marginTop: '-130px',
        height: '195px',
    },
    ModalContentStyle: {
        width: '350px'
    },
    textButton: { TextAlign: 'center'}
};

export default SyncProduct;