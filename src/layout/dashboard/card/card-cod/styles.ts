import colors from '@/utils/colors';

export const styles: { [key: string]: React.CSSProperties } = {
  CardWraper: {
    height: '325px',
  },
  titleCard: {
    marginLeft: '-5px',
  },
  WrapperList: {
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '270px',
  },
  WrapperItem: {
    borderTop: '1px solid #DBDFEA',
    paddingLeft: '10px',
  },
  TitleProductWrapper: {
    marginLeft: '5px',
    paddingLeft: '10px',
    width: '60%',
  },
  WrapperIcon: {
    marginLeft: '10px',
  },
  TextTotalCod: {
    fontSize: '13px',
    color: colors.black,
  },
  skeletonLoadingWrapp: {
    marginRight: '15px',
  },
  wrapperNoData: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#4C4F54',
  },
  textNoData: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '12px',
  },
  textSubNoData: {
    fontSize: '13px',
  },
};

export const iconStyles = (color: string, backgroundColor: string) => ({
  color: color,
  backgroundColor: backgroundColor,
  padding: '10px',
  borderRadius: '10%',
  marginRight: '20px',
});

export const textCountCodStyles = (color: string) => ({
  color: color,
  paddingTop: '6px',
  paddingLeft: '7px',
  fontSize: '20px',
  fontWeight: 'bold',
});
