/* eslint-disable react-hooks/exhaustive-deps */
// react & next
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import exportGif from '@/assets/gift/export.gif';

// component
import {
  Block,
  BlockContent,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  DropdownOption,
  Head,
  Icon,
  PaginationComponent,
  PreviewAltCard,
  TabsIcon,
  Button,
  InfoWarning,
  ModalDownload,
  TagFilter,
} from '@/components';
import TableTransfer from '@/components/organism/table-inventory-transfer';
import Nodata from '@/assets/images/illustration/no-data.svg';
// import FilterOverlayWarehouseList from '@/components/organism/filter-list-dropdown';

// layout
import Content from '@/layout/content/Content';
import {
  styles,
  IconCalendar,
  Create,
} from '@/layout/inventory-transfer/style';

// utils
import { TabOptionInventoryTransfer } from '@/utils/constants';
import { getOptionInventoryTransfer } from '@/utils/getSelectOption';
import moment from 'moment';

// third party
import { Input } from 'reactstrap';
import DatePicker from 'react-datepicker';

// Service & redux
import { getDataListTransfer } from '@/services/inventory';
import { usePermissions } from '@/utils/usePermissions';
import { FilterTableInventoryTransfer } from '@/components/molecules/filter-table';

interface RangeDate {
  start: Date | null;
  end: Date | null;
}

type FilterDataByType = 'order_code' | 'sku_code' | 'sku_name';
interface PaginationConfig {
  current: number;
  record: number;
  totalData: number;
}

export interface transferDataProps {
  transfer_header_id: number;
  transfer_code: string;
  status: string;
  origin_location: string;
  destination_location: string;
  total_quantity: number;
  total_sku: number;
  created_by: string | null;
  approved_by: string | null;
  created_time: string;
  updated_at: string;
}

