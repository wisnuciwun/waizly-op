/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  geUploadOrderHistory,
  geUploadOrderHistoryCsv,
  getDownloadOrderHistory,
} from '@/services/order';
import { DownloadOrderHistoryItems } from '@/utils/type/order';
import Image from 'next/image';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';
import moment from 'moment';
import { getOptionDownlaod } from '@/utils/getSelectOption';
import { Input as Inputs } from 'reactstrap';
import { useSelector } from 'react-redux';
import { UseDelay, getDeferentDate } from '@/utils/formater';
import loadingGif from '@/assets/gift/loading.gif';
interface Props {
  reload: boolean;
}

const TableDownloadOrder = ({ reload }: Props) => {
  const { client_id } = useSelector((state: any) => state?.auth.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [listHistory, setListHistory] = useState<
    DownloadOrderHistoryItems[] | null
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
          <th>ID Unduh</th>
          <th>Nama Toko</th>
          <th>Dilakukan Oleh</th>
          <th>Waktu</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
    );
  };

  const handleGetUploadHostory = async (paginations?: PaginationProps) => {
    setLoading(true);
    const payload = {
      search: {
        download_id: selectedSearchOption === 'id' ? search : '',
        store_name: selectedSearchOption === 'name' ? search : '',
      },
      client_id: client_id,
      page: paginations ? paginations.page : pagination.page,
      size: paginations ? paginations.size : pagination.size,
    };

    const response = await getDownloadOrderHistory(payload);
    if (response) {
      setPagination((data) => ({
        ...data,
        totalRecord: response.data.page.total_record,
      }));
      setListHistory(response.data.downloadHistories);
    }
    setLoading(false);
  };

  const handleDownlaod = async (
    id: string,
    fileName: string,
    types: string,
  ) => {
    setModalWaiting(true);
    let response: any = {};
    if (types === 'csv') {
      response = await geUploadOrderHistoryCsv(id);
    } else {
      response = await geUploadOrderHistory(id);
    }

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
              <tr style={styles.Table} key={i}>
                <td className="table-activity-history-body-text text-truncate">
                  <Skeleton
                    width={'168px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>

                <td className="table-activity-history-body-text text-truncate">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text text-truncate">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text text-truncate">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text text-truncate">
                  <Skeleton
                    width={'184px'}
                    height={'20px'}
                    shape={'rectangle'}
                  />
                </td>
                <td className="table-activity-history-body-text text-truncate">
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
          <Fragment>
            {listHistory && listHistory.length > 0 ? (
              <Fragment>
                {listHistory.map((data, index) => (
                  <tr style={styles.Table} key={index}>
                    <td className="table-activity-history-body-text text-truncate">
                      <div style={styles.Id}>{data.download_id || '-'}</div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {data.store_name || '-'}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {data.request_by || '-'}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Name} className="text-truncate">
                        {moment(data.created_at).format('DD/MM/YY HH:mm')}
                      </div>
                    </td>
                    <td className="table-activity-history-body-text">
                      <div style={styles.Status} className="text-truncate">
                        <TableUpload.BadgeStatus
                          success={data.status_request == 2}
                        >
                          <TableUpload.TextStatus
                            success={data.status_request == 2}
                          >
                            {data.status_request == 2 ? 'SELESAI' : 'PROSES'}
                          </TableUpload.TextStatus>
                        </TableUpload.BadgeStatus>
                      </div>
                    </td>

                    <td className="table-activity-history-body-text">
                      <div style={styles.Action} className="text-truncate">
                        <Button
                          type={'button'}
                          className={`justify-center ${getDeferentDate(data.created_at, new Date()) > 7 || !data.status_request || data.status_request == 1 || disableButton ? 'btn-disabled' : ''}`}
                          style={styles.ButtonPrimary}
                          color={'primary'}
                          disabled={
                            getDeferentDate(data.created_at, new Date()) > 7 ||
                            !data.status_request ||
                            data.status_request == 1 ||
                            disableButton
                          }
                          onClick={() =>
                            handleDownlaod(
                              data.download_id,
                              `Result-${data.download_id}.${data.file_type}`,
                              data.file_type,
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
          </Fragment>
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
              options={getOptionDownlaod}
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
                style={{ color: '#203864' }}
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
          heightImage={250}
          modalContentStyle={styles.ModalContentStyleWaiting}
          separatedRound
          iconStyle={{ zoom: 1.4, objectFit: 'cover', marginBottom: 150 }}
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

export default TableDownloadOrder;
