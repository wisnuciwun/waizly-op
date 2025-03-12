/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Content from '@/layout/content/Content';
import { useRouter } from 'next/navigation';
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Button,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
  DropdownOption,
  TabsIcon,
  TagFilter,
} from '@/components';
import FilterTableStore from './filter';
import { Badge, Input } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { PreviewCard } from '@/components/molecules/preview/index';
import { bulkActionOptions } from '@/utils/index';
import {
  getStore,
  postStoreId,
  getSyncOrderToggle,
} from '@/services/storeIntegration/index';
import moment from 'moment';
import ModalError from '@/components/atoms/modal/modal-confirm/index';
import ModalCancel from '@/components/atoms/modal/modal-confirm/modalCancel';

import Image from 'next/image';
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Nodata from '@/assets/images/illustration/no-data.svg';
import Other from '@/assets/images/marketplace/offline.png';
import SocialCommerce from '@/assets/images/marketplace/social-commerce.png';
import gifSuccess from '@/assets/gift/Highfive.gif';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import { Skeleton } from 'primereact/skeleton';

import { usePermissions } from '@/utils/usePermissions';
import debounce from 'lodash/debounce';
import { dataTabsTokoTerintegrasi } from '@/components/molecules/tabs/data-tabs';
import { FilterTableStoreIntegration } from '@/components/molecules/filter-table';

