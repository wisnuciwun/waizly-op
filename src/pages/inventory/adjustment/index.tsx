/* eslint-disable react-hooks/exhaustive-deps */
// react & next
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

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
  TagFilter,
} from '@/components';
import TableAdjustment from '@/components/organism/table-inventory-adjustment';
import Nodata from '@/assets/images/illustration/no-data.svg';
// import FilterOverlayWarehouseList from '@/components/organism/filter-list-dropdown';

// layout
import Content from '@/layout/content/Content';
import {
  styles,
  IconCalendar,
  Create,
} from '@/layout/inventory/inventory-adjustment/style';

// utils
import { TabOptionInventoryTransfer } from '@/utils/constants';
import { getOptionInventoryAdjustment } from '@/utils/getSelectOption';
import moment from 'moment';

// third party
import { Input } from 'reactstrap';
import DatePicker from 'react-datepicker';

// Service & redux
import { getDataListAdjustment } from '@/services/inventory';
import { usePermissions } from '@/utils/usePermissions';
import { useSelector } from 'react-redux';
import { FilterTableInventoryTransfer } from '@/components/molecules/filter-table';

interface RangeDate {
  start: Date | null;
  end: Date | null;
}

type FilterDataByType = 'code' | 'sku_code' | 'sku_name';
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

function Adjustment() {
  const route = useRouter();
  const { query, pathname, replace } = route;
  const typeTabs = route.query.tab;
  const permissions = usePermissions();
  const { client_id } = useSelector((state: any) => state.auth.user);

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    start: null,
    end: null,
  });
  const [filterDataByType, setFilterDataByType] =
    useState<FilterDataByType>('code');
  const [searchData, setSearchData] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(false);
  // const [checkedItemsLocation, setCheckedItemsLocation] = useState<number[]>(
  //   [],
  // );
  // const [checkedItemsApprove, setCheckedItemsApprove] = useState<number[]>([]);
  // const [checkedItemsRecive, setCheckedItemsRecive] = useState<number[]>([]);
  const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
  const [listDataAdjustment, setListDataAdjustment] = useState<
    transferDataProps[]
  >([]);
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

  const handleDeleteFilter = (idx: number) => {
    const dataFilters = dataFilter?.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const getStatusIdTabs = (tabType: string | string[]) => {
    switch (tabType) {
      case 'waiting-approvel':
        return [53];
      case 'approved':
        return [54];
      case 'canceled':
        return [55];
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
      const filterUserCreate = dataFilter?.filter((value) => value.type === 'Dibuat Oleh')[0]?.filter || [];
      const filterUserApprove = dataFilter?.filter((value) => value.type === 'Disetujui Oleh')[0]?.filter || [];
      const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];

      const payload = {
        client_id,
        start_date: moment(rangeDate.start).unix(),
        end_date: moment(rangeDate.end).unix(),
        location_id: filterLocation,
        created_by: filterUserCreate,
        approved_by: filterUserApprove,
        status_id: statusId,
        page: page,
        size: size,
        search: {
          code: filterDataByType === 'code' ? search : '',
          sku_name: filterDataByType === 'sku_name' ? search : '',
          sku_code: filterDataByType === 'sku_code' ? search : '',
        },
      };
      const adjustmentList = await getDataListAdjustment(payload);
      setListDataAdjustment(adjustmentList?.data?.stock_adjustments);
      setPaginationConfig(() => ({
        current: page,
        record: size,
        totalData: adjustmentList?.data?.page?.total_record,
      }));
    } catch (error) {
      // console.log(error)
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (query.tab) {
      fetchDataList({});
    }
  }, [
    query.tab,
    // dataFilter,
    // checkedItemsLocation,
    // checkedItemsApprove,
    // checkedItemsRecive,
    rangeDate.end,
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
      pathname: '/inventory/adjustment/form',
      query: { action: 'add' },
    });
  };

  return (
    <>
      <Head title="Adjustment" />
      <Content>
        <BlockHead size="sm">
          <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
          <BlockHeadContent>
            <div className="d-flex justify-content-between">
              <BlockTitle>Adjustment</BlockTitle>
              <Button
                color="primary"
                style={{ height: 40, fontSize: 14 }}
                onClick={handleClickAddTransfer}
                className={
                  !permissions?.includes('Tambah Adjustment') && 'btn-disabled'
                }
                disabled={!permissions?.includes('Tambah Adjustment')}
              >
                Tambah Adjustment
              </Button>
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
                          options={getOptionInventoryAdjustment}
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
                      onChange={onRangeChange}
                      endDate={rangeDate.end}
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
                    <FilterTableInventoryTransfer
                      isOpen={isOpenFilter} 
                      setIsOpen={(value) => setIsOpenFilter(value)} 
                      dataFilter={dataFilter}
                      setDataFilter={(data) => setDataFilter(data)}
                    />
                    {/* <FilterOverlayWarehouseList
                      checkedItems={checkedItemsLocation}
                      checkedItemsApprove={checkedItemsApprove}
                      checkedItemsRecive={checkedItemsRecive}
                      setCheckedItems={setCheckedItemsLocation}
                      setCheckedItemsApprove={setCheckedItemsApprove}
                      setCheckedItemsRecive={setCheckedItemsRecive}
                      isMore={true}
                    /> */}
                  </div>
                </li>
              </Create.UnorderedListResponsive>
            </div>
          </Block>
        </BlockHeadContent>
        <div className='mt-2 mb-2'>
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
                <TableAdjustment
                  dataAdjustment={listDataAdjustment}
                  loading={loadingList}
                />

                <PreviewAltCard bodyClass="" className="border-0 shadow-none">
                  <div className={'dataTables_wrapper'}>
                    <div className="d-flex justify-content-between align-items-center g-2">
                      <div className="text-start">
                        {listDataAdjustment?.length > 0 && (
                          <PaginationComponent
                            itemPerPage={paginationConfig.record}
                            totalItems={paginationConfig.totalData}
                            paginate={handlePageChange}
                            currentPage={paginationConfig.current}
                          />
                        )}
                      </div>

                      <div className="text-center w-100">
                        {listDataAdjustment?.length > 0 ? (
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
    </>
  );
}

export default Adjustment;
