import colors from '@/utils/colors';
import styled from 'styled-components';

const OrderInfo = {
    Container: styled.div`
        margin-bottom: 16px;
        border-bottom: 1px solid ${colors.gray}
    `,
    ContainerTime: styled.div`
        display: flex;
        flex-direction: row;
    `,
    ContainerDate: styled.div`
        display: flex;
        flex-direction: column;
    `
};

export const styles = {
    textSmall: {
        fontSize: 12,
        marginTop: -16,
        lineHight: '16px'
    }
};

export default OrderInfo;