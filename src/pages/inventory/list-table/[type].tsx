/* eslint-disable react-hooks/exhaustive-deps */
// react
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

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
  ModalCancel,
  TabsIcon,
  ModalConfirm,
  ModalDownload,
  InfoWarning,
  TagFilter
} from '@/components';
import { Input, Badge } from 'reactstrap';
import DatePicker from 'react-datepicker';
import ButtonMore from '@/components/atoms/buttonmore';
import { dataTabsIconPembelian } from '@/components/molecules/tabs/data-tabs-inventory';

// asset
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifHeavyBox from '@/assets/gift/heavy-box.gif';
import gifSuccess from '@/assets/gift/Highfive.gif';
import exportGif from '@/assets/gift/export.gif';

// utils
import { getOptionInventory } from '@/utils/getSelectOption';
import { usePermissions } from '@/utils/usePermissions';
import { inventoryStatus } from '@/utils';

// redux & service
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  approveOrder,
  cancelOrder,
  getInventoryList,
} from '@/services/inventory';
import * as Table from '@/components/molecules/table/table-inventory';
import { DefaultPagination } from '@/components/organism/inventory-purchasing';
import { FilterTableInventory } from '@/components/molecules/filter-table';
// import FilterOverlayWarehouseList from '@/components/organism/filter-list-dropdown';
// import { PaginationProps } from '@/utils/type';

