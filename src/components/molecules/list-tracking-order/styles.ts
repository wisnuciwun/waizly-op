import colors from '@/utils/colors';
import styled from 'styled-components';

const TrackingOrder = {
    Container: styled.div`
        position: relative;
        display: flex;
        flex-direction: row;
    `,
    ContainerDate: styled.div<{active: boolean}>`
        width: 68px;
        margin-right: ${props => props.active ? '13px' : '12px'};
        text-align-last: right;
    `,
    TextDate: styled.text`
        font-size: 11px;
        font-weight: 400;
        line-height: 20px;
        padding-right: 6px;
        text-align: right;
        margin-top: 16px;
        color: #BDC0C7;
        text-align-last: right;
    `,
    ContainerStatus: styled.div<{active: boolean, withoutBorder?: boolean;}>`
        display: flex;
        flex-direction: column;
        padding-left: 32px;
        padding-bottom: 24px;
        border-left: ${props => props.withoutBorder ? '4px' : '0px'} solid ${props => props.active ? '#FBBA2D' : colors.darkBlue};
    `,
    ContainerDot: styled.div<{active: boolean}>`
        position: absolute;
        left: ${props => props.active ? '63px' : '64px'};
        top: -8px;
        padding: ${props => props.active ? '8px' : '12px'};
        border-radius: 100%;
        background-color: ${colors.white};
        width: ${props => props.active ? '44px' : '36px'};
        height: ${props => props.active ? '44px' : '36px'};
    `,
    Status: styled.div<{active: boolean}>`
        border-radius: 100%;
        padding-left: 5px;
        padding-top: 2px;
        width: ${props => props.active ? '24px' : '12px'};
        height: ${props => props.active ? '24px' : '12px'};
        background-color:  ${props => props.active ? '#FBBA2D' : colors.darkBlue};
    `,
    Title: styled.text<{active: boolean}>`
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${props => props.active ? '#FBBA2D' : colors.black}
    `,
    SubTitle: styled.li<{active: boolean}>`
        padding-left: 7px;
        font-size: 12px;
        font-weight: 400;
        size: 12px;
        line-height: 20px;
        color: #4C4F54
    `
};

export default TrackingOrder;