import colors from '@/utils/colors';
import styled from 'styled-components';

const TableProductInventoryInbound =  {
    Container: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;
    padding: 8px;
    gap: 10px;
    border-bottom: 2px solid ${colors.lightGray};
`,
Info: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    // width: 500px;
    white-space: nowrap;
`,
ContainerInfo: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`,
Title: styled.text`
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    color: ${colors.black};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
    width: ${({ width }) => width || '100%'};
`,
ContainerInput: styled.div`
    width: 110px;
    padding: 8px;
`,
SubTitle: styled.div`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    margin-right: 2px;
    color: ${colors.black};
    overflow: hidden;
    text-overflow: ellipsis; 
`,
SubTitleColors: styled.div`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    margin-right: 2px;
    overflow: hidden;
    text-overflow: ellipsis; 
`,
Message: styled.text`
    font-size: 10px;
    font-weight: 400;
    line-height: 20px;
    color: ${colors.red}
`,
Trash: styled.div`
    max-width: 24px;
    max-height: 24px;
    margin-right: 16px;
    margin-left: auto;
    margin-top: -2px;
    cursor: pointer;
`,
    ContainerRightFooter: styled.div`
    display: flex;
    justify-content: flex-end;
    justify-items: right;
    gap:1rem;
    width:100%;
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
    `,
    Table: styled.table`
    border: solid 1px ${colors.gray};
    border-radius: 4px;
    width: 100%;
    overflow-x: auto;
`,

};

export const styles = {
    input: {
        width: 150
    },
    subs: {
        width: 120,
        padding: 8
    },
    listHeader: {
        padding: 8,
        margin: 8,
        fontWeight: '400',
        color: '#4C4F54'
    },
    
    header: {
        whiteSpace: 'nowrap',
        backgroundColor: colors.lightGray,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
};

export default TableProductInventoryInbound;