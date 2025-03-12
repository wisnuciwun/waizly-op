/* eslint-disable react-hooks/exhaustive-deps */
// react
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

// layout
import Content from '@/layout/content/Content';

// component
import {
  Block,
  BlockHeadContent,
  BlockTitle,
  Button,
  Head,
  InfoWarning,
  ModalCancel,
  ModalConfirm,
} from '@/components';
import { Row, Col, Badge, Label, Input } from 'reactstrap';
import { Icon } from '@/components';

// assets
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifHeavyBox from '@/assets/gift/heavy-box.gif';
import successGif from '@/assets/gift/success-create-sku.gif';

// utils
import classNames from 'classnames';
import { usePermissions } from '@/utils/usePermissions';

// redux & service
import {
  approveOrder,
  cancelOrder,
  getOrderDetail,
} from '@/services/inventory';
import {
  SKUTableBody,
  SKUTableHeader,
} from '@/components/organism/inventory-purchasing';
import {
  TableHistoryBodyInventory,
  TableHistoryHead,
} from '@/components/molecules/table/table-inventory';
import { convertTimestampNotGMT } from '@/utils/convertTimeStamp';

const PurchasementDetail = () => {
  const inputRef = useRef<any>(null);
  const permissions = usePermissions();
  const route = useRouter();
  const searchParams = useSearchParams();
  const [cancelReason, setcancelReason] = useState('');
  const [isModalCancel, setisModalCancel] = useState(false);
  const [acceptPurchasment, setacceptPurchasment] = useState(false);
  const idSearch = searchParams.get('id');
  const [produkData, setprodukData] = useState<any>(null);
  const [ismodalSuccess, setismodalSuccess] = useState(false);
  const [successModalText, setsuccessModalText] = useState('');

  const handleCancelOrder = async () => {
    const payload = {
      reject_reason: cancelReason,
    };
    setsuccessModalText('Berhasil Membatalkan Pembelian');
    setisModalCancel(false);

    await cancelOrder(produkData?.purchase_header_id, payload).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setismodalSuccess(true);
        setTimeout(() => {
          route.push('/inventory/list-table/pembelian');
        }, 3000);
      }
    });
  };

  const handleApproveOrder = async () => {
    setsuccessModalText('Berhasil Menyetujui Pembelian');
    setacceptPurchasment(false);

    await approveOrder(produkData?.purchase_header_id).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setismodalSuccess(true);
        setTimeout(() => {
          route.push('/inventory/list-table/pembelian');
        }, 3000);
      }
    });
  };

  const getOrderbyId = async () => {
    if (idSearch != null) {
      await getOrderDetail(idSearch).then((res) => {
        if (res?.status == 200) {
          setprodukData(res.data);
        }
      });
    }
  };

  const statusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'menunggu persetujuan':
        return { color: '#FFB703', backgroundColor: '#FFF2C6' };
      case 'dibatalkan':
        return { color: '#FF6E5D', backgroundColor: '#FFE3E0' };
      case 'disetujui':
        return { color: '#36C068', backgroundColor: '#E2FFEC' };
      case 'selesai':
        return { color: '#36C068', backgroundColor: '#E2FFEC' };
      case 'menunggu inbound':
        return { color: '#00A7E1', backgroundColor: '#D5FDFF' };
      default:
        return { backgroundColor: '#CFFAFE', color: '#969FAF' };
    }
  };

  useEffect(() => {
    getOrderbyId();
  }, [idSearch]);

  const tableClass = classNames({
    table: true,
  });

  return (
    <>
      <Head title="Detail Pembelian" />
      <Content>
        <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
        <Block size="lg">
          <div>
            <Row>
              <Col>
                <div className="wrapper-bg-light">
                  <div className="d-flex justify-content-between flex-wrap align-items-center">
                    <div style={{ color: '#203864', fontSize: 12 }}>
                      INVENTORI&nbsp;&nbsp;/&nbsp;&nbsp;PEMBELIAN&nbsp;&nbsp;/&nbsp;&nbsp;
                      <span style={{ color: '#BDC0C7' }}>Detail Pembelian</span>
                    </div>
                    {produkData?.status.toLowerCase() ==
                      'menunggu persetujuan' && (
                      <div
                        style={{ height: 50 }}
                        className="d-flex gap-1 align-items-center"
                      >
                        <Button
                          className={`btn-outline-primary justify-content-center ${!permissions?.includes('Ubah Pembelian') &&
                            'btn-disabled'}`}
                          style={{ width: 104, fontSize: 14, borderRadius: 3 }}
                          onClick={() =>
                            route.push(
                              `/inventory/edit?id=${produkData?.purchase_header_id}`
                            )
                          }
                          disabled={
                            !permissions?.includes('Ubah Pembelian') 
                          }
                        >
                          <Icon name="edit" />
                          &nbsp;&nbsp;Edit
                        </Button>
                        <Button
                          className={`btn-primary justify-content-center ${!permissions?.includes('Setujui Pembelian') &&
                            'btn-disabled'}`}
                          style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                          onClick={() => setacceptPurchasment(true)}
                          disabled={
                            !permissions?.includes('Setujui Pembelian') 
                          }
                        >
                          <Icon name="check-c text-white" />
                          &nbsp;&nbsp;Setujui
                        </Button>
                        <Button
                          className={`btn-danger justify-content-center ${!permissions?.includes('Batalkan Pembelian') &&
                            'btn-disabled'}`}
                          style={{ width: 125, fontSize: 14, borderRadius: 3 }}
                          onClick={() => setisModalCancel(true)}
                          disabled={
                            !permissions?.includes('Batalkan Pembelian') 
                          }
                        >
                          Batalkan
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="product-info mt-4">
                    <BlockTitle fontSize={32}>
                      {produkData?.purchase_code.toString()}
                    </BlockTitle>
                  </div>
                  <div>
                    <ul className="d-flex g-3 gx-2">
                      <li>
                        <div style={{ fontSize: 14 }}>
                          <span
                            style={{
                              marginRight: '10px',
                              color: '#4C4F54',
                            }}
                          >
                            Gudang Tujuan:{' '}
                            <span
                              style={{
                                fontWeight: 'normal',
                                color: '#4C4f54',
                              }}
                            >
                              {produkData?.location}
                            </span>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="product-meta"
                    style={{
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      scrollbarWidth: 'none',
                    }}
                  >
                    <ul className="d-flex g-1 gx-4">
                      <li>
                        <div style={{ color: '#4C4F54' }} className="fs-14px">
                          Inbound ID
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                        >
                          {produkData?.inbound_code
                            ? produkData?.inbound_code
                            : '-'}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 110 }}
                          className="fs-14px"
                        >
                          Status Pembelian
                        </div>
                        <div className="fw-bold">
                          <Badge
                            className="badge-dim"
                            color=""
                            style={{
                              fontWeight: 'inherit',
                              backgroundColor: statusBadge(produkData?.status)
                                .backgroundColor,
                              border: 'none',
                              color: statusBadge(produkData?.status).color,
                              fontSize: 12,
                            }}
                          >
                            {produkData?.status.toUpperCase()}
                          </Badge>
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 95 }}
                          className="fs-14px"
                        >
                          Status Inbound
                        </div>
                        <div className="fw-bold">
                          {produkData?.status_inbound ? (
                            <Badge
                              className="badge-dim"
                              color=""
                              style={{
                                fontWeight: 'inherit',
                                backgroundColor: statusBadge(
                                  produkData?.status_inbound
                                ).backgroundColor,
                                border: 'none',
                                color: statusBadge(produkData?.status_inbound)
                                  .color,
                                fontSize: 12,
                              }}
                            >
                              {produkData?.status_inbound?.toUpperCase()}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </div>
                      </li>
                      <li>
                        <div style={{ color: '#4C4F54' }} className="fs-14px">
                          Jumlah
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                        >
                          {produkData?.total_quantity}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 95 }}
                          className="fs-14px"
                        >
                          Waktu Dipesan
                        </div>
                        <div
                          className="fs-14px fw-bold"
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                        >
                          {produkData?.purchase_date}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 90 }}
                          className="fs-14px"
                        >
                          Waktu Dibuat
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                        >
                          {produkData?.created_at &&
                            convertTimestampNotGMT(produkData?.created_at)}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{
                            color: '#4C4F54',
                            minWidth: 70,
                          }}
                          className="fs-14px"
                        >
                          External ID
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                            width:
                              produkData &&
                              produkData?.external_purchase_code?.length > 20
                                ? 150
                                : produkData?.external_purchase_code?.length
                                    .length < 10
                                ? 70
                                : 100,
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                          }}
                        >
                          {produkData?.external_purchase_code}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 80 }}
                          className="fs-14px"
                        >
                          Dibuat Oleh
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                          className="text-overflow-three"
                        >
                          {produkData?.created_by}
                        </div>
                      </li>
                      <li>
                        <div
                          style={{ color: '#4C4F54', minWidth: 90 }}
                          className="fs-14px"
                        >
                          Disetujui Oleh
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#4C4F54',
                          }}
                          className="text-overflow-three"
                        >
                          {produkData?.approved_by
                            ? produkData?.approved_by
                            : '-'}
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="d-flex g-1 gx-4">
                      <li
                        style={{ overflow: 'hidden', wordWrap: 'break-word' }}
                      >
                        <div
                          className="fs-14px"
                          style={{ color: '#4C4F54', marginTop: '10px' }}
                        >
                          Catatan Pembelian:
                        </div>
                        <div className="fs-14px" style={{ color: '#4C4F54' }}>
                          {produkData?.notes}
                        </div>
                      </li>
                    </ul>
                  </div>
                  <hr />
                  <div className="product-details entry me-xxl-3 mt-1">
                    <p
                      style={{
                        fontSize: 20,
                        color: '#4C4F54',
                        fontWeight: '700',
                      }}
                    >
                      Detail SKU
                    </p>
                  </div>
                  <Col lg={12} className="pt-2">
                    <BlockHeadContent>
                      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                        <table className={`${tableClass}`}>
                          <SKUTableHeader />
                          <SKUTableBody produkData={produkData} />
                        </table>
                      </div>
                    </BlockHeadContent>
                  </Col>
                  <hr />
                  <Col lg={12}>
                    <BlockHeadContent>
                      <Label
                        className="form-label"
                        htmlFor="fv-topics"
                        style={{ fontWeight: 'bold', fontSize: '20px' }}
                      >
                        Riwayat Aktivitas
                      </Label>
                      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                        <table className={`${tableClass}`}>
                          <TableHistoryHead />
                          <TableHistoryBodyInventory produkData={produkData} />
                        </table>
                      </div>
                    </BlockHeadContent>
                  </Col>
                  <Col lg={12} className="pt-5">
                    <div className="d-flex justify-content-end">
                      <span
                        style={{
                          textAlign: 'right',
                        }}
                      >
                        <ul className="nk-block-tools g-3">
                          <li>
                            <span
                              style={{
                                fontWeight: 'bolder',
                                marginRight: '35px',
                              }}
                              onClick={() => route.back()}
                            >
                              <Link href="" className=" text-color-primary">
                                Kembali
                              </Link>
                            </span>
                          </li>
                        </ul>
                      </span>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </div>
        </Block>
      </Content>
      {isModalCancel && (
        <ModalCancel
          toggle={false}
          iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
          icon={gifConfirm}
          buttonConfirmation={true}
          textCancel="Kembali"
          textSubmit="Konfirmasi Pembatalan"
          disableBtnSubmit={cancelReason == ''}
          useTimer={false}
          btnSubmitWidth={'65%'}
          btnCancelWidth={'35%'}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-115px',
            height: 365.413,
          }}
          footerStyle={{ marginTop: 30 }}
          modalContentStyle={{ width: 400, height: 650 }}
          widthImage={400}
          heightImage={333}
          title={'Apakah Kamu Yakin?'}
          handleClickCancelled={() => setisModalCancel(false)}
          handleClickYes={handleCancelOrder}
          buttonConfirmStyle={{
            backgroundColor: cancelReason == '' ? '' : '#FF6E5D',
            color: 'white',
            border: 'none',
            height: 46,
          }}
          subtitle={
            'Apakah kamu yakin ingin membatalkan pembelian? Silakan isi alasan pembatalan pembelian'
          }
        >
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Alasan Pembatalan<span style={{ color: 'red' }}>*</span>
          </div>
          <Input
            innerRef={inputRef}
            type="textarea"
            value={cancelReason}
            maxLength={200}
            style={{ padding: 8, marginTop: 10, fontSize: 12 }}
            onChange={(e: any) => setcancelReason(e.target.value)}
          />
        </ModalCancel>
      )}
      {acceptPurchasment && (
        <ModalCancel
          toggle={false}
          icon={gifHeavyBox}
          buttonConfirmStyle={{ height: 46 }}
          textSubmit="Setuju"
          modalContentStyle={{ width: 400, height: 474 }}
          iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
          footerStyle={{ marginTop: 25 }}
          widthImage={400}
          heightImage={333}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-120px',
            height: 194.413,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu setujui pembelian, status pembelian tidak dapat diubah kembali'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setacceptPurchasment(false)}
          handleClickYes={handleApproveOrder}
        />
      )}
      {ismodalSuccess && (
        <ModalConfirm
          hideCallback={() => {
            setismodalSuccess(false);
          }}
          subtitle=""
          useTimer={true}
          toggle={false}
          icon={successGif}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
            marginLeft: '-25px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={successModalText}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};

export default PurchasementDetail;
