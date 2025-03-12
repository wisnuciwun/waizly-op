import colors from '@/utils/colors';
import styled from 'styled-components';

const TableUpload = {
  ContainerAction: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  Container: styled.div`
    border: solid 1px ${colors.gray};
    margin-top: 16px;
  `,
  BadgeStatus: styled.div<{ success: boolean }>`
    background-color: ${(props) => (props.success ? '#E2FFEC' : '#FFE9D0')};
    height: 20px;
    width: 65px;
    display: flex;
    flex-directon: row;
    align-items: center;
    align-content: center;
    justify-content: center;
  `,
  TextStatus: styled.text<{ success: boolean }>`
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: ${(props) => (props.success ? '#36C068' : '#EF7A27')};
  `,
  ContainerBadgeResult: styled.div`
    display: flex;
    flex-direction: row;
  `,
  BadgeResult: styled.div<{ success: boolean }>`
    background-color: ${(props) => (props.success ? '#E2FFEC' : '#FFE3E0')};
    height: 20px;
    width: ${(props) => (props.success ? '97px' : '81px')};
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-directon: row;
    align-items: center;
    align-content: center;
    justify-content: center;
  `,
  TextResult: styled.text<{ success: boolean }>`
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: ${(props) => (props.success ? '#36C068' : '#FF6E5D')};
  `,
  ContainerEmpty: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    gap: 8px;
    margin: 24px;
  `,
  TextEmpty: styled.text`
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: ${colors.black};
  `,
  TextInfo: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #4c4f54;
  `,
  ContainerInfo: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  `,
};

export const styles = {
  ButtonSecondary: {
    height: 43,
    width: 180,
    fontSize: 14,
    color: '#203864',
  },
  ButtonPrimary: {
    height: 43,
    width: 180,
    fontSize: 14,
  },
  ContainerTable: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
  Table: {
    border: '1px solid #E9E9EA',
  },
  Body: {
    whiteSpace: 'nowrap',
  },
  Id: {
    width: 168,
    paddingTop: 12,
  },
  Name: {
    width: 184,
    paddingTop: 12,
  },
  Status: {
    width: 107,
    paddingTop: 12,
  },
  Action: {
    width: 172,
  },
  TableScroll: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
  ModalLoading: {
    width: 400,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -225,
    paddingBottom: 40,
  },
  ModalContentStyleWaiting: {
    width: 400,
    height: 440,
  },
};

export default TableUpload;
