/* eslint-disable react-hooks/exhaustive-deps */
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useQRCode } from 'next-qrcode';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody, Spinner } from 'reactstrap';
import PDF, { styles } from './styles';
import Image from 'next/image';
import Barcode from 'react-barcode';
import logoWaizly from '@/assets/images/logo/waizly-logo-full.svg';
import moment from 'moment';
import colors from '@/utils/colors';
import { debounce } from 'lodash';
import { ShippingProps } from '@/utils/type/order';
import { changeToFormatPhone, curencyRupiah } from '@/utils/formater';
import { imageCourier } from './constants';

interface Props {
  isShow: boolean;
  items: ShippingProps;
}
const ModalShipping = ({ isShow, items }: Props) => {
  const { Canvas } = useQRCode();
  const [totalMoreList, setTotalMoreList] = useState(0);
  const layout = useRef(null);
  const layoutExtra = useRef(null);
  const content = useRef(null);
  const heightDefaultContent = 220;
  const debounced = useRef(debounce((list) => printDocument(list), 600));

  const handleCountList = () => {
    const countAddressSeller = items.recipient_full_address
      ? parseInt((items.shipper_address?.length / 23).toFixed(0))
      : 0;
    const countAddressBuyer = items.shipper_address
      ? parseInt(
          (
            `${items.recipient_full_address}${items.recipient_remarks}`.length /
            48
          ).toFixed(0)
        )
      : 0;
    const addresses =
      countAddressBuyer > countAddressSeller
        ? countAddressBuyer
        : countAddressSeller;

    const contentHeight = addresses > 0 ? addresses * 20 : 20;
    const listHeight = 20;
    const totaHeightSpace = heightDefaultContent - contentHeight;

    if (totaHeightSpace > 0) {
      const listTotal = totaHeightSpace / listHeight;
      const total = listTotal > 1 ? parseInt(listTotal.toFixed(0)) + 4 : 4;
      setTotalMoreList(total);
      debounced.current(total);
    } else {
      setTotalMoreList(4);
      debounced.current(4);
    }
  };

  const printDocument = async (list: number) => {
    const input = layout.current;
    const inputExtra = layoutExtra.current;
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a5',
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      await html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      });

      if (items.items?.length > list)
        await html2canvas(inputExtra).then((canvas) => {
          const imgDataExtra = canvas.toDataURL('image/png');
          pdf.addPage();
          pdf.addImage(imgDataExtra, 'PNG', 0, 0, width, height);
        });

      window.open(pdf.output('bloburl'));
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleCountList();
    }, 1500);
  }, []);

  return (
    <div>
      <Modal size="md" isOpen={isShow} style={styles.modal}>
        <ModalBody style={styles.modalBody}>
          <div style={styles.spinner}>
            <Spinner size={'lg'} color="white" />
          </div>
          <PDF.Container className="pdf-main" ref={layout}>
            <PDF.Header isDeliveryManual={items?.delivery_method_id == 2}>
              {items?.delivery_method_id == 1 ? (
                <>
                  <PDF.ContainerImage>
                    <Image src={logoWaizly} width={130} alt="illustration" />
                  </PDF.ContainerImage>
                  {items.routing_code && <PDF.HeaderText>{items.routing_code}</PDF.HeaderText>}
                  
                  <PDF.ContainerImage>
                    <Image
                      src={imageCourier(items.logistic_provider_name)}
                      width={96}
                      alt="illustration"
                    />
                  </PDF.ContainerImage>
                </>
              ) : (
                <PDF.HeaderText>{'PENGIRIMAN MANUAL'}</PDF.HeaderText>
              )}
            </PDF.Header>
            <PDF.Content>
              <PDF.ResiContainer>
                <PDF.QrCode>
                  <Canvas
                    text={items.original_order_code || '-'}
                    options={{
                      errorCorrectionLevel: 'M',
                      width: 122,
                      margin: 3,
                      color: {
                        dark: '#000000',
                        light: colors.white,
                      },
                    }}
                  />
                  <PDF.LabelQr>{'Nomor Pesanan:'}</PDF.LabelQr>
                  <PDF.TextValue>
                    {items.original_order_code || '-'}
                  </PDF.TextValue>
                </PDF.QrCode>
                <PDF.Barcode>
                  <PDF.ContainerTextDate>
                    <PDF.TextDate>
                      {'Pesanan Dibuat: ' +
                        moment(items.checkout_at).format('DD MMM YYYY')}
                    </PDF.TextDate>
                  </PDF.ContainerTextDate>

                  <PDF.ContentBarcode>
                    {items.tracking_number?.length > 0 ? (
                      <Barcode
                        height={
                          items.tracking_number?.length < 28
                            ? 70
                            : items.tracking_number?.length < 38
                            ? 90
                            : 120
                        }
                        value={items.tracking_number || ''}
                        displayValue={false}
                        lineColor="black"
                      />
                    ) : null}
                    <PDF.TextBarcode
                      hideBarcode={items.tracking_number?.length == 0}
                    >
                      {'No. Resi: '}
                      <span
                        style={{ fontWeight: 800, overflowWrap: 'break-word' }}
                      >
                        {items.tracking_number || '-'}
                      </span>
                    </PDF.TextBarcode>
                  </PDF.ContentBarcode>
                </PDF.Barcode>
              </PDF.ResiContainer>
              <PDF.ContainerAddress ref={content}>
                <PDF.SellerAddres>
                  <PDF.TextName>
                    {'Nama Pengirim: '}
                    <span style={{ fontWeight: 800 }}>
                      {items.shipper_name || '-'}
                    </span>
                  </PDF.TextName>
                  <PDF.TextName>
                    {'No. HP: ' + changeToFormatPhone(items.shipper_phone)}
                  </PDF.TextName>
                  <PDF.ContainerTextAddress>
                    {/* <PDF.LabelAddress>{'Alamat:'}</PDF.LabelAddress> */}
                    <PDF.ValueAddress>
                      {'Alamat: ' + (items.shipper_address || '-')}
                    </PDF.ValueAddress>
                  </PDF.ContainerTextAddress>
                </PDF.SellerAddres>
                <PDF.CustomerAddres>
                  <PDF.TextName>
                    {'Nama Penerima: '}
                    <span style={{ fontWeight: 800 }}>
                      {items.recipient_name || '-'}
                    </span>
                  </PDF.TextName>
                  <PDF.TextName>
                    {'No. HP: ' + changeToFormatPhone(items.recipient_phone)}
                  </PDF.TextName>
                  <PDF.ContainerTextAddress>
                    {/* <PDF.LabelAddress>{'Alamat:'}</PDF.LabelAddress> */}
                    <PDF.ValueAddress>
                      {'Alamat: ' +
                        (items.recipient_full_address
                          ? `${items.recipient_full_address} ${
                              items.recipient_remarks
                                ? `( ${items.recipient_remarks} )`
                                : ''
                            }`
                          : '-')}
                    </PDF.ValueAddress>
                  </PDF.ContainerTextAddress>
                </PDF.CustomerAddres>
              </PDF.ContainerAddress>
              <PDF.ContainerDetail>
                <PDF.TextWeight>{`Berat: ${items.package_weight}gr`}</PDF.TextWeight>
                <PDF.TextWeight>{`COD: ${
                  items.payment_method === 'COD'
                    ? 'Rp ' + curencyRupiah(items.cod_fee)
                    : '-'
                }`}</PDF.TextWeight>
              </PDF.ContainerDetail>
            </PDF.Content>
            <PDF.RowList className={'mt-2 border-bottom border-dark'}>
              <PDF.RowNumber>
                <PDF.HeadText>{'#'}</PDF.HeadText>
              </PDF.RowNumber>
              <PDF.RowName>
                <PDF.HeadText>{'Nama SKU'}</PDF.HeadText>
              </PDF.RowName>
              <PDF.RowTotal>
                <PDF.HeadText>{'Jumlah'}</PDF.HeadText>
              </PDF.RowTotal>
            </PDF.RowList>
            {items.items?.length > 0 &&
              items.items.map((data, index) => (
                <>
                  {index < totalMoreList && (
                    <PDF.RowList
                      key={index}
                      className={'border-bottom border-dark'}
                      id={'list'}
                    >
                      <PDF.RowNumber>
                        <PDF.Body>{index + 1}</PDF.Body>
                      </PDF.RowNumber>
                      <PDF.RowName>
                        <PDF.Body>{data.product_name}</PDF.Body>
                      </PDF.RowName>
                      <PDF.RowTotal>
                        <PDF.Body>{data.quantity}</PDF.Body>
                      </PDF.RowTotal>
                    </PDF.RowList>
                  )}
                </>
              ))}

            <div className={'text-end mt-1'}>
              <PDF.Body>{'Total: ' + items.items?.length}</PDF.Body>
            </div>
          </PDF.Container>
          {items.items?.length > totalMoreList && (
            <PDF.Container className="pdf-main" ref={layoutExtra}>
              {items.items?.length > 0 &&
                items.items.map((data, index) => (
                  <>
                    {index >= totalMoreList && (
                      <PDF.RowList
                        key={index}
                        className={'border-bottom border-dark'}
                        id={'list'}
                      >
                        <PDF.RowNumber>
                          <PDF.Body>{index + 1}</PDF.Body>
                        </PDF.RowNumber>
                        <PDF.RowName>
                          <PDF.Body>{data.product_name}</PDF.Body>
                        </PDF.RowName>
                        <PDF.RowTotal>
                          <PDF.Body>{data.quantity}</PDF.Body>
                        </PDF.RowTotal>
                      </PDF.RowList>
                    )}
                  </>
                ))}
              <div className={'text-end mt-1'}>
                <PDF.Body>{'Total: ' + items.items?.length}</PDF.Body>
              </div>
            </PDF.Container>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalShipping;