function Transfer() {
  const route = useRouter();
  const permissions = usePermissions();
  const { query, pathname, replace } = route;
  const typeTabs = route.query.tab;

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    start: null,
    end: null,
  });
  const [filterDataByType, setFilterDataByType] =
    useState<FilterDataByType>('order_code');
  const [searchData, setSearchData] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(false);
  // const [checkedItemsLocation, setCheckedItemsLocation] = useState<number[]>(
  //   [],
  // );
  // const [checkedItemsApprove, setCheckedItemsApprove] = useState<number[]>([]);
  // const [checkedItemsRecive, setCheckedItemsRecive] = useState<number[]>([]);
  const [listDataTransfer, setListDataTransfer] = useState<transferDataProps[]>(
    [],
  );
  const [modalExport, setModalExport] = useState<boolean>(false);
  const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    current: 1,
    record: 10,
    totalData: 10,
  });
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<any>(null);

  const onRangeChange = (dates: Date[]) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const handleChangeTabs = (value: string) => {
    setLoadingList(true);
    setPaginationConfig((prevState) => ({
      ...prevState,
      current: 1,
    }));
    route.push({
      pathname: pathname,
      query: {
        tab: value,
      },
    });
    setLoadingList(false);
  };

  const handleSearchEnter = (e: { key: string }) => {
    if (e.key === 'Enter') {
      fetchDataList({});
    }
  };

  const handlePageChange = (page: number) => {
    setPaginationConfig((prevState) => ({ ...prevState, current: page }));
    fetchDataList({ page });
  };

  const handleRowSizeChange = (value: string) => {
    const manipulateToInteger = parseInt(value);
    setPaginationConfig((prevState) => ({
      ...prevState,
      record: manipulateToInteger,
      current: 1,
    }));
    fetchDataList({ page: 1, size: manipulateToInteger });
  };

  const getStatusIdTabs = (tabType: string | string[]) => {
    switch (tabType) {
      case 'waiting-approvel':
        return [48];
      case 'approved':
        return [49];
      case 'canceled':
        return [50];
      default:
        return [];
    }
  };

  const fetchDataList = async ({
    page = paginationConfig.current,
    size = paginationConfig.record,
    search = searchData,
  }) => {
    try {
      setLoadingList(true);
      const statusId = getStatusIdTabs(query.tab);
      const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];
      const filterUserCreate = dataFilter?.filter((value) => value.type === 'Dibuat Oleh')[0]?.filter || [];
      const filterUserApprove = dataFilter?.filter((value) => value.type === 'Disetujui Oleh')[0]?.filter || [];
      const payload = {
        // client_id,
        status_id: statusId,
        start_date:
          rangeDate.start != null
            ? moment(rangeDate.start).startOf('day').unix()
            : null,
        end_date:
          rangeDate.end != null
            ? moment(rangeDate.end).endOf('day').unix()
            : null,
        origin_id: filterLocation,
        destination_id: [],
        created_by: filterUserCreate,
        approved_by: filterUserApprove,
        page: page,
        size: size,
        search: {
          transfer_code: filterDataByType === 'order_code' ? search : '',
          name: filterDataByType === 'sku_name' ? search : '',
          sku: filterDataByType === 'sku_code' ? search : '',
        },
      };
      const transferList = await getDataListTransfer(payload);
      setListDataTransfer(transferList?.data?.transfers);
      setPaginationConfig((prevState) => ({
        ...prevState,
        current: page,
        record: size,
        totalData: transferList?.data?.page?.total_record,
      }));
    } catch (error) {
      // console.log(error)
    } finally {
      setLoadingList(false);
    }
  };

  const handleDeleteFilter = (idx: number) => {
    const dataFilters = dataFilter?.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const handleModalExport = () => setModalExport((prev) => !prev);

  useEffect(() => {
    if (query.tab) {
        fetchDataList({page: 1});
        fetchDataList({});
    }
  }, [
    query.tab,
    // dataFilter,
    // checkedItemsLocation,
    // checkedItemsApprove,
    // checkedItemsRecive,
    rangeDate.end
  ]);

  useEffect(() => {
    if(dataFilter) {
      fetchDataList({page: 1, size: 10});
    }
  },[dataFilter]);

  useEffect(() => {
    const updateRouteAndFetchData = async () => {
      if (!query.tab) {
        await replace({
          pathname: pathname,
          query: {
            tab: 'all',
          },
        });
      }
    };
    updateRouteAndFetchData();
  }, [query.tab, pathname, replace]);

  // handle go to form add
  const handleClickAddTransfer = () => {
    route.push({
      pathname: '/inventory/transfer/form',
      query: { action: 'add' },
    });
  };

  return (
    <>
      <Head title="Transfer" />
      <Content>
        <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
        <BlockHead size="sm">
          <BlockHeadContent>
            <div className="d-flex justify-content-between">
              <BlockTitle>Transfer</BlockTitle>
              <div>
                <Button
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={handleModalExport}
                >
                  <Icon
                    name="download-cloud"
                    style={{ color: '#203864' }}
                  ></Icon>
                  <div style={{ paddingLeft: 3 }}>Unduh Transfer</div>
                </Button>

                {/* <Button
                  disabled
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={()=> {}}
                >
                  <Icon
                    name="upload-cloud"
                    style={{ color: '#203864' }}
                  ></Icon>
                  <div style={{ paddingLeft: 3 }}>Unggah Transfer</div>
                </Button> */}

                <Button
                  color="primary"
                  style={{ height: 40, fontSize: 14 }}
                  onClick={handleClickAddTransfer}
                  className={
                    !permissions?.includes('Tambah Transfer') && 'btn-disabled'
                  }
                  disabled={!permissions?.includes('Tambah Transfer')}
                >
                  Tambah Transfer
                </Button>
              </div>
              
            </div>
          </BlockHeadContent>
        </BlockHead>
        <BlockHeadContent>
          <div className="d-flex">
            <div className="mb-2">
              <TabsIcon
                tabsData={TabOptionInventoryTransfer}
                activeTab={typeTabs}
                tabCounts={null}
                onTabChange={handleChangeTabs}
              />
            </div>
          </div>

          <Block size="lg">
            <div
              className={
                'nk-block-tools g-3 d-flex align-items-center justify-content-between'
              }
              style={styles.WrapperParentSortData}
            >
              <Create.UnorderedListResponsive className="d-flex g-3">
                <li>
                  <div>
                    <div className="d-flex">
                      <div className="form-wrap">
                        <DropdownOption
                          className="filter-dropdown"
                          style={styles.DropdownStyle}
                          options={getOptionInventoryTransfer}
                          optionLabel={'name'}
                          placeholder={'Pilih'}
                          value={filterDataByType}
                          onChange={(e) => setFilterDataByType(e.target.value)}
                        />
                      </div>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon
                            name="search"
                            className="pt-1"
                            style={styles.IconSearch}
                          />
                        </div>
                        <Input
                          type="text"
                          className="form-control filter-search shadow-none"
                          placeholder="Search"
                          value={searchData}
                          onKeyDown={handleSearchEnter}
                          onChange={(e) => {
                            setSearchData(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li className="d-flex align-items-center g-4">
                  <div className="d-flex" style={styles.WrapperDatePicker}>
                    <DatePicker
                      selected={rangeDate.start}
                      startDate={rangeDate.start}
                      endDate={rangeDate.end}
                      onChange={onRangeChange}
                      selectsRange
                      dateFormat="dd/MM/yyyy"
                      showIcon={rangeDate.start === null}
                      className="form-control form-filter"
                      isClearable
                      placeholderText="Tanggal Dibuat"
                      maxDate={new Date()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      open={isOpenDate}
                      onFocus={() => setIsOpenDate(true)}
                      onClickOutside={() => setIsOpenDate(false)}
                      icon={IconCalendar(() => setIsOpenDate(true))}
                    />
                  </div>
                  <div style={styles.WrapperFilterStore}>
                    {/* <FilterOverlayWarehouseList
                      checkedItems={checkedItemsLocation}
                      checkedItemsApprove={checkedItemsApprove}
                      checkedItemsRecive={checkedItemsRecive}
                      setCheckedItems={setCheckedItemsLocation}
                      setCheckedItemsApprove={setCheckedItemsApprove}
                      setCheckedItemsRecive={setCheckedItemsRecive}
                      isMore={true}
                    /> */}
                    <FilterTableInventoryTransfer
                      isOpen={isOpenFilter} 
                      setIsOpen={(value) => setIsOpenFilter(value)} 
                      dataFilter={dataFilter}
                      setDataFilter={(data) => setDataFilter(data)}
                    />
                  </div>
                </li>
              </Create.UnorderedListResponsive>
            </div>
          </Block>
        </BlockHeadContent>
        <div className='mt-3 mb-2'>
          {dataFilter && dataFilter.length > 0 ? (
              <TagFilter
                  data={dataFilter}
                  onDelete={(index) => handleDeleteFilter(index)}
                  onReset={() => setDataFilter([])}
              
              />
          ): null}
        </div>
        <BlockContent>
          <Block size="lg">
            <div className="card-inner-group">
              <div className="card-inner p-0 border-0 overflow-x-auto">
                <TableTransfer
                  dataTransfer={listDataTransfer}
                  loading={loadingList}
                />

                <PreviewAltCard bodyClass="" className="border-0 shadow-none">
                  <div className={'dataTables_wrapper'}>
                    <div className="d-flex justify-content-between align-items-center g-2">
                      <div className="text-start">
                        {listDataTransfer?.length > 0 && (
                          <PaginationComponent
                            itemPerPage={paginationConfig.record}
                            totalItems={paginationConfig.totalData}
                            paginate={handlePageChange}
                            currentPage={paginationConfig.current}
                          />
                        )}
                      </div>

                      <div className="text-center w-100">
                        {listDataTransfer?.length > 0 ? (
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
                                    value={paginationConfig.record}
                                    onChange={(e) =>
                                      handleRowSizeChange(e.target.value)
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
                            <Image src={Nodata} alt="waizly-logo" />
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
            </div>
          </Block>
        </BlockContent>
      </Content>
      <ModalDownload
        type={'TRANSFER'}
        modalBodyStyle={{
          width: 600,
          borderTopLeftRadius: '48%',
          borderTopRightRadius: '48%',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          paddingLeft: 116,
          paddingRight: 116,
          marginLeft: '-100px',
          marginTop: '-130px',
          height: '368px',
          paddingTop: '50px',
          marginBottom: 13,
        }}
        isOpen={modalExport}
        handleClickCancelled={handleModalExport}
        handleClickYes={()=> {}}
        icon={exportGif}
        widthImage={400}
        heightImage={380}
        modalContentStyle={{ width: 400, height: 440 }}
      />
    </>
  );
}

export default Transfer;