function ListTable() {
  const inputRef = useRef(null);
  const permissions = usePermissions();
  const [routeCode, setrouteCode] = useState<number>(null);
  const [modalExport, setModalExport] = useState<boolean>(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [rangeDate, setRangeDate] = useState({ start: null, end: null });
  const [cancelReason, setcancelReason] = useState('');
  const [acceptPurchasment, setacceptPurchasment] = useState(false);
  const title = params != null ? [...params?.type.toString().split('')] : [''];
  title?.shift();
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('purchase_code');
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 8, size: 10 });
  const [pageInfo, setPageInfo] = useState({
    total_record: 10,
    size_per_page: 10,
    previous_page: null,
    current_page: 1,
    next_page: 2,
    total_pages: 1,
  });
  const route = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [isModalCancel, setisModalCancel] = useState(false);
  const [dataOrder, setdataOrder] = useState<any>([]);
  const { client_id } = useSelector((state: any) => state.auth.user);
  const [selectedItem, setselectedItem] = useState<any>({});
  const [ismodalSuccess, setismodalSuccess] = useState(false);
  const [isOpenDate, setIsOpenDate] = useState<boolean>(false);
  const [successModalText, setsuccessModalText] = useState('');
  const maxSelectableDate = rangeDate.start
    ? moment.min(moment(rangeDate.start).add(3, 'months'), moment()).toDate()
    : new Date();

  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [dataFilter, setDataFilter] = useState<any>([]);

  const handlePageChange = (page: number) => {
    setPaginationModel((prevState) => ({ ...prevState, page }));
  };

  const handlePerPage = (size: number) => {
    setPaginationModel((prevState) => ({ ...prevState, size, page: 1 }));
  };

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
  };

  const tabOption = () => {
    switch (params?.type) {
      case 'pembelian':
        return dataTabsIconPembelian;
      default:
        return dataTabsIconPembelian;
    }
  };

  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'menunggu persetujuan':
        return { color: '#FFB703', backgroundColor: '#FFF2C6' };
      case 'dibatalkan':
        return { color: '#FF6E5D', backgroundColor: '#FFE3E0' };
      case 'disetujui':
        return { color: '#36C068', backgroundColor: '#E2FFEC' };
      default:
        break;
    }
  };

  const handleTabChange = () => {
    setSearch('');
    setRangeDate({ start: null, end: null });
    setPaginationModel({ page: 1, size: 10 });
  };

  const initialRouteCode = () => {
    const tabs = searchParams.get('tab');
    if (params?.type != undefined && !tabs) {
      switch (params?.type) {
        case 'pembelian':
          handleSetParams(tabs || inventoryStatus.SEMUA);
          break;
        default:
          handleSetParams(inventoryStatus.SEMUA);
          break;
      }
    }
  };

  const handleSetParams = (value: any) => {
    let tabs = '';
    switch (value) {
      case inventoryStatus.SEMUA:
        tabs = 'Semua';
        break;
      case inventoryStatus.MENUNGGU_PERSETUJUAN:
        tabs = 'Menunggu_Persetujuan';
        break;
      case inventoryStatus.DISETUJUI:
        tabs = 'Disetujui';
        break;
      case inventoryStatus.DIBATALKAN:
        tabs = 'Dibatalkan';
        break;
      default:
        tabs = '';
        break;
    }
    route.push({
      pathname: pathname,
      query: {
        tab: tabs,
      },
    });
  };

  const initQueryParams = () => {
    const tabs = searchParams.get('tab');
    if (tabs) {
      if (params?.type === 'pembelian') {
        switch (tabs) {
          case 'Menunggu_Persetujuan':
            setrouteCode(inventoryStatus.MENUNGGU_PERSETUJUAN);
            break;
          case 'Dibatalkan':
            setrouteCode(inventoryStatus.DIBATALKAN);
            break;
          case 'Disetujui':
            setrouteCode(inventoryStatus.DISETUJUI);
            break;
          default:
            setrouteCode(inventoryStatus.SEMUA);
            break;
        }
      }
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      handlePageChange(1);
    }
  };

  const truncateValue = (name, length) => {
    return name != null && name.length > length
      ? `${name.substring(0, length)}...`
      : name;
  };

  const handleGetListInventory = async (data?: any) => {
    setloadingData(true);
    const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
    const payload = {
      location_id: filterLocation,
      start_date:
        rangeDate.start != null
          ? moment(rangeDate.start).startOf('day').unix()
          : null,
      status_id: routeCode == 0 ? [] : [routeCode],
      client_id,
      page: data ? data.page : paginationModel.page,
      size: data ? data.size : paginationModel.size,
      end_date:
        rangeDate.end != null
          ? moment(rangeDate.end).endOf('day').unix()
          : null,
      search: { purchase_code: '', sku_name: '', sku_code: '' },
    };

    payload.search[selectedSearchOption] = search;

    await getInventoryList(payload).then((res) => {
      if (res?.status == 200) {
        setdataOrder(res.data.purchase_orders);
        setPageInfo(res.data.page);
        setloadingData(false);
      } else {
        setloadingData(false);
      }
    });
  };

 

  const handleCancelOrder = async () => {
    const payload = {
      reject_reason: cancelReason,
    };
    setsuccessModalText('Berhasil Membatalkan Pembelian');
    setisModalCancel(false);

    await cancelOrder(selectedItem?.purchase_header_id, payload).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setcancelReason('');
        setismodalSuccess(true);
        setselectedItem(null);
        handleGetListInventory();
      }
    });
  };

  const handleApproveOrder = async () => {
    setsuccessModalText('Berhasil Menyetujui Pembelian');
    setacceptPurchasment(false);

    await approveOrder(selectedItem?.purchase_header_id).then((res) => {
      if (res?.status == 200 || res?.status == 201) {
        setismodalSuccess(true);
        setselectedItem(null);
        handleGetListInventory();
      }
    });
  };

  const handleDeleteFilter = (idx: number) => {
    
  const dataFilters = dataFilter.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const handleModalExport = () => setModalExport((prev) => !prev);

  useEffect(() => {
    localStorage.removeItem('location_id');
    return () => {
      localStorage.removeItem('location_id');
    };
  }, []);

  useEffect(() => {
    handleTabChange();
    initialRouteCode();
  }, [params]);

  useEffect(() => {
    initQueryParams();
  }, [searchParams.get('tab')]);

  useEffect(() => {
    if (routeCode != null) {
      handleGetListInventory();
    }
  }, [routeCode, paginationModel]);

  useEffect(() => {
    if(dataFilter) {
      handleGetListInventory({page: 1, size: 10});
    }
  },[dataFilter]);

  useEffect(() => {
    handlePageChange(1);
  }, [rangeDate.end]);

  return (
    <>
      <Head title={'Pembelian'} />
      <Content>
        <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockBetween>
              <BlockTitle>
                {params?.type[0].toUpperCase() + title.join('')}
              </BlockTitle>
              <div>
                <Button
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={handleModalExport}
                >
                  <Icon
                    name="download-cloud"
                    style={{ color: '#203864' }}
                  ></Icon>
                  <div style={{ paddingLeft: 3 }}>Unduh Pembelian</div>
                </Button>

                <Button
                  disabled
                  style={{ height: 43, fontSize: 14, color: '#203864', marginRight: 8 }}
                  onClick={()=> {}}
                >
                  <Icon
                    name="upload-cloud"
                    style={{ color: '#203864' }}
                  ></Icon>
                  <div style={{ paddingLeft: 3 }}>Unggah Pembelian</div>
                </Button>

                <Button
                  color="primary"
                  style={{ height: 43, fontSize: 14 }}
                  className={!permissions?.includes('Tambah Pembelian') && 'btn-disabled'}
                  onClick={() => route.push('/inventory/create')}
                  disabled={!permissions?.includes('Tambah Pembelian')}
                >
                  Tambah Pembelian
                </Button>
              </div>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>
        <BlockHeadContent>
          <div className="d-flex">
            <div className="mb-2">
              <>
                <TabsIcon
                  tabsData={tabOption()}
                  activeTab={routeCode}
                  tabCounts={null}
                  onTabChange={(v) => handleSetParams(v)}
                />
              </>
            </div>
            <div>&nbsp;</div>
          </div>
          <Block size="lg">
            <div
              className={
                'nk-block-tools g-3 d-flex align-items-center justify-content-between'
              }
              style={{
                marginLeft: 0,
                marginRight: 0,
                marginTop: 8,
                marginBottom: 4,
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <ul className="d-flex g-3 flex-wrap align-items-center">
                <li>
                  <div className="w-100">
                    <div className="d-flex">
                      <div className="form-wrap">
                        <DropdownOption
                          className="filter-dropdown"
                          options={getOptionInventory}
                          style={{ fontSize: 12 }}
                          optionLabel={'name'}
                          placeholder={'Pilih'}
                          value={selectedSearchOption}
                          onChange={(e) =>
                            setSelectedSearchOption(e.target.value)
                          }
                        />
                      </div>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon
                            name="search"
                            className="pt-1"
                            style={{
                              color: '#203864',
                              backgroundColor: '#ffffff',
                            }}
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
                  </div>
                </li>
                <div className="d-flex align-items-center">
                  <li>
                    <div className="d-flex" style={{ width: '240px' }}>
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={rangeDate.start}
                        startDate={rangeDate.start}
                        endDate={rangeDate.end}
                        selectsRange
                        onChange={onDateChange}
                        showIcon={rangeDate.start == null}
                        className="form-control form-filter"
                        isClearable
                        placeholderText="Tanggal Dibuat"
                        maxDate={maxSelectableDate}
                        minDate={rangeDate.start}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        open={isOpenDate}
                        onFocus={() => setIsOpenDate(true)}
                        onClickOutside={() => setIsOpenDate(false)}
                        icon={
                          <svg
                            viewBox="0 0 18 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => setIsOpenDate(true)}
                          >
                            <path
                              d="M4 11.6602C4 11.4388 4.07812 11.25 4.23438 11.0938C4.40365 10.9245 4.60547 10.8398 4.83984 10.8398H7.33984C7.5612 10.8398 7.75 10.9245 7.90625 11.0938C8.07552 11.25 8.16016 11.4388 8.16016 11.6602C8.16016 11.8945 8.07552 12.0964 7.90625 12.2656C7.75 12.4219 7.5612 12.5 7.33984 12.5H4.83984C4.60547 12.5 4.40365 12.4219 4.23438 12.2656C4.07812 12.0964 4 11.8945 4 11.6602ZM10.25 12.5H13.5898C13.8112 12.5 14 12.4219 14.1562 12.2656C14.3255 12.0964 14.4102 11.8945 14.4102 11.6602C14.4102 11.4388 14.3255 11.25 14.1562 11.0938C14 10.9245 13.8112 10.8398 13.5898 10.8398H10.25C10.0156 10.8398 9.8138 10.9245 9.64453 11.0938C9.48828 11.25 9.41016 11.4388 9.41016 11.6602C9.41016 11.8945 9.48828 12.0964 9.64453 12.2656C9.8138 12.4219 10.0156 12.5 10.25 12.5ZM17.3398 5V14.1602C17.3398 14.8503 17.0924 15.4427 16.5977 15.9375C16.1159 16.4193 15.5299 16.6602 14.8398 16.6602H3.16016C2.47005 16.6602 1.8776 16.4193 1.38281 15.9375C0.901042 15.4427 0.660156 14.8503 0.660156 14.1602V5C0.660156 4.3099 0.901042 3.72396 1.38281 3.24219C1.8776 2.7474 2.47005 2.5 3.16016 2.5H4.83984V1.66016C4.83984 1.4388 4.91797 1.25 5.07422 1.09375C5.24349 0.924479 5.4388 0.839844 5.66016 0.839844C5.89453 0.839844 6.08984 0.924479 6.24609 1.09375C6.41536 1.25 6.5 1.4388 6.5 1.66016V2.5H11.5V1.66016C11.5 1.4388 11.5781 1.25 11.7344 1.09375C11.9036 0.924479 12.1055 0.839844 12.3398 0.839844C12.5612 0.839844 12.75 0.924479 12.9062 1.09375C13.0755 1.25 13.1602 1.4388 13.1602 1.66016V2.5H14.8398C15.5299 2.5 16.1159 2.7474 16.5977 3.24219C17.0924 3.72396 17.3398 4.3099 17.3398 5ZM2.33984 7.5H15.6602V5C15.6602 4.76562 15.5755 4.57031 15.4062 4.41406C15.25 4.24479 15.0612 4.16016 14.8398 4.16016H13.1602V5C13.1602 5.23438 13.0755 5.4362 12.9062 5.60547C12.75 5.76172 12.5612 5.83984 12.3398 5.83984C12.1055 5.83984 11.9036 5.76172 11.7344 5.60547C11.5781 5.4362 11.5 5.23438 11.5 5V4.16016H6.5V5C6.5 5.23438 6.41536 5.4362 6.24609 5.60547C6.08984 5.76172 5.89453 5.83984 5.66016 5.83984C5.4388 5.83984 5.24349 5.76172 5.07422 5.60547C4.91797 5.4362 4.83984 5.23438 4.83984 5V4.16016H3.16016C2.9388 4.16016 2.74349 4.24479 2.57422 4.41406C2.41797 4.57031 2.33984 4.76562 2.33984 5V7.5ZM15.6602 9.16016H2.33984V14.1602C2.33984 14.3945 2.41797 14.5964 2.57422 14.7656C2.74349 14.9219 2.9388 15 3.16016 15H14.8398C15.0612 15 15.25 14.9219 15.4062 14.7656C15.5755 14.5964 15.6602 14.3945 15.6602 14.1602V9.16016Z"
                              fill="#203864"
                            />
                          </svg>
                        }
                      />
                    </div>
                  </li>
                  <li>
                    <FilterTableInventory 
                      isOpen={isOpenFilter} 
                      setIsOpen={(value) => setIsOpenFilter(value)} 
                      dataFilter={dataFilter}
                      setDataFilter={(data) => setDataFilter(data)}
                    />
                    {/* <FilterOverlayWarehouseList
                      checkedItems={checkedItemsLocation}
                      setCheckedItems={setCheckedItemsLocation}
                    /> */}
                  </li>
                </div>
              </ul>
            </div>
          </Block>
        </BlockHeadContent>
        <div className='mt-4'>
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
            <div style={{ maxWidth: '100%' }}>
              <div className="card-inner-group">
                <div
                  className="card-inner p-0 border-0 overflow-x-auto"
                  style={{ fontSize: '13px' }}
                >
                  <table className="master-sku-nk-tb-list is-separate my-3">
                    <Table.PurchasingHead routeCode={routeCode} />
                    <tbody
                      style={{
                        fontSize: 12,
                        color: '#4C4F54',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {loadingData ? (
                        <>
                          {Array.from({ length: 10 }, (_, i) => (
                            <Table.PurchasingLoading key={i} />
                          ))}
                        </>
                      ) : (
                        <>
                          {dataOrder?.map((item, id) => (
                            <>
                              <tr
                                key={id}
                                style={{
                                  backgroundColor: '#fff',
                                }}
                              >
                                <td
                                  className="tb-col nk-tb-col"
                                  style={{
                                    width: 220,
                                    paddingLeft: 16,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                    className="text-primary text-truncate"
                                    onClick={() => {
                                      if (
                                        !permissions?.includes('Hanya Lihat')
                                      ) {
                                        route.push(
                                          `/inventory/detail?id=${item?.purchase_header_id}`,
                                        );
                                      }
                                    }}
                                  >
                                    {item?.purchase_code}
                                  </div>
                                  <div style={{ color: '#BDC0C7' }}>
                                    {moment
                                      .utc(item?.created_at)
                                      .format('DD/MM/YYYY HH:mm')}
                                  </div>
                                </td>
                                <td
                                  style={{ fontWeight: 200, width: 160 }}
                                  className="tb-col nk-tb-col"
                                >
                                  <Badge
                                    className="badge-dim"
                                    color=""
                                    style={{
                                      fontWeight: 700,
                                      color: statusBadge(item.parent_status)
                                        .color,
                                      backgroundColor: statusBadge(
                                        item.parent_status,
                                      ).backgroundColor,
                                      height: 20,
                                      padding: '0px 8px 0px 8px',
                                      border: 'none',
                                      fontSize: 12,
                                    }}
                                  >
                                    {item.parent_status?.toUpperCase()}
                                  </Badge>
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  {truncateValue(item.location_name, 15)}
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  {item.total_quantity}
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  {item.total_sku}
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  {truncateValue(item.created_by, 15)}
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  {truncateValue(
                                    item.approved_by ? item.approved_by : '-',
                                    15,
                                  )}
                                </td>
                                <td
                                  style={{ width: 125 }}
                                  className="tb-col nk-tb-col"
                                  hidden={
                                    routeCode !=
                                    inventoryStatus.MENUNGGU_PERSETUJUAN
                                  }
                                >
                                  <>
                                    <Button
                                      color="primary"
                                      style={{
                                        fontWeight: 400,
                                        width: 80,
                                        marginRight: 10,
                                        justifyContent: 'center',
                                        fontSize: 12,
                                      }}
                                      onClick={() => {
                                        setselectedItem(item);
                                        setacceptPurchasment(true);
                                      }}
                                      className={
                                        !permissions?.includes(
                                          'Setujui Pembelian',
                                        ) && 'btn-disabled'
                                      }
                                      disabled={
                                        !permissions?.includes(
                                          'Setujui Pembelian',
                                        )
                                      }
                                    >
                                      Setujui
                                    </Button>
                                    <ButtonMore id="more-option">
                                      <div
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                          route.push(
                                            `/inventory/edit?id=${item.purchase_header_id}`,
                                          )
                                        }
                                      >
                                        Ubah Pembelian
                                      </div>
                                      <div
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        className="mt-1"
                                        onClick={() => {
                                          setisModalCancel(true);
                                          setselectedItem(item);
                                          setTimeout(() => {
                                            inputRef.current.click();
                                          }, 200);
                                        }}
                                      >
                                        Batalkan Pembelian
                                      </div>
                                    </ButtonMore>
                                  </>
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <DefaultPagination
                  paginationModel={paginationModel}
                  dataOrder={dataOrder}
                  pageInfo={pageInfo}
                  handlePageChange={handlePageChange}
                  handlePerPage={handlePerPage}
                />
              </div>
            </div>
          </Block>
        </BlockContent>
      </Content>
      {isModalCancel && (
        <ModalCancel
          toggle={false}
          iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
          icon={gifConfirm}
          buttonConfirmation={true}
          textCancel="Kembali"
          textSubmit="Konfirmasi Pembatalan"
          disableBtnSubmit={cancelReason == ''}
          useTimer={false}
          btnSubmitWidth={'65%'}
          btnCancelWidth={'35%'}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-115px',
            height: 365.413,
          }}
          footerStyle={{ marginTop: 30 }}
          modalContentStyle={{ width: 400, height: 650 }}
          widthImage={400}
          heightImage={333}
          title={'Apakah Kamu Yakin?'}
          handleClickCancelled={() => setisModalCancel(false)}
          handleClickYes={handleCancelOrder}
          buttonConfirmStyle={{
            backgroundColor: cancelReason == '' ? '' : '#FF6E5D',
            color: 'white',
            border: 'none',
            height: 46,
          }}
          subtitle={
            'Apakah kamu yakin ingin membatalkan pembelian? Silakan isi alasan pembatalan pembelian'
          }
        >
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Alasan Pembatalan<span style={{ color: 'red' }}>*</span>
          </div>
          <Input
            innerRef={inputRef}
            type="textarea"
            value={cancelReason}
            maxLength={200}
            style={{ padding: 8, marginTop: 10, fontSize: 12 }}
            onChange={(e: any) => setcancelReason(e.target.value)}
          />
        </ModalCancel>
      )}
      {acceptPurchasment && (
        <ModalCancel
          toggle={false}
          icon={gifHeavyBox}
          buttonConfirmStyle={{ height: 46 }}
          textSubmit="Setuju"
          modalContentStyle={{ width: 400, height: 474 }}
          iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
          footerStyle={{ marginTop: 25 }}
          widthImage={400}
          heightImage={333}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-120px',
            height: 194.413,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu setujui pembelian, status pembelian tidak dapat diubah kembali'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setacceptPurchasment(false)}
          handleClickYes={handleApproveOrder}
        />
      )}
      {ismodalSuccess && (
        <ModalConfirm
          hideCallback={() => {
            setismodalSuccess(false);
          }}
          subtitle=""
          useTimer={true}
          toggle={false}
          icon={gifSuccess}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
            marginLeft: '-25px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={successModalText}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      <ModalDownload
        type={'PURCHASE_ORDER'}
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

export default ListTable;
