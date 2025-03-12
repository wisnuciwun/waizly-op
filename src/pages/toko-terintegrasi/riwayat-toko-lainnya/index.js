// react & next
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Badge } from 'reactstrap';

//component
import {
  Head,
  PreviewCard,
  BlockContent,
  PaginationComponent,
  Button,
} from '@/components';
import classNames from 'classnames';

//layout
import Content from '@/layout/content/Content';

// redux & service
import { getHistoryStore } from '@/services/storeIntegration';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';

// utils
import { formatDate } from '@/utils';

const ActivityHistory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParams = searchParams.get('id');
  const [dataActivityHistory, setDataActivityHistory] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);

  // handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
    setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
  };

  // back to edit
  const handleClickEditMasterSku = () => {
    router.push({
      pathname: '/toko-terintegrasi/edit-toko-lainya',
      query: { id: idParams },
    });
  };

  // fetch activity history
  const fetchGetHistory = async () => {
    try {
      const res = await getHistoryStore(idParams, {
        page: paginationModel.page,
        size: paginationModel.size,
      });

      if (res?.status === 200) {
        setDataActivityHistory(res?.data?.history_list);
        setTotalRecord(res?.data?.page_info?.total_record);
      }
    } catch (error) {}
  };

  // handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSelectedPageSize(newSize);
    setPaginationModel((prev) => ({ ...prev, size: newSize }));
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  useEffect(() => {
    fetchGetHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.size]);

  // style table
  const tableClass = classNames({
    table: true,
  });

  return (
    <>
      <Head title="Toko Terintegrasi" />
      <Content>
        <PreviewCard>
          <p className="text-primary">
            TOKO TERINTEGRASI&nbsp; / &nbsp;DETAIL TOKO&nbsp; / &nbsp;
            <span style={{ color: '#BDC0C7' }}>Riwayat Toko</span>
          </p>

          <div>
            <p className="text-primary fw-bold" style={{ fontSize: 14 }}>
              Riwayat Toko
            </p>
            {/* table */}
            <div className="table-responsive">
              <table className={`table-activity-history-wrap ${tableClass}`}>
                <thead className="table-primary">
                  <tr>
                    <th>Aktivitas</th>
                    <th>Dilakukan Oleh</th>
                    <th>Waktu</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataActivityHistory.map((item, index) => (
                    <tr key={item?.id ?? index}>
                      <td className="table-activity-history-body-text">
                        {item?.activity ?? '-'}
                      </td>
                      <td className="table-activity-history-body-text">
                        {item?.full_name ?? '-'}
                      </td>
                      <td className="table-activity-history-body-text">
                        {formatDate(item?.created_at) ?? '-'}
                      </td>
                      <td className="table-activity-history-body-text">
                        <span className="tb-sub">
                          <Badge
                            className="badge-dim"
                            color={
                              item.parent_status === 'Connected'
                                ? 'success'
                                : item.parent_status === 'Problem Authorizing'
                                  ? 'danger'
                                  : item.parent_status === 'Authorizing'
                                    ? 'warning'
                                    : item.parent_status === 'No Mapping'
                                      ? 'secondary'
                                      : 'danger'
                            }
                          >
                            {item.parent_status === 'Connected'
                              ? 'TERKONEKSI'
                              : item.parent_status === 'Problem Authorizing'
                                ? 'INTEGRASI TERKENDALA'
                                : item.parent_status === 'Authorizing'
                                  ? 'PROSES INTEGRASI'
                                  : item.parent_status === 'No Mapping'
                                    ? 'NO MAPPING'
                                    : 'danger'}
                          </Badge>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <BlockContent className="card-bordered rounded-0 border-top-0 rounded-bottom-2 shadow-none px-3 py-3">
                <div className={'dataTables_wrapper'}>
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start">
                      {dataActivityHistory.length > 0 && (
                        <PaginationComponent
                          itemPerPage={selectedPageSize}
                          totalItems={totalRecord}
                          paginate={handlePageChange}
                          currentPage={currentPage}
                        />
                      )}
                    </div>
                    <div className="text-center w-100">
                      {/* Modified this line */}
                      {dataActivityHistory.length > 0 ? (
                        <div className="datatable-filter text-end">
                          <div
                            className="dataTables_length"
                            id="DataTables_Table_0_length"
                          >
                            <label>
                              <span className="d-none d-sm-inline-block">
                                Data Per Halaman
                              </span>
                              <div className="form-control-select">
                                <select
                                  name="DataTables_Table_0_length"
                                  className="custom-select custom-select-sm form-control form-control-sm"
                                  value={selectedPageSize}
                                  onChange={(e) => handlePageSizeChange(e)}
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
                            width={'auto'}
                            height={'auto'}
                            alt="no-data"
                          />
                          <div className="text-silent">
                            Belum Terdapat Data.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </BlockContent>
            </div>
            <Button
              onClick={() => handleClickEditMasterSku()}
              className="text-primary float-end mt-4"
              style={{ fontSize: 14 }}
            >
              Kembali
            </Button>
          </div>
        </PreviewCard>
      </Content>
    </>
  );
};

export default ActivityHistory;
