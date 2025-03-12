import styled from 'styled-components';

const CardLog = {
    Container: styled.div`
    background-color: white;
    border: 1px solid #DBDFEA;
    border-radius: 4px;
    padding: 20px 15px 15px 20px;
    height: 580px;
    overflow: auto;
    `,
    HeaderTitle: styled.div`
    font-size: 14px;
    color: #203864;
    font-weight: 700;
    margin-bottom: 20px;
    `,
    Content: styled.div`
    background-color: white;
    border-top: 0.5px solid #DBDFEA;
    padding: 20px 10px 20px 10px;
    cursor: pointer;
    `,
    ContainerText: styled.div`
    display: flex;
    justify-content: space-between;
    `,
    badgeVersionContainer: styled.span`
    background-color: #E1EFFA;
    color: #0372D9;
    padding: 3px 10px 3px 10px;
    border-radius: 2px;
    text-align: center;
    font-size: 10px;
    `,
};

export const styles: { [key: string]: React.CSSProperties } = {
    textHead: {
        color: '#4C4F54',
        fontSize: '14px',
        fontWeight: '700',
    },
    text: {
        fontSize: '10px',
        lineHeight: '20px',
        color: '#4C4F54',
        paddingLeft: '7px'
    },
    badgeVersion: {
        backgroundColor: '#E1EFFA',
        padding: '3px',
        borderRadius: '2px',
        fontSize: '12px',
        fontWeight: '700',
    },
    textVersion: {
        color: '#0372D9',
        fontSize: '12px',
        fontWeight: '700',
    },
    badge: {
        backgroundColor: '#D5FDFF',
        color: '#00A7E1',
        padding: '3px 10px 3px 10px',
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: '12px',
        borderRadius: '2px'
    }
};

export default CardLog;