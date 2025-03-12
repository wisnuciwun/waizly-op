import React from 'react';
import { inventoryStatus } from '@/utils';
import { Skeleton } from 'primereact/skeleton';
import moment from 'moment';

const DataTableTitle = ({ ...props }) => {
  return (
    <div
      className="master-sku-table-title py-1"
      style={{ fontSize: 12, fontWeight: 'normal', color: '#4C4F54' }}
    >
      <div className="card-title-group">{props.children}</div>
    </div>
  );
};

interface Props  {
  routeCode: number;
}

const PurchasingHead = ({
  routeCode
}: Props) => {

  return (
    <thead>
      <tr className="nk-tb-col-check" style={{ whiteSpace: 'nowrap' }}>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Nomor Pembelian</DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Status Pembelian</DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle className="d-flex align-items-center justify-content-between">
            Gudang Tujuan
          </DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Jumlah</DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Jumlah SKU</DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Dibuat Oleh</DataTableTitle>
        </th>
        <th className="master-sku-nk-tb-col">
          <DataTableTitle>Disetujui Oleh</DataTableTitle>
        </th>
        <th
          hidden={routeCode != inventoryStatus.MENUNGGU_PERSETUJUAN}
          className="master-sku-nk-tb-col"
        >
          <DataTableTitle>Aksi</DataTableTitle>
        </th>
      </tr>
    </thead>
  );
};

const PurchasingLoading = () => {
  return (
    <tr
      style={{
        backgroundColor: '#fff',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      }}
    >
      <td className="tb-col nk-tb-col">
        <Skeleton width={'168px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'168px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
      <td className="tb-col nk-tb-col">
        <Skeleton width={'184px'} height={'32px'} shape={'rectangle'} />
      </td>
    </tr>
  );
};

const TableHistoryHead = () => {
  return (
    <thead className="table-primary" style={{ border: '1px solid #E9E9EA' }}>
      <tr style={{ whiteSpace: 'nowrap' }}>
        <th style={{ fontSize: 12 }}>Aktivitas</th>
        <th style={{ fontSize: 12 }}>Dilakukan Oleh</th>
        <th style={{ fontSize: 12 }}>Waktu</th>
      </tr>
    </thead>
  );
};

const TableHistoryBody = ({ produkData }) => {
  return (
    <tbody style={{ whiteSpace: 'nowrap' }}>
      {produkData?.length != 0 &&
        produkData?.map((datas, key) => (
          <tr key={key} style={{ border: '1px solid #E9E9EA' }}>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '24rem',
                  fontSize: 12
                }}
                className="text-truncate"
              >
                {datas.activity ?? '-'}
              </div>
            </td>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '15rem',
                  fontSize: 12
                }}
                className="text-truncate"
              >
                {datas.full_name ?? '-'}
              </div>
            </td>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '10rem',
                  fontSize: 12
                }}
              >
                {moment(datas.created_at).format('DD/MM/YYYY HH:mm') ?? '-'}
              </div>
            </td>
          </tr>
        ))}
    </tbody>
  );
};

const TableHistoryBodyInventory = ({ produkData }) => {
  return (
    <tbody style={{ whiteSpace: 'nowrap' }}>
      {produkData?.purchase_history && produkData?.purchase_history.length != 0 &&
        produkData?.purchase_history.map((datas: any, key: number) => (
          <tr key={key} style={{ border: '1px solid #E9E9EA' }}>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '24rem',
                }}
                className="text-truncate"
              >
                {datas.activity ?? '-'}
              </div>
            </td>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '15rem',
                }}
                className="text-truncate"
              >
                {datas.full_name ?? '-'}
              </div>
            </td>
            <td className="table-activity-history-body-text">
              <div
                style={{
                  width: '10rem',
                }}
              >
                {moment(datas.created_at).format('DD/MM/YYYY HH:mm') ?? '-'}
              </div>
            </td>
          </tr>
        ))}
    </tbody>
  );
};

export {
  DataTableTitle,
  PurchasingHead,
  PurchasingLoading,
  TableHistoryHead,
  TableHistoryBody,
  TableHistoryBodyInventory
};
