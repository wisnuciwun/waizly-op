// react & next
import Image from 'next/image';

// third party
import classNames from 'classnames';

//component
import { BlockContent } from '@/components';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';

// utils
import { formatCurrency } from '@/utils/formatCurrency';
import { getCourierLogo, getCourierStatus } from '@/utils/get-courier-status';

export const TableCourier = ({ dataShipping }) => {
  // style table
  const tableClass = classNames({
    table: true,
  });

  return (
    <>
      <div className="table-responsive">
        {dataShipping.length > 0 ? (
          <>
            <table className={`table-activity-history-wrap ${tableClass}`}>
              <thead className="table-primary">
                <tr>
                  <th style={{ fontSize: 13 }}>Nama Kurir</th>
                  <th style={{ fontSize: 13 }}>Tipe Pengiriman</th>
                  <th style={{ fontSize: 13 }}>Estimasi Waktu Pengiriman</th>
                  <th style={{ fontSize: 13 }}>Estimasi Harga</th>
                  <th style={{ fontSize: 13 }}>Berat Minimal</th>
                </tr>
              </thead>
              <tbody>
                {dataShipping.map((columns, idx) => (
                  <tr key={idx}>
                    <td className="table-activity-history-body-text text-truncate">
                      <Image
                        alt='image'
                        src={getCourierLogo(columns?.courier)?.logo}
                        width={getCourierLogo(columns?.courier)?.width}
                        height={30}
                      />
                    </td>
                    <td className="table-activity-history-body-text text-truncate text-uppercase pt-2">
                      <span
                        style={{
                          padding: '0px 8px 0px 8px',
                          borderRadius: '2px',
                          backgroundColor: getCourierStatus(
                            columns?.service_type
                          )?.background,
                          color: getCourierStatus(columns?.service_type)
                            ?.textcolor,
                          fontWeight: 700,
                        }}
                      >
                        {columns?.service_type ?? '-'}
                      </span>
                    </td>
                    <td className="table-activity-history-body-text wrapperColumns pt-2">
                      {columns?.estimate_delivery ?? '-'} Hari
                    </td>
                    <td className="table-activity-history-body-text pt-2">
                      <span className="master-sku-product-table-currency">
                        <span>Rp</span>{' '}
                        {formatCurrency(parseFloat(columns?.estimate_price)) ??
                          '-'}
                      </span>
                    </td>
                    <td className="table-activity-history-body-text pt-2">
                      {columns?.minimum_weight ?? '-'}{' '}
                      {columns?.unit_of_measure ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <BlockContent className="card-bordered rounded-0 border-top-0 rounded-bottom-2 shadow-none px-3 py-3">
              <div className={'dataTables_wrapper'}>
                <div className="d-flex justify-content-between align-items-center g-2">
                  <div className="text-center w-100">
                    <div className="text-silent">
                      <Image
                        src={Nodata}
                        width={'auto'}
                        height={'auto'}
                        alt="no-data"
                      />
                      <div className="text-silent">Belum Terdapat Data.</div>
                    </div>
                  </div>
                </div>
              </div>
            </BlockContent>
          </>
        )}
      </div>
    </>
  );
};
