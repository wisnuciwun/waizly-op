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
  PreviewCard,
  PaginationComponent,
  TabsIcon,
  dataTabsIconProduk,
  ModalConfirm,
  TagFilter
} from '@/components';
import { DataTableTitle } from '@/components/molecules/table/table-master-sku';
import {
  Input,
  Badge,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem,
} from 'reactstrap';

// Asset
import { Skeleton } from 'primereact/skeleton';
import Nodata from '@/assets/images/illustration/no-data.svg';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';

// utils
import { getOptionProduk } from '@/utils/getSelectOption';
import { formatCurrency } from '@/utils/formatCurrency';
import { UseDelay } from '@/utils/formater';
import { usePermissions } from '@/utils/usePermissions';

// redux & service
import { useDispatch, useSelector } from 'react-redux';
import { getViewProduct } from '@/services/produk';
import FilterTableStore from './filter';
import { FilterTableStoreProduct } from '@/components/molecules/filter-table';

import moment from 'moment';

// img
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import choosingOptions from '@/assets/gift/choosing-options.gif';
import barcode from '@/assets/gift/barcode.gif';
import {
  addMasterSingleSKU,
  setcheckboxOptionsFiltered,
  setselectedItemsFiltered,
} from '@/redux/action/product';
import { capitalize } from '@/utils/formater';

