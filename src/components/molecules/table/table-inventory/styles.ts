import colors from '@/utils/colors';
import styled from 'styled-components';

const TableProduct =  {
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
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    white-space: nowrap;
`,
ContainerInfo: styled.div`
    width: 85%;
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
`,
ContainerInput: styled.div`
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
`
};

export const styles = {
    input: {
        width: 100
    },
    subs: {
        width: 120,
        padding: 8
    }
};

export default TableProduct;