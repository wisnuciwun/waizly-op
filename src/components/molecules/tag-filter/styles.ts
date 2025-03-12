import colors from '@/utils/colors';
import styled from 'styled-components';

const TagsFilter = {
    Container: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
    Tag: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 3px 16px;
        background-color: ${colors.darkBlue};
        border: 1px solid ${colors.darkBlue};
        border-radius: 4px;
    `,
    TagSecondary: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px 16px;
        gap: 8px;
        border: 1px solid ${colors.darkBlue};
        background-color: ${colors.white};
        border-radius: 4px;
        cursor: pointer;
    `,
    Title: styled.text`
        color: ${colors.white};
        font-size: 12px;
        line-height: 20px;
    `,
    TitleSecondary: styled.text`
        color: ${colors.darkBlue};
        font-size: 12px;
        line-height: 20px;
    `,
};

export default TagsFilter;