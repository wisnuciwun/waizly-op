import colors from '@/utils/colors';
import styled from 'styled-components';

const Create = {
  Container: styled.div`
    background-color: white;
    padding: 20px;
    border: solid 1px ${colors.gray};
    border-radius: 4px;
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    color: ${colors.black};
    font-weight: 400;
    line-height: 20px;
  `,
  SubsPage: styled.text`
    font-size: 12px;
    color: #bdc0c7;
    font-weight: 400;
    line-height: 20px;
  `,
  Browser: styled.div`
    background-color: white;
    border: dashed 1px ${colors.gray};
    border-radius: 8px;
    height: 254px;
    cursor: pointer;
  `,
  ContainerAdd: styled.div`
    margin-top: 16px;
  `,
  TitleCreate: styled.div`
    font-size: 14px;
    line-height: 22px;
    font-weight: 700;
    color: ${colors.darkBlue};
  `,
  SubtitleCreate: styled.div`
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    color: ${colors.black};
  `,
  ContainerButton: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 24px;
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
    cursor: 'pointer',
  },
  ButtonTertiary: {
    height: 43,
    fontSize: 14,
    color: '#203864',
    border: 'solid 2px #203864',
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
    width: '350px',
  },
  ModalParseDataContentStyle: {
    width: '100%',
  },
  ModalParseDataBodyStyle: {
    marginTop: '-30px',
    borderTopLeftRadius: '10%',
    borderTopRightRadius: '10%',
    borderBottomLeftRadius: '10%',
    borderBottomRightRadius: '10%',
    width: '100%',
  },

  textButton: { TextAlign: 'center' },
  // left: {
  //     width: '70%'
  // }
  // left: {
  //     width: '70%'
  // }
};

export default Create;
