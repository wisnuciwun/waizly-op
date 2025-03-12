import styled from 'styled-components';

const Create = {
    ContainerFilter: styled.div`
      display: flex;
      margin-left: 16px;
      flex-direction: row;
      gap: 4px;
      justify-content: center;
      cursor: pointer;
      padding-left: 4px;
    `,
    Text: styled.text`
      font-size: 14px;
      font-weight: 700;
      color: #203864;
    `
  };

export const styles = {
  overlay: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    width: '440px',
    backgroundColor: 'white',
  },
  header: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '16px',
    letterSpacing: '2.2px',
    color: '#4C4F54'
  },
  listGroup: {
    height: '250px',
    overflowY: 'auto'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 30px',
  },
  label: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  buttonContainer: {
    width: '100%',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  resetButton: {
    fontSize: '14px'
  },
};

export default Create;