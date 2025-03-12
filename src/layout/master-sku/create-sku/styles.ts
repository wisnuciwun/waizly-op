import colors from '@/utils/colors';
import styled from 'styled-components';

const Create = {
    ContainerWithLineBottom: styled.div<{noBorder?: boolean}>`
        margin-bottom: 16px;
        margin-top: 16px;
        border-bottom: ${params => (params.noBorder ?? false) ? 'none' : `1px solid ${colors.gray}`} 
    `,
    ContainerHoverRemoveAction: styled.div`
        position: absolute;
        cursor: pointer;
        top: 0;
        height: 153px;
        width: 153px;
    `,
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
    Browser: styled.div<{iserrorupload?:boolean}>`
        background-color: white;
        border: dashed 1px ${params => params.iserrorupload ? colors.red : colors.gray};
        border-radius: 8px;
        height: 153px;
        align-content: center;
        cursor: pointer;
        width: 153px;
    `,
    ContainerAdd: styled.div`
        margin-top: 16px;
        margin-bottom: 16px;
    `,
    TitleCreate: styled.div`
        font-size: 14px;
        line-height: 22px;
        font-weight: 700;
        color: ${colors.darkBlue}
    `,
    SubtitleCreate: styled.div`
        margin-bottom: 8px;
        font-size: 12px;
        line-height: 20px;
        font-weight: 400;
        color: ${colors.black}
    `,
    ContainerFooter: styled.div<{edit: boolean}>`
        display: flex;
        flex-direction: row;
        justify-content: ${params => params.edit ? 'space-between' : 'end'};
        align-items: center;
        margin-top: 24px;
    `,
    ContainerButton: styled.div`
        display: flex;
        flex-direction: row;
        gap: 16px;
        justify-content: end;
    `,
    History: styled.text`
        font-size: 12px;
        line-height: 20px;
        font-weight: 400;
        color: ${colors.blue};
        text-decoration: underline;
        cursor: pointer;
        margin-top: 16px;
    `,
    ContainerTime: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
    TitleTime: styled.text`
        font-size: 12px;
        line-height: 20px;
        font-weight: 700;
        color: ${colors.black};
    `,
    WrapperImageContainer: styled.div`
        text-align: center;
        width: 153px;
    `
};

export const styles = {
    Image : {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 6
    },
    TextDescriptionTitle : {
        color : colors.black,
        fontSize: 12,
    },
    TextRequired: {
        color: colors.red
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
    ValueTime: {
        fontSize: 12,
        fontWeight: 400,
        marginLeft: '2px'
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
    LabelTextCheckbox:{
        color: colors.black,
        fontSize: 12,
    },
    SpacingDividerCheckbox: {
        marginBottom: '1rem'
    },
    label: {
        fontWeight: 'bold'
    }
};

export default Create;