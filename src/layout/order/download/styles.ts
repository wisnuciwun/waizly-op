import colors from '@/utils/colors';
import styled from 'styled-components';

const Upload = {
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
        color: ${colors.darkBlue};
        font-weight: 400;
        line-height: 20px;
    
    `,
    SubsPage: styled.text`
        font-size: 12px;
        color: #BDC0C7;
        font-weight: 400;
        line-height: 20px;
    `,
    ContainerUpload: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 8px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #E9E9EA;
    `,
    ValueUpload: styled.text<{active: boolean}>`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: ${props => props.active ? colors.black : '#E9E9EA'}
    `,
    ContainerButton: styled.div`
        height: 38px;
        width: 78px;
        background-color: ${colors.darkBlue};
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        justify-content: center;
        cursor: pointer;
    `,
    TextButton: styled.text`
        font-size: 13px;
        font-weight: 400;
        line-height: 22px;
        color: ${colors.white};
        text-align: center;
    `,
    Description: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        color: #4C4F54;

    `,
    ContainerAction: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    `,
    ContainerRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    `,
    ContainerInfo: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
    ButtonDownload: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 43px;
        width: 189px;
        border-radius: 4px;
        align-items: center;
        border: 1px solid ${colors.darkBlue};
        gap: 8px;
        cursor: pointer;
    `,
    TextDownload: styled.text`
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: ${colors.darkBlue}
    `,
    TextUnderline: styled.text`
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: ${colors.darkBlue};
        text-decoration: underline;
        cursor: pointer;
    `,
    TextInfo: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        color: #4C4F54;
    `,
    ContainerTable: styled.div`
        border: solid 1px ${colors.gray};
        margin-top: 16px;
    `,
    BadgeStatus: styled.div<{success: boolean}>`
        background-color: ${props => props.success ? '#E2FFEC' : '#FFE9D0'};
        height: 20px;
        width: 65px;
        display: flex;
        flex-directon: row;
        align-items: center;
        align-content: center;
        justify-content: center;
    `,
    TextStatus: styled.text<{success: boolean}>`
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${props => props.success ? '#36C068' : '#EF7A27'};
    `,
    ContainerBadgeResult: styled.div`
        display: flex;
        flex-direction: row;
    `,
    BadgeResult: styled.div<{success: boolean}>`
        background-color: ${props => props.success ? '#E2FFEC' : '#FFE3E0'};
        height: 20px;
        width: ${props => props.success ? '97px' : '81px'};
        padding-left: 8px;
        padding-right: 8px;
        display: flex;
        flex-directon: row;
        align-items: center;
        align-content: center;
        justify-content: center;
    `,
    TextResult: styled.text<{success: boolean}>`
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        color: ${props => props.success ? '#36C068' : '#FF6E5D'};
    `,

};

export const styles = {
    ButtonSecondary: {
        height: 43,
        width: 180,
        fontSize: 14,
        color: '#203864'
    },
    ButtonPrimary: {
        height: 43,
        width: 207,
        fontSize: 14
    },
    ContainerTable: {
        overflowX: 'auto',
        maxWidth: '100%' 
    },
    Table: {
        border: '1px solid #E9E9EA'
    },
    Body: {
        whiteSpace: 'nowrap'
    },
    Id: {
        width: 168,
        paddingTop: 12
    },
    Name: {
        width: 184,
        paddingTop: 12
    },
    Status: {
        width: 107,
        paddingTop: 12
    },
    Action: {
        width: 172
    },
    required: {
        color: colors.red
    },
    ModalConfirm: {
        width: 400,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: '-100px',
        paddingBottom: 0,
        height: '155px',
        marginLeft: '-25px',
        paddingLeft: 36,
        paddingRight: 36,
        marginBottom: 13,
    },
    ModalConfirmSuccess: {
        width: 400,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: '-100px',
        paddingBottom: 0,
        height: '175px',
        marginLeft: '-25px',
        paddingLeft: 36,
        paddingRight: 36,
        marginBottom: 13,
    },
    ModalLoading: {
        width: 450,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: '-100px',
        paddingBottom: 0,
        height: '116px',
        marginLeft: '-25px',
        paddingLeft: 36,
        paddingRight: 36,
        marginBottom: 13,
    },
    ModalContentStyle: {
        width: '350px'
    },
    ModalContentStyleWaiting: {
        width: '400px'
    },
    textList: {
        fontSize: '14px',
        fontWeight: '400',
        marginTop: '4px'
    }

};

export default Upload;