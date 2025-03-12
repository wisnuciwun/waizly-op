/* eslint-disable react-hooks/exhaustive-deps */
import {
  BlockTitle,
  Head,
  InfoWarning,
  PagginationFilter,
  PaginationComponent,
} from '@/components';
import Content from '@/layout/content/Content';
import Image from 'next/image';
import emptyAddBundling from '@/assets/images/empty/camera.svg';
import colors from '@/utils/colors';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Col, Spinner } from 'reactstrap';
import { Button } from '@/components';
import { PaginationProps } from '@/utils/type';
import { getLastPath } from '@/utils/formater';
import { getDetailStock, getHistoryStock } from '@/services/inventory';
import { useSelector } from 'react-redux';
import { ignoreGudang } from '@/utils/ignoreGudangText';

import Nodata from '@/assets/images/illustration/no-data.svg';
import { Skeleton } from 'primereact/skeleton';
import { convertTimestamp } from '@/utils/convertTimeStamp';
import { useRouter } from 'next/router';
import TooltipComponent from '@/components/template/tooltip';

const DetailStock = () => {
  const router = useRouter();
  const id = getLastPath();
  const { client_id } = useSelector((state: any) => state.auth.user);
  const [dataDetailStock, setDataDetailStock] = useState<any>({});
  const [listHistory, setListHistory] = useState<any>([]);
  const [typeHistory, setTypeHistory] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    size: 10,
    totalRecord: 0,
  });
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const handlePageChange = (pageNumber: number) => {
    setPagination({ ...pagination, page: pageNumber });
    getStockHistory({ ...pagination, page: pageNumber });
  };

  const handleSetPageSize = (value: number) => {
    setPagination({ ...pagination, size: value, page: 1 });
    getStockHistory({ ...pagination, size: value, page: 1 });
  };

  const detailStock = async () => {
    setLoadingDetail(true);
    const response = await getDetailStock(id, client_id);

    if (response?.data) {
      setDataDetailStock(response?.data[0]);
    }
    setLoadingDetail(false);
  };

  const getStockHistory = async (data?: PaginationProps) => {
    setLoadingHistory(true);
    const payload = {
      product_id: id,
      client_id: client_id,
      page: data ? data.page : pagination.page,
      size: data ? data.size : pagination.size,
      type: typeHistory == 'all' || typeHistory == '' ? null : typeHistory,
    };
    const response = await getHistoryStock(payload);
    if (response.data) {
      setListHistory(response.data.stocks);
      setPagination((data) => ({
        ...data,
        totalRecord: response.data.page.total_record,
      }));
    }

    setLoadingHistory(false);
  };

  const handleClickTransaction = (id: string, type: string) => {
    const referenceType = type.toLowerCase();
    const url =
      referenceType === 'pembelian'
        ? `/inventory/detail?id=${id}`
        : referenceType === 'transfer'
          ? `/inventory/transfer/detail-transfer?id=${id}`
          : `/inventory/inbound/detail-inbound?id=${id}&type=detail&listType=false`;

    router.push(url);
  };

  useEffect(() => {
    detailStock();
  }, []);

  useEffect(() => {
    getStockHistory();
  }, [typeHistory]);
  return (
    <>
      <Head title="Detail Stok" />
      <Content>
        <InfoWarning
          strongWord={'Versi Beta!'}
          desc={
            'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'
          }
        />
        <Fragment>
          <Col lg={12} sm={12} className="mb-4">
            <DetailStockPage.Container>
              <DetailStockPage.Breadcrumb>
                <DetailStockPage.MainPage>
                  {'INVENTORI'}
                </DetailStockPage.MainPage>
                <DetailStockPage.MainPage>{'/'}</DetailStockPage.MainPage>
                <DetailStockPage.MainPage>{'STOK'}</DetailStockPage.MainPage>
                <DetailStockPage.MainPage>{'/'}</DetailStockPage.MainPage>
                <DetailStockPage.SubsPage>
                  {'Detail Stok'}
                </DetailStockPage.SubsPage>
              </DetailStockPage.Breadcrumb>
              {loadingDetail ? (
                <DetailStockPage.ContainerLoading>
                  <Spinner size={'lg'} color={colors.darkBlue} />
                </DetailStockPage.ContainerLoading>
              ) : (
                <DetailStockPage.Content>
                  <DetailStockPage.LeftContet>
                    <Image
                      width={405}
                      height={414}
                      src={
                        dataDetailStock?.product_image
                          ? dataDetailStock.product_image
                          : emptyAddBundling
                      }
                      style={{
                        alignSelf: 'center',
                        width: 405,
                        height: 414,
                      }}
                      alt="Image Product"
                    />
                  </DetailStockPage.LeftContet>
                  <DetailStockPage.RightContent>
                    <BlockTitle className={'mb-1'} fontSize={32}>
                      {dataDetailStock.product_name || '-'}
                    </BlockTitle>
                    <DetailStockPage.ContainerSKU>
                      <DetailStockPage.TextSKU>
                        {'Kode SKU:'}
                      </DetailStockPage.TextSKU>
                      <DetailStockPage.ValueSKU
                        onClick={() =>
                          router.push(
                            `/master-sku/edit/${dataDetailStock?.product_id || 0}`,
                          )
                        }
                      >
                        {dataDetailStock.product_sku || '-'}
                      </DetailStockPage.ValueSKU>
                    </DetailStockPage.ContainerSKU>
                    <div
                      style={{
                        overflow: 'auto',
                        maxWidth: '100%',
                        maxHeight: 260,
                        border: '1px solid #E9E9EA',
                      }}
                    >
                      <table className={'table'} style={{ marginBottom: 0 }}>
                        <thead
                          className="table-primary"
                          style={{ border: '1px solid #E9E9EA' }}
                        >
                          <tr style={{ whiteSpace: 'nowrap' }}>
                            <DetailStockPage.StickyTh style={{ fontSize: 12 }}>
                              {'Gudang'}
                            </DetailStockPage.StickyTh>
                            {/* <th>Tipe Gudang</th> */}
                            <DetailStockPage.StickyThType
                              style={{ fontSize: 12 }}
                            >
                              {'Tipe Gudang'}
                            </DetailStockPage.StickyThType>
                            <th
                              className="master-sku-nk-tb-col"
                              style={{
                                marginTop: 8,
                                marginBottom: 8,
                                fontSize: 12,
                              }}
                            >
                              <div className={'d-flex align-items-center'}>
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: '#4C4F54',
                                    fontSize: 12,
                                  }}
                                >
                                  Total Stok
                                </span>
                                <TooltipComponent
                                  icon="help-fill"
                                  iconClass="card-hint"
                                  direction="bottom"
                                  id={'Tooltip-' + 'total-stock-detail'}
                                  text={'Stok tersedia di Gudang'}
                                  style={styles.TooltipCanvasField}
                                />
                              </div>
                            </th>
                            <th style={{ fontSize: 12 }}>
                              <div className={'d-flex align-items-center'}>
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: '#4C4F54',
                                    fontSize: 12,
                                  }}
                                >
                                  Total Stok Normal
                                </span>
                                <TooltipComponent
                                  icon="help-fill"
                                  iconClass="card-hint"
                                  direction="bottom"
                                  id={'Tooltip-' + 'total-stock-normal-detail'}
                                  text={'Stok barang normal yang dapat dijual'}
                                  style={styles.TooltipCanvasField}
                                />
                              </div>
                            </th>
                            <th style={{ fontSize: 12 }}>
                              <div className={'d-flex align-items-center'}>
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: '#4C4F54',
                                    fontSize: 12,
                                  }}
                                >
                                  Total Stok Rusak
                                </span>
                                <TooltipComponent
                                  icon="help-fill"
                                  iconClass="card-hint"
                                  direction="bottom"
                                  id={'Tooltip-' + 'total-stock-rusak-detail'}
                                  text={
                                    'Stok barang rusak yang tidak dapat dijual'
                                  }
                                  style={styles.TooltipCanvasField}
                                />
                              </div>
                            </th>
                            <th style={{ fontSize: 12 }}>
                              <div className={'d-flex align-items-center'}>
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: '#4C4F54',
                                    fontSize: 12,
                                  }}
                                >
                                  Dialokasikan
                                </span>
                                <TooltipComponent
                                  icon="help-fill"
                                  iconClass="card-hint"
                                  direction="bottom"
                                  id={'Tooltip-' + 'dialokasikan-detail'}
                                  text={'Stok yang dialokasikan untuk outbound'}
                                  style={styles.TooltipCanvasField}
                                />
                              </div>
                            </th>
                            <th style={{ fontSize: 12 }}>
                              <div className={'d-flex align-items-center'}>
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: '#4C4F54',
                                    fontSize: 12,
                                  }}
                                >
                                  Tersedia
                                </span>
                                <TooltipComponent
                                  icon="help-fill"
                                  iconClass="card-hint"
                                  direction="bottom"
                                  id={'Tooltip-' + 'tersedia-detail'}
                                  text={'Stok tersedia yang dapat dijual'}
                                  style={styles.TooltipCanvasField}
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ whiteSpace: 'nowrap' }}>
                          {dataDetailStock.locations &&
                          dataDetailStock.locations.length > 0 ? (
                            <>
                              {dataDetailStock.locations.map(
                                (value: any, i: any) => (
                                  <tr
                                    key={i}
                                    style={{ border: '1px solid #E9E9EA' }}
                                  >
                                    <DetailStockPage.StickyTd className="table-activity-history-body-text text-truncate w-[130px]">
                                      <div
                                        className="text-truncate"
                                        style={styles.Gudang}
                                      >
                                        {value.location_name || '-'}
                                      </div>
                                    </DetailStockPage.StickyTd>
                                    <DetailStockPage.StickyTdType className="table-activity-history-body-text">
                                      <div style={styles.Type}>
                                        <DetailStockPage.Tags
                                          status={value.location_type}
                                        >
                                          <DetailStockPage.TextTags
                                            status={value.location_type}
                                          >
                                            {ignoreGudang(
                                              value.location_type,
                                            ) || '-'}
                                          </DetailStockPage.TextTags>
                                        </DetailStockPage.Tags>
                                      </div>
                                    </DetailStockPage.StickyTdType>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.TotalStock}>
                                        {value.total_stock || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.TotalStockNormal}>
                                        {value.total_stock_normal || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.TotalStockRusak}>
                                        {value.total_stock_rusak || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div
                                        style={styles.TotalStockDialokasikan}
                                      >
                                        {value.dialokasikan || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.Tersedia}>
                                        {value.tersedia || 0}
                                      </div>
                                    </td>
                                  </tr>
                                ),
                              )}
                            </>
                          ) : null}
                        </tbody>
                      </table>
                      {dataDetailStock.locations &&
                      dataDetailStock.locations.length == 0 ? (
                        <DetailStockPage.ContainerNoData>
                          <Image
                            src={Nodata}
                            width={200}
                            height={200}
                            alt="waizly-logo"
                          />
                          <div className="text-silent">
                            Belum Terdapat Data.
                          </div>
                        </DetailStockPage.ContainerNoData>
                      ) : null}
                    </div>
                  </DetailStockPage.RightContent>
                </DetailStockPage.Content>
              )}

              <DetailStockPage.ContainerTable>
                <DetailStockPage.ContainerTab>
                  <DetailStockPage.Tabs
                    onClick={() => setTypeHistory('all')}
                    active={typeHistory == '' || typeHistory == 'all'}
                  >
                    <DetailStockPage.TextTabs
                      active={typeHistory == '' || typeHistory == 'all'}
                    >
                      Semua
                    </DetailStockPage.TextTabs>
                  </DetailStockPage.Tabs>
                  <DetailStockPage.Tabs
                    onClick={() => setTypeHistory('stok masuk')}
                    active={typeHistory == 'stok masuk'}
                  >
                    <DetailStockPage.TextTabs
                      active={typeHistory == 'stok masuk'}
                    >
                      Stok Masuk
                    </DetailStockPage.TextTabs>
                  </DetailStockPage.Tabs>
                  <DetailStockPage.Tabs
                    onClick={() => setTypeHistory('stok keluar')}
                    active={typeHistory == 'stok keluar'}
                  >
                    <DetailStockPage.TextTabs
                      active={typeHistory == 'stok keluar'}
                    >
                      Stok Keluar
                    </DetailStockPage.TextTabs>
                  </DetailStockPage.Tabs>
                </DetailStockPage.ContainerTab>
                <div style={{ border: '1px solid #E9E9EA', marginTop: 16 }}>
                  <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                    <table className={'table'}>
                      <thead
                        className="table-primary"
                        style={{ border: '1px solid #E9E9EA' }}
                      >
                        <tr style={{ whiteSpace: 'nowrap' }}>
                          <th style={{ fontSize: 12 }}>Nomor Transaksi</th>
                          <th style={{ fontSize: 12 }}>Gudang</th>
                          <th style={{ fontSize: 12 }}>Total Stok Awal</th>
                          <th style={{ fontSize: 12 }}>
                            Perubahan Stok Normal
                          </th>
                          <th style={{ fontSize: 12 }}>Perubahan Stok Rusak</th>
                          <th style={{ fontSize: 12 }}>{'Total Stok Akhir'}</th>
                          <th style={{ fontSize: 12 }}>{'Sumber aktivitas'}</th>
                          <th style={{ fontSize: 12 }}>{'Dilakukan oleh'}</th>
                          <th style={{ fontSize: 12 }}>{'Waktu'}</th>
                        </tr>
                      </thead>
                      <tbody style={{ whiteSpace: 'nowrap' }}>
                        {loadingHistory ? (
                          <>
                            {Array.from({ length: 10 }, (_, i) => (
                              <tr
                                key={i}
                                style={{ border: '1px solid #E9E9EA' }}
                              >
                                <td className="table-activity-history-body-text">
                                  <div style={styles.NoTrx}>
                                    <Skeleton
                                      width={'180px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.TotalStockAwal}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.TotalStockAwal}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                                <td className="table-activity-history-body-text">
                                  <div style={styles.PerubahanStock}>
                                    <Skeleton
                                      width={'150px'}
                                      height={'32px'}
                                      shape={'rectangle'}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <>
                            {listHistory && listHistory.length > 0 ? (
                              <>
                                {listHistory.map((value: any, i: any) => (
                                  <tr
                                    key={i}
                                    style={{ border: '1px solid #E9E9EA' }}
                                  >
                                    <td className="table-activity-history-body-text">
                                      <div
                                        style={styles.NoTrx}
                                        onClick={() =>
                                          handleClickTransaction(
                                            value.source_id,
                                            value.reference_type,
                                          )
                                        }
                                      >
                                        {value.source_code || '-'}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div
                                        className="text-truncate"
                                        style={styles.TotalStockAwal}
                                      >
                                        {value.location || ''}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.TotalStockAwal}>
                                        {value.total_stocks_before || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.PerubahanStock}>
                                        <p
                                          style={{
                                            fontSize: 12,
                                            color:
                                              value?.total_goods_stock_changes &&
                                              value?.total_goods_stock_changes.includes(
                                                '+',
                                              )
                                                ? '#36C068'
                                                : value.total_goods_stock_changes &&
                                                    value.total_goods_stock_changes.includes(
                                                      '-',
                                                    )
                                                  ? '#FF6E5D'
                                                  : '#4C4F54',
                                          }}
                                        >
                                          {value.total_goods_stock_changes ||
                                            '-'}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.PerubahanStock}>
                                        <p
                                          style={{
                                            fontSize: 12,
                                            color:
                                              value?.total_damage_stock_changes?.includes(
                                                '+',
                                              )
                                                ? '#36C068'
                                                : value?.total_damage_stock_changes?.includes(
                                                      '-',
                                                    )
                                                  ? '#FF6E5D'
                                                  : '#4C4F54',
                                          }}
                                        >
                                          {value?.total_damage_stock_changes ||
                                            '-'}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.SumberActivity}>
                                        {value.total_stocks_after || 0}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.Oleh}>
                                        {value.reference_type || '-'}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div
                                        className="text-truncate"
                                        style={styles.Waktu}
                                      >
                                        {value.created_name || ''}
                                      </div>
                                    </td>
                                    <td className="table-activity-history-body-text">
                                      <div style={styles.Waktu}>
                                        {convertTimestamp(value.created_at)}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            ) : null}
                          </>
                        )}
                      </tbody>
                    </table>
                    {listHistory && listHistory.length == 0 ? (
                      <DetailStockPage.ContainerNoData>
                        <Image
                          src={Nodata}
                          width={200}
                          height={200}
                          alt="waizly-logo"
                        />
                        <div className="text-silent">Belum Terdapat Data.</div>
                      </DetailStockPage.ContainerNoData>
                    ) : null}
                  </div>
                  {listHistory && listHistory.length > 0 ? (
                    <Col xs={12} lg={12}>
                      <div className="d-flex justify-content-between align-items-center g-2 m-2 mt-0">
                        <div className="text-start">
                          <PaginationComponent
                            itemPerPage={pagination.size}
                            totalItems={pagination.totalRecord}
                            paginate={handlePageChange}
                            currentPage={pagination.page}
                          />
                        </div>
                        <PagginationFilter
                          pageSize={pagination.size}
                          setPageSize={(value: number) =>
                            handleSetPageSize(value)
                          }
                        />
                      </div>
                    </Col>
                  ) : null}
                </div>
              </DetailStockPage.ContainerTable>
              <DetailStockPage.ContainerBack>
                <Button
                  style={{ width: 140, fontSize: 14 }}
                  className={'justify-center text-primary'}
                  onClick={() => router.back()}
                >
                  Kembali
                </Button>
              </DetailStockPage.ContainerBack>
            </DetailStockPage.Container>
          </Col>
        </Fragment>
      </Content>
    </>
  );
};

const DetailStockPage = {
  Container: styled.div`
    background-color: white;
    padding: 20px;
    border: solid 1px ${colors.gray};
    border-radius: 4px;
  `,
  Breadcrumb: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 4px;
    margin-bottom: 8px;
    gap: 4px;
  `,
  MainPage: styled.text`
    font-size: 12px;
    color: ${colors.black};
    font-weight: 400;
    line-height: 20px;
  `,
  SubsPage: styled.text`
    font-size: 12px;
    color: #bdc0c7;
    font-weight: 400;
    line-height: 20px;
  `,
  Content: styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 24px;
    margin-top: 24px;
  `,
  LeftContet: styled.div`
    min-width: 405px;
    min-height: 414px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    // border: 1px solid ${colors.gray};
  `,
  RightContent: styled.div`
    width: calc(100% - 425px);
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
  `,
  StickyTh: styled.th`
    position: sticky;
    left: 0;
    z-index: 2;
  `,
  StickyThType: styled.th`
    position: sticky;
    left: 158.5px;
    z-index: 2;
  `,
  StickyTd: styled.td`
    position: sticky;
    left: 0;
    z-index: 2;
  `,
  StickyTdType: styled.td`
    position: sticky;
    left: 158.5px;
    z-index: 2;
  `,
  Tags: styled.div<{ status: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 16px;
    border-radius: 4px;
    width: ${(props) =>
      props.status.includes('ETHIX') ? '110px' : 'fit-content'};
    background-color: ${(props) =>
      props.status.includes('ETHIX') ? '#E1EFFA' : '#D5FDFF'};
    color: ${(props) =>
      props.status.includes('ETHIX') ? '#0372D9' : '#00A7E1'};
  `,
  TextTags: styled.p<{ status: string }>`
    font-size: 12px;
    line-height: 20px;
    font-weight: 700;
    text-align: center;
    color: ${(props) =>
      props.status.includes('ETHIX') ? '#0372D9' : '#00A7E1'};
  `,
  ContainerSKU: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    margin-bottom: 16px;
  `,
  TextSKU: styled.div`
    font-size: 14px;
    color: ${colors.black};
  `,
  ValueSKU: styled.p`
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    text-decoration: underline;
    color: ${colors.blue};
    cursor: pointer;
  `,
  ContainerTable: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 24px;
  `,
  ContainerTab: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid ${colors.gray};
    gap: 28px;
  `,
  Tabs: styled.div<{ active: boolean }>`
    border-bottom: ${(props) => (props.active ? '4px' : '0px')} solid
      ${colors.darkBlue};
    padding-bottom: 8px;
    cursor: pointer;
  `,
  TextTabs: styled.div<{ active: boolean }>`
    font-size: 14px;
    line-height: 20px;
    font-weight: ${(props) => (props.active ? '700' : '500')};
    color: ${(props) => (props.active ? colors.blue : colors.black)};
  `,
  ContainerLoading: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70vh;
  `,
  ContainerNoData: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  ContainerBack: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin-top: 16px;
  `,
};

const styles = {
  Gudang: {
    width: 130,
    fontSize: 12,
  },
  Type: {
    // width: 124,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 12,
  },
  TotalStock: {
    width: 95,
    fontSize: 12,
  },
  TotalStockNormal: {
    width: 141,
    fontSize: 12,
  },
  TotalStockRusak: {
    width: 141,
    fontSize: 12,
  },
  TooltipCanvasField: {
    width: '12rem',
    borderRadius: 8,
    textAlign: 'start',
    cursor: 'pointer',
  },
  TotalStockDialokasikan: {
    width: 113,
    fontSize: 12,
  },
  Tersedia: {
    width: 91,
    fontSize: 12,
  },
  NoTrx: {
    width: 130,
    fontSize: 12,
    cursor: 'pointer',
    color: '#203864',
    textDecoration: 'underline',
  },
  TotalStockAwal: {
    width: 80,
    fontSize: 12,
  },
  PerubahanStock: {
    width: 120,
    fontSize: 12,
  },
  StockAkhir: {
    width: 80,
    fontSize: 12,
  },
  SumberActivity: {
    width: 90,
    fontSize: 12,
  },
  Oleh: {
    width: 80,
    fontSize: 12,
  },
  Waktu: {
    width: 70,
    fontSize: 12,
  },
  ButtonBack: {
    width: 168,
    fontSize: 14,
    color: colors.darkBlue,
  },
};

export default DetailStock;
