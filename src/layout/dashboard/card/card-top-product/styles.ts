export const styles: { [key: string]: React.CSSProperties } = {
  CardWraper: {
    height: '325px',
  },
  WrapperList: {
    overflowX: 'hidden',
    position: 'relative',
    maxHeight: '270px',
  },
  CustomOverflowY: {
    overflowY: 'auto',
    maxHeight: '100%',
    position: 'absolute',
    width: 'calc(100% - 1rem)',
    top: 55,
    left: '0.5rem',
    right: '0.5rem',
    bottom: 0,
  },
  TitleProductWrapper: {
    width: '50%',
    textWrap: 'nowrap',
  },
  MarketPlaceImage: {
    paddingLeft: '5px',
    paddingTop: '3px',
  },
  Price: {
    fontSize: '12px',
    marginRight: '10px',
  },
  Amount: {
    marginRight: '10px',
  },
  wrapperNoData: {
    textAlign: 'center',
    marginTop: '2.7rem',
    color: '#4C4F54',
  },
  textNoData: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '12px',
  },
  desc: {
    fontSize: '14px',
    fontWeight: '400',
    
  }
};
