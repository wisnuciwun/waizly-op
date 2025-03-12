import colors from '@/utils/colors';
import styled from 'styled-components';
import Button from '../../button';

const Create = {
  ButtonDownloadTemplate: styled(Button)`
    border: 1px solid ${colors.darkBlue};
    margin-top: 16px;
    font-size: 16px;
    width: 100%;
    justify-content: center;
  `,

  WrapperDividerWithText: styled.div`
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    color: ${colors.black};
    font-size: 12px;
  `,
  DividerX: styled.div`
    border-bottom: 1px solid ${colors.black};
    width: 40%;
    height: 12px;
  `,

  CustomInputFile: styled.span<{isColor: string}>`
    display: inline-block;
    width: 100%;
    border: 1px solid ${colors.gray};
    padding: 5px 0px 5px 11px;
    box-sizing: border-box;
    font-size: 12px;
    border-radius: 5px 0px 0px 5px;
    color: ${(props) => props.isColor ?? colors.black};
    place-content: center;
    font-weight: normal;
  `,

  CustomButtonBrowseFile: styled.span`
    width: 80px;
    font-size: 14px;
    border-radius: 0px 5px 5px 0px;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFF !important;
  `,

  WrapperAlert: styled.div`
    font-size: 12px;
    display: flex;
    gap: 12px;
    margin-top: 1rem;
    color: ${colors.blue};
  `,
};

export default Create;

export const styles = {
  IconCloudDownload: {
    color: colors.darkBlue,
  },

  IconAlert: {
    color: colors.darkBlue,
    fontSize: 20,
  },

  LabelCutomInput: {
    display: 'flex',
    fontWeight: 700,
  },

  TextDownloadInnerButton: {
    paddingLeft: 3,
    color: colors.darkBlue,
    fontWeight: 700,
    fontSize: 14,
  },

  HideOriginalInputFile: {
    display: 'none',
  },

  ButtonBack: {
    width: 168,
    fontSize: 14,
    color: colors.darkBlue,
  },

  ButtonSubmit: {
    width: 168,
    fontSize: 14,
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
};
