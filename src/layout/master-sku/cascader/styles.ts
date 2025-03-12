import colors from '@/utils/colors';
import styled from 'styled-components';

const Create = {
    ListItemCascader : styled.li<{isBackGroundColor:boolean}>`
        padding-right: 1rem;
        padding-left: 1rem;
        padding-top: 6px;
        padding-bottom: 6px;
        cursor: pointer;
        background-color: ${params => (params.isBackGroundColor) ? colors.lightGray : 'transparent'}; 
    `,
    ContainerWrapperList: styled.div<{isNotOverFlow: boolean; isBorderNone: boolean, width: string}>`
        width: ${params => params?.width ?? '250px'};
        height: 200px;
        overflow-y: ${params => (params.isNotOverFlow) ? '' : 'auto' };
        border-right: ${params => (params.isBorderNone) ? 'none' : `1px solid ${colors.gray}`};
    `,
    TextList: styled.p<{isFontBold: boolean}>`
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: ${params => (params.isFontBold) ? 'bold' : 'normal' };
    `

};

export default Create;