import colors from '@/utils/colors';
import styled from 'styled-components';

const Product = {
    Container: styled.div`
        padding: 16px 16px 0px 16px;
        border: dashed 1px ${colors.gray};
        height: 251px;
        border-radius: 4px;
    `,
    Table: styled.table`
        border: solid 1px ${colors.gray};
        border-radius: 4px;
        width: 100%;
        overflow-x: auto;
    `,
    ContainerHeader: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background-color: ${colors.lightGray};
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    `,
    LabelHead: styled.div`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.black}
    `,
    ContainerBody: styled.div`
        width: 100%;
        overflow-x: auto;
    `,
    ContainerFooter: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 16px;
    `,
    ContainerRightFooter: styled.div`
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        justify-items: right;
    `,
    TextFooter: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${colors.blue}
    `,
    TextFooterRight: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        text-align: right;
        margin-top: 8px;
        color: ${colors.black};
    `,
    TextFooterRightError: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        text-align: right;
        color: ${colors.red};
    `
};

export const styles = {
    container: {
        overflowX: 'auto',
    },
    table: {
        border: '1px solid #E9E9EA',
        borderRadius: 4,
        width: '100%',
        overflowX: 'auto'
    },
    listHeader: {
        padding: 8,
        margin: 8,
        fontWeight: '400',
        color: '#4C4F54'
    },
    headerAction: {
        width: 48,
        marginLeft: 4
    },
    header: {
        whiteSpace: 'nowrap',
        backgroundColor: colors.lightGray,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    infoSection: {
        width: 230
    },
    inputSection: {
        width: 104
    },
    action: {
        width: 40,
    },
    required: {
        color: colors.red
    },
    underline: {
        textDecoration: 'underline',
        cursor: 'pointer'
    }
};

export default Product;