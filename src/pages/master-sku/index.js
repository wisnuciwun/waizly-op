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
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  Button,
  DropdownOption,
  Icon,
  BlockContent,
  PreviewAltCard,
  PaginationComponent,
  Tabs,
  dataTabsMasterSku,
  SkeletonLoading,
} from '@/components';
import {
  DataTableHead,
  DataTableRow,
  DataTableItem,
  DataTableTitle,
  DataTableBody,
} from '@/components/molecules/table/table-master-sku';
import ModalConfirmationFormMasterSku from '@/components/atoms/modal/modal-form-master-sku';
import { Input } from 'reactstrap';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';

// utils
import { getOptionMasterSku } from '@/utils/getSelectOption';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils';
import { UseDelay } from '@/utils/formater';

// redux & service
import { useSelector } from 'react-redux';
import { getMasterSku, getCountMasterSku } from '@/services/master';
import ModalExport from '@/components/atoms/modal/modal-export';
import ModalImport from '@/components/atoms/modal/modal-import';
import exportGif from '@/assets/gift/export.gif';
import importGif from '@/assets/gift/upload.gif';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';

import { usePermissions } from '@/utils/usePermissions';
import ModalConfirm from '@/components/atoms/modal/modal-confirm/modalConfirm';
import { ModalConfirm as ModalPending } from '@/components';
import loadingGif from '@/assets/gift/loading.gif';
import succesUploadGif from '@/assets/gift/success-create-sku.gif';
import failedUploadGif from '@/assets/gift/Anxiety.gif';
import colors from '@/utils/colors';