const ProductList = () => {
  const permissions = usePermissions(); 
  const [isModalConfirmSync, setIsModalConfirmSync] = useState(false);
  const [sm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [dataStore, setDataStore] = useState([]);
  // const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalRecord: 0
  });
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('store_name_op');
  const [search, setSearch] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [syncStoreLoading, setSyncStoreLoading] = useState(false);
  const [isSuccesSync, setIsSuccessSync] = useState(false);
  const [selectedStore, setselectedStore] = useState({
    store_name_op: '',
    id: '',
    checked: false,
  });
  const [isLoading, setisLoading] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState(null);

  // next
  const route = useRouter();

  const { client_id } = useSelector((state) => state.auth.user);

  const getImageSrc = (channelName) => {
    const formattedName = channelName.toLowerCase().replace(/\s+/g, '');
    switch (formattedName) {
      case 'tokopedia':
        return Tokopedia;
      case 'shopee':
        return Shopee;
      case 'lazada':
        return Lazada;
      case 'tiktok':
        return Tiktok;
      case 'shopify':
        return Shopify;
      case 'other':
        return Other;
      case 'socialecommerce':
        return SocialCommerce;
      default:
        return Shopify;
    }
  };

  const [loading, setLoading] = useState(false);

  // const [payload, setPayload] = useState({
  //   client_id: client_id,
  //   channel: [],
  //   location: [],
  //   status: [],
  //   order_api: null,
  //   search: {
  //     store_name_op: null,
  //     store_name_channel: null,
  //   },
  //   page: pagination.page,
  //   size: pagination.size,
  // });

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // setPaginationModel((prev) => ({ ...prev, page: pageNumber }));

    // setPayload((prevPayload) => ({
    //   ...prevPayload,
    //   page: pageNumber,
    // }));
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPagination({...pagination, size: newSize, page: 1});
    fetchData({...pagination, size: newSize, page: 1});
    // setSelectedPageSize(newSize);

    // const newTotalPages = Math.ceil(totalRecords / newSize);

    // if (currentPage > newTotalPages) {
    //   setCurrentPage(1);
    //   // setPaginationModel((prev) => ({ ...prev, page: 1 }));
    //   // setPayload((prevPayload) => ({ ...prevPayload, page: 1 }));
    //   // fetchData();
    // } else {
    //   // setPaginationModel((prev) => ({ ...prev, size: newSize }));
    //   // setPayload((prevPayload) => ({ ...prevPayload, size: newSize }));
    //   // fetchData();
    // }
  };

  const handlePageChange = (pageNumber) => {
    setPagination({...pagination, page: pageNumber });
    fetchData({...pagination, page: pageNumber});
    // paginate(pageNumber);
    // setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
    // setPayload((prevPayload) => ({
    //   ...prevPayload,
    //   page: pageNumber,
    // }));
  };

  const handleTabChange = (newValue) => {
    let updatedPayload = { };
    let updatedActiveTab = newValue;
    // const filterChannel = dataFilter.filter((value) => value.type === 'Channel')[0]?.filter || [];
    // const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
    // const filterMappingOrder = dataFilter.filter((value) => value.type === 'Mapping Status')[0]?.filter || [];
    // const filterIntegrationOrder = dataFilter.filter((value) => value.type === 'Integrasi Pesanan')[0]?.filter;

    
    switch (newValue) {
      case 1:
        updatedPayload.channel = [];
        updatedPayload.page = 1;
        updatedPayload.status = [];
        updatedPayload.order_api = null;
        updatedPayload.location = [];
        break;
      case 2:
        updatedPayload.channel = [1, 2, 3, 4];
        updatedPayload.page = 1;
        updatedPayload.status = [];
        updatedPayload.order_api = null;
        updatedPayload.location = [];
        break;
      case 3:
        updatedPayload.channel = [6];
        updatedPayload.page = 1;
        updatedPayload.status = [];
        updatedPayload.order_api = null;
        updatedPayload.location = [];
        break;
      case 4:
        updatedPayload.channel = [11, 14];
        updatedPayload.page = 1;
        updatedPayload.status = [];
        updatedPayload.order_api = null;
        updatedPayload.location = [];
        break;
      default:
        break;
    }

    // handlePageChange(1);
    setDataFilter(null);
    setActiveTab(updatedActiveTab);
    fetchData({...updatedPayload, page: 1, size: 10});
    // setPayload(updatedPayload);
  };

  const updateChannelInPayload = (selectedChannel) => {
    const channelsArray = Array.isArray(selectedChannel) ? selectedChannel : [];
    const selectedChannels = channelsArray.filter(
      (value) => value.type === 'channel',
    );
    const channelIds = selectedChannels.map((channel) => channel.id);

    // setPayload((prevPayload) => ({
    //   ...prevPayload,
    //   channel: channelIds,
    //   page: 1,
    // }));
  };

  const updateLocationInPayload = (selectedLocation) => {
    const channelsArray = Array.isArray(selectedLocation)
      ? selectedLocation
      : [];
    const selectedLocations = channelsArray.filter(
      (value) => value.type === 'location',
    );
    const locationIds = selectedLocations.map((location) => location.id);

    // setPayload((prevPayload) => ({
    //   ...prevPayload,
    //   location: locationIds,
    //   page: 1,
    // }));
  };

  // const handleMappingStatus = (selectedStatus) => {
  //   const statusIds = selectedStatus.map((status) => status.id);

  //   setPayload((prevPayload) => ({
  //     ...prevPayload,
  //     status: statusIds,
  //     page: 1,
  //   }));
  // };

  // const handelOrderStatus = (selectedStatusOrder) => {
  //   const orderApiValue = selectedStatusOrder;

  //   setPayload((prevPayload) => ({
  //     ...prevPayload,
  //     order_api: orderApiValue,
  //     page: 1,
  //   }));
  // };

  // const handleResetFilter = () => {
  //   const defaultPayload = {
  //     client_id: client_id,
  //     channel: [],
  //     location: [],
  //     status: [],
  //     order_api: null,
  //     search: {
  //       store_name_op: null,
  //       store_name_channel: null,
  //     },
  //     page: 1,
  //     size: paginationModel.size,
  //   };

  //   setPayload(defaultPayload);
  //   // fetchData(defaultPayload);
  // };

  const fetchData = async (data) => {
    setLoading(true);
    const filterChannel = dataFilter?.filter((value) => value.type === 'Channel')[0]?.filter || [];
    const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];
    const filterMappingOrder = dataFilter?.filter((value) => value.type === 'Mapping Status')[0]?.filter || [];
    const filterIntegrationOrder = dataFilter?.filter((value) => value.type === 'Integrasi Pesanan')[0]?.filter;
    
    const dataOrder = data?.order_api !== null && data?.order_api !== undefined ? data?.order_api : null;
    const order_api = filterIntegrationOrder !== null && filterIntegrationOrder !== undefined ? filterIntegrationOrder : null;
    const selectedSearchField = bulkActionOptions.find(
      (option) => option.value === selectedSearchOption,
    );
    const payload = {
      client_id: client_id,
      channel: data?.channel || filterChannel,
      location: data?.location || filterLocation,
      status: data?.status || filterMappingOrder,
      order_api: dataOrder ? dataOrder : order_api,
      search: {
        [selectedSearchField?.value]: selectedSearchField ? search : '',
      },
      page: data?.page !== null && data?.page !== undefined ? data.page : pagination.page,
      size: data?.size !== null && data?.size !== undefined ? data.size : pagination.size,
    };

    try {
      const response = await getStore(payload);

      if (response.status === 200) {
        setDataStore(response?.data?.store_list);
        // console.log('hahhaha', response?.data?.store_list);
        // setTotalRecords(response?.data?.page_info?.total_record);
        setPagination((datas) => ({
          ...datas, 
          page: data ? data.page : datas.page,
          size: data ? data.size : datas.size,
          totalRecord: response?.data?.page_info?.total_record
      }));
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const syncStoreSubmit = async (id) => {
    try {
      setSyncStoreLoading(true);

      if (!id) {
        console.error('id is not available');
        return;
      }

      const response = await postStoreId(id);

      if (response.status === 200) {
        setIsSuccessSync(true);
        setTimeout(() => {
          fetchData();
          setIsSuccessSync(false);
        }, 2000);
      }
    } catch (error) {
    } finally {
      setSyncStoreLoading(false);
    }
  };

  const updatePayload = () => {
    const selectedSearchField = bulkActionOptions.find(
      (option) => option.value === selectedSearchOption,
    );

    setPayload((prevPayload) => ({
      ...prevPayload,
      search: {
        [selectedSearchField?.value]: selectedSearchField ? search : '',
      },
      page: 1,
    }));
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const handleClickEditStore = (id) => {
    const selectedItem = dataStore.find((item) => item.id === id);
    if (selectedItem) {
      const { channel_id } = selectedItem;
      if (channel_id === 11 || channel_id === 14) {
        route.push({
          pathname: '/toko-terintegrasi/edit-toko-lainya',
          query: { id },
        });
      } else {
        route.push({
          pathname: '/toko-terintegrasi/edit-toko',
          query: { id },
        });
      }
    }
  };

  const handleSyncStore = async () => {
    setisLoading(true);
    try {
      await getSyncOrderToggle(selectedStore.id).then((res) => {
        if (res.status == 200) {
          setselectedStore({ store_name_op: '', id: '' });
          fetchData();
          setIsModalConfirmSync(false);
        }
      });
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
    setisLoading(false);
  };

  const handleAuthStore = (storeId, name, url) => {
    route.push(
      `/toko-terintegrasi/tambah-toko?storeId=${storeId}&storeName=${name.replace(' ', '-')}&storeUrl=${url}`,
    );
  };

  const badgeStatus = (type) => {
    switch (type) {
      case 'Connected':
        return { bg: '#E2FFEC', font: '#36C068' };
      case 'Problem Authorizing':
        return { bg: '#FFE3E0', font: '#FF6E5D' };
      case 'Authorizing':
        return { bg: '#FFE9D0', font: '#EF7A27' };
      case 'No Mapping':
        return { bg: '#E9E9EA', font: 'rgb(76, 79, 84)' };
      default:
        return { bg: '#E9E9EA', font: '#4C4F54' };
    }
  };

  const handleDeleteFilter = (idx) => {
    const dataFilters = dataFilter?.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const debounceIntegrationBtn = debounce(handleSyncStore, 1500, {
    maxWait: 2000,
  });


  // useEffect(() => {
  //   if(dataFilter.length > 0) {
  //     const filterChannel = dataFilter.filter((value) => value.type === 'Channel')[0]?.filter || [];
  //     const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
  //     const filterMappingOrder = dataFilter.filter((value) => value.type === 'Mapping Status')[0]?.filter || [];
  //     const filterIntegrationOrder = dataFilter.filter((value) => value.type === 'Integrasi Pesanan')[0]?.filter;
  //     setPayload((prevPayload) => ({
  //       ...prevPayload,
  //       channel: filterChannel,
  //       location: filterLocation,
  //       status: filterMappingOrder,
  //       order_api: filterIntegrationOrder !== null ? filterIntegrationOrder : null,
  //       page: 1,
  //       size: 10
  //     }));
  //   }
  // },[dataFilter]);

  useEffect(() => {
    if(dataFilter) {
      fetchData({...pagination, page: 1, size: 10});
    }
   
  },[dataFilter]);

useEffect(() => {
  fetchData();
},[]);

  const {
    formState: { errors },
  } = useForm();

  return (
    <>
      {/* <Head title="Product List"></Head> */}
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Toko Terintegrasi</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? 'block' : 'none' }}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button
                        className={`toggle d-none d-md-inline-flex ${
                          !permissions?.includes('Tambah Toko') &&
                          'btn-disabled'
                        }`}
                        color="primary"
                        disabled={!permissions?.includes('Tambah Toko')}
                        onClick={() => {
                          route.push('/toko-terintegrasi/tambah-toko');
                        }}
                      >
                        <div>Tambah Toko</div>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
          <BlockBetween>
            <BlockBetween>
              <Block size="lg">
                <TabsIcon
                  tabsData={dataTabsTokoTerintegrasi}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
                {/* <Nav tabs className="mt-4">
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#Semua"
                      style={{
                        color: activeTab === '1' ? 'inherit' : '#203864',
                        fontWeight: activeTab === '1' ? 'bold' : 'normal',
                      }}
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => handleTabChange('1')}
                    >
                      <span>Semua</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#Marketplace"
                      style={{
                        color: activeTab === '2' ? 'inherit' : '#203864',
                        fontWeight: activeTab === '2' ? 'bold' : 'normal',
                      }}
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => handleTabChange('2')}
                    >
                      <Icon name="bag" />{' '}
                      <span
                        style={{
                          color: activeTab === '2' ? 'inherit' : '#203864',
                        }}
                      >
                        Marketplace
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#Web-Store"
                      style={{
                        color: activeTab === '3' ? 'inherit' : '#203864',
                        fontWeight: activeTab === '3' ? 'bold' : 'normal',
                      }}
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => handleTabChange('3')}
                    >
                      <Icon name="globe" /> <span>Web Store</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#Toko-Lainnya"
                      style={{
                        color: activeTab === '4' ? 'inherit' : '#203864',
                        fontWeight: activeTab === '4' ? 'bold' : 'normal',
                      }}
                      className={classnames({ active: activeTab === '4' })}
                      onClick={() => handleTabChange('4')}
                    >
                      <Image
                        src={iconTokoLainya}
                        width={18}
                        style={{ marginRight: '5px' }}
                        alt="product-sku"
                      />{' '}
                      <span>Toko Lainnya</span>
                    </NavLink>
                  </NavItem>
                </Nav> */}
              </Block>
            </BlockBetween>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle mt-4">
                <ul className="nk-block-tools">
                  <li>
                    <div className="d-flex">
                      <div className="form-wrap">
                        <DropdownOption
                          className="filter-dropdown"
                          options={bulkActionOptions}
                          optionLabel={'label'}
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
                          className="form-control filter-search-with-icon shadow-none"
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={handleSearchEnter}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <FilterTableStoreIntegration
                      isOpen={isOpenFilter} 
                      setIsOpen={(value) => setIsOpenFilter(value)} 
                      dataFilter={dataFilter}
                      setDataFilter={(data) => setDataFilter(data)}
                    />
                    {/* <FilterTableStore
                      resetPayload={handleResetFilter}
                      updateChannelInPayload={updateChannelInPayload}
                      updateLocationInPayload={updateLocationInPayload}
                      onMappingStatusClick={handleMappingStatus}
                      onOrderStatusClick={handelOrderStatus}
                      activeTab={activeTab}
                    /> */}
                  </li>
                </ul>
              </div>
            </BlockHeadContent>
          </BlockBetween>
          <div className='mt-2' style={{ marginBottom: -8 }}>
            {dataFilter && dataFilter.length > 0 ? (
              <TagFilter
                  data={dataFilter}
                  onDelete={(index) => handleDeleteFilter(index)}
                  onReset={() => setDataFilter([])}
              
              />
            ): null}
          </div>
        </BlockHead>
        
        <Block>
          <div className="card-inner-group">
            <div className="card-inner p-0">
              <div
                className="nk-tb-list is-separate is-medium mb-3"
                style={{ overflowX: 'auto' }}
              >
                <DataTableHead className="nk-tb-item">
                  <DataTableRow size="md" style={{ width: 85 }}>
                    <span className="sub-text">Channel</span>
                  </DataTableRow>
                  <DataTableRow size="md" style={{ width: 225 }}>
                    <span className="sub-text">Nama Toko di Bebas Kirim</span>
                  </DataTableRow>
                  <DataTableRow size="md" style={{ width: 150 }}>
                    <span className="sub-text">Nama Toko Channel</span>
                  </DataTableRow>
                  <DataTableRow size="md" style={{ width: 100 }}>
                    <span className="sub-text">Gudang</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Status Koneksi</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Waktu</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Integrasi Pesanan</span>
                  </DataTableRow>
                  <DataTableRow size="md">
                    <span className="sub-text">Aksi</span>
                  </DataTableRow>
                </DataTableHead>
                {loading ? (
                  <>
                    {Array.from({ length: 10 }, (_, i) => (
                      <DataTableItem key={i}>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'168px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'184px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'184px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'180px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'180px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'90px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'90px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <td className="table-activity-history-body-text">
                            <Skeleton
                              width={'90px'}
                              height={'20px'}
                              shape={'rectangle'}
                            />
                          </td>
                        </DataTableRow>
                      </DataTableItem>
                    ))}
                  </>
                ) : (
                  <>
                    {dataStore.length > 0
                      ? dataStore.map((item, index) => (
                          <DataTableItem key={index}>
                            <DataTableRow>
                              <Image
                                src={getImageSrc(item.channel_name)}
                                width={40}
                                height={40}
                                alt="waizly-logo"
                              />
                              {/* <span>{item.channel_name}</span> */}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div
                                style={{
                                  width: 225,
                                  color: '#4C4F54',
                                  overflowWrap: 'break-word',
                                }}
                              >
                                {item.store_name_op}
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span
                                style={{
                                  overflowWrap: 'break-word',
                                  color: '#4C4F54',
                                }}
                              >
                                {item.store_name_channel}
                              </span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div style={{ width: 100, color: '#4C4F54' }}>
                                {item.location_name}
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <div
                                style={{ width: 150 }}
                                className="d-flex flex-column"
                              >
                                <span className="tb-sub">
                                  <Badge
                                    className="badge-dim"
                                    color=""
                                    style={{
                                      backgroundColor: badgeStatus(
                                        item.status_name,
                                      ).bg,
                                      color: badgeStatus(item.status_name).font,
                                      fontWeight: 'bold',
                                      border: 'none',
                                    }}
                                  >
                                    {item.status_name === 'Connected'
                                      ? 'TERKONEKSI'
                                      : item.status_name ===
                                          'Problem Authorizing'
                                        ? 'INTEGRASI TERKENDALA'
                                        : item.status_name === 'Authorizing'
                                          ? 'PROSES INTEGRASI'
                                          : item.status_name === 'No Mapping'
                                            ? 'NO MAPPING'
                                            : 'danger'}
                                  </Badge>
                                </span>
                                {item.channel_name == 'TOKOPEDIA' &&
                                item.status_name === 'Authorizing' ? (
                                  <span
                                    onClick={() =>
                                      handleAuthStore(
                                        item.id,
                                        item.store_name_op,
                                        item.store_url,
                                      )
                                    }
                                    style={{
                                      marginTop: 8,
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      color: '#203864',
                                    }}
                                  >
                                    Lanjutkan Otorisasi
                                  </span>
                                ) : null}
                              </div>
                            </DataTableRow>
                            <DataTableRow style={{ width: 180 }}>
                              <span className="tb-sub">
                                <div>
                                  <span className="tb-product">
                                    <span
                                      className="title"
                                      style={{ color: '#4C4F54' }}
                                    >
                                      Waktu Dibuat
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span className="title text-nowrap">
                                    {moment(item.created_at).format(
                                      'DD-MM-YYYY HH:mm',
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <span className="tb-product">
                                    <span
                                      className="title"
                                      style={{ color: '#4C4F54' }}
                                    >
                                      Waktu Diperbarui
                                    </span>
                                  </span>
                                </div>
                                <div>
                                  <span className="title text-nowrap">
                                    {moment(item.updated_at).format(
                                      'DD-MM-YYYY HH:mm',
                                    )}
                                  </span>
                                </div>
                                    {item?.channel_name === 'SHOPEE' && (
                                      <>
                                        <div>
                                          <span className="tb-product">
                                            <span
                                              className="title"
                                              style={{ color: '#4C4F54' }}
                                            >
                                              Waktu Kadaluarsa
                                            </span>
                                          </span>
                                        </div>
                                        <div>
                                          <span className="title text-nowrap">
                                            {item?.connection_expired_at ? moment(item.connection_expired_at).format(
                                              'DD-MM-YYYY HH:mm'
                                            ) : '-'}
                                          </span>
                                        </div>
                                      </>
                                    )}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                <div className="custom-control custom-switch">
                                  <input
                                    disabled={
                                      !permissions?.includes(
                                        'Integrasi Pesanan Store',
                                      ) || item.status_name !== 'Connected'
                                    }
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={item.id}
                                    defaultChecked={item.order_api}
                                    checked={item.order_api}
                                    style={{ color: '#65C466 !important' }}
                                    onChange={() => {
                                      setselectedStore({
                                        store_name_op: item.store_name_op,
                                        id: item.id,
                                        checked: item.order_api,
                                      });
                                      setIsModalConfirmSync(true);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    style={{ color: '#65C466 !important' }}
                                    htmlFor={item.id}
                                  ></label>
                                </div>
                              </span>
                            </DataTableRow>
                            <DataTableRow
                              className="nk-tb-col-tools text-nowrap"
                              style={{ textAlign: 'center' }}
                            >
                              {/* <Icon name="edit" /> */}
                              <Button
                                style={{ width: 23 }}
                                tag="a"
                                href="#view"
                                onClick={() => handleClickEditStore(item?.id)}
                                disabled={
                                  !permissions?.includes(
                                    'Lihat Detail & Edit Authorized Store',
                                  )
                                }
                              >
                                <Icon name="edit"></Icon>
                              </Button>
                              <Button
                                style={{ width: 23 }}
                                tag="a"
                                href="#view"
                                onClick={() => syncStoreSubmit(item?.id)}
                                disabled={
                                  syncStoreLoading ||
                                  item?.status_name !== 'Connected'
                                }
                              >
                                <Icon name="reload-alt"></Icon>
                              </Button>
                              <Button
                                style={{ width: 23, color: 'red' }}
                                tag="a"
                                href="#view"
                              >
                                <Icon name="trash-empty"></Icon>
                              </Button>
                            </DataTableRow>
                          </DataTableItem>
                        ))
                      : null}
                  </>
                )}
              </div>
              <PreviewCard>
                <div
                  className={
                    'card-inner dataTables_wrapper dt-bootstrap4 no-footer'
                  }
                  style={{ padding: '0.5rem' }}
                >
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start">
                      {dataStore.length > 0 && (
                        <PaginationComponent
                          itemPerPage={pagination.size}
                          totalItems={pagination.totalRecord}
                          paginate={handlePageChange}
                          currentPage={pagination.page}
                        />
                      )}
                    </div>
                    <div className="text-center w-100">
                      {' '}
                      {/* Modified this line */}
                      {dataStore.length > 0 ? (
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
                                {' '}
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
                                </select>{' '}
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
              </PreviewCard>
            </div>
          </div>
          {/* </Card> */}
        </Block>
      </Content>
      {isModalConfirmSync && (
        <ModalCancel
          icon={gifConfirm}
          modalContentStyle={{
            width: 400,
            height: 496,
          }}
          widthImage={400}
          heightImage={272}
          separatedRound
          buttonConfirmation={true}
          useTimer={false}
          handleClickYes={!isLoading && debounceIntegrationBtn}
          handleClickCancelled={() => setIsModalConfirmSync(false)}
          textSubmit={selectedStore.checked ? 'Ya, Berhenti' : 'Ya, Aktifkan'}
          textCancel="Kembali"
          iconStyle={{ objectFit: 'cover' }}
          modalBodyStyle={{
            marginTop: '-10px',
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
            paddingLeft: 24,
            paddingRight: 24,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={`Apakah kamu ingin ${
            selectedStore.checked ? 'menonaktifkan' : 'mengaktifkan'
          } integrasi pesanan dari toko ${
            selectedStore.store_name_op
          }? Tindakan ini akan mempengaruhi proses pembaruan pesananmu`}
        />
      )}
      {isSuccesSync && (
        <ModalError
          icon={gifSuccess}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          buttonConfirmation={false}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
            buttonConfirmation: true,
          }}
          title={'Permintaan Sinkronisasi Toko Berhasil!'}
        />
      )}
    </>
  );
};

export default ProductList;
