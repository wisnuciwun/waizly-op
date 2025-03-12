/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import Content from '@/layout/content/Content';
import {
  Block,
  BlockHeadContent,
  Button,
  BlockBetween,
  Head,
} from '@/components';
import { Row, Col, Badge, Label, Spinner } from 'reactstrap';
import colors from '@/utils/colors';
import {
  getDetailOrder,
  getHistoryOrder,
  trackingHistory,
} from '@/services/order/index';
import Link from 'next/link';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import moment from 'moment';
import { formatCurrency } from '@/utils/formatCurrency';
import { Icon } from '@/components';
import ModalTrackingOrder from './components/modal-tracking-order';
import { usePermissions } from '@/utils/usePermissions';
import { orderStatus } from '@/utils';
import { getCODPriceByCourier } from '@/services/order';
import {
  dataTabsIconBermasalah,
  dataTabsIconDiproses,
  dataTabsIconPembatalan,
  dataTabsIconPengiriman,
  dataTabsIconSelesai,
} from '@/components/molecules/tabs/data-tabs-pesanan';
// img
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Shopifyy from '@/assets/images/marketplace/shopify-small.svg';
import Tokopedia from '@/assets/images/marketplace/tokopedia-small.svg';
import Shopee from '@/assets/images/marketplace/shopee-small.svg';
import Lazada from '@/assets/images/marketplace/lazada-small.svg';
import Tiktok from '@/assets/images/marketplace/tiktok-small.svg';
import Offline from '@/assets/images/marketplace/offline-small.svg';
import Other from '@/assets/images/marketplace/other-small.svg';
import SocialCommerce from '@/assets/images/marketplace/offline-small.svg';
// assets
import successGif from '@/assets/gift/success-create-sku.gif';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const editProduk = () => {
  const permissions = usePermissions();
  const route = useRouter();
  const [produkData, setDataProduk] = useState({});
  const [historyOrder, setDataHistory] = useState({});
  const searchParams = useSearchParams();
  const [listHistoryOrder, setListHistoryOrder] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const idSearch = searchParams.get('id');
  const [codPercent, setCodPercent] = useState(0);
  const { client_id } = useSelector((state) => state.auth.user);

  const getOrderbyId = async () => {
    try {
      if (!idSearch) {
        console.error('idSearch is not available');
        return;
      }

      const response = await getDetailOrder(idSearch);

      if (response.status === 200) {
        const produkData = response.data.order;
        if (produkData.delivery_info?.logistic_carrier) {
          const codPercents = await handleGetCodPrice(
            produkData?.delivery_info?.logistic_provider_name || '',
          );
          setCodPercent(codPercents);
        }

        setDataProduk(produkData);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
      return [];
    }
  };

  const handleGetCodPrice = async (courier) => {
    const response = await getCODPriceByCourier(client_id, courier);
    return parseFloat(response?.data[0]?.cod_percentage || 0);
  };
  const getHistorybyId = async () => {
    setLoadingHistory(true);
    try {
      if (!idSearch) {
        console.error('idSearch is not available');
        return;
      }

      const response = await getHistoryOrder(idSearch);
      console.log('getHistoryOrder', response);

      if (response.status === 200) {
        const historyOrder = response.data;
        console.log('historyOrder', historyOrder);
        setDataHistory(historyOrder);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
      return [];
    } finally {
      setLoadingHistory(false);
    }
  };

  const truncateVariantName = (product_name) => {
    return product_name.length > 25
      ? `${product_name.substring(0, 25)}...`
      : product_name;
  };

  const renderTableHeader = () => {
    return (
      <thead className="table-primary" style={{ border: '1px solid #E9E9EA' }}>
        <tr style={{ whiteSpace: 'nowrap' }}>
          <th>Informasi SKU</th>
          <th>Jumlah</th>
          <th>Berat Satuan (g)</th>
          <th>Harga Satuan</th>
          <th>Sub Total Produk</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody style={{ whiteSpace: 'nowrap' }}>
        {produkData.items &&
          produkData.items.map((items, idx) => (
            <tr key={idx} style={{ border: '1px solid #E9E9EA' }}>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '20rem',
                    maxWidth: '20rem',
                  }}
                >
                  <div
                    className="master-sku-product-table-card"
                    style={{
                      minWidth: '20rem',
                      maxWidth: '20rem',
                      marginRight: '30px',
                    }}
                  >
                    <Image
                      src={ilustrationCamera}
                      width={44}
                      alt="product-sku"
                    />
                    <div className="master-sku-product-table-info text-truncate">
                      {truncateVariantName(items?.product_name || '-')}
                      <br />
                      <span style={{ fontWeight: 400, fontSize: '12px' }}>
                        Kode SKU: {items?.sku || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '5rem',
                    maxWidth: '5rem',
                  }}
                >
                  {items.qty || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Informasi berat satuan (g) */}
                  {items.unit_weight || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Informasi harga satuan */}
                  Rp {formatCurrency(parseFloat(items.unit_price))}{' '}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                    fontWeight: '700',
                  }}
                >
                  Rp {formatCurrency(parseFloat(items.sub_total_product_price))}{' '}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    );
  };

  const renderTableBodyCancel = () => {
    return (
      <tbody style={{ whiteSpace: 'nowrap' }}>
        {produkData.items_cancel &&
          produkData.items_cancel.map((items, idx) => (
            <tr key={idx} style={{ border: '1px solid #E9E9EA' }}>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '20rem',
                    maxWidth: '20rem',
                  }}
                >
                  <div
                    className="master-sku-product-table-card"
                    style={{
                      minWidth: '20rem',
                      maxWidth: '20rem',
                      marginRight: '30px',
                    }}
                  >
                    <Image
                      src={ilustrationCamera}
                      width={44}
                      alt="product-sku"
                    />
                    <div className="master-sku-product-table-info text-truncate">
                      {truncateVariantName(items?.product_name || '-')}
                      <br />
                      <span style={{ fontWeight: 400, fontSize: '12px' }}>
                        Kode SKU: {items?.sku || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '5rem',
                    maxWidth: '5rem',
                  }}
                >
                  {items.qty || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Informasi berat satuan (g) */}
                  {items.unit_weight || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Informasi harga satuan */}
                  Rp {formatCurrency(parseFloat(items.unit_price))}{' '}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                    fontWeight: '700',
                  }}
                >
                  Rp {formatCurrency(parseFloat(items.sub_total_product_price))}{' '}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    );
  };

  //history order
  const renderTableHeaderHistory = () => {
    return (
      <thead className="table-primary" style={{ border: '1px solid #E9E9EA' }}>
        <tr style={{ whiteSpace: 'nowrap' }}>
          <th>Aktivitas</th>
          <th>Dilakukan Oleh</th>
          <th>Waktu</th>
          <th>Status Pesanan</th>
        </tr>
      </thead>
    );
  };

  const handleTrackOrder = async () => {
    setShowOrderHistory(true);
    setLoadingHistory(true);
    const response = await trackingHistory(idSearch);
    setListHistoryOrder(response?.data?.tracking_order || []);
    setLoadingHistory(false);
  };

  const statusBadge = (code) => {
    switch (code) {
      case orderStatus.SIAP_DIPROSES:
      case orderStatus.BELUM_DIBAYAR:
      case orderStatus.UNMAPPING_PRODUK:
      case orderStatus.UNMAPPING_GUDANG:
      case orderStatus.OUT_OF_STOCK:
        return {
          style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.DIPROSES:
        return {
          style: { backgroundColor: '#FFE9D0', color: '#EF7A27' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.MENUNGGU_RESI:
      case orderStatus.MENUNGGU_KURIR:
        // case orderStatus.SIAP_DIKIRIM:
        return {
          style: { backgroundColor: '#D5FDFF', color: '#00A7E1' },
          text: dataTabsIconPengiriman
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.SEDANG_DIKIRIM:
      case orderStatus.PENGIRIMAN_SELESAI:
        return {
          style: { backgroundColor: '#E1EFFA', color: '#0372D9' },
          text: dataTabsIconPengiriman
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.DITERIMA:
        return {
          style: { backgroundColor: '#E2FFEC', color: '#36C068' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.DALAM_PENGEMBALIAN:
        return {
          style: { backgroundColor: '#E9E9EA', color: '#4C4F54' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.DIBATALKAN:
      case orderStatus.PENGAJUAN_PEMBATALAN:
        return {
          style: { backgroundColor: '#FFE3E0', color: '#FF6E5D' },
          text: dataTabsIconPembatalan
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.UNMAPPING_ORDER:
        return {
          style: { backgroundColor: '#FFE9D0', color: '#EF7A27' },
          text: dataTabsIconBermasalah
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.SELESAI_DIKEMBALIKAN:
        return {
          style: { backgroundColor: '#E2FFEC', color: '#36C068' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
      default:
        return {
          style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == code)[0]
            ?.label?.toUpperCase(),
        };
    }
  };

  const renderTableBodyHistory = () => {
    return (
      <tbody style={{ whiteSpace: 'nowrap' }}>
        {historyOrder.history_list &&
          historyOrder.history_list.map((datas, idx) => (
            <tr key={idx} style={{ border: '1px solid #E9E9EA' }}>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '15rem',
                    maxWidth: '15rem',
                  }}
                >
                  {datas.activity || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text text-truncate">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Menampilkan nama lengkap */}
                  {datas.full_name || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Menampilkan waktu */}
                  {moment(datas.created_at).format('DD/MM/YYYY HH:mm')}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  {/* Menampilkan status pesanan */}
                  <Badge
                    className="badge-dim"
                    color=""
                    style={{
                      fontWeight: 'bold',
                      border: 'none',
                      color: statusBadge(datas.status_id).style.color,
                      backgroundColor: statusBadge(datas.status_id).style
                        .backgroundColor,
                    }}
                  >
                    {statusBadge(datas.status_id).text}
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    );
  };

  const disableEditOrder = (status, delivery, location, permission) => {
    if (status == orderStatus.SIAP_DIPROSES && permission) {
      return false;
    } else {
      if (delivery == 2 && location != 2 && permission) {
        return false;
      }
    }

    return true;
  };

  const courierBadgeStatus = (value = '') => {
    const status = value? value.toUpperCase() : '';

    if (status === 'ENTRY') {
      return { bg: '#FFF2C6', font: '#FFB703' };
    } else if (status === 'PICKUP CONFIRMED' || status === 'AWAITING PICKUP') {
      return { bg: '#FFE9D0', font: '#EF7A27' };
    } else if (status === 'PICKED UP') {
      return { bg: '#D5FDFF', font: 'PICKED UP' };
    } else if (status === 'IN TRANSIT' || status === 'ON DELIVERY') {
      return { bg: '#E1EFFA', font: '#0372D9' };
    } else if (status === 'DELIVERED' || status === 'RETURNED') {
      return { bg: '#E2FFEC', font: '#36C068' };
    } else if (status === 'RETURN PROCESS') {
      return { bg: '#E9E9EA', font: '#4C4F54' };
    } else if (
      status === 'ISSUE' ||
      status === 'CANCEL REQUEST' ||
      status === 'CANCELED'
    ) {
      return { bg: '#FFE3E0', font: '#FF6E5D' };
    } else {
      return { bg: '#E9E9EA', font: '#4C4F54' };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (idSearch) {
        await getOrderbyId();
      }
    };

    fetchData();
  }, [idSearch]);

  useEffect(() => {
    const fetchData = async () => {
      if (idSearch) {
        await getHistorybyId();
      }
    };

    fetchData();
  }, [idSearch]);

  const tableClass = classNames({
    table: true,
  });

  const getImageSrc = (channelName = '') => {
    const formattedName = channelName.toLowerCase().replace(/\s+/g, '');
    switch (formattedName) {
      case 'tokopedia':
        return Tokopedia;
      case 'shopee':
        return Shopee;
      case 'lazada':
        return Lazada;
      case 'tiktok':
        return Tiktok;
      case 'shopify':
        return Shopifyy;
      case 'other':
        return Other;
      case 'offline':
        return Offline;
      case 'socialecommerce':
        return SocialCommerce;
      default:
        return Other;
    }
  };

  return (
    <>
      <Head title="Detail-Order" />
      <Content>
        {loadingHistory ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh',
              backgroundColor: colors.white,
            }}
          >
            <Spinner size={'lg'} color={colors.darkBlue} />
          </div>
        ) : (
          <Block>
            <div>
              <Row>
                <Col lg={8} xs={12}>
                  <div className="wrapper-bg-light">
                    <p style={{ color: '#203864', fontSize: 12 }}>
                      PESANAN /
                      <span style={{ color: '#BDC0C7' }}> Detail Pesanan</span>
                    </p>
                    <div className="product-info me-xxl-5">
                      <h2
                        className="product-title"
                        style={{ overflowWrap: 'break-word' }}
                      >
                        {' '}
                        {produkData.order_code ||
                          'Product name not available'}{' '}
                      </h2>
                    </div>
                    <div>
                      <ul className="d-flex g-3 gx-2">
                        <li>
                          <div>
                            <Image
                              src={getImageSrc(produkData?.channel_name)}
                              alt="waizly-logo"
                            />
                            <span
                              style={{
                                fontWeight: 'normal',
                                color: '#4C4f54',
                                fontSize: '12px',
                              }}
                            >
                              &nbsp;
                              {produkData.store_name ||
                                'Channel name not available'}
                            </span>
                          </div>
                        </li>
                        <li>
                          <div>
                            <span
                              style={{
                                marginRight: '10px',
                                color: '#4C4F54',
                                fontSize: '12px',
                              }}
                            >
                              Gudang:{' '}
                              <span
                                style={{
                                  fontWeight: 'normal',
                                  color: '#4C4f54',
                                  fontSize: '12px',
                                }}
                              >
                                {produkData.location_name ||
                                  'Gudang not available'}
                              </span>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="product-meta">
                      <ul className="d-flex g-1 gx-4">
                        <li>
                          <div style={{ color: '#4C4F54' }} className="fs-14px">
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
                            {moment(produkData.checkout_at).format(
                              'DD/MM/YYYY HH:mm',
                            )}
                          </div>
                        </li>
                        <li>
                          <div style={{ color: '#4C4F54' }} className="fs-14px">
                            Dibuat Melalui
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#4C4F54',
                            }}
                          >
                            {produkData.created_via || 'MANUAL'}
                          </div>
                        </li>
                        <li>
                          <div style={{ color: '#4C4F54' }} className="fs-14px">
                            Metode Pembayaran
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <Badge
                              className="badge-dim"
                              color={
                                produkData.payment_method_id == '5'
                                  ? ''
                                  : produkData.payment_method_id == '2'
                                    ? ''
                                    : produkData.payment_method_id == '4'
                                      ? ''
                                      : produkData.payment_method_id == '1'
                                        ? ''
                                        : 'secondary'
                              }
                              style={{
                                fontWeight: 'inherit',
                                backgroundColor:
                                  produkData.payment_method_id == '5'
                                    ? '#E1EFFA'
                                    : produkData.payment_method_id == '2'
                                      ? '#E1EFFA'
                                      : produkData.payment_method_id == '4'
                                        ? '#E1EFFA'
                                        : produkData.payment_method_id == '1'
                                          ? '#E1EFFA'
                                          : undefined,
                                border:
                                  produkData.payment_method_id == '5'
                                    ? 'none'
                                    : produkData.payment_method_id == '2'
                                      ? 'none'
                                      : produkData.payment_method_id == '4'
                                        ? 'none'
                                        : produkData.payment_method_id == '1'
                                          ? 'none'
                                          : undefined,
                                color:
                                  produkData.payment_method_id == '5'
                                    ? '#0372D9'
                                    : produkData.payment_method_id == '2'
                                      ? '#0372D9'
                                      : produkData.payment_method_id == '4'
                                        ? '#0372D9'
                                        : produkData.payment_method_id == '1'
                                          ? '#0372D9'
                                          : undefined,
                              }}
                            >
                              {produkData.payment_method_id == '5'
                                ? 'PREPAID'
                                : produkData.payment_method_id == '2'
                                  ? 'COD'
                                  : produkData.payment_method_id == '4'
                                    ? 'TRANSFER'
                                    : produkData.payment_method_id == '1'
                                      ? 'NON COD'
                                      : '-'}
                            </Badge>
                          </div>
                        </li>
                        <li>
                          <div style={{ color: '#4C4F54' }} className="fs-14px">
                            Status Pesanan
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <Badge
                              className="badge-dim"
                              color={
                                produkData.status_id == '18'
                                  ? 'warning'
                                  : produkData.status_id == '20'
                                    ? 'warning'
                                    : produkData.status_id == '37'
                                      ? 'warning'
                                      : produkData.status_id == '38'
                                        ? 'warning'
                                        : produkData.status_id == '42'
                                          ? 'warning'
                                          : produkData.status_id == '21'
                                            ? 'warning'
                                            : //orange
                                              produkData.status_id == '23'
                                              ? ''
                                              : produkData.status_id == '35'
                                                ? 'info'
                                                : produkData.status_id == '26'
                                                  ? 'info'
                                                  : produkData.status_id == '25'
                                                    ? 'info'
                                                    : //blue
                                                      produkData.status_id ==
                                                        '27'
                                                      ? ''
                                                      : produkData.status_id ==
                                                          '39'
                                                        ? ''
                                                        : produkData.status_id ==
                                                            '28'
                                                          ? 'success'
                                                          : //green
                                                            produkData.status_id ==
                                                              '40'
                                                            ? 'dark'
                                                            : //brown
                                                              produkData.status_id ==
                                                                '41'
                                                              ? 'danger'
                                                              : produkData.status_id ==
                                                                  '30'
                                                                ? 'danger'
                                                                : produkData.status_id ==
                                                                    '29'
                                                                  ? 'success'
                                                                  : 'secondary'
                              }
                              style={{
                                fontWeight: 'bold',
                                backgroundColor:
                                  produkData.status_id == '23'
                                    ? '#FFE9D0'
                                    : produkData.status_id == '27'
                                      ? '#E1EFFA'
                                      : produkData.status_id == '39'
                                        ? '#E1EFFA'
                                        : undefined,
                                border:
                                  produkData.status_id == '23'
                                    ? 'none'
                                    : produkData.status_id == '27'
                                      ? 'none'
                                      : produkData.status_id == '39'
                                        ? 'none'
                                        : undefined,
                                color:
                                  produkData.status_id == '23'
                                    ? '#EF7A27'
                                    : produkData.status_id == '35'
                                      ? '#00A7E1'
                                      : produkData.status_id == '26'
                                        ? '#00A7E1'
                                        : produkData.status_id == '25'
                                          ? '#00A7E1'
                                          : produkData.status_id == '27'
                                            ? '#0372D9'
                                            : produkData.status_id == '39'
                                              ? '#0372D9'
                                              : produkData.status_id == '40'
                                                ? '#4C4F54'
                                                : undefined,
                              }}
                            >
                              {produkData.status_id == '18'
                                ? 'BELUM DIBAYAR'
                                : produkData.status_id == '20'
                                  ? 'SIAP DIPROSES'
                                  : produkData.status_id == '37'
                                    ? 'UNMAPPING PRODUK'
                                    : produkData.status_id == '42'
                                      ? 'UNMAPPING PENGIRIMAN'
                                      : produkData.status_id == '38'
                                        ? 'UNMAPPING GUDANG'
                                        : produkData.status_id == '21'
                                          ? 'OUT OF STOCK'
                                          : produkData.status_id == '23'
                                            ? 'DIPROSES'
                                            : produkData.status_id == '35'
                                              ? 'PENDING LOGISTIK'
                                              : produkData.status_id == '26'
                                                ? 'MENUNGGU KURIR'
                                                : produkData.status_id == '25'
                                                  ? 'MENUNGGU RESI'
                                                  : produkData.status_id == '27'
                                                    ? 'SEDANG DIKIRIM'
                                                    : produkData.status_id ==
                                                        '39'
                                                      ? 'PENGIRIMAN SELESAI'
                                                      : produkData.status_id ==
                                                          '28'
                                                        ? 'DITERIMA'
                                                        : produkData.status_id ==
                                                            '40'
                                                          ? 'DALAM PENGEMBALIAN'
                                                          : produkData.status_id ==
                                                              '41'
                                                            ? 'PENGAJUAN PEMBATALAN'
                                                            : produkData.status_id ==
                                                                '30'
                                                              ? 'DIBATALKAN'
                                                              : produkData.status_id ==
                                                                  '29'
                                                                ? 'SELESAI DIKEMBALIKAN'
                                                                : '-'}
                            </Badge>
                          </div>
                        </li>
                        <li>
                          <div style={{ color: '#4C4F54' }} className="fs-14px">
                            Status Pengiriman
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <Badge
                              className="badge-dim"
                              color=""
                              style={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                backgroundColor: courierBadgeStatus(
                                  produkData.delivery_status,
                                ).bg,
                                color: courierBadgeStatus(
                                  produkData.delivery_status,
                                ).font,
                                border: 'none',
                              }}
                            >
                              {produkData.delivery_status || '-'}
                            </Badge>
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
                            Catatan Pesanan:
                          </div>
                          <div className="fs-14px" style={{ color: '#4C4F54' }}>
                            {produkData.remarks || '-'}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <hr />
                    <div className="product-details entry me-xxl-3 mt-5">
                      <p
                        style={{
                          fontSize: 18,
                          color: '#4C4F54',
                          fontWeight: '700',
                        }}
                        className="mb-3"
                      >
                        Detail Paket
                      </p>
                      <div>
                        <ul className="d-flex g-1 gx-1">
                          <li>
                            {produkData.package_info ? (
                              <>
                                <div>
                                  <span
                                    style={{
                                      marginRight: '10px',
                                      color: '#4C4F54',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Berat Paket:{' '}
                                    <span
                                      style={{
                                        fontWeight: 'normal',
                                        color: '#4C4f54',
                                        fontSize: '14px',
                                      }}
                                    >
                                      {produkData.package_info.package_weight ||
                                        '0.00'}{' '}
                                      gram
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span
                                    style={{
                                      marginRight: '10px',
                                      color: '#4C4F54',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Dimensi Paket:{' '}
                                    <span
                                      style={{
                                        fontWeight: 'normal',
                                        color: '#4C4f54',
                                        fontSize: '14px',
                                      }}
                                    >
                                      {produkData.package_info.package_length ||
                                        '0.00'}{' '}
                                      cm x{' '}
                                      {produkData.package_info.package_width ||
                                        '0.00'}{' '}
                                      cm x{' '}
                                      {produkData.package_info.package_height ||
                                        '0.00'}{' '}
                                      cm
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span
                                    style={{
                                      marginRight: '10px',
                                      color: '#4C4F54',
                                      fontSize: '14px',
                                    }}
                                  >
                                    Berat Ditagihkan:{' '}
                                    <span
                                      style={{
                                        fontWeight: 'normal',
                                        color: '#4C4f54',
                                        fontSize: '14px',
                                      }}
                                    >
                                      {produkData?.package_info
                                        ?.package_chargeable_weight || 0}{' '}
                                      gram
                                    </span>
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Col lg={12} className="pt-2">
                      <BlockHeadContent>
                        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                          <table className={`${tableClass}`}>
                            {renderTableHeader()}
                            {renderTableBody()}
                          </table>
                        </div>
                      </BlockHeadContent>
                      <div className="d-flex justify-content-end">
                        <span
                          style={{
                            textAlign: 'right',
                            color: '#4C4F54',
                          }}
                        >
                          <ul>
                            <li>
                              <span>
                                Total Jumlah SKU:{' '}
                                {produkData.items ? produkData.items.length : 0}
                              </span>
                            </li>
                          </ul>
                        </span>
                      </div>
                    </Col>
                    <hr />
                    {produkData?.items_cancel &&
                    produkData?.items_cancel.length > 0 ? (
                      <>
                        <Col lg={12}>
                          <BlockHeadContent>
                            <Label
                              className="form-label"
                              htmlFor="fv-topics"
                              style={{ fontWeight: 'bold', fontSize: '20px' }}
                            >
                              {'Detail Pembatalan'}
                            </Label>
                            <div
                              style={{ overflowX: 'auto', maxWidth: '100%' }}
                            >
                              <table className={`${tableClass}`}>
                                {renderTableHeader()}
                                {renderTableBodyCancel()}
                              </table>
                            </div>
                          </BlockHeadContent>
                          <div className="d-flex justify-content-end">
                            <span
                              style={{
                                textAlign: 'right',
                                color: '#4C4F54',
                              }}
                            >
                              <ul>
                                <li>
                                  <span>
                                    Total Jumlah SKU:{' '}
                                    {produkData.items_cancel
                                      ? produkData.items_cancel.length
                                      : 0}
                                  </span>
                                </li>
                              </ul>
                            </span>
                          </div>
                        </Col>
                        <hr />
                      </>
                    ) : null}

                    <Col lg={12}>
                      <BlockHeadContent>
                        <Label
                          className="form-label"
                          htmlFor="fv-topics"
                          style={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                            cursor: 'default',
                          }}
                        >
                          Log Pesanan
                        </Label>
                        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                          <table className={`${tableClass}`}>
                            {renderTableHeaderHistory()}
                            {renderTableBodyHistory()}
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
                              >
                                <Link
                                  href="/order/list-table/semua"
                                  className=" text-color-primary"
                                >
                                  Kembali
                                </Link>
                              </span>
                            </li>
                            {produkData.status_id == 20 ||
                            produkData.status_id == 23 ? (
                              <>
                                {produkData.channel_id == 10 ||
                                produkData.channel_id == 11 ||
                                produkData.channel_id == 14 ? (
                                  <li>
                                    <Button
                                      disabled={disableEditOrder(
                                        produkData.status_id,
                                        produkData.delivery_info
                                          ?.delivery_method_id,
                                        produkData.location_type_id,
                                        permissions.includes('Ubah Pesanan'),
                                      )}
                                      onClick={() =>
                                        route.push({
                                          pathname: `/order/edit/${idSearch}`,
                                          query: {
                                            status:
                                              produkData.status_id ==
                                              orderStatus.SIAP_DIPROSES
                                                ? 'SIAP_DIPROSES'
                                                : 'DIPROSES',
                                          },
                                        })
                                      }
                                      className={`btn w-100 center shadow-none btn-primary ${
                                        !permissions?.includes(
                                          'Ubah Pesanan',
                                        ) && 'btn-disabled'
                                      }`}
                                    >
                                      Ubah
                                    </Button>
                                  </li>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : null}
                          </ul>
                        </span>
                      </div>
                    </Col>
                  </div>
                </Col>
                <br />
                <Col lg={4} xs={12}>
                  <div className="wrapper-bg-light">
                    <ul>
                      <li
                        style={{
                          fontWeight: '700',
                          fontSize: '14px',
                          color: '#4C4F54',
                        }}
                      >
                        Pembeli
                      </li>
                      <li>
                        {produkData.buyer_info ? (
                          <>
                            <div
                              style={{
                                fontWeight: '700',
                                fontSize: '14px',
                                color: '#4C4F54',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {produkData.buyer_info.buyer_name || '-'}
                            </div>
                            <span style={{ overflowWrap: 'break-word' }}>
                              <br />
                              {produkData.buyer_info.buyer_phone || '-'}
                              <br />
                              {produkData.buyer_info.buyer_email || '-'}
                            </span>
                          </>
                        ) : (
                          <div>-</div>
                        )}
                      </li>
                    </ul>
                  </div>
                  <br />
                  <div className="wrapper-bg-light">
                    <BlockHeadContent>
                      {/* <BlockBetween className={"mb-2"}>
                      <>
                        <span style={{ fontWeight: "700", fontSize: "12px" }}>
                          Pemasukan &nbsp;
                        </span>
                      </>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#203864",
                                }}
                              >
                                Rp{" "}
                                {formatCurrency(
                                  parseFloat(
                                    produkData.price_info.sub_total_price
                                  ) +
                                  parseFloat(
                                    produkData.price_info.shipping_price
                                  ) +
                                  parseFloat(
                                    produkData.price_info.other_price
                                  )+
                                  parseFloat(
                                    produkData.price_info.cod_fee
                                  )
                                )}
                              </span>
                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}
                      <BlockBetween className={'mb-2'}>
                        <>
                          <span
                            style={{
                              fontWeight: '400',
                              fontSize: '12px',
                              color: '#4C4F54',
                            }}
                          >
                            Subtotal
                          </span>
                        </>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData.price_info.sub_total_price,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Total Biaya Pengiriman
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                {produkData.price_info.shipping_price ===
                                '-1.00' ? (
                                  <div>-</div>
                                ) : (
                                  <span
                                    style={{
                                      fontWeight: '400',
                                      fontSize: '12px',
                                      color: '#4C4F54',
                                    }}
                                  >
                                    Rp{' '}
                                    {formatCurrency(
                                      parseFloat(
                                        produkData.price_info.shipping_price,
                                      ),
                                    )}{' '}
                                  </span>
                                )}
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Biaya Asuransi
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(produkData.price_info.insurance_price || 0)
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Biaya Layanan
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(produkData.price_info.service_fee || 0)
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      {produkData?.payment_method_id == '2' && produkData?.channel_name === 'LAZADA' ? (
                        <>
                          <BlockBetween className={'mb-2'}>
                            <span
                              style={{
                                fontWeight: '400',
                                fontSize: '12px',
                                color: '#4C4F54',
                              }}
                            >
                              {/* {`Biaya COD (${produkData.delivery_info?.logistic_provider_name ? produkData.delivery_info?.logistic_provider_name : '-'}${produkData?.price_info?.cod_fee !== '0.00' ? ` - ${codPercent ? codPercent * 100 : 0}%` : '' })`} */}
                              {'Biaya COD'}
                            </span>
                            <ul className="nk-block-tools g-3">
                              <li>
                                {produkData.price_info ? (
                                  <>
                                    <span
                                      style={{
                                        fontWeight: '400',
                                        fontSize: '12px',
                                        color: '#4C4F54',
                                      }}
                                    >
                                      Rp{' '}
                                      {formatCurrency(
                                        parseFloat(produkData.price_info.cod_fee)
                                      )}{' '}
                                    </span>
                                  </>
                                ) : (
                                  <div>-</div>
                                )}
                              </li>
                            </ul>
                          </BlockBetween>
                        </>
                      ): null}
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Biaya Lainnya
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData.price_info.other_price,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      

                      {/* <BlockBetween className={"mb-2"}>
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "12px",
                          color: "#4C4F54",
                        }}
                      >
                        Biaya Gudang
                      </span>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#203864",
                                }}
                              >
                                -Rp{" "}
                                {formatCurrency(
                                  parseFloat(
                                    '0.00'
                                    // produkData.price_info.total_discount_price
                                  )
                                )}{" "}
                              </span>
                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}
                      {/* <BlockBetween className={"mb-2"}>
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "12px",
                          color: "#4C4F54",
                        }}
                      >
                        Biaya Layanan
                      </span>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#203864",
                                }}
                              >
                                -Rp{" "}
                                {formatCurrency(
                                  parseFloat(
                                     '0.00'
                                    // produkData.price_info.total_discount_price
                                  )
                                )}{" "}
                              </span>
                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}
                      {/* <BlockBetween className={"mb-2"}>
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "12px",
                          color: "#4C4F54",
                        }}
                      >
                        Pengembalian
                      </span>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#203864",
                                }}
                              >
                                -Rp{" "}
                                {formatCurrency(
                                  parseFloat(
                                     '0.00'
                                    // produkData.price_info.total_discount_price
                                  )
                                )}{" "}
                              </span>
                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}

                      <hr />

                      {/* <BlockBetween className={'mb-2'}>
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "12px",
                          color: "#4C4F54",
                        }}
                      >
                        Diskon Pengiriman
                      </span>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              <span
                                style={{
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  color: "#4C4F54",
                                }}
                              >
                                
                                -Rp{" "}
                                {formatCurrency(
                                  parseFloat(produkData.price_info.discount_shipping)
                                )}{" "}
                              </span>
                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}
                      {/* <BlockBetween className={"mb-1"}>
                      <>
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "12px",
                            color: "#4C4F54",
                          }}
                        >
                          Total Biaya Pengiriman
                        </span>
                      </>
                      <ul className="nk-block-tools g-3">
                        <li>
                          {produkData.price_info ? (
                            <>
                              {produkData.price_info.shipping_price === '-1.00' ? (
                                <div>-</div>
                              ) : (
                                <span
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "12px",
                                    color: "#4C4F54",
                                  }}
                                >
                                  Rp{" "}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData.price_info.shipping_price
                                    )
                                  )}{" "}
                                </span>
                              )}

                            </>
                          ) : (
                            <div>-</div>
                          )}
                        </li>
                      </ul>
                    </BlockBetween> */}

                      
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Diskon Pengiriman
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#203864',
                                  }}
                                >
                                  -Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData?.price_info?.discount_shipping,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      <BlockBetween className={'mb-2'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          Diskon Pesanan
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#203864',
                                  }}
                                >
                                  -Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData.price_info.discount_seller,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                      <BlockBetween className={'mb-2 mt-1'}>
                        <span
                          style={{
                            fontWeight: '400',
                            fontSize: '12px',
                            color: '#4C4F54',
                          }}
                        >
                          {'Biaya Packing (Kayu/Kardus/dll.)'}
                        </span>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData.price_info.packing_price,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>

                      <BlockBetween>
                        <div className="form-group mt-1">
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={'cost-shipping'}
                              checked={
                                parseFloat(
                                  produkData?.price_info?.discount_shipping ||
                                    0,
                                ) > 0
                              }
                              onChange={() => {}}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={'cost-shipping'}
                              style={{ color: '#4C4F54', paddingLeft: 4 }}
                            >
                              {'Biaya Pengiriman Ditanggung Penjual'}
                            </label>
                          </div>
                        </div>
                      </BlockBetween>
                      <BlockBetween>
                        <div className="form-group mt-1">
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={'cost-shipping'}
                              checked={
                                parseFloat(
                                  produkData?.price_info?.insurance_price ||
                                    0,
                                ) > 0
                              }
                              onChange={() => {}}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={'cost-shipping'}
                              style={{ color: '#4C4F54', paddingLeft: 4 }}
                            >
                              {'Gunakan Asuransi Pengiriman'}
                            </label>
                          </div>
                        </div>
                      </BlockBetween>
                      {/* <BlockBetween>
                      <div className="form-group mt-1">
                        <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'cost-shipping'}
                                // disabled
                                checked={true}
                                onChange={() => {}}
                            />
                            <label
                                className="custom-control-label"
                                htmlFor={'cost-shipping'}
                                style={{ color: '#4C4F54', paddingLeft: 4}}
                                >
                                {'Gunakan Asuransi Pengiriman'}
                            </label>
                        </div>
                      </div>
                    </BlockBetween> */}
                      <hr />
                      <BlockBetween>
                        <>
                          <span style={{ fontWeight: '700', fontSize: '12px' }}>
                            {produkData?.payment_method_id == '2'
                              ? 'Total Pesanan COD'
                              : 'Total Pesanan'}
                          </span>
                        </>
                        <ul className="nk-block-tools g-3">
                          <li>
                            {produkData.price_info ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '700',
                                    fontSize: '12px',
                                    color: '#203864',
                                  }}
                                >
                                  Rp{' '}
                                  {formatCurrency(
                                    parseFloat(
                                      produkData?.payment_method_id == '2'
                                        ? produkData.price_info.cod_price
                                        : produkData.price_info
                                            .grand_total_order_price,
                                    ),
                                  )}{' '}
                                </span>
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </li>
                        </ul>
                      </BlockBetween>
                    </BlockHeadContent>
                  </div>
                  <br />
                  <div className="wrapper-bg-light">
                    <ul>
                      <Styles.Container>
                        <li
                          style={{
                            fontWeight: '700',
                            fontSize: '14px',
                            color: '#4C4F54',
                          }}
                          className="mb-2"
                        >
                          Pengiriman
                        </li>
                        {(produkData.status_id == 25 ||
                          produkData.status_id == 26 ||
                          produkData.status_id == 27 ||
                          produkData.status_id == 40 ||
                          produkData.status_id == 39) &&
                        produkData?.delivery_info?.delivery_method_id == 1 ? (
                          <Styles.ContainerButton onClick={handleTrackOrder}>
                            <Styles.Text>{'Lacak'}</Styles.Text>
                            <Icon
                              style={{ color: '#203864', fontSize: 20 }}
                              name={'chevron-right'}
                            ></Icon>
                          </Styles.ContainerButton>
                        ) : null}
                      </Styles.Container>

                      <li>
                        {produkData.delivery_info ? (
                          <>
                            <span>
                              <Badge
                                className="badge-dim"
                                color={
                                  produkData.delivery_info.delivery ===
                                  'REGULER'
                                    ? 'info'
                                    : produkData.delivery_info.delivery ===
                                        'CARGO'
                                      ? 'info'
                                      : 'secondary'
                                }
                                style={{
                                  fontWeight: 'bold',
                                  color:
                                    produkData.delivery_info.delivery ===
                                    'REGULER'
                                      ? '#0372D9'
                                      : undefined,
                                }}
                              >
                                {produkData.delivery_info.delivery === 'REGULER'
                                  ? 'REGULER'
                                  : produkData.delivery_info.delivery ===
                                      'CARGO'
                                    ? 'CARGO'
                                    : '-'}
                              </Badge>
                            </span>
                            <div style={{ fontSize: '12px', color: '#4C4F54' }}>
                              {produkData.delivery_info.logistic_carrier || '-'}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#4C4F54',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                              }}
                            >
                              {produkData.delivery_info.tracking_number || '-'}
                            </div>
                            <li
                              style={{
                                fontWeight: '700',
                                fontSize: '12px',
                                color: '#4C4F54',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                              }}
                              className="mt-2"
                            >
                              {produkData.delivery_info.location}
                            </li>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#4C4F54',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                              }}
                            >
                              {produkData.delivery_info.location_address}
                            </div>
                          </>
                        ) : (
                          <div>-</div>
                        )}
                      </li>
                      <hr />
                      <li
                        style={{
                          fontWeight: '700',
                          fontSize: '14px',
                          color: '#4C4F54',
                        }}
                        className="mb-1"
                      >
                        Penerima
                      </li>
                      <li>
                        {produkData.recipient_info ? (
                          <>
                            <div
                              style={{
                                fontWeight: '700',
                                color: '#4C4F54',
                                fontSize: '12px',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {produkData.recipient_info.recipient_name || '-'}
                            </div>
                            <div style={{ color: '#4C4F54', fontSize: '12px' }}>
                              {produkData.recipient_info.recipient_phone
                                ? produkData.recipient_info.recipient_phone
                                : '-'}
                            </div>
                            <div
                              style={{
                                color: '#4C4F54',
                                fontSize: '12px',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                              }}
                            >
                              {produkData.recipient_info
                                .recipient_full_address || '-'}
                            </div>
                            <div style={{ color: '#4C4F54', fontSize: '12px' }}>
                              {produkData.recipient_info.recipient_district},{' '}
                              {produkData.recipient_info.recipient_city},{' '}
                              {produkData.recipient_info.recipient_province},{' '}
                              {produkData.recipient_info.recipient_postal_code}
                            </div>
                            <div
                              className="mt-2"
                              style={{
                                color: '#4C4F54',
                                fontSize: '12px',
                                overflow: 'hidden',
                                wordWrap: 'break-word',
                              }}
                            >
                              <span>Catatan Pengiriman: </span>
                              <br />
                              {produkData.recipient_info.recipient_remarks ||
                                '-'}
                            </div>
                          </>
                        ) : (
                          <div>-</div>
                        )}
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>
          </Block>
        )}

        <ModalTrackingOrder
          show={showOrderHistory}
          onBack={() => setShowOrderHistory(false)}
          loading={loadingHistory}
          items={listHistoryOrder}
          icon={successGif}
        />
      </Content>
    </>
  );
};

const Styles = {
  Container: styled.div`
    display: flex;
    flexdirection: row;
    justify-content: space-between;
  `,
  ContainerButton: styled.div`
    border: 1px solid #203864;
    display: flex;
    place-content: center;
    align-items: center;
    gap: 4px;
    width: 83px;
    height: 36px;
    border-radius: 3px;
    cursor: pointer;
  `,
  Text: styled.div`
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    color: #203864;
  `,
};

export default editProduk;
