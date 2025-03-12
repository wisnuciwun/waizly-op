export const styles: { [key: string]: React.CSSProperties } = {
  Wrapper: {
    paddingBottom: '85px',
  },
  WrapperText: {
    position: 'absolute',
    textAlign: 'center',
    top: '60%',
    marginLeft: '-18px',
  },
  Text: {
    fontSize: '13px',
    color: '#4C4F54',
    marginTop: '10px',
    marginBottom: 4
  },
  Count: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4C4F54',
  },
  Headertitle: {
    fontSize: '14px',
    color: '#4C4F54',
    fontWeight: 'bold',
  },
  Headersub: {
    fontSize: '12px',
    color: '#4C4F54',
  },
  emptyTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4C4F54',
  },
  emptySubTitle: {
    color: '#4C4F54',
    padding: '24px',
    fontSize: '12px',
  },
  container: {
    marginTop: 24
  }
};

export const getLineGradientStyle = (index: number): React.CSSProperties => {
  switch (index % 4) {
    case 0:
      return {
        height: '4px',
        backgroundImage: 'linear-gradient(to right, #816BFF, #FF63A5 100%)',
        width: '100%',
      };
    case 1:
      return {
        height: '4px',
        backgroundImage: 'linear-gradient(to right, #FF63A5, #FFA353 100%)',
        width: '100%',
      };
    case 2:
      return {
        height: '4px',
        backgroundImage: 'linear-gradient(to right, #FFA353, #20C997 100%)',
        width: '100%',
      };
    // case 3:
    //   return {
    //     height: "4px",
    //     backgroundImage:
    //       "linear-gradient(to right, #f364ae, #ffa057 100%, #ffa057)",
    //     width: "100%",
    //   };
    // case 4:
    //   return {
    //     height: "4px",
    //     backgroundImage: "linear-gradient(to right, #ffa057, #2fc693 100%)",
    //     width: "100%",
    //   };
    default:
      return {};
  }
};

export const iconStyles = (color: string, backgroundColor: string) => ({
  color: color,
  backgroundColor: backgroundColor,
  padding: '10px',
  borderRadius: '100%',
});

export const wrapperButtonIcon = (borderColor: string) => ({
  border: `2px dashed ${borderColor}`,
  borderRadius: '100%',
  padding: '3px',
});
