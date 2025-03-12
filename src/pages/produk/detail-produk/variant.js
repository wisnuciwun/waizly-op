/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import Content from '@/layout/content/Content';
import { Block, BlockBetween, BlockHeadContent } from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import { Col, Badge, Label } from 'reactstrap';
import { getDetailProduk } from '@/services/produk/index';
import defaultFoto from '@/assets/images/dummy/default.svg';
import Link from 'next/link';
import classNames from 'classnames';
import { useSearchParams } from 'next/navigation';
import moment from 'moment';
import { formatCurrency } from '@/utils/formatCurrency';

// img
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Image from 'next/image';

const editProduk = () => {
  const [sm] = useState(false);
  const [produkData, setDataProduk] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const searchParams = useSearchParams();
  const idSearch = searchParams.get('parent_product_listing_id');
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  //   const { client_id } = useSelector((state) => state.auth.user);
  //   const clientId = client_id;

  const getProdukbyId = async () => {
    try {
      if (!idSearch) {
        console.error('idSearch is not available');
        return;
      }

      const response = await getDetailProduk(idSearch);

      if (response.status === 200) {
        const produkData = response.data;
        setDataProduk(produkData);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
      return [];
    }
  };

  const getStatusBadgeProps = (statusId) => {
    switch (statusId) {
      case 34:
        return { color: 'secondary', text: 'DRAFT' };
      case 31:
        return { color: 'success', text: 'AKTIF' };
      case 32:
        return { color: 'warning', text: 'DIARSIPKAN' };
      case 36:
        return { color: 'danger', text: 'DIBLOKIR' };
      default:
        return { text: '-' };
    }
  };

  const getImageSrc = (channelName) => {
    // const formattedName = channelName.toLowerCase().replace(/\s+/g, "");
    switch (channelName) {
      case 1:
        return Shopee;
      case 2:
        return Tokopedia;
      case 3:
        return Lazada;
      case 4:
        return Tiktok;
      case 6:
        return Shopify;
      default:
        return Shopify;
    }
  };

  const getStatusBadgeStatusSKU = (statusId) => {
    switch (statusId) {
      case false:
        return { color: 'danger', text: 'TIDAK TERHUBUNG' };
      case true:
        return { color: 'success', text: 'TERHUBUNG' };
      default:
        return { color: 'secondary', text: '-' };
    }
  };

  const renderTableHeader = () => {
    return (
      <thead className="table-primary">
        <tr style={{ whiteSpace: 'nowrap' }}>
          {produkData.variant_1 && <th>{produkData.variant_1}</th>}
          {produkData.variant_2 && <th>{produkData.variant_2}</th>}
          {produkData.variant_3 && <th>{produkData.variant_3}</th>}
          <th>Kode Produk</th>
          <th>Berat (gram)</th>
          <th>Panjang x Lebar x Tinggi (cm)</th>
          <th>Harga Produk</th>
          <th>Stok</th>
          <th>Status Produk</th>
          <th>Hubungan Master SKU</th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody style={{ whiteSpace: 'nowrap' }}>
        {produkData.variant_detail &&
          produkData.variant_detail.map((variant, idx) => (
            <tr key={idx}>
              {produkData.variant_1 && (
                <td className="table-activity-history-body-text">
                  <div
                    style={{
                      minWidth: '10rem',
                      maxWidth: '10rem',
                    }}
                  >
                    {variant.variant_name_1 || '-'}
                  </div>
                </td>
              )}
              {produkData.variant_2 && (
                <td className="table-activity-history-body-text">
                  <div
                    style={{
                      minWidth: '10rem',
                      maxWidth: '10rem',
                    }}
                  >
                    {variant.variant_name_2 || '-'}
                  </div>
                </td>
              )}
              {produkData.variant_3 && (
                <td className="table-activity-history-body-text">
                  <div
                    style={{
                      minWidth: '10rem',
                      maxWidth: '10rem',
                    }}
                  >
                    {variant.variant_name_3 || '-'}
                  </div>
                </td>
              )}
              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                <div
                  style={{
                    marginRight: '30px',
                    whiteSpace: 'nowrap',
                    color: '#4C4F54',
                  }}
                >
                  {variant.sku || '-'}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '7rem',
                    maxWidth: '7rem',
                  }}
                >
                  {variant.weight || '0'}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '12rem',
                    maxWidth: '12rem',
                  }}
                >
                  {`${variant.length} x ${variant.width} x ${variant.height}` ||
                    '0'}
                </div>
              </td>
              <td style={{ color: '#203864', fontWeight: 'bold' }}>
                <div
                  style={{
                    minWidth: '10rem',
                    maxWidth: '10rem',
                  }}
                >
                  Rp {formatCurrency(parseFloat(variant.publish_price))}{' '}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '5rem',
                    maxWidth: '5rem',
                  }}
                >
                  {variant.qty || '0'}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '7rem',
                    maxWidth: '7rem',
                  }}
                >
                  {getStatusBadgeProps(variant.status_id) ? (
                    <Badge
                      className="badge-dim"
                      color={getStatusBadgeProps(variant.status_id).color}
                    >
                      {getStatusBadgeProps(variant.status_id).text}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </div>
              </td>
              <td className="table-activity-history-body-text">
                <div
                  style={{
                    minWidth: '8rem',
                    maxWidth: '8rem',
                  }}
                >
                  {getStatusBadgeStatusSKU(variant.is_mapping) ? (
                    <Badge
                      className="badge-dim"
                      color={getStatusBadgeStatusSKU(variant.is_mapping).color}
                    >
                      {getStatusBadgeStatusSKU(variant.is_mapping).text}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    );
  };

  const renderDescription = () => {
    const maxLength = 255;
    const description = produkData && produkData.description;
    const shouldShowFullDescription =
      description && description.length > maxLength;

    return (
      <div className="product-details entry me-xxl-3 mt-5">
        <h5 className="mb-3">Deskripsi Produk</h5>
        <p style={{ textAlign: 'justify' }}>
          {shouldShowFullDescription
            ? showFullDescription
              ? description
              : `${description.substring(0, maxLength)}...`
            : description || 'No description'}
          {shouldShowFullDescription && (
            <span
              style={{ color: '#007bff', cursor: 'pointer' }}
              onClick={toggleDescription}
            >
              {showFullDescription ? ' Sembunyikan' : ' Selengkapnya'}
            </span>
          )}
        </p>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (idSearch) {
        await getProdukbyId();
      }
    };

    fetchData();
  }, [idSearch]);

  const tableClass = classNames({
    table: true,
  });

  return (
    <>
      <Content>
        <Block>
          <PreviewCard>
            <BlockHeadContent>
              <ul className="nk-block-tools pb-5">
                <li>
                  <p style={{ color: '#203864' }}>
                    PRODUK TOKO /
                    <span style={{ color: '#BDC0C7' }}> Detail Toko</span>
                  </p>
                </li>
              </ul>
            </BlockHeadContent>
            <>
              <div
                style={{ gap: 16 }}
                className={'d-flex justify-content-between w-full'}
              >
                <div
                  style={{ width: 427, marginRight: 16 }}
                  className="product-gallery me-xl-1 me-xxl-5"
                >
                  <div
                    className="slider-item rounded"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '436px',
                      width: 427,
                    }}
                  >
                    <Image
                      src={defaultFoto}
                      width={250}
                      height={250}
                      alt="waizly-logo"
                      style={{ marginRight: '10px' }}
                    />
                  </div>
                </div>

                <div style={{ width: '100%' }}>
                  <div className="product-info me-xxl-5">
                    <h2 className="product-title">
                      {' '}
                      {produkData.name || 'Product name not available'}
                    </h2>
                  </div>
                  <div className="amount mt-2">
                    <Image
                      src={getImageSrc(produkData.channel_id)}
                      width={15}
                      height={15}
                      alt="waizly-logo"
                      style={{ marginRight: '10px' }}
                    />{' '}
                    {produkData.store_name || '-'}
                  </div>
                  <div className="product-meta">
                    <ul className="d-flex g-3 gx-5">
                      <li>
                        <div className="fs-14px text-muted">Kondisi Produk</div>
                        <div className="fs-16px fw-bold text-secondary">
                          <Badge
                            className="badge-dim"
                            color={
                              produkData.condition === 'NEW'
                                ? 'info'
                                : produkData.condition === 'SECOND'
                                  ? 'info'
                                  : 'secondary'
                            }
                            style={{
                              color:
                                produkData.condition === 'SECOND'
                                  ? '#0372D9'
                                  : undefined,
                            }}
                          >
                            {produkData.condition === 'NEW'
                              ? 'BARU'
                              : produkData.condition === 'SECOND'
                                ? 'BARU'
                                : '-'}
                          </Badge>
                        </div>
                      </li>
                      <li>
                        <div className="fs-14px text-muted">Status Produk</div>
                        <div className="fs-16px fw-bold text-secondary">
                          <Badge
                            className="badge-dim"
                            color={
                              getStatusBadgeProps(
                                produkData.variant_detail &&
                                  produkData.variant_detail.length > 0 &&
                                  produkData.variant_detail[0].status_id,
                              ).color
                            }
                          >
                            {
                              getStatusBadgeProps(
                                produkData.variant_detail &&
                                  produkData.variant_detail.length > 0 &&
                                  produkData.variant_detail[0].status_id,
                              ).text
                            }
                          </Badge>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="product-details entry me-xxl-3 mt-5">
                    {renderDescription()}
                  </div>
                </div>
              </div>
              <Col lg={12} className="pt-5">
                <BlockHeadContent>
                  <Label
                    className="form-label"
                    htmlFor="fv-topics"
                    style={{ fontWeight: 'bold', fontSize: '20px' }}
                  >
                    Detail Varian
                  </Label>
                  <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                    <table className={`${tableClass}`}>
                      {renderTableHeader()}
                      {renderTableBody()}
                    </table>
                  </div>
                </BlockHeadContent>
              </Col>
              <Col lg={12} className="pt-5">
                <BlockBetween>
                  <BlockHeadContent>
                    <div>
                      <span
                        style={{
                          marginRight: '10px',
                          fontWeight: 'bolder',
                          color: '#4C4F54',
                        }}
                      >
                        Dibuat Di Channel{' '}
                        <span
                          style={{ fontWeight: 'normal', color: '#4C4f54' }}
                        >
                          {moment(produkData.created_at).format(
                            'DD-MM-YYYY HH:mm',
                          )}
                        </span>
                      </span>
                      <span style={{ fontWeight: 'bolder', color: '#4C4F54' }}>
                        Terakhir Sinkronisasi{' '}
                        <span
                          style={{ fontWeight: 'normal', color: '#4C4f54' }}
                        >
                          {moment(produkData.last_sync_product).format(
                            'DD-MM-YYYY HH:mm',
                          )}
                        </span>
                      </span>
                    </div>
                  </BlockHeadContent>

                  <BlockHeadContent>
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <div
                        className="toggle-expand-content"
                        style={{ display: sm ? 'block' : 'none' }}
                      >
                        <ul className="nk-block-tools g-3">
                          <li>
                            <div
                              className="toggle d-none d-md-inline-flex"
                              style={{ cursor: 'pointer' }}
                            >
                              <span
                                style={{
                                  fontWeight: 'bolder',
                                  marginRight: '35px',
                                }}
                              >
                                <Link
                                  href="/produk/shopify"
                                  className=" text-color-primary"
                                >
                                  Kembali
                                </Link>
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </BlockHeadContent>
                </BlockBetween>
              </Col>
            </>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
};

export default editProduk;
