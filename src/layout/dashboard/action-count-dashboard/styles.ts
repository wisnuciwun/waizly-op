import colors from '@/utils/colors';
import {Card} from 'reactstrap';
import styled from 'styled-components';

const Create = {
  TitleCard: styled.p`
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
    color: ${colors.black};
    margin-bottom: 4px;
  `,

  SubTitleCard: styled.p`
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: ${colors.black};
  `,

  CardAction: styled.div`
    border-radius: 4px;
    padding: 20px;
    border: 1px solid ${colors.gray200};
  `,

  ValueText: styled.span<{isColor: string}>`
    max-width: 100%;
    font-weight: 700;
    color: ${(props) => props.isColor ?? '#000'} !important;
    font-size: 32px !important;
  `,

  CardCountAction: styled(Card)<{isColorBorder: string; isBackgroundColor: string}>`
    border: 1px solid ${colors.gray200};
    &:hover {
      border: 1px solid ${(props) => props.isColorBorder} !important;
      background-color: ${(props) => props.isBackgroundColor};
      cursor: pointer;
    }
  `,
};

export default Create;

export const styles = {
  TitleCard: {
    fontSize: 14,
    lineHeight: '22px',
    fontWeight: '700',
    color: colors.black
  },
  TooltipCanvasField: {
    width: '12rem',
    borderRadius: 8,
    textAlign: 'start',
  },
  CountWrapperHeight: {
    display: 'flex',
    gap: '1rem',
  },
  CountWrapperColumn: {
    width: '50%',
  },
  TruncateLimitText: {
    maxWidth: '100%',
  },
  BarChart: {
    height: 73,
  },
  container: {
    gap: '12px'
  },
  containerCard: {
    padding: '20px'
  }
};
