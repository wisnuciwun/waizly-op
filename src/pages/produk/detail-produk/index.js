/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import Content from '@/layout/content/Content';
import { Block, BlockBetween, BlockHeadContent } from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import { Row, Col, Badge, Spinner } from 'reactstrap';
import colors from '@/utils/colors';
import { getDetailProduk } from '@/services/produk/index';
import defaultFoto from '@/assets/images/dummy/default.svg';
import Link from 'next/link';
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
  const [loadingDetail, setLoadingDetail] = useState(false);

  const getProdukbyId = async () => {
    setLoadingDetail(true);
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
    } finally {
      setLoadingDetail(false);
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

  const getStatusBadgeProps = (statusId) => {
    switch (statusId) {
      case 34:
        return { color: 'secondary', text: 'Draft' };
      case 31:
        return { color: 'success', text: 'Aktif' };
      case 32:
        return { color: 'warning', text: 'Archived' };
      case 36:
        return { color: 'danger', text: 'Blokir' };
      default:
        return { text: '-' };
    }
  };

  const renderDescription = () => {
    const maxLength = 255;
    const description = produkData && produkData.description;
    const shouldShowFullDescription =
      description && description.length > maxLength;

    return (
      <div className="product-details entry me-xxl-3 mt-5">
        <h5 style={{ color: ' #4C4F54' }} className="mb-3">
          Deskripsi Produk
        </h5>
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
              {loadingDetail ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh',
                  }}
                >
                  <Spinner size={'lg'} color={colors.darkBlue} />
                </div>
              ) : (
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
                      <h2
                        className="product-title"
                        style={{ color: '#203864' }}
                      >
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
                    <div className="amount">
                      <div className="fs-14px" style={{ color: ' #4C4F54' }}>
                        Kode Produk:{' '}
                        {(produkData.variant_detail &&
                          produkData.variant_detail.length > 0 &&
                          produkData.variant_detail[0].sku) ||
                          '-'}
                      </div>
                    </div>
                    <div className="product-meta">
                      <ul className="d-flex g-3 gx-5">
                        <li>
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Kondisi Produk
                          </div>
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
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
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
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Status Produk
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <Badge
                              className="badge-dim"
                              style={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}
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
                        <li>
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Hubungan Master SKU
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <Badge
                              className="badge-dim"
                              style={{
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}
                              color={
                                produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].is_mapping
                                  ? 'success'
                                  : 'secondary'
                              }
                            >
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                (produkData.variant_detail[0].is_mapping
                                  ? 'Terhubung'
                                  : 'Tidak Terhubung')) ||
                                '-'}
                            </Badge>
                          </div>
                        </li>
                        <li>
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Stock Channel
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#4C4F54',
                                fontSize: '14px',
                              }}
                            >
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].qty) ||
                                '0'}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="product-meta">
                      <ul className="d-flex g-3 gx-5">
                        <li>
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Berat (Gram)
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#4C4F54',
                                fontSize: '14px',
                              }}
                            >
                              {' '}
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].weight) ||
                                '0'}
                            </div>
                          </div>
                        </li>
                        <li>
                          <div
                            style={{ color: ' #4C4F54' }}
                            className="fs-14px"
                          >
                            Panjang x Lebar x Tinggi (cm)
                          </div>
                          <div className="fs-16px fw-bold text-secondary">
                            <div
                              style={{
                                fontWeight: 'bold',
                                color: '#4C4F54',
                                fontSize: '14px',
                              }}
                            >
                              {' '}
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].length) ||
                                '0'}{' '}
                              x{' '}
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].width) ||
                                '0'}{' '}
                              x{' '}
                              {(produkData.variant_detail &&
                                produkData.variant_detail.length > 0 &&
                                produkData.variant_detail[0].height) ||
                                '0'}{' '}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="product-info me-xxl-5 mt-5">
                      <p
                        style={{ fontSize: 24, fontFamily: 'Inter' }}
                        className="product-title"
                      >
                        Rp{' '}
                        {formatCurrency(
                          parseFloat(
                            (produkData.variant_detail &&
                              produkData.variant_detail.length > 0 &&
                              produkData.variant_detail[0].publish_price) ||
                              '0',
                          ),
                        )}{' '}
                      </p>
                    </div>
                    <div className="product-details entry me-xxl-3 mt-5">
                      {renderDescription()}
                    </div>
                  </div>
                </div>
              )}

              <Row>
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
                        <span
                          style={{ fontWeight: 'bolder', color: '#4C4F54' }}
                        >
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
              </Row>
            </>
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
};

export default editProduk;
