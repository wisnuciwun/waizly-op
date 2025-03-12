import colors from '@/utils/colors';
import { CSSProperties } from 'react';
import styled from 'styled-components';

const Create = {
    Container: styled.div`
        background-color: white;
        padding: 20px;
        border: solid 1px ${colors.gray};
        border-radius: 4px;
    `,
    ContainerWithLineBottom: styled.div<{noBorder?: boolean}>`
        margin-bottom: 16px;
        margin-top: 16px;
        border-bottom: ${params => (params.noBorder ?? false) ? 'none' : `1px solid ${colors.gray}`} 
    `,
    WrapperHeader: styled.div`
        display: flex;
        justify-content: space-between;
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
        color: ${colors.blue};
        font-weight: 400;
        line-height: 20px;
       
    `,
    SubsPage: styled.text`
        font-size: 12px;
        color: #BDC0C7;
        font-weight: 400;
        line-height: 20px;
    `,
    HeaderTitle: styled.h2<{fontSize?: number}>`
        overflow-wrap: break-word;
        font-size: ${params => params.fontSize ?? '32px'}
    `,
    SubTitle: styled.p<{color?: string, fontSize?:string, fontWeight?: string, marginTop?: string, marginBottom?: string}>`
        color: ${params => params.color ?? colors.black};
        font-size: ${params => params.fontSize ?? '14px'};
        font-weight: ${params => params.fontWeight ?? 'normal'};
        margin-top:  ${params => params.marginTop ?? '0px'};
        margin-bottom:  ${params => params.marginBottom ?? '0px'} !important;
    `,
    Table: styled.table`
        border: solid 1px ${colors.gray};
        border-radius: 4px;
        width: 100%;
        overflow-x: auto;
    `,
    ContainerRightFooter: styled.div`
        display: flex;
        justify-content: flex-end;
        justify-items: right;
        gap:1rem;
    `,
    TextFooterRight: styled.text`
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        text-align: right;
        margin-top: 8px;
        color: ${colors.black};
    `,
};

export const styles: { [key: string]: CSSProperties } = {
    ButtonAction: {
        fontWeight: 700,
        width: 124,
        marginRight: 10,
        justifyContent: 'center',
        fontSize: 14,
        gap: '0.5rem'
    },
    IconCheckStyle: {
        color: '#FFF'
    },
    WrapperInboundNotes: {
        overflow: 'hidden', 
        wordWrap: 'break-word'
    },
    listHeader: {
        padding: 8,
        margin: 8,
        fontWeight: '400',
        color: '#4C4F54',
        fontSize: 12
    },
    header: {
        whiteSpace: 'nowrap',
        backgroundColor: colors.lightGray,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    RequiredStyle: {
        color: colors.red
    },
    ModalBodyStyle: {
        width: 400,
        borderTopLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: '-125px',
        marginLeft: '-25px',
        marginBottom: 24,
        paddingRight: 44,
        paddingLeft: 44
    },
    ModalContentStyle: {
        width: '350px'
    },
};

export default Create;