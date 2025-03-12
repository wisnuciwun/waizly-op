import colors from '@/utils/colors';
import styled from 'styled-components';

const Empty= {
    Container: styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 170px;
    `,
    Image: styled.img.attrs(({src}) => ({
        alt: 'image-product',
        src: src
    }))`
        width: 120px;
        height: 80px;
        align-self: center;
    `,
    Text: styled.p`
        color: ${colors.black};
        font-size: 13px;
        margin-top: 8px;
    `
};

export default Empty;