/* eslint-disable react-hooks/exhaustive-deps */
// React
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// layout
import Content from '@/layout/content/Content';

// component
import {
  Head,
  Block,
  BlockContent,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  PreviewAltCard,
  Button,
  Icon,
  PaginationComponent,
  SkeletonLoading,
} from '@/components';
import {
  DataTableHead,
  DataTableRow,
  DataTableItem,
  DataTableTitle,
  DataTableBody,
} from '@/components/molecules/table/table-master-sku';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';

// redux & service
import { useSelector } from 'react-redux';
import { getListWerehouse } from '@/services/locations';

// utils
import { UseDelay } from '@/utils/formater';
import { getStatusLabelTypeWerehouse } from '@/utils/getStatus';
import { usePermissions } from '@/utils/usePermissions';

const Werehouse = () => {
  const permissions = usePermissions();

  const [dataWerehouse, setDataWerehouse] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  // next
  const route = useRouter();

  // redux
  const { client_id } = useSelector((state) => state.auth.user);

  // handle go to form add
  const handleClickAddGudang = () => {
    route.push({
      pathname: '/pengaturan/gudang/form-gudang',
      query: { action: 'add' },
    });
  };

  // handle go to form edit and detail
  const handleClickEdit = (id) => {
    route.push({
      pathname: '/pengaturan/gudang/form-gudang',
      query: { action: 'edit', id },
    });
  };

  // fetch data list werehouse
  const fetchGetWerehouse = async () => {
    try {
      setLoading(true);
      const res = await getListWerehouse({
        client_id,
        search: {
          location_code: null,
          location_name: null,
        },
        page: paginationModel.page,
        size: paginationModel.size,
      });
      if (res?.status === 200) {
        setDataWerehouse(res?.data?.locations);
        setTotalRecord(res?.data?.page_info?.total_record);
      }
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        route.push('/login');
      }
    } finally {
      await UseDelay(500);
      setLoading(false);
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
    fetchGetWerehouse();
  }, [currentPage, paginationModel.page, paginationModel.size]);

  return (
    <>
      <Head title="Gudang" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockBetween>
              <BlockTitle>Gudang</BlockTitle>
              <Button
                color="primary"
                style={{ height: 43, fontSize: 14 }}
                onClick={handleClickAddGudang}
                className={!permissions?.includes('Tambah Gudang') && 'btn-disabled'}
                disabled={!permissions?.includes('Tambah Gudang')}
              >
                Tambah Gudang
              </Button>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>
        <div style={{ marginTop: -25 }}>
          <BlockContent>
            <Block>
              <div className="card-inner-group">
                <div className="card-inner p-0 border-0 overflow-x-auto">
                  <DataTableBody className="master-sku-nk-tb-list is-separate my-3">
                    <DataTableHead className="master-sku-nk-tb-item">
                      <DataTableRow>
                        <DataTableTitle>
                          <span>Kode Gudang</span>
                        </DataTableTitle>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <DataTableTitle>
                          <span>Nama Gudang</span>
                        </DataTableTitle>
                      </DataTableRow>
                      <DataTableRow>
                        <DataTableTitle className="d-flex align-items-center justify-content-between">
                          <span>Tipe Gudang</span>
                        </DataTableTitle>
                      </DataTableRow>
                      <DataTableRow size="sm">
                        <DataTableTitle>
                          <span>Penanggung Jawab</span>
                        </DataTableTitle>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <DataTableTitle>
                          <span>Detail Alamat</span>
                        </DataTableTitle>
                      </DataTableRow>
                      <DataTableRow>
                        <DataTableTitle className="d-flex align-items-center justify-content-between">
                          <span>Total Toko Terhubung</span>
                        </DataTableTitle>
                      </DataTableRow>

                      <DataTableRow>
                        <DataTableTitle>
                          <span style={{ marginLeft: 11 }}>Aksi</span>
                        </DataTableTitle>
                      </DataTableRow>
                    </DataTableHead>
                    {loading ? (
                      <>
                        {dataWerehouse.map((item) => (
                          <DataTableItem key={item?.id}>
                            {[...Array(7)].map((_, index) => (
                              <DataTableRow
                                size="md"
                                className="p-0"
                                key={index}
                              >
                                <SkeletonLoading
                                  width={'100%'}
                                  height={'100px'}
                                  className="rounded-0"
                                />
                              </DataTableRow>
                            ))}
                          </DataTableItem>
                        ))}
                      </>
                    ) : (
                      <>
                        {dataWerehouse.map((item, index) => (
                          <DataTableItem key={index}>
                            <DataTableRow>
                              <div
                                style={{ minWidth: '6rem', maxWidth: '6rem' }}
                              >
                                <span className="sub-text text-truncate">
                                  {item?.location_code ?? '-'}
                                </span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div
                                style={{ minWidth: '10rem', maxWidth: '10rem' }}
                              >
                                <span className="sub-text fw-bold text-truncate">
                                  {item?.location_name ?? '-'}
                                </span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div
                                style={{ minWidth: '11rem', }}
                              >
                                <span
                                  className="sub-text text-truncate fw-bold"
                                  style={{
                                    color: getStatusLabelTypeWerehouse(
                                      item?.location_type_name
                                    )?.color,
                                    backgroundColor:
                                      getStatusLabelTypeWerehouse(
                                        item?.location_type_name
                                      )?.backgroundColor,
                                    padding: '0px 8px 0px 8px',
                                    borderRadius: '2px',
                                    width: 'fit-content'
                                  }}
                                >
                                  {getStatusLabelTypeWerehouse(
                                      item?.location_type_name
                                    )?.text ?? '-'}
                                </span>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div
                                style={{ minWidth: '11rem', maxWidth: '11rem' }}
                              >
                                <span className="sub-text fw-bold text-truncate">
                                  {item?.pic ?? '-'}
                                  <p className="sub-text text-truncate fw-light">
                                    {item?.phone
                                      ? item.phone.startsWith('0')
                                        ? `+62${item.phone.slice(1)}`
                                        : item.phone.startsWith('62')
                                          ? `+${item.phone}`
                                          : `+62${item.phone}`
                                      : '-'}
                                  </p>
                                </span>
                              </div>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <div
                                style={{ minWidth: '19rem', maxWidth: '19rem' }}
                              >
                                <span className="sub-text text-truncate">
                                  {item?.full_address ?? '-'}
                                  <p className="sub-text fw-bold text-truncate">
                                    {item?.detail_address ?? '-'}
                                  </p>
                                </span>
                              </div>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <div
                                style={{ minWidth: '8rem', maxWidth: '8rem' }}
                              >
                                <span className="sub-text float-end">
                                  {item?.connected_store ?? '-'}
                                </span>
                              </div>
                            </DataTableRow>
                            <DataTableRow>
                              <Button
                                size="lg"
                                onClick={() =>
                                  handleClickEdit(item?.location_id)
                                }
                                style={{ marginLeft: -10 }}
                                disabled={!permissions?.includes('Lihat Detail & Edit Gudang')}
                              >
                                <Icon name="edit" />
                              </Button>
                            </DataTableRow>
                          </DataTableItem>
                        ))}
                      </>
                    )}
                  </DataTableBody>
                </div>
                <PreviewAltCard className="border-0 shadow-none">
                  <div className={'dataTables_wrapper'}>
                    <div className="d-flex justify-content-between align-items-center g-2">
                      <div className="text-start">
                        {dataWerehouse.length > 0 && (
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
                        {dataWerehouse.length > 0 ? (
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
                              alt="waizly-logo"
                            />
                            <div className="text-silent">
                              Belum Terdapat Data.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PreviewAltCard>
              </div>
            </Block>
          </BlockContent>
        </div>
      </Content>
    </>
  );
};

export default Werehouse;
