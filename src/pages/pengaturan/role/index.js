/* eslint-disable react-hooks/exhaustive-deps */
// React
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// layout
import Content from '@/layout/content/Content';
// third party
import classNames from 'classnames';

// component
import {
  Head,
  BlockHead,
  BlockHeadContent,
  BlockBetween,
  Button,
  Icon,
  PaginationComponent,
  SkeletonLoading,
  DataTableItem,
  DataTableRow,
  ModalConfirm,
} from '@/components';
import { headerTableRole } from '@/components/molecules/table/TableData';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';
import Warning from '@/assets/gift/Anxiety.gif';

// redux & service
import { useSelector } from 'react-redux';
import { getListRole } from '@/services/role';

// utils
import { UseDelay } from '@/utils/formater';
import { formatDate } from '@/utils';
import { usePermissions } from '@/utils/usePermissions';

const Role = () => {
  const permissions = usePermissions();

  const [dataRole, setDataRole] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [modalMaxData, setModalMaxData] = useState(false);

  // toggle for modal
  const toggle = () => setModalMaxData(!modalMaxData);

  // next
  const route = useRouter();

  // redux
  const { client_id } = useSelector((state) => state.auth.user);

  // handle go to form add
  const handleClickAddRole = () => {
    if (totalRecord > 9) {
      setModalMaxData(true);
    } else {
      route.push({
        pathname: '/pengaturan/role/form-role',
        query: { action: 'add' },
      });
    }
  };

  //   // handle go to form edit and detail
  const handleClickEdit = (id) => {
    route.push({
      pathname: '/pengaturan/role/form-role',
      query: { action: 'edit', id },
    });
  };

  // fetch data list werehouse
  const fetchGetListRole = async () => {
    try {
      setLoading(true);
      const res = await getListRole({
        client_id,
        page: paginationModel.page,
        size: paginationModel.size,
      });
      if (res?.status === 200) {
        setDataRole(res?.data?.roles);
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

  //   // handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
    setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
  };

  useEffect(() => {
    fetchGetListRole();
  }, [currentPage, paginationModel.page, paginationModel.size]);

  // class table
  const tableClass = classNames({
    table: true,
    'table-bordered': false,
    'table-borderless': true,
    'table-striped': true,
    'table-hover': true,
  });

  return (
    <>
      <Head title="Role" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            {loading ? (
              <>
                <BlockBetween>
                  <SkeletonLoading
                    width={'15%'}
                    height={'35px'}
                    className="rounded-0"
                  />
                  <SkeletonLoading
                    width={'15%'}
                    height={'35px'}
                    className="rounded-0"
                  />
                </BlockBetween>
              </>
            ) : (
              <>
                <BlockBetween>
                  <h4 fontSize={24}>Role ({totalRecord}/10)</h4>
                  <Button
                    color="primary"
                    style={{ height: 43, fontSize: 14 }}
                    onClick={handleClickAddRole}
                    className={
                      !permissions?.includes('Tambah Role') && 'btn-disabled'
                    }
                    disabled={!permissions?.includes('Tambah Role')}
                  >
                    Tambah Role ({totalRecord}/10)
                  </Button>
                </BlockBetween>
              </>
            )}
          </BlockHeadContent>
        </BlockHead>
        <div style={{ backgroundColor: 'white' }}>
          <div className="table-responsive">
            <table className={tableClass}>
              <thead>
                <tr>
                  {headerTableRole.header.map((item, idx) => {
                    return (
                      <th
                        key={idx}
                        className="fw-normal"
                        style={{
                          fontSize: 13,
                          color: '#4C4F54',
                          paddingTop: 15,
                          paddingBottom: 15,
                        }}
                      >
                        {item}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[...Array(7)].map((_, index) => (
                      <DataTableItem key={index}>
                        {[...Array(7)].map((_, index) => (
                          <DataTableRow size="md" className="p-0" key={index}>
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
                    {dataRole.map((item, index) => (
                      <tr style={{ fontSize: 13 }} key={index}>
                        <td
                          style={{
                            minWidth: 250,
                            maxWidth: 250,
                            paddingTop: 40,
                          }}
                        >
                          <p
                            className="text-truncate"
                            style={{ color: '#4C4F54' }}
                          >
                            {item?.role_name
                              ? item.role_name.replace('_', ' ')
                              : '-'}
                          </p>
                        </td>
                        <td
                          style={{
                            minWidth: 300,
                            maxWidth: 300,
                            paddingTop: 40,
                          }}
                        >
                          <p
                            className="text-truncate"
                            style={{ color: '#4C4F54' }}
                          >
                            {item?.description ? item?.description : '-'}
                          </p>
                        </td>
                        <td
                          style={{
                            minWidth: 200,
                            maxWidth: 200,
                            paddingTop: 40,
                          }}
                        >
                          <p
                            className="text-truncate"
                            style={{ color: '#4C4F54' }}
                          >
                            {item?.number_of_sub_account ?? '-'}
                          </p>
                        </td>
                        <td
                          className="d-flex flex-column"
                          style={{ minWidth: 200, color: '#4C4F54' }}
                        >
                          <div>
                            <span className="fw-bold">Waktu Dibuat</span>
                            <p>{formatDate(item?.created_at) ?? '-'}</p>
                          </div>
                          <div>
                            <span className="fw-bold">Waktu Diperbarui</span>
                            <p>{formatDate(item?.updated_at) ?? '-'}</p>
                          </div>
                        </td>
                        <td style={{ paddingTop: 28 }}>
                          <div
                            className={`${
                              item?.role_name === 'SELLER_OWNER'
                                ? 'd-none'
                                : 'd-flex'
                            }`}
                          >
                            <Button
                              size="lg"
                              onClick={() => handleClickEdit(item?.role_id)}
                              style={{ marginLeft: -23 }}
                              disabled={
                                !permissions?.includes(
                                  'Lihat Detail & Edit Role'
                                )
                              }
                            >
                              <Icon name="edit" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`${loading ? 'd-none' : 'dataTables_wrapper'}`}
            style={{
              backgroundColor: 'white',
              padding: '15px 20px 15px 20px',
              borderTop: dataRole.length > 0 ? '1.5px solid #eceef4' : 'none',
              // marginTop: -16,
            }}
          >
            <div className="d-flex justify-content-between align-items-center g-2">
              <div className="text-start">
                {dataRole.length > 0 && (
                  <PaginationComponent
                    itemPerPage={selectedPageSize}
                    totalItems={totalRecord}
                    paginate={handlePageChange}
                    currentPage={currentPage}
                  />
                )}
              </div>
              <div className="text-center w-100">
                {dataRole.length > 0 ? (
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
                    <div className="text-silent">Belum Terdapat Data.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Content>

      {modalMaxData && (
        <ModalConfirm
          icon={Warning}
          widthImage={390}
          heightImage={320}
          modalContentStyle={{ width: 390 }}
          modalBodyStyle={{
            width: 440,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            marginLeft: '-25px',
            paddingLeft: 40,
            paddingRight: 40,
            marginBottom: 13,
            height: '185px',
          }}
          toggle={toggle}
          title={'Batas jumlah role sudah tercapai'}
          subtitle={
            'Kamu sudah menggunakan seluruh kuota role yaitu 10 role per akun. Silahkan hubungi tim kami untuk request penambahan kuota role.'
          }
          useTimer={false}
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};

export default Role;
