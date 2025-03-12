/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import TableUpload, { styles } from './styles';
import { Col } from 'reactstrap';
import {
  Button,
  DropdownOption,
  Icon,
  ModalCancel,
  PagginationFilter,
  PaginationComponent,
} from '@/components';
import { PaginationProps } from '@/utils/type';
import { Skeleton } from 'primereact/skeleton';
import {
  getUploadOrderHistory,
  geDownloadOrderHistory,
} from '@/services/order';
import { UploadOrderHistoryItems } from '@/utils/type/order';
import Image from 'next/image';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';
import moment from 'moment';
import { getOptionUpload } from '@/utils/getSelectOption';
import { Input as Inputs } from 'reactstrap';
import { useSelector } from 'react-redux';
import { UseDelay, getDeferentDate } from '@/utils/formater';
import loadingGif from '@/assets/gift/loading.gif';
interface Props {
  reload?: boolean;
}

const TableUploadOrder = ({ reload }: Props) => {
  const { client_id } = useSelector((state: any) => state?.auth.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [listHistory, setListHistory] = useState<
    UploadOrderHistoryItems[] | null
  >(null);
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    size: 10,
    totalRecord: 0,
  });
  const [selectedSearchOption, setSelectedSearchOption] =
    useState<string>('name');
  const [search, setSearch] = useState<string>('');
  const [modalWaiting, setModalWaiting] = useState<boolean>(false);

  const renderTableHead = () => {
    return (
      <thead className="table-primary" style={styles.Table}>
        <tr style={{ whiteSpace: 'nowrap' }}>
          <th>ID Unggah</th>
          <th>Nama File</th>
          <th>Dilakukan Oleh</th>
          <th>Waktu</th>
          <th>Status</th>
          <th>Hasil</th>
          <th>Aksi</th>
        </tr>
      </thead>
    );
  };

  const handleGetUploadHostory = async (paginations?: PaginationProps) => {
    setLoading(true);
    const payload = {
      search: {
        upload_id: selectedSearchOption === 'id' ? search : '',
        file_name: selectedSearchOption === 'name' ? search : '',
      },
      client_id: client_id,
      page: paginations ? paginations.page : pagination.page,
      size: paginations ? paginations.size : pagination.size,
    };

    const response = await getUploadOrderHistory(payload);
    if (response) {
      setPagination((data) => ({
        ...data,
        totalRecord: response.data.page.total_record,
      }));
      setListHistory(response.data.histories);
    }
    setLoading(false);
  };

  const handleDownlaod = async (id: string, fileName?: string) => {
    setModalWaiting(true);
    const response = await geDownloadOrderHistory(id);

    if (response) {
      const url = window.URL.createObjectURL(
        new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
      );
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      link.remove();
    }

    await UseDelay(1000);
    setModalWaiting(false);
  };

  useEffect(() => {
    handleGetUploadHostory();
  }, []);

  useEffect(() => {
    if (reload) {
      handleGetUploadHostory();
    }
  }, [reload]);

  useEffect(() => {
    if (search.length == 0 && listHistory?.length > 0) {
      handleGetUploadHostory();
    }
  }, [search]);

  const renderTableBody = () => {
    return (
      <tbody style={styles.Body}>
        {loading ? (
          <>
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={i} style={styles.Table}>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'168px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
              </tr>
            ))}
          </>
        ) : (
          <>
            {listHistory && listHistory.length > 0 ? (
              <Fragment>
                {listHistory.map((data, index) => (
                  <tr style={styles.Table} key={index}>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Id} className="text-truncate">
                        {data.upload_id || '-'}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {data.file_name || '-'}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {data.upload_by || '-'}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {moment(data.created_at).format('DD/MM/YY HH:mm')}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Status}>
                        <TableUpload.BadgeStatus success={data.status_id == 2}>
                          <TableUpload.TextStatus success={data.status_id == 2}>
                            {data.status_id == 2 ? 'SELESAI' : 'PROSES'}
                          </TableUpload.TextStatus>
                        </TableUpload.BadgeStatus>
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name}>
                        <TableUpload.ContainerBadgeResult>
                          <TableUpload.BadgeResult success>
                            <TableUpload.TextResult
                              success
                            >{`Berhasil: ${data.success ? data.success : 0}`}</TableUpload.TextResult>
                          </TableUpload.BadgeResult>
                          <TableUpload.BadgeResult success={false}>
                            <TableUpload.TextResult
                              success={false}
                            >{`Gagal: ${data.failed ? data.failed : 0}`}</TableUpload.TextResult>
                          </TableUpload.BadgeResult>
                        </TableUpload.ContainerBadgeResult>
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Action}>
                        <Button
                          type={'button'}
                          className={`justify-center ${getDeferentDate(data.created_at, new Date()) > 7 || data.status_id == 1 || disableButton ? 'btn-disabled' : ''}`}
                          style={styles.ButtonPrimary}
                          color={'primary'}
                          disabled={
                            getDeferentDate(data.created_at, new Date()) > 7 ||
                            data.status_id == 1 ||
                            disableButton
                          }
                          onClick={() =>
                            handleDownlaod(
                              data.upload_id,
                              `Result-${data.upload_id}`,
                            )
                          }
                        >
                          {'Unduh File Pesanan'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ) : null}
          </>
        )}
      </tbody>
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setPagination({ ...pagination, page: pageNumber });
    handleGetUploadHostory({ ...pagination, page: pageNumber });
  };

  const handleSetPageSize = (value: number) => {
    setPagination({ ...pagination, size: value, page: 1 });
    handleGetUploadHostory({ ...pagination, size: value, page: 1 });
  };

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPagination({ ...pagination, page: 1 });
      handleGetUploadHostory({ ...pagination, page: 1 });
    }
  };

  return (
    <Fragment>
      <TableUpload.ContainerAction>
        <TableUpload.ContainerInfo>
          <Icon name={'info'} />
          <TableUpload.TextInfo>
            {
              'Tombol "Unduh File" akan dinonaktifkan setelah 7 hari sejak selesai mengunggah file'
            }
          </TableUpload.TextInfo>
        </TableUpload.ContainerInfo>
        <div className="d-flex">
          <div className="form-wrap">
            <DropdownOption
              className="filter-dropdown"
              options={getOptionUpload}
              optionLabel={'name'}
              placeholder={'Nama Product'}
              value={selectedSearchOption}
              onChange={(e) => setSelectedSearchOption(e.target.value)}
            />
          </div>
          <div className="form-control-wrap">
            <div className="form-icon form-icon-right">
              <Icon
                name="search"
                className="pt-1"
                style={{ color: '#203864', backgroundColor: '#ffffff' }}
              ></Icon>
            </div>
            <Inputs
              type="text"
              className="form-control filter-search shadow-none"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchEnter}
            />
          </div>
        </div>
      </TableUpload.ContainerAction>
      <TableUpload.Container>
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table className={'table'}>
            {renderTableHead()}
            {renderTableBody()}
          </table>
          {!listHistory ||
            (listHistory.length == 0 && (
              <TableUpload.ContainerEmpty>
                <Image
                  width={120}
                  height={80}
                  src={NodataSKU}
                  alt="image-no-data"
                />
                <TableUpload.TextEmpty>
                  {'Data Tidak Ditemukan.'}
                </TableUpload.TextEmpty>
              </TableUpload.ContainerEmpty>
            ))}
        </div>
        <Col xs={12} lg={12}>
          {listHistory && listHistory.length > 0 ? (
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
                setPageSize={(value: number) => handleSetPageSize(value)}
              />
            </div>
          ) : null}
        </Col>
      </TableUpload.Container>
      {modalWaiting && (
        <ModalCancel
          icon={loadingGif}
          widthImage={400}
          heightImage={225}
          modalContentStyle={styles.ModalContentStyleWaiting}
          separatedRound
          iconStyle={{ zoom: 1.4, objectFit: 'cover', marginBottom: 175 }}
          modalBodyStyle={styles.ModalLoading}
          title={'Sedang Proses Unduh ...'}
          subtitle={'Tunggu ya, file kamu sedang dalam proses unduh'}
          useTimer={false}
          buttonConfirmation={false}
          handleClickYes={() => {}}
          handleClickCancelled={() => {}}
          textSubmit={''}
          toggle={false}
        />
      )}
    </Fragment>
  );
};

export default TableUploadOrder;
