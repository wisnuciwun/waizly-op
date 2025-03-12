import { PaginationComponent } from '@/components';
import { PreviewAltCard } from '@/components/atoms';
import Image from 'next/image';
import Nodata from '@/assets/images/illustration/no-data.svg';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import { uniq } from 'lodash';
import { formatCurrency } from '@/utils/formatCurrency';
import colors from '@/utils/colors';

const DefaultPagination = ({
  paginationModel,
  dataOrder,
  pageInfo,
  handlePageChange,
  handlePerPage,
}) => {
  return (
    <PreviewAltCard bodyClass="" className="border-0 shadow-none">
      <div className={'dataTables_wrapper'}>
        <div className="d-flex justify-content-between align-items-center g-2">
          <div className="text-start">
            {dataOrder?.length > 0 && (
              <PaginationComponent
                itemPerPage={paginationModel.size}
                totalItems={pageInfo?.total_record}
                paginate={handlePageChange}
                currentPage={pageInfo.current_page}
              />
            )}
          </div>
          <div className="text-center w-100">
            {dataOrder?.length > 0 ? (
              <div className="datatable-filter text-end">
                <div
                  className="dataTables_length"
                  id="DataTables_Table_0_length"
                >
                  <label>
                    <span
                      style={{ fontSize: 12 }}
                      className="d-none d-sm-inline-block"
                    >
                      Data Per Halaman
                    </span>
                    <div className="form-control-select">
                      <select
                        name="DataTables_Table_0_length"
                        className="custom-select custom-select-sm form-control form-control-sm"
                        value={paginationModel.size}
                        onChange={(e) =>
                          handlePerPage(parseInt(e.target.value))
                        }
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-silent">
                <Image
                  src={Nodata}
                  width={300}
                  height={200}
                  alt="waizly-logo"
                />
                <div className="text-silent">Belum Terdapat Data.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PreviewAltCard>
  );
};

const SKUTableHeader = () => {
  return (
    <thead className="table-primary" style={{ border: '1px solid #E9E9EA' }}>
      <tr style={{ whiteSpace: 'nowrap' }}>
        <th style={{ fontSize: 12 }}>Informasi SKU</th>
        <th style={{ fontSize: 12 }}>
          Jumlah
        </th>
        <th style={{ fontSize: 12 }}>Harga Satuan</th>
        <th style={{ fontSize: 12 }}>Sub Total Produk</th>
        <th></th>
      </tr>
    </thead>
  );
};

const SKUTableBody = ({ produkData }) => {
  return (
    <tbody style={{ whiteSpace: 'nowrap' }}>
      {produkData?.purchase_details.length != 0 &&
        produkData?.purchase_details?.map((items, key) => (
          <tr key={key} style={{ border: '1px solid #E9E9EA' }}>
            <td
              style={{
                width: '50%',
                maxWidth: 550,
                minWidth: 225,
                paddingRight: 50,
              }}
              className="table-activity-history-body-text"
            >
              <div className="master-sku-product-table-card" style={{}}>
                <Image
                  src={
                    items.images.length != 0 ? items.images : ilustrationCamera
                  }
                  width={44}
                  height={44}
                  alt="product-sku"
                />
                <div
                  style={{ fontSize: 14 }}
                  className="master-sku-product-table-info text-truncate"
                >
                  {items?.product_name || '-'}
                  <br />
                  <span style={{ fontWeight: 400, fontSize: 12 }}>
                    Kode SKU: {items?.product_sku || '-'}
                  </span>
                </div>
              </div>
            </td>
            <td
              style={{ verticalAlign: 'middle' }}
              className="table-activity-history-body-text text-truncate"
            >
              <div
                style={{
                  minWidth: '5rem',
                  maxWidth: '5rem',
                  fontSize: 12,
                }}
              >
                {items.quantity || '-'}
              </div>
            </td>
            <td
              style={{ verticalAlign: 'middle' }}
              className="table-activity-history-body-text text-truncate"
            >
              <div
                style={{
                  minWidth: '10rem',
                  maxWidth: '10rem',
                  fontSize: 12,
                }}
              >
                Rp {formatCurrency(parseFloat(items.unit_price))}{' '}
              </div>
            </td>
            <td
              style={{ verticalAlign: 'middle' }}
              className="table-activity-history-body-text text-truncate"
            >
              <div
                style={{
                  minWidth: '10rem',
                  maxWidth: '10rem',
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#203864',
                }}
              >
                Rp {formatCurrency(parseFloat(items?.unit_price_total))}{' '}
              </div>
            </td>
            <td style={{ width: 50 }}>&nbsp;</td>
          </tr>
        ))}
      <tr
        style={{
          fontSize: 12,
          fontWeight: 400,
          color: '#4C4F54',
        }}
      >
        <td></td>
        <td>
          <span>
            Jumlah barang dibeli:{' '}
            {produkData?.purchase_details
              .filter((v) => v.quantity?.toString() != 'NaN')
              .map((v) => v.quantity)
              .reduce((x, y) => x + y)}
          </span>
        </td>
        <td></td>
        <td>
          <span>
            Subtotal:{' '}
            <b>
              {' '}
              Rp{' '}
              {formatCurrency(
                parseFloat(
                  produkData?.purchase_details
                    .map((v: any) => v.unit_price_total)
                    .reduce((x: number, y: number) => x + y)
                )
              )}
            </b>
          </span>
        </td>
        <td>
          <span>
            Total SKU:{' '}
            {
              uniq(produkData?.purchase_details.map((item) => item.product_sku))
                .length
            }
          </span>
        </td>
      </tr>
    </tbody>
  );
};

const SKUFormInfo = ({ list, alreadyChanged, edit }) => {
  return (
    <div
      hidden={
        (list.length == 0 && !alreadyChanged) ||
        (list.length != 0 && alreadyChanged) ||
        (list.length != 0 && edit)
      }
      style={{ fontSize: 12 }}
      className="text-end mt-2"
    >
      <div className="text-muted">SKU: 0</div>
      <div className="text-danger">Jumlah SKU dalam pembelian minimal 1</div>
    </div>
  );
};

const SKUTableHead = () => {
  return (
    <thead className="table-primary" style={{ border: '1px solid #E9E9EA' }}>
      <tr style={styles.header}>
        <th style={styles.listHeader}>Informasi SKU</th>
        <th style={styles.listHeader}>
          Jumlah<span style={{ color: 'red' }}>*</span>
        </th>
        <th style={styles.listHeader}>Harga Satuan</th>
        {true && <th style={styles.listHeader}>Aksi</th>}
      </tr>
    </thead>
  );
};

const styles = {
  listHeader: {
    padding: 8,
    margin: 8,
    fontWeight: '400',
    color: '#4C4F54',
    fontSize: 12,
  },
  headerAction: {
    width: 48,
    marginLeft: 4,
  },
  header: {
    whiteSpace: 'nowrap',
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  underline: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export {
  DefaultPagination,
  SKUTableHeader,
  SKUTableBody,
  SKUFormInfo,
  SKUTableHead,
  styles,
};