const TableProduct = ({ type }) => {
  const permissions = usePermissions();

  // console.log(permissions)

  const [dataProduk, setDataProduk] = useState([]);
  const [totalRecord, setTotalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState(31);
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('product_name');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState({
    sort_type: 'desc',
    sortOption: 'name',
  });
  const [expandedRows, setExpandedRows] = useState([]);
  const [mappingType, setMappingType] = useState('all');
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const [selectedId, setSelectedStoreIds] = useState([]);
  const selectedItems = useSelector((state) => state.product.masterSingleSKU);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalNoSKU, setmodalNoSKU] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState(null);
  const dispatch = useDispatch();

  const toggleExpand = (productId) => {
    setExpandedRows((prevRows) =>
      prevRows.includes(productId)
        ? prevRows.filter((id) => id !== productId)
        : [...prevRows, productId],
    );
  };

  // next
  const route = useRouter();

  // redux
  const { client_id } = useSelector((state) => state.auth.user);

  const handleMappingTypeChange = (newMappingType) => {
    setMappingType(newMappingType);
    setPaginationModel((prev) => ({ ...prev, page: 1 }));
    setCurrentPage(1);
  };

  const handleSelectedStoreIds = (selectedStoreIds) => {
    setSelectedStoreIds(selectedStoreIds);
    setPaginationModel((prev) => ({ ...prev, page: 1 }));
    setCurrentPage(1);
  };

  const channel =
    type == 'shopee'
      ? 1
      : type == 'tokopedia'
        ? 2
        : type == 'lazada'
          ? 3
          : type == 'tiktok'
            ? 4
            : 6;

  const handleResetFilter = () => {
    setMappingType('all');
    setSelectedStoreIds([]);
  };

  // fetch get product
  const fetchGetProduct = async (data) => {
    const filterSyncSKU = dataFilter?.filter((value) => value.type === 'Hubungan Master SKU')[0]?.filter;
    const filterStore = dataFilter?.filter((value) => value.type === 'Toko')[0]?.filter || [];
    const payload = {
      client_id: client_id,
      channel_id: [channel],
      store: filterStore,
      search: {
        product_name: selectedSearchOption === 'product_name' ? search : null,
        sku: selectedSearchOption === 'sku' ? search : null,
      },
      status_id: [activeTab],
      is_mapping: filterSyncSKU !== null && filterSyncSKU !== undefined ? filterSyncSKU : 'all',
      sort_by: sortOption.sort_by,
      sort_type: sortOption.sort_type,
      page: data ? data.page : currentPage,
      size: data ? data.size: selectedPageSize,
    };
    try {
      setLoading(true);
      const res = await getViewProduct(payload);

      if (res?.status === 200) {
        setDataProduk(res?.data?.product_listing);
        setTotalRecord(res?.data?.page_info?.total_record);
      }
    } catch (error) {
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
    fetchGetProduct({page: 1, size: newSize});
    setCurrentPage(1);
  };

  // handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
    fetchGetProduct({page: pageNumber,size:  selectedPageSize});
    setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
  };

  // handle tabs change
  const handleTabChange = async (selectedTab) => {
    if (selectedTab !== activeTab) {
      setPaginationModel((prev) => ({ ...prev, page: 1 }));
      setCurrentPage(1);
      fetchGetProduct({page: 1, size:  selectedPageSize});
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

  // handle sort dropdown
  const handleSortDropdown = (selectedOption, defaultSortType = 'asc') => {
    const sortByValue =
      selectedOption === 'Dibuat Di Channel'
        ? 'created_at'
        : 'last_sync_product';

    const newSortType =
      sortOption.sort_by === sortByValue
        ? sortOption.sort_type === 'asc'
          ? 'desc'
          : 'asc'
        : defaultSortType;

    setSortOption({ sort_by: sortByValue, sort_type: newSortType });
  };

  // handle enter search
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      fetchGetProduct({page: 1, size: 10});
    }
  };

  const handleDeleteFilter = (idx) => {
    const dataFilters = dataFilter?.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const handleClickDetailProduk = (id, hasVariant) => {
    const newPath = hasVariant
      ? '/produk/detail-produk/variant'
      : '/produk/detail-produk';

    route.push({
      pathname: newPath,
      query: {
        parent_product_listing_id: id,
      },
    });
  };

  const syncStoreSubmit = () => {
    route.push(`/produk/sinkron-produk?type=${type}`);
  };

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
      default:
        return Shopify;
    }
  };

  useEffect(() => {
    fetchGetProduct();
  }, [
    // currentPage,
    // paginationModel.page,
    // paginationModel.size,
    // mappingType,
    // dataFilter,
    selectedId,
    activeTab,
    sortOption,
    type,
  ]);

  useEffect(() => {
    if(dataFilter) {
      fetchGetProduct({page: 1, size: 10});
      setCurrentPage(1);
    }
  },[dataFilter]);

  // useEffect(() => {
  //   if(dataFilter) {
  //     fetchGetProduct({page: 1, size: 10});
  //     setCurrentPage(1);
  //   }
    
  // },[dataFilter]);

  const truncateVariantName = (name) => {
    return name.length > 6 ? `${name.substring(0, 6)}...` : name;
  };

  const truncateVariantSku = (sku) => {
    return sku != null && sku.length > 15 ? `${sku.substring(0, 15)}...` : sku;
  };

  const onSelectChange = (value, checked) => {
    if (checked) {
      dispatch(addMasterSingleSKU([...selectedItems, value]));
    } else {
      let newArr = [...selectedItems];
      newArr.splice(
        selectedItems.map((v) => v.product_id).indexOf(value.product_id),
        1,
      );
      dispatch(addMasterSingleSKU(newArr));
    }
  };

  const chekedData = () => {

    if(dataProduk && dataProduk.length === 0) {
      return false;
    }
    return dataProduk.every((item) =>
      selectedItems
        .map((v) => v.product_id)
        .toString()
        .includes(item.product_id),
    );
  };

  const selectorCheck = () => {
    let checked = dataProduk.every((item) =>
      selectedItems
        .map((v) => v.product_id)
        .toString()
        .includes(item.product_id),
    );

    if (!checked) {
      dispatch(addMasterSingleSKU([...selectedItems, ...dataProduk]));
    } else {
      dispatch(addMasterSingleSKU([]));
    }
  };

  useEffect(() => {
    dispatch(addMasterSingleSKU([]));
    dispatch(setselectedItemsFiltered([]));
    dispatch(setcheckboxOptionsFiltered([]));
  }, []);

  return (
    <>
      <Head title={`Produk Toko - ${capitalize(type)}`} />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockBetween>
              <BlockTitle>{capitalize(type)}</BlockTitle>
              <ul className="nk-block-tools g-3">
                <li>
                  <Button
                    size="lg"
                    // className={`btn w-100 center shadow-none btn-primary`}
                    type={loading ? 'button' : 'submit'}
                    disabled={!permissions.includes('Sync Produk Toko')}
                    className={
                      !permissions.includes('Sync Produk Toko') &&
                      'btn-disabled'
                    }
                    onClick={() => syncStoreSubmit()}
                  >
                    <Icon
                      name="reload"
                      style={{ marginRight: '10px', color: '#203864' }}
                    />
                    {/* {syncStoreLoading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Sinkron Toko"
                    )} */}
                    <text style={{ color: '#203864' }}>{'Sinkron Produk'}</text>
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      // if (selectedItems.length == 0) {
                      //   setModalConfirmation(true);
                      // } else
                      if (
                        selectedItems
                          .flatMap((v) => v.variant)
                          .some((v) => v.sku == '' || v.sku == null)
                      ) {
                        setmodalNoSKU(true);
                      } else {
                        route.push({
                          pathname: '/produk/tambah-master-single-sku',
                        });
                      }
                    }}
                    color="primary"
                    style={{ height: 43 }}
                    className={
                      !permissions.includes('Tambahkan ke Master SKU') &&
                      'btn-disabled'
                    }
                    disabled={!permissions.includes('Tambahkan ke Master SKU')}
                  >
                    Tambahkan ke Master SKU
                  </Button>
                </li>
              </ul>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>
        <BlockHeadContent>
          <BlockBetween>
            <div>
              <>
                <TabsIcon
                  tabsData={dataTabsIconProduk}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </>
            </div>

            <ul className="nk-block-tools g-3">
              <li>
                <div className="mt-2">
                  <div className="d-flex">
                    <div className="form-wrap">
                      <DropdownOption
                        className="filter-dropdown"
                        options={getOptionProduk}
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
              <li className='mt-2'>
                <FilterTableStoreProduct
                  isOpen={isOpenFilter} 
                  channel={channel}
                  setIsOpen={(value) => setIsOpenFilter(value)} 
                  dataFilter={dataFilter}
                  setDataFilter={(data) => setDataFilter(data)}
                />
                {/* <FilterTableStore
                  channel={channel}
                  mapping={mappingType}
                  onChangeMapping={handleMappingTypeChange}
                  onSelectedStoreIdsChange={handleSelectedStoreIds}
                  resetPayload={handleResetFilter}
                /> */}
              </li>
            </ul>
          </BlockBetween>
        </BlockHeadContent>
        <div className='mt-3' style={{ marginBottom: -8 }}>
            {dataFilter && dataFilter.length > 0 ? (
              <TagFilter
                  data={dataFilter}
                  onDelete={(index) => handleDeleteFilter(index)}
                  onReset={() => setDataFilter([])}
              />
            ): null}
          </div>
        <BlockContent>
          <Block>
            <div className="card-inner-group">
              <div
                className="card-inner p-0 border-0 overflow-x-auto"
                style={{ fontSize: '13px' }}
              >
                <table className="master-sku-nk-tb-list is-separate my-3">
                  <thead>
                    <tr className="nk-tb-col-check">
                      <th className="master-sku-nk-tb-col">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            disabled={
                              !permissions.includes('Tambahkan ke Master SKU')
                            }
                            type="checkbox"
                            className="custom-control-input"
                            id="pid-all"
                            onChange={() => selectorCheck()}
                            checked={chekedData()}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="pid-all"
                          ></label>
                        </div>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle>
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Nama Produk
                          </span>
                          <Button
                            onClick={() => handleSortChange('name')}
                            size="sm"
                          >
                            <Icon name="swap-v" style={{ cursor: 'pointer' }} />
                          </Button>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle>
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Varian
                          </span>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle className="d-flex align-items-center justify-content-between">
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Kode Produk
                          </span>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle>
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Harga Produk
                          </span>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle>
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Stok
                          </span>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle>
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Hubungan Master SKU
                          </span>
                        </DataTableTitle>
                      </th>
                      <th className="master-sku-nk-tb-col">
                        <DataTableTitle className="d-flex align-items-center justify-content-between">
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4F54' }}
                          >
                            Waktu
                          </span>
                          <Dropdown isOpen={open} toggle={toggle}>
                            <DropdownToggle
                              tag="a"
                              href="#toggle"
                              onClick={(ev) => {
                                ev.preventDefault();
                              }}
                            >
                              <Button>
                                <Icon
                                  name="swap-v"
                                  style={{ cursor: 'pointer' }}
                                />
                              </Button>
                            </DropdownToggle>
                            <DropdownMenu className="bg-white mt-3">
                              <DropdownItem className="p-0">
                                <Button
                                  style={{
                                    color: '#4C4F54',
                                    fontWeight: 400,
                                    fontSize: 13,
                                    padding: '10px 16px 10px 16px',
                                  }}
                                  onClick={() =>
                                    handleSortDropdown('Dibuat Di Channel')
                                  }
                                >
                                  Dibuat Di Channel
                                </Button>
                              </DropdownItem>
                              <DropdownItem className="p-0">
                                <Button
                                  style={{
                                    color: '#4C4F54',
                                    fontWeight: 400,
                                    fontSize: 13,
                                    padding: '10px 16px 10px 16px',
                                  }}
                                  onClick={() =>
                                    handleSortDropdown(
                                      'Terakhir Sinkronisasi',
                                      'asc',
                                    )
                                  }
                                >
                                  Terakhir Sinkronisasi
                                </Button>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </DataTableTitle>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <>
                        {Array.from({ length: 10 }, (_, i) => (
                          <tr
                            style={{
                              backgroundColor: '#fff',
                              paddingTop: '0.75rem',
                              paddingBottom: '0.75rem',
                            }}
                            key={i}
                          >
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'168px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                            <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                              <Skeleton
                                width={'184px'}
                                height={'32px'}
                                shape={'rectangle'}
                              />
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <>
                        {dataProduk.map((item, idx) => (
                          <>
                            <tr
                              key={idx}
                              style={{
                                backgroundColor: '#fff',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                              }}
                            >
                              <th className="nk-tb-col-check master-sku-nk-tb-col tb-col">
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    disabled={
                                      !permissions.includes(
                                        'Tambahkan ke Master SKU',
                                      )
                                    }
                                    type="checkbox"
                                    className="custom-control-input"
                                    defaultChecked={item.check}
                                    id={
                                      item.parent_product_listing_id + 'oId-all'
                                    }
                                    key={Math.random()}
                                    checked={
                                      selectedItems.find(
                                        (v) => v.product_id == item.product_id,
                                      ) != undefined
                                        ? true
                                        : false
                                    }
                                    onChange={(e) =>
                                      onSelectChange(item, e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={
                                      item.parent_product_listing_id + 'oId-all'
                                    }
                                  ></label>
                                </div>
                              </th>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div
                                  className="master-sku-product-table-card mt-2 mb-2"
                                  style={{
                                    minWidth: '21rem',
                                    maxWidth: '21rem',
                                    marginRight: '30px',
                                  }}
                                >
                                  <Image
                                    src={ilustrationCamera}
                                    width={48}
                                    alt="product-sku"
                                  />

                                  <div className="master-sku-product-table-info text-truncate">
                                    <span
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        handleClickDetailProduk(
                                          item?.parent_product_listing_id,
                                          item?.has_variant,
                                        )
                                      }
                                    >
                                      {item?.product_name}
                                    </span>
                                    <br />
                                    <span style={{ fontWeight: 'normal' }}>
                                      <Image
                                        src={getImageSrc(item.channel_name)}
                                        width={12}
                                        height={12}
                                        alt="waizly-logo"
                                        style={{
                                          marginRight: '8px',
                                          marginBottom: '2px',
                                        }}
                                      />
                                      {item?.store_name}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <th>
                                <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                  <div
                                    style={{
                                      minWidth: '10rem',
                                      fontWeight: 'normal',
                                      color: '#4C4F54',
                                    }}
                                  >
                                    {item.has_variant && (
                                      <>
                                        {item.variant.map(
                                          (variantItem, index) => (
                                            <span
                                              key={
                                                variantItem.child_product_listing_id
                                              }
                                              style={{
                                                display: expandedRows.includes(
                                                  item.product_id,
                                                )
                                                  ? 'inline'
                                                  : index < 3
                                                    ? 'inline'
                                                    : 'none',
                                              }}
                                            >
                                              {/* Display first 3 variant items by default */}
                                              {index < 3 && (
                                                <>
                                                  {truncateVariantName(
                                                    variantItem.variant_name_1,
                                                  )}
                                                  {variantItem.variant_name_2 &&
                                                    `, ${truncateVariantName(
                                                      variantItem.variant_name_2,
                                                    )}`}
                                                  {variantItem.variant_name_3 &&
                                                    `, ${truncateVariantName(
                                                      variantItem.variant_name_3,
                                                    )}`}
                                                  <br />
                                                </>
                                              )}
                                            </span>
                                          ),
                                        )}
                                      </>
                                    )}
                                    {!item.has_variant && '-'}
                                    <div className="text-center">
                                      {item.variant.length > 3 && (
                                        <>
                                          <Collapse
                                            isOpen={expandedRows.includes(
                                              item.product_id,
                                            )}
                                          >
                                            <div className="d-flex flex-column align-items-start">
                                              {/* Render additional variant items */}
                                              {item.variant
                                                .slice(3)
                                                .map((vItem, idx) => (
                                                  <div key={idx}>
                                                    {/* Customize the rendering as needed */}
                                                    {truncateVariantName(
                                                      vItem.variant_name_1,
                                                    )}
                                                    {vItem.variant_name_2 &&
                                                      `, ${truncateVariantName(
                                                        vItem.variant_name_2,
                                                      )}`}
                                                    {vItem.variant_name_3 &&
                                                      `, ${truncateVariantName(
                                                        vItem.variant_name_3,
                                                      )}`}
                                                  </div>
                                                ))}
                                            </div>
                                          </Collapse>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </th>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div
                                  style={{
                                    minWidth: '10rem',
                                    color: '#4c4f54',
                                    textWrap: 'nowrap',
                                  }}
                                >
                                  {item.has_variant ? (
                                    <>
                                      {item.variant.map(
                                        (variantItem, index) => (
                                          <span
                                            key={
                                              variantItem.child_product_listing_id
                                            }
                                            style={{
                                              display: expandedRows.includes(
                                                item.product_id,
                                              )
                                                ? 'inline'
                                                : index < 3
                                                  ? 'inline'
                                                  : 'none',
                                            }}
                                          >
                                            {/* {variantItem.sku} <br /> */}
                                            {index < 3 && (
                                              <>
                                                {truncateVariantSku(
                                                  variantItem.sku,
                                                )}
                                                <br />
                                              </>
                                            )}
                                          </span>
                                        ),
                                      )}
                                      {item.variant.length > 3 && (
                                        <>
                                          <Collapse
                                            isOpen={expandedRows.includes(
                                              item.product_id,
                                            )}
                                          >
                                            {item.variant
                                              .slice(3)
                                              .map((variantItem, index) => (
                                                <span key={index}>
                                                  {truncateVariantSku(
                                                    variantItem.sku,
                                                  )}
                                                  <br />
                                                </span>
                                              ))}
                                          </Collapse>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    item.variant.length > 0 && (
                                      <span>
                                        {truncateVariantSku(
                                          item.variant[0].sku,
                                        )}{' '}
                                        <br />
                                      </span>
                                    )
                                  )}
                                  {!item.has_variant &&
                                    item.variant.length === 0 &&
                                    '-'}{' '}
                                </div>
                              </td>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div
                                  style={{
                                    minWidth: '8rem',
                                    color: '#203864',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {item.has_variant ? (
                                    <>
                                      {item.variant.map(
                                        (variantItem, index) => (
                                          <span
                                            key={index}
                                            style={{
                                              color: '#203864',
                                              display: expandedRows.includes(
                                                item.product_id,
                                              )
                                                ? 'inline'
                                                : index < 3
                                                  ? 'inline'
                                                  : 'none',
                                            }}
                                          >
                                            {index < 3 && (
                                              <>
                                                Rp{' '}
                                                {formatCurrency(
                                                  parseFloat(
                                                    variantItem.publish_price,
                                                  ),
                                                )}{' '}
                                                <br />
                                              </>
                                            )}
                                          </span>
                                        ),
                                      )}
                                      {item.variant.length > 3 && (
                                        <>
                                          <Collapse
                                            isOpen={expandedRows.includes(
                                              item.product_id,
                                            )}
                                          >
                                            {item.variant
                                              .slice(3)
                                              .map((variantItem, index) => (
                                                <span
                                                  style={{
                                                    color: '#203864',
                                                  }}
                                                  key={index}
                                                >
                                                  Rp{' '}
                                                  {formatCurrency(
                                                    parseFloat(
                                                      variantItem.publish_price,
                                                    ),
                                                  )}{' '}
                                                  <br />
                                                </span>
                                              ))}
                                          </Collapse>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    item.variant.length > 0 && (
                                      <span
                                        style={{
                                          color: '#203864',
                                        }}
                                      >
                                        Rp{' '}
                                        {formatCurrency(
                                          parseFloat(
                                            item.variant[0].publish_price,
                                          ),
                                        )}{' '}
                                        <br />
                                      </span>
                                    )
                                  )}
                                  {!item.has_variant &&
                                    item.variant.length === 0 &&
                                    '-'}{' '}
                                </div>
                              </td>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div
                                  style={{ minWidth: '3rem', color: '#4C4F54' }}
                                >
                                  {item.has_variant ? (
                                    <>
                                      {item.variant.map(
                                        (variantItem, index) => (
                                          <span
                                            key={index}
                                            style={{
                                              color: '#4C4F54',
                                              display: expandedRows.includes(
                                                item.product_id,
                                              )
                                                ? 'inline'
                                                : index < 3
                                                  ? 'inline'
                                                  : 'none',
                                            }}
                                          >
                                            {index < 3 && (
                                              <>
                                                {variantItem.qty} <br />
                                              </>
                                            )}
                                          </span>
                                        ),
                                      )}
                                      {item.variant.length > 3 && (
                                        <Collapse
                                          isOpen={expandedRows.includes(
                                            item.product_id,
                                          )}
                                        >
                                          {item.variant
                                            .slice(3)
                                            .map((variantItem, index) => (
                                              <span
                                                key={index}
                                                style={{ color: '#4C4F54' }}
                                              >
                                                {variantItem.qty}
                                                <br />
                                              </span>
                                            ))}
                                        </Collapse>
                                      )}
                                    </>
                                  ) : (
                                    item.variant.length > 0 && (
                                      <span>
                                        {item.variant[0].qty} <br />
                                      </span>
                                    )
                                  )}
                                  {!item.has_variant &&
                                    item.variant.length === 0 &&
                                    '-'}{' '}
                                </div>
                              </td>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div style={{ minWidth: '12rem' }}>
                                  {item.has_variant ? (
                                    <>
                                      {item.variant.map(
                                        (variantItem, index) => (
                                          <span
                                            key={index}
                                            style={{
                                              display: expandedRows.includes(
                                                item.product_id,
                                              )
                                                ? 'inline'
                                                : index < 3
                                                  ? 'inline'
                                                  : 'none',
                                            }}
                                          >
                                            {index < 3 && (
                                              <>
                                                <Badge
                                                  className="badge-dim"
                                                  style={{
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                  }}
                                                  color={
                                                    variantItem.is_mapping
                                                      ? 'success'
                                                      : 'danger'
                                                  }
                                                >
                                                  {variantItem.is_mapping
                                                    ? 'TERHUBUNG'
                                                    : 'TIDAK TERHUBUNG'}
                                                </Badge>
                                                <br />
                                              </>
                                            )}
                                          </span>
                                        ),
                                      )}
                                      {item.variant.length > 3 && (
                                        <>
                                          <Collapse
                                            isOpen={expandedRows.includes(
                                              item.product_id,
                                            )}
                                          >
                                            {item.variant
                                              .slice(3)
                                              .map((variantItem, index) => (
                                                <span key={index}>
                                                  <Badge
                                                    className="badge-dim"
                                                    style={{
                                                      fontWeight: 'bold',
                                                      textTransform:
                                                        'uppercase',
                                                    }}
                                                    color={
                                                      variantItem.is_mapping
                                                        ? 'success'
                                                        : 'danger'
                                                    }
                                                  >
                                                    {variantItem.is_mapping
                                                      ? 'TERHUBUNG'
                                                      : 'TIDAK TERHUBUNG'}
                                                  </Badge>
                                                  <br />
                                                </span>
                                              ))}
                                          </Collapse>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    item.variant.length > 0 && (
                                      <span>
                                        <Badge
                                          className="badge-dim"
                                          style={{
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                          }}
                                          color={
                                            item.variant[0].is_mapping
                                              ? 'success'
                                              : 'danger'
                                          }
                                        >
                                          {item.variant[0].is_mapping
                                            ? 'TERHUBUNG'
                                            : 'TIDAK TERHUBUNG'}
                                        </Badge>
                                        <br />
                                      </span>
                                    )
                                  )}
                                  {!item.has_variant &&
                                    item.variant.length === 0 &&
                                    '-'}{' '}
                                </div>
                              </td>
                              <td className="master-sku-nk-tb-col tb-col nk-tb-col">
                                <div style={{ minWidth: '10rem' }}>
                                  <span className="tb-sub">
                                    <div>
                                      <span className="tb-product">
                                        <span
                                          className="title"
                                          style={{
                                            fontWeight: 'bold',
                                            color: '#4C4F54',
                                          }}
                                        >
                                          Dibuat Di Channel
                                        </span>
                                      </span>
                                    </div>
                                    <div>
                                      <text
                                        style={{ color: '#4C4F54' }}
                                        className="title text-nowrap"
                                      >
                                        {moment(item.created_at).format(
                                          'DD/MM/YYYY HH:mm',
                                        )}
                                      </text>
                                    </div>
                                    <div>
                                      <span className="tb-product">
                                        <span
                                          className="title"
                                          style={{
                                            fontWeight: 'bold',
                                            color: '#4C4F54',
                                          }}
                                        >
                                          Terakhir Sinkronisasi
                                        </span>
                                      </span>
                                    </div>
                                    <div>
                                      <text
                                        style={{ color: '#4C4F54' }}
                                        className="title text-nowrap"
                                      >
                                        {moment(item.last_sync_product).format(
                                          'DD/MM/YYYY HH:mm',
                                        )}
                                      </text>
                                    </div>
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr style={{ margin: '0', padding: '0' }}>
                              <td
                                colSpan="8"
                                className="text-center"
                                style={{ marginBottom: '-20px', padding: '0' }}
                              >
                                <div style={{ margin: '0', padding: '0' }}>
                                  {item.variant.length > 3 && (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          toggleExpand(item.product_id)
                                        }
                                      >
                                        {expandedRows.includes(item.product_id)
                                          ? `Lihat ${
                                              item.variant.length - 3
                                            } Variant Lainya`
                                          : `Lihat ${
                                              item.variant.length - 3
                                            } Variant Lainya`}
                                        <Icon
                                          name={
                                            expandedRows.includes(
                                              item.product_id,
                                            )
                                              ? 'chevron-up'
                                              : 'chevron-down'
                                          }
                                          style={{
                                            color: '#203864',
                                            marginLeft: 4,
                                          }}
                                        ></Icon>
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <PreviewCard className="border-0 shadow-none">
                <div className={'dataTables_wrapper'}>
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start">
                      {dataProduk.length > 0 && (
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
                      {dataProduk.length > 0 ? (
                        <div className="datatable-filter text-end">
                          <div
                            className="dataTables_length"
                            id="DataTables_Table_0_length"
                          >
                            <label>
                              <span
                                style={{ fontSize: 12 }}
                                className="d-none d-sm-inline-block"
                              >
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
              </PreviewCard>
            </div>
          </Block>
        </BlockContent>
      </Content>
      {modalConfirmation && (
        <ModalConfirm
          toggle={() => setModalConfirmation((prev) => !prev)}
          icon={choosingOptions}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '148px',
            width: 400,
            marginLeft: '-25px',
            padding: 38,
            paddingTop: 20,
            marginBottom: 13,
          }}
          title={'Kamu Belum Memilih Produk!'}
          subtitle={
            'Pilih setidaknya 1 produk untuk di hubungkan ke Master SKU'
          }
          useTimer={false}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
      {modalNoSKU && (
        <ModalConfirm
          icon={barcode}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '45%',
            borderTopRightRadius: '45%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginLeft: '-25px',
            paddingLeft: 44,
            paddingRight: 44,
            paddingBottom: 10,
            width: 400,
            marginTop: '-100px',
            height: '228px',
            marginBottom: 13,
          }}
          textSubmit="Lanjutkan"
          title={'Terdapat Kode Produk Yang Kosong!'}
          subtitle={
            'Dari Produk Toko yang kamu pilih, hanya yang memiliki Kode Produk yang dapat ditambahkan ke Master SKU.'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalNoSKU(false)}
          handleClickYes={() =>
            route.push({
              pathname: '/produk/tambah-master-single-sku',
            })
          }
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};

export default TableProduct;
