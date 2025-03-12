import colors from '@/utils/colors';
import styled from 'styled-components';


export const TransferInfo = {
  Container: styled.div`
      margin-bottom: 16px;
      border-bottom: 1px solid ${colors.gray}
  `,
  ContainerTime: styled.div`
      display: flex;
      flex-direction: row;
  `,
  ContainerDate: styled.div`
      display: flex;
      flex-direction: column;
  `
};


export const stylesFormInventory = {
    listHeader: {
      padding: 8,
      margin: 8,
      fontWeight: '400',
      color: '#4C4F54',
      fontSize: 12,
    },
    headerAction: {
      width: 48,
      marginLeft: 4,
    },
    header: {
      whiteSpace: 'nowrap',
      backgroundColor: colors.lightGray,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    underline: {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };