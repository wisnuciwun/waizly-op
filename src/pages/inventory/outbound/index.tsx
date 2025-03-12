/* eslint-disable react-hooks/exhaustive-deps */
import {
  Block,
  BlockContent,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  DropdownOption,
  Head,
  Icon,
  InfoWarning,
  PaginationComponent,
  PreviewAltCard,
  TabsIcon,
  TagFilter,
} from '@/components';
import Content from '@/layout/content/Content';
import {
  TabOptionInventoryOutbound,
} from '@/utils/constants';
import {
  getOptionInventoryOutbound,
} from '@/utils/getSelectOption';
import { Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { CSSProperties, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDataListOutbound } from '@/services/inventory';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Nodata from '@/assets/images/illustration/no-data.svg';
// import FilterOverlayWarehouseList from "@/components/organism/filter-list-dropdown-warehouse";
import styled from 'styled-components';
import moment from 'moment';
import TableOutbound from '@/components/organism/table-inventory-outbound';
import { FilterTableInventory } from '@/components/molecules/filter-table';
// import FilterOverlayWarehouseList from '@/components/organism/filter-list-dropdown';

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

export interface InboundDataProps {
  inbound_id: number;
  inbound_code: string;
  status: string;
  location_name: string;
  total_quantity: number;
  total_sku: number;
  received_by: string | null;
  created_at: string;
  updated_at: string;
  purchase_code: string;
}

function Outbound() {
  const route = useRouter();
  const { query, pathname, replace } = route;
  const { client_id } = useSelector((state: any) => state.auth.user);

  const typeTabs = query.tab;

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    start: null,
    end: null,
  });
  const [filterDataByType, setFilterDataByType] =
    useState<FilterDataByType>('order_code');
  const [searchData, setSearchData] = useState<string>('');
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [checkedItemsLocation, setCheckedItemsLocation] = useState<number[]>(
    [],
  );
  const [listDataOutbound, setListDataOutbound] = useState<InboundDataProps[]>(
    [],
  );
  const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
  const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>({
    current: 1,
    record: 10,
    totalData: 10,
  });

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<any>(null);

  const maxSelectableDate = rangeDate.start
    ? moment.min(moment(rangeDate.start).add(3, 'months'), moment()).toDate()
    : new Date();

  const onRangeChange = (dates: Date[]) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const handleChangeTabs = (value: string) => {
    setLoadingList(true);
    route.push({
      pathname: pathname,
      query: {
        tab: value,
      },
    });
    setPaginationConfig((prevState) => ({
      ...prevState,
      current: 1,
    }));
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
      case 'waiting-outbound':
        return [51];
      case 'completed':
        return [52];
      default:
        return [];
    }
  };

  const handleDeleteFilter = (idx: number) => {
    const dataFilters = dataFilter?.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const fetchDataList = async ({
    page = paginationConfig.current,
    size = paginationConfig.record,
    search = searchData,
    startDate = rangeDate.start,
    endDate = rangeDate.end,
  }) => {
    try {
      setLoadingList(true);
      const statusId = getStatusIdTabs(query.tab);
      const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];

      const payload = {
        client_id,
        start_date: startDate ? moment(startDate).startOf('day').unix() : null,
        end_date: endDate ? moment(endDate).startOf('day').unix() : null,
        location_id: filterLocation,
        status_id: statusId,
        page: page,
        size: size,
        search: {
          outbound_code: filterDataByType === 'order_code' ? search : '',
          sku_name: filterDataByType === 'sku_name' ? search : '',
          sku_code: filterDataByType === 'sku_code' ? search : '',
        },
      };
      const outboundList = await getDataListOutbound(payload);
      setListDataOutbound(outboundList?.data?.outbound);
      setPaginationConfig(() => ({
        current: page,
        record: size,
        totalData: outboundList?.data?.page_info?.total_record,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (query.tab) {
      fetchDataList({});
      
    }
  }, [query.tab, rangeDate.end]);

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

  return (
    <>
      <Head title="Outbound" />
      <Content>
        <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockTitle>Outbound</BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <BlockHeadContent>
          <div className="d-flex">
            <div className="mb-2">
              <TabsIcon
                tabsData={TabOptionInventoryOutbound}
                activeTab={typeTabs}
                tabCounts={null}
                onTabChange={handleChangeTabs}
                labelStyleOverride={{ fontSize: 14 }}
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
                          options={getOptionInventoryOutbound}
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
                      showIcon={rangeDate.start === null}
                      className="form-control form-filter"
                      isClearable
                      placeholderText="Tanggal Dibuat"
                      maxDate={maxSelectableDate}
                      minDate={rangeDate.start}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      dateFormat="dd/MM/yyyy"
                      open={isOpenDate}
                      onFocus={() => setIsOpenDate(true)}
                      onClickOutside={() => setIsOpenDate(false)}
                      icon={IconCalendar(() => setIsOpenDate(true))}
                    />
                  </div>
                  <div style={styles.WrapperFilterStore}>
                    {/* <FilterOverlayWarehouseList
                      checkedItems={checkedItemsLocation}
                      setCheckedItems={setCheckedItemsLocation}
                    /> */}
                    <FilterTableInventory
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
                <TableOutbound
                  dataOrder={listDataOutbound}
                  loading={loadingList}
                />

                <PreviewAltCard bodyClass="" className="border-0 shadow-none">
                  <div className={'dataTables_wrapper'}>
                    <div className="d-flex justify-content-between align-items-center g-2">
                      <div className="text-start">
                        {listDataOutbound?.length > 0 && (
                          <PaginationComponent
                            itemPerPage={paginationConfig.record}
                            totalItems={paginationConfig.totalData}
                            paginate={handlePageChange}
                            currentPage={paginationConfig.current}
                          />
                        )}
                      </div>

                      <div className="text-center w-100">
                        {listDataOutbound?.length > 0 ? (
                          <div className="datatable-filter text-end">
                            <div
                              className="dataTables_length"
                              id="DataTables_Table_0_length"
                            >
                              <label>
                                <span
                                  className="d-none d-sm-inline-block"
                                  style={{ fontSize: 12 }}
                                >
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

const styles: { [key: string]: CSSProperties } = {
  IconSearch: {
    color: '#203864',
    backgroundColor: '#ffffff',
  },
  WrapperParentSortData: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 8,
    marginBottom: 4,
    gap: 8,
    flexWrap: 'wrap',
  },
  WrapperDatePicker: {
    width: 240,
  },
  WrapperFilterStore: {
    marginLeft: -16,
  },
  DropdownStyle: {
    fontSize: 12,
  },
};

const Create = {
  UnorderedListResponsive: styled.ul`
    @media (max-width: 760px) {
      flex-direction: column;
    }
  `,
};

const IconCalendar = (onClick: () => void) => (
  <svg
    width="20"
    height="23"
    viewBox="0 0 20 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M5.5 13.6602C5.5 13.4388 5.57812 13.25 5.73438 13.0938C5.90365 12.9245 6.10547 12.8398 6.33984 12.8398H8.83984C9.0612 12.8398 9.25 12.9245 9.40625 13.0938C9.57552 13.25 9.66016 13.4388 9.66016 13.6602C9.66016 13.8945 9.57552 14.0964 9.40625 14.2656C9.25 14.4219 9.0612 14.5 8.83984 14.5H6.33984C6.10547 14.5 5.90365 14.4219 5.73438 14.2656C5.57812 14.0964 5.5 13.8945 5.5 13.6602ZM11.75 14.5H15.0898C15.3112 14.5 15.5 14.4219 15.6562 14.2656C15.8255 14.0964 15.9102 13.8945 15.9102 13.6602C15.9102 13.4388 15.8255 13.25 15.6562 13.0938C15.5 12.9245 15.3112 12.8398 15.0898 12.8398H11.75C11.5156 12.8398 11.3138 12.9245 11.1445 13.0938C10.9883 13.25 10.9102 13.4388 10.9102 13.6602C10.9102 13.8945 10.9883 14.0964 11.1445 14.2656C11.3138 14.4219 11.5156 14.5 11.75 14.5ZM18.8398 7V16.1602C18.8398 16.8503 18.5924 17.4427 18.0977 17.9375C17.6159 18.4193 17.0299 18.6602 16.3398 18.6602H4.66016C3.97005 18.6602 3.3776 18.4193 2.88281 17.9375C2.40104 17.4427 2.16016 16.8503 2.16016 16.1602V7C2.16016 6.3099 2.40104 5.72396 2.88281 5.24219C3.3776 4.7474 3.97005 4.5 4.66016 4.5H6.33984V3.66016C6.33984 3.4388 6.41797 3.25 6.57422 3.09375C6.74349 2.92448 6.9388 2.83984 7.16016 2.83984C7.39453 2.83984 7.58984 2.92448 7.74609 3.09375C7.91536 3.25 8 3.4388 8 3.66016V4.5H13V3.66016C13 3.4388 13.0781 3.25 13.2344 3.09375C13.4036 2.92448 13.6055 2.83984 13.8398 2.83984C14.0612 2.83984 14.25 2.92448 14.4062 3.09375C14.5755 3.25 14.6602 3.4388 14.6602 3.66016V4.5H16.3398C17.0299 4.5 17.6159 4.7474 18.0977 5.24219C18.5924 5.72396 18.8398 6.3099 18.8398 7ZM3.83984 9.5H17.1602V7C17.1602 6.76562 17.0755 6.57031 16.9062 6.41406C16.75 6.24479 16.5612 6.16016 16.3398 6.16016H14.6602V7C14.6602 7.23438 14.5755 7.4362 14.4062 7.60547C14.25 7.76172 14.0612 7.83984 13.8398 7.83984C13.6055 7.83984 13.4036 7.76172 13.2344 7.60547C13.0781 7.4362 13 7.23438 13 7V6.16016H8V7C8 7.23438 7.91536 7.4362 7.74609 7.60547C7.58984 7.76172 7.39453 7.83984 7.16016 7.83984C6.9388 7.83984 6.74349 7.76172 6.57422 7.60547C6.41797 7.4362 6.33984 7.23438 6.33984 7V6.16016H4.66016C4.4388 6.16016 4.24349 6.24479 4.07422 6.41406C3.91797 6.57031 3.83984 6.76562 3.83984 7V9.5ZM17.1602 11.1602H3.83984V16.1602C3.83984 16.3945 3.91797 16.5964 4.07422 16.7656C4.24349 16.9219 4.4388 17 4.66016 17H16.3398C16.5612 17 16.75 16.9219 16.9062 16.7656C17.0755 16.5964 17.1602 16.3945 17.1602 16.1602V11.1602Z"
      fill="#203864"
    />
  </svg>
);

export default Outbound;
