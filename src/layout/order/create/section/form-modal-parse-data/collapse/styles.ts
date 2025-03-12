import styled from 'styled-components';

const Create = {
  Container: styled.div`
    margin-top: 20px;
    margin-bottom: 25px;
    background-color: white;
    padding: 13px;
    border-radius: 5px;
  `,
  ContainerContent: styled.div`
    font-size: 12px;
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 12px;
    padding: 25px;
    border-radius: 5px;
    color: #4c4f54 !important;
    background-color: #f5f6fa;
  `,
  ContainerTitle: styled.span`
    font-size: 12px;
    color: #4c4f54 !important;
  `,
  Title: styled.span`
    font-weight: bold;
  `, 
};

export const styles: { [key: string]: React.CSSProperties } = {
  titleExample: {
    fontSize: 12,
    cursor: 'pointer',
    marginLeft: '2px',
  },
  Collapse: {
    width: '100%',
    position: 'absolute',
    left: 0,
  },
  Button: {
    position: 'absolute',
    right: 35,
    top: 45,
    color: '#203864',
    border: 'solid 2px #203864',
    justifyContent: 'center',
    width: 77,
  },
  TitleButton: {
    color: '#203864',
    fontSize: 12
  },
  Icon: {
    color: '#203864',
    marginLeft: -3
  },
};

export default Create;
