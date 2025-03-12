/* eslint-disable react-hooks/exhaustive-deps */
// react & next
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
import { getActivityHistoryLocation } from '@/services/locations';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';

// utils
import { formatDate } from '@/utils';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParams = searchParams.get('id');
  const [dataActivityHistory, setDataActivityHistory] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);

  // back to edit
  const handleClickEditMasterSku = () => {
    router.back();
  };

  // fetch activity history
  const fetchGetActivityHistory = async () => {
    try {
      const res = await getActivityHistoryLocation(
        idParams,
        paginationModel.page,
        paginationModel.size
      );
      console.log(res);
      if (res?.status === 200) {
        setDataActivityHistory(res?.data?.history_list);
        setTotalRecord(res?.data?.page_info?.total_record);
      }
    } catch (error) {
      // console.log("errrr", error);
    }
  };
  // handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSelectedPageSize(newSize);
    setPaginationModel((prev) => ({ ...prev, size: newSize, page: 1 }));
    setCurrentPage(1);
  };

  // handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
    setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
  };

  useEffect(() => {
    fetchGetActivityHistory();
  }, [paginationModel.page, paginationModel.size, idParams]);

  // style table
  const tableClass = classNames({
    table: true,
  });

  return (
    <>
      <Head title="Gudang" />
      <Content>
        <PreviewCard>
          <p className="text-primary" style={{ fontSize: 12 }}>
            PENGATURAN &nbsp; / GUDANG / &nbsp;DETAIL GUDANG&nbsp; / &nbsp;
            <span style={{ color: '#BDC0C7' }}>Riwayat Aktivitas</span>
          </p>

          <div>
            <p className="text-primary fw-bold" style={{ fontSize: 14 }}>
              Riwayat Aktivitas
            </p>
            {/* table */}
            <div className="table-responsive">
              <table className={`table-activity-history-wrap ${tableClass}`}>
                <thead className="table-primary">
                  <tr>
                    <th>Aktivitas</th>
                    <th>Dilakukan Oleh</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {dataActivityHistory.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="table-activity-history-body-text">
                          {item?.activity ?? '-'}
                        </td>
                        <td className="table-activity-history-body-text">
                          {item?.full_name ?? '-'}
                        </td>
                        <td className="table-activity-history-body-text">
                          {formatDate(item?.created_at) ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
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
}
