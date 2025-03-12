import colors from '@/utils/colors';
import styled from 'styled-components';

const PDF = {
  Container: styled.div`
    width: 561px;
    height: 793px;
    margin: 16px;
    border: 1px dashed ${colors.black};
    padding: 16px;
  `,
  Header: styled.div<{ isDeliveryManual: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: ${(props) =>
      props.isDeliveryManual ? 'center' : 'space-between'};
    padding: 16px;
    align-items: center;
    border: 1px solid ${colors.black};
    border-bottom: none;
  `,
  ContainerImage: styled.div`
    padding-top: 3px;
    width: 130px;
    height: 32px;
  `,
  Content: styled.div`
    border: 1px solid ${colors.black};
  `,
  ResiContainer: styled.div`
    display: flex;
    flex-direction: row;
    height: 158px;
    border-bottom: 1px solid ${colors.black};
  `,
  QrCode: styled.div`
    width: 38%;
    height: 158px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid ${colors.black};
    overflow: hidden;
  `,
  LabelQr: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: ${colors.black};
    text-align: center;
  `,
  TextValue: styled.text`
    font-size: 12px;
    font-weight: 800;
    line-height: 18px;
    color: #191a15;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  Barcode: styled.div`
    width: 62%;
    height: 158px;
    padding: 8px;
  `,
  ContentBarcode: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
  `,
  ContainerTextDate: styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
  `,
  TextDate: styled.text`
    font-size: 10px;
    font-weight: 400;
    line-height: 20px;
    color: ${colors.black};
  `,
  ContainerText: styled.text`
    max-width: 204px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2px;
  `,
  TextBarcode: styled.text<{ hideBarcode: boolean }>`
    max-width: 240px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    color: #191a15;
    margin-top: ${(props) => (props.hideBarcode ? 44 : 16)}px;
  `,
  TextValueBarcode: styled.text`
    font-size: 12px;
    font-weight: 800;
    line-height: 18px;
    color: #191a15;
    text-align: center;
    overflow-wrap: break-word;
  `,
  ContainerAddress: styled.div`
    display: flex;
    flex-direction: row;
    padding: 8px;
    border-bottom: 1px solid ${colors.black};
  `,
  SellerAddres: styled.div`
    width: 40%;
    display: flex;
    padding-right: 4px;
    flex-direction: column;
  `,
  CustomerAddres: styled.div`
    width: 60%;
    display: flex;
    padding-right: 8px;
    padding-left: 8px;
    flex-direction: column;
    overflow-wrap: break-word;
  `,
  TextName: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #191a15;
    overflow-wrap: break-word;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  ContainerTextAddress: styled.div`
    display: flex;
    flex-direction: row;
    gap: 2px;
  `,
  LabelAddress: styled.text`
    width: 44px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #191a15;
  `,
  ValueAddress: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: #191a15;
    overflow-wrap: break-word;
    word-break: break-all;
  `,
  ContainerDetail: styled.div`
    display: flex;
    flex-direction: row;
    padding: 8px;
    gap: 16px;
  `,
  TextWeight: styled.text`
    width: 50%;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: #191a15;
  `,
  HeadText: styled.text`
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: #191a15;
  `,
  HeaderText: styled.text`
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    color: #191a15;
    text-align: center;
  `,
  Body: styled.text`
    font-size: 12px;
    font-weight: 400;
    line-height: 10px;
    color: #191a15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  RowList: styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
  `,
  RowNumber: styled.div`
    width: 26px;
  `,
  RowName: styled.div`
    width: 420px;
    white-space: nowrap;
    overflow: hidden;
  `,
  RowTotal: styled.div`
    width: 60px;
    text-align: center;
  `,
};

export const styles = {
  textBarcode: {
    fontWeight: 800,
    overflowWrap: 'break-word',
  },
  spinner: { height: 70, marginLeft: 280, marginTop: 20 },
  modal: { maxWidth: 662, height: 400 },
  modalBody: {
    maxHeight: 110,
    overflow: 'hidden',
    zIndex: 99,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
};

export default PDF;
