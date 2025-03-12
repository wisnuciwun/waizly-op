export const styles: { [key: string]: React.CSSProperties } = {
  CardWraper: {
    height: '325px',
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
    paddingLeft: '10px',
    width: '70%',
  },
  wrapperTextInfo: {
    paddingTop: '3px',
  },
  WrapperIcon: {
    marginLeft: '10px',
  },
  TextInfo: {
    fontSize: '12px',
    color: '#4C4F54',
  },
};

export const iconStyles = (color: string, backgroundColor: string) => ({
  color: color,
  backgroundColor: backgroundColor,
  padding: '10px',
  borderRadius: '100%',
});

export const textCount = (color: string) => ({
  color: color,
  fontSize: '16px',
  fontWeight: 'bold',
});