const MasterSku = () => {
  const permissions = usePermissions();
  const [dataMasterSku, setDataMasterSku] = useState([]);
  const [dataCountMasterSku, setDataCountMasterSku] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('all');
  const [modalAddConfirmation, setModalAddConfirmation] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState('name');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [sortOption, setSortOption] = useState({
    sort_by: 'name',
    sort_type: 'asc',
  });
  const [defaultFiles, setDefaultFiles] = useState(null);

  // next
  const route = useRouter();

  // redux
  const { client_id } = useSelector((state) => state.auth.user);

  const [modalExport, setModalExport] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalPending, setModalPending] = useState(false);
  const [modalErrorTypeFile, setModalErrorTypeFile] = useState(false);
  const [modalSuccesUpload, setModalSuccesUpload] = useState(false);
  const [operationCounts, setOperationCounts] = useState({
    successCount: 0,
    failedCount: 0
  });
  const handleModalExport = () => setModalExport((prev) => !prev);
  const handleModalConfirm = () => setModalConfirm((prev) => !prev);
  const handleModalImport = () => setModalImport((prev) => !prev);

  const handleActionButton = () => setModalAddConfirmation((prev) => !prev);

  const handleClickSingleSKU = () => {
    route.push({
      // pathname: "/master-sku/form-master-sku",
      pathname: '/master-sku/create',
      // query: { action: "add" },
    });
  };

  const handleClickBundling = () => {
    route.push({
      // pathname: "/master-sku/form-master-sku-bundling",
      pathname: '/master-sku/create-bundling',
      // query: { action: "add" },
    });
  };

  const handleClickEdit = (id, type) => {
    if (type === 'SINGLE') {
      route.push({
        // pathname: "/master-sku/form-master-sku",
        pathname: `/master-sku/edit/${id}`,
        // query: { action: "edit", id },
      });
    } else {
      route.push({
        // pathname: "/master-sku/form-master-sku-bundling",
        pathname: `/master-sku/edit-bundling/${id}`,
        // query: { action: "edit", id },
      });
    }
  };

  // fetch get master sku
  const fetchGetMasterSku = async () => {
    try {
      setLoading(true);
      const res = await getMasterSku({
        client_id,
        type: activeTab,
        sku: selectedSearchOption === 'sku' ? search : null,
        name: selectedSearchOption === 'name' ? search : null,
        sort_by: sortOption.sort_by,
        sort_type: sortOption.sort_type,
        page: paginationModel.page,
        size: paginationModel.size,
      });
      if (res?.status === 200) {
        setDataMasterSku(res?.data?.products);
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

  // fetch get count master sku
  const fetchCountMasterSku = async () => {
    try {
      setLoadingTabs(true);
      const res = await getCountMasterSku({
        client_id,
      });
      if (res?.status === 200) {
        setDataCountMasterSku(res?.data);
      }
    } catch (error) {
      setLoadingTabs(false);
      // console.log("errrr", error);
    } finally {
      await UseDelay(500);
      setLoadingTabs(false);
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

  // handle tabs change
  const handleTabChange = async (selectedTab) => {
    if (selectedTab !== activeTab) {
      setPaginationModel((prev) => ({ ...prev, page: 1 }));
      setCurrentPage(1);
    }
    setActiveTab(selectedTab);
  };

  // handle sort change
  const handleSortChange = (sortField) => {
    const newSortType =
      sortOption.sort_by === sortField && sortOption.sort_type === 'asc'
        ? 'desc'
        : 'asc';

    setSortOption({ sort_by: sortField, sort_type: newSortType });
  };

  // handle enter search
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      fetchGetMasterSku();
    }
  };

  useEffect(() => {
    fetchGetMasterSku();
  }, [
    currentPage,
    paginationModel.page,
    paginationModel.size,
    activeTab,
    sortOption,
  ]);

  useEffect(() => {
    fetchCountMasterSku(activeTab);
  }, []);

  const handleSuccesUpload = () => {
    setModalPending(false);
    setModalSuccesUpload(true);
    setDefaultFiles(null);
  };

  // count data tabs
  const totalSingleCount =
    parseInt(
      dataCountMasterSku.find((item) => item?.name === 'SINGLE')?.count
    ) || 0;
  const totalBundlingCount =
    parseInt(
      dataCountMasterSku.find((item) => item?.name === 'BUNDLING')?.count
    ) || 0;

  const allItemTabs = dataCountMasterSku.findIndex(
    (item) => item?.name === 'ALL'
  );
  if (allItemTabs === -1) {
    const totalCount = totalSingleCount + totalBundlingCount;
    dataCountMasterSku.unshift({
      name: 'ALL',
      count: totalCount.toString(),
    });
  } else {
    dataCountMasterSku[allItemTabs].count = (
      totalSingleCount + totalBundlingCount
    ).toString();
  }

  const handleGifCondition = operationCounts?.failedCount !== 0 && operationCounts?.successCount === 0 ? failedUploadGif : succesUploadGif;
  const handleTextImportHeader = operationCounts?.successCount !== 0 ? 'Berhasil Mengunggah Master SKU!' : 'Gagal Mengunggah Master SKU!';
  const handleTextImportSubaccount = (operationCounts?.failedCount !== 0 && operationCounts?.successCount !== 0) ? 'Proses unggah Master SKU telah berhasil! Silakan periksa pada file hasil unggah Master SKU yang telah berhasil diunduh secara otomatis.' : (operationCounts?.failedCount !== 0 && operationCounts?.successCount === 0) ? 'Kami akan mengembalikan file kamu yang diunduh secara otomatis, dan kamu dapat melihat data-data Master SKU mana saja yang tidak sesuai untuk di-unggah dalam file tersebut' : '';
  const handleHeightModal = operationCounts?.failedCount === 0 && operationCounts?.successCount !== 0;

  return (
    <>
      <Head title="Master SKU" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockBetween>
              <BlockTitle style={{ fontSize: 24 }}>Master SKU</BlockTitle>
              <div>
                <Button
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={handleModalExport}
                >
                  <Icon
                    name="download-cloud"
                    style={{ color: '#203864' }}
                  ></Icon>
                  <div style={{ paddingLeft: 3 }}>Unduh SKU</div>
                </Button>

                <Button
                  disabled={
                    !permissions?.includes('Tambah Bundling SKU') &&
                    !permissions?.includes('Tambah Single SKU')
                  }
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={handleModalImport}
                >
                  <Icon name="upload-cloud" style={{ color: '#203864' }}></Icon>
                  <div style={{ paddingLeft: 3 }}>Unggah SKU</div>
                </Button>

                <Button
                  color="primary"
                  style={{ height: 43, fontSize: 14 }}
                  onClick={handleActionButton}
                  className={
                    !permissions?.includes('Tambah Bundling SKU') &&
                    !permissions?.includes('Tambah Single SKU') &&
                    'btn-disabled'
                  }
                  disabled={
                    !permissions?.includes('Tambah Bundling SKU') &&
                    !permissions?.includes('Tambah Single SKU')
                  }
                >
                  Tambah Master SKU
                </Button>
              </div>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>
        <BlockContent>
          <div className="d-flex justify-content-lg-between justify-content-sm-start flex-sm-column flex-lg-row">
            <div>
              {loadingTabs ? (
                <>
                  <SkeletonLoading width={'350px'} height={'40px'} />
                </>
              ) : (
                <>
                  <Tabs
                    tabsData={dataTabsMasterSku}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    tabCounts={dataCountMasterSku.map((item) =>
                      item.count > 0 ? item.count : '0'
                    )}
                  />
                </>
              )}
            </div>

            <div className="mt-2">
              {loadingTabs ? (
                <>
                  <SkeletonLoading width={'350px'} height={'40px'} />
                </>
              ) : (
                <div className="d-flex">
                  <div className="form-wrap">
                    <DropdownOption
                      className="filter-dropdown"
                      options={getOptionMasterSku}
                      optionLabel={'name'}
                      placeholder={'Pilih'}
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
                    <Input
                      type="text"
                      className="form-control filter-search shadow-none"
                      placeholder="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleSearchEnter}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Block>
            <div className="card-inner-group">
              <div className="card-inner p-0 border-0 overflow-x-auto">
                <DataTableBody className="master-sku-nk-tb-list is-separate my-3">
                  <DataTableHead className="master-sku-nk-tb-item">
                    <DataTableRow>
                      <DataTableTitle>
                        <span>Nama SKU</span>
                        <Button
                          onClick={() => handleSortChange('name')}
                          size="sm"
                        >
                          <Icon name="swap-v" style={{ cursor: 'pointer' }} />
                        </Button>
                      </DataTableTitle>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <DataTableTitle>
                        <span>Tipe</span>
                      </DataTableTitle>
                    </DataTableRow>
                    <DataTableRow>
                      <DataTableTitle className="d-flex align-items-center justify-content-between">
                        <span>Kode SKU</span>
                        <Button
                          onClick={() => handleSortChange('sku')}
                          size="sm"
                        >
                          <Icon name="swap-v" style={{ cursor: 'pointer' }} />
                        </Button>
                      </DataTableTitle>
                    </DataTableRow>
                    {activeTab === 'bundling' && (
                      <>
                        <DataTableRow size="sm">
                          <DataTableTitle>
                            <span>Gudang</span>
                          </DataTableTitle>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <DataTableTitle>
                            <span>Stok</span>
                          </DataTableTitle>
                        </DataTableRow>
                      </>
                    )}
                    <DataTableRow size="sm">
                      <DataTableTitle>
                        <span>Produk Toko Terhubung</span>
                      </DataTableTitle>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <DataTableTitle>
                        <span>Referensi Harga</span>
                      </DataTableTitle>
                    </DataTableRow>
                    <DataTableRow>
                      <DataTableTitle className="d-flex align-items-center justify-content-between">
                        <span>Waktu Dibuat</span>
                        <Button
                          onClick={() => handleSortChange('created_at')}
                          size="sm"
                        >
                          <Icon name="swap-v" style={{ cursor: 'pointer' }} />
                        </Button>
                      </DataTableTitle>
                    </DataTableRow>

                    <DataTableRow>
                      <DataTableTitle>
                        <span>Aksi</span>
                      </DataTableTitle>
                    </DataTableRow>
                  </DataTableHead>
                  {loading ? (
                    <>
                      {dataMasterSku.map((item) => (
                        <DataTableItem key={item?.id}>
                          {[...Array(activeTab === 'bundling' ? 9 : 7)].map((_, index) => (
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
                      {dataMasterSku.map((item) => (
                        <DataTableItem key={item?.id}>
                          <DataTableRow>
                            <div
                              className="master-sku-product-table-card mt-2 mb-2"
                              style={{ minWidth: '21rem', maxWidth: '21rem' }}
                            >
                              <Image
                                src={item?.product_image_url || ilustrationCamera}
                                width={48}
                                height={48}
                                alt={'image-browser'}
                              />

                              <div className="master-sku-product-table-info text-truncate">
                                <span>{item?.name}</span>
                              </div>
                            </div>
                          </DataTableRow>
                          <DataTableRow size="md">
                            <div style={{ minWidth: '10rem' }}>
                              <span
                                className={`${item?.product_type === 'SINGLE'
                                  ? 'master-sku-product-table-type-single'
                                  : 'master-sku-product-table-type-bundling'
                                  }`}
                              >
                                {item?.product_type ?? '-'}
                              </span>
                            </div>
                          </DataTableRow>
                          <DataTableRow size="md">
                            <div
                              style={{ minWidth: '10rem', maxWidth: '10rem' }}
                            >
                              <span className="sub-text text-truncate">
                                {item?.sku ?? '-'}
                              </span>
                            </div>
                          </DataTableRow>
                          {activeTab === 'bundling' && (
                            <>
                              <DataTableRow size="md">
                                <div
                                  style={{ minWidth: '11rem', maxWidth: '11rem' }}
                                >
                                  {item?.location?.length ? (
                                    item.location.map((value, index) => (
                                      <span key={index} className="sub-text text-truncate text-start">
                                        {value}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="sub-text text-truncate text-start">
                                      -
                                    </span>
                                  )}
                                </div>
                              </DataTableRow>
                              <DataTableRow size="md">
                                <div
                                  style={{ minWidth: '8rem', maxWidth: '8rem' }}
                                >
                                  {item?.quantity?.length ? (
                                    item.quantity.map((value, index) => (
                                      <span key={index} className="sub-text text-truncate text-start">
                                        {value}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="sub-text text-truncate text-start">
                                      -
                                    </span>
                                  )}
                                </div>
                              </DataTableRow>
                            </>
                          )} 
                          <DataTableRow size="md">
                            <div
                              style={{ minWidth: '11rem', maxWidth: '11rem' }}
                            >
                              <span className="sub-text text-truncate text-start">{item?.total_store_connected}</span>
                            </div>
                          </DataTableRow>

                          <DataTableRow size="md">
                            <div style={{ minWidth: '8rem' }}>
                              <span className="master-sku-product-table-currency">
                                <span style={{color: colors.blue}}>Rp</span>
                                {formatCurrency(parseFloat(item?.price)) ?? '-'}
                              </span>
                            </div>
                          </DataTableRow>

                          <DataTableRow size="md">
                            <div style={{ minWidth: '9rem' }}>
                              <span className="sub-text">
                                {formatDate(item?.created_at) ?? '-'}
                              </span>
                            </div>
                          </DataTableRow>
                          <DataTableRow>
                            <Button
                              disabled={
                                item?.product_type === 'SINGLE'
                                  ? !permissions?.includes('Edit Single SKU')
                                  : !permissions?.includes('Edit Bundling SKU')
                              }
                              size="lg"
                              onClick={() =>
                                handleClickEdit(item?.id, item?.product_type)
                              }
                              style={{ marginLeft: -20 }}
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
                      {dataMasterSku.length > 0 && (
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
                      {dataMasterSku.length > 0 ? (
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
      </Content>

      <ModalExport
        modalBodyStyle={{
          width: 500,
          borderTopLeftRadius: '48%',
          borderTopRightRadius: '48%',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          paddingLeft: 68,
          paddingRight: 68,
          marginLeft: '-50px',
          marginTop: '-130px',
          height: '210px',
          paddingTop: '50px',
          marginBottom: 13,
        }}
        isOpen={modalExport}
        handleClickCancelled={handleModalExport}
        icon={exportGif}
        widthImage={400}
        heightImage={380}
        modalContentStyle={{ width: 400, height: 380 }}
      />

      <ModalImport
        modalBodyStyle={{
          width: 600,
          borderTopLeftRadius: '70%',
          borderTopRightRadius: '70%',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          paddingLeft: 120,
          paddingRight: 120,
          marginTop: '-95px',
          paddingTop: 48,
          marginLeft: '-100px',
          height: '320px',
          marginBottom: 13,
        }}
        isOpen={modalImport}
        handleClickCancelled={handleModalImport}
        handleClickShowConfirm={handleModalConfirm}
        handlePendingModal={() => {
          setModalImport(false);
          setModalPending((prev) => !prev);
        }}
        handleSuccesUpload={handleSuccesUpload}
        icon={importGif}
        widthImage={400}
        heightImage={380}
        setDefaultFiles={setDefaultFiles}
        defaultFiles={defaultFiles}
        modalContentStyle={{ width: 400, height: 318 }}
        operationCounts={setOperationCounts}
        errorTypeFile={() => {
          setModalImport(false);
          setModalErrorTypeFile(prev => !prev);
          setModalPending(false);
          setDefaultFiles(null);
        }}
      />

      {modalConfirm && (
        <ModalConfirm
          icon={gifConfirm}
          buttonConfirmation={true}
          handleClickYes={() => {
            setModalConfirm(false);
            setDefaultFiles(null);
          }}
          handleClickCancelled={() => {
            setModalConfirm(false);
            setModalImport(true);
            fetchGetMasterSku();
          }}
          modalBodyStyle={{
            borderTopLeftRadius: '48%',
            borderTopRightRadius: '48%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-130px',
            height: '195px',
          }}
          modalContentStyle={{ width: '350px' }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
      {modalPending && (
        <ModalPending
          icon={loadingGif}
          widthImage={380}
          heightImage={320}
          modalContentStyle={{ width: 380 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
            marginTop: '-70px',
            height: '135px',
          }}
          title={'Sedang Proses Unggah...'}
          subtitle={'Tunggu ya, file kamu sedang dalam proses unggah'}
          useTimer={false}
        />
      )}

      {modalSuccesUpload && (
        <ModalPending
          icon={handleGifCondition}
          widthImage={400}
          heightImage={320}
          modalContentStyle={{ width: 380 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
            marginTop: '-112px',
            height: handleHeightModal ? '160px' : '240px',
            marginBottom: 24,
            paddingRight: 44,
            width: 400,
            paddingLeft: 44
          }}
          hideCallback={() => {
            setModalSuccesUpload(false);
            fetchGetMasterSku();
          }}
          title={handleTextImportHeader}
          subtitle={handleTextImportSubaccount}
          isCountAction
          successCount={operationCounts?.successCount}
          failedCount={operationCounts?.failedCount}
        />
      )}

      {modalErrorTypeFile && (
        <ModalPending
          icon={failedUploadGif}
          widthImage={400}
          heightImage={320}
          modalContentStyle={{ width: 380 }}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-110px',
            height: 200,
            marginBottom: 24,
            paddingRight: 44,
            paddingLeft: 44
          }}
          timeOut={4000}
          hideCallback={() => {
            setModalErrorTypeFile(false);
            fetchGetMasterSku();
          }}
          title={'Gagal Mengunggah Master SKU!'}
          subtitle={'Mohon periksa kembali file yang diunggah dan pastikan sesuai dengan template yang disediakan dengan mengikuti instruksi pengisian dalam template.'}
        />
      )}

      {modalAddConfirmation && (
        <ModalConfirmationFormMasterSku
          isOpenModal={modalAddConfirmation}
          handleActionCloseModal={handleActionButton}
          handleClickSingleSKU={handleClickSingleSKU}
          handleClickBundling={handleClickBundling}
        />
      )}
    </>
  );
};

export default MasterSku;
