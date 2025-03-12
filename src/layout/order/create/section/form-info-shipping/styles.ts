import colors from '@/utils/colors';
import styled from 'styled-components';

const ShippingInfo = {
  Container: styled.div`
    margin-bottom: 16px;
  `,
  ContainerSearch: styled.div`
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.19);
    width: 100%;
    height: 200px;
    margin-top: -20px;
    background-color: ${colors.white};
    border-radius: 8px;
    padding: 12px;
    gap: 8px;
    overflow: scroll;
    border: 1px solid ${colors.gray100};
    &:focus {
      outline: none;
      border-color: ${colors.gray100};
    }
  `,
  ContainerSearchCourier: styled.div`
    z-index: 10000;
    position: absolute;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.19);
    width: 360px;
    height: 200px;
    margin-top: -20px;
    background-color: ${colors.white};
    border-radius: 8px;
    gap: 8px;
    overflow: scroll;
    border: 1px solid ${colors.gray100};
    &:focus {
      outline: none;
      border-color: ${colors.gray100};
    }
  `,
  ContainerList: styled.div`
        padding-bottom: 4px;
        padding-top: 4px;
        border-bottom: 1px solid ${colors.gray};
        cursor: pointer;
        background-color: ${colors.white}
        &:hover: {
            background-color: ${colors.gray100}
        }
    `,
  Title: styled.text`
    font-size: 12px;
    font-weight: 700;
    line-height: 10px;
    color: ${colors.black};
  `,
  Subtitle: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: ${colors.gray};
  `,
  ContainerHeaderSearch: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    gap: 6px;
    border-bottom: 1px solid ${colors.gray};
  `,
  dot: styled.div`
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background-color: #bdc0c7;
  `,
  TitleSearch: styled.text`
    font-size: 12px;
    font-weight: 400;
    color: #bdc0c7;
  `,
};

export const styles = {
  required: {
    color: colors.red,
  },
  loading: {
    marginLeft: 150,
    marginTop: 60,
  },
  Container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default ShippingInfo;
