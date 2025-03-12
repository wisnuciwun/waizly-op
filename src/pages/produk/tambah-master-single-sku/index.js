/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  BlockTitle,
  DropdownOption,
  Head,
  Icon,
  ModalConfirm,
  PaginationComponent,
  PagginationFilter,
} from '@/components';
import Content from '@/layout/content/Content';
import { useRouter } from 'next/navigation';
import { Input, FormGroup, Button, Row, Col, Tooltip } from 'reactstrap';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import Nodata from '@/assets/images/illustration/no-data.svg';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';
import successGif from '@/assets/gift/success-create-sku.gif';
import { useDispatch, useSelector } from 'react-redux';
import { channelLogo } from '@/utils/channelLogo';
import {
  getStoreList,
  postProductsMasterSingleSKU,
  requestProductsMasterSKU,
} from '@/services/master';
import { MultiSelect } from 'primereact/multiselect';
import { optionMasterSku } from '@/utils/getSelectOption';
import {
  setcheckboxOptionsFiltered,
  setselectedItemsFiltered,
} from '@/redux/action/product';
import colors from '@/utils/colors';
import { LoadingMappingProduct } from '@/components/molecules';

function TambahMasterSingleSKU() {
  const { client_id } = useSelector((state) => state.auth.user);
  const storeName = 'SHOPIFY';
  const pageSubtitle = 'Tambah Master Single SKU dari Produk Toko';
  const [search, setsearch] = useState('');
  const [checkboxOptions, setcheckboxOptions] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    total_record: 10,
    size_per_page: 10,
    previous_page: null,
    current_page: 1,
    next_page: 2,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedStores, setselectedStores] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [selectedSearchOption, setSelectedSearchOption] = useState('name');
  const [acceptRule, setacceptRule] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const mainData = useSelector((state) =>
    state.product.masterSingleSKU.flatMap((product) =>
      product.variant.map((vary) => ({
        channel_name: product.channel_name,
        store_name: product.store_name,
        product_name: product.product_name,
        ...vary,
      })),
    ),
  );
  const { selectedItemsFiltered } = useSelector((state) => state.product);
  const { checkboxOptionsFiltered } = useSelector((state) => state.product);
  const checkboxOptionsId = selectedItemsFiltered.map(
    (v) => v.child_product_listing_id,
  );
  const totalItems = selectedItemsFiltered.length;
  const channelList = [{ value: 6, label: 'Shopify' }];
  const [storeList, setstoreList] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const route = useRouter();

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOver, setTooltipOver] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const toggleOver = () => setTooltipOver(!tooltipOver);

  const onBackClick = () => {
    router.push('/produk/shopify');
  };

  const handlePageChange = (page) => {
    setPaginationModel((prevState) => ({ ...prevState, page }));
  };

  const handlePerPage = (size) => {
    setPaginationModel((prevState) => ({ ...prevState, size, page: 1 }));
  };

  const handleClickCancelled = () => {
    setModalConfirmation(false);
  };

  const handleClickYes = () => {
    setModalConfirmation(false);
    onBackClick();
  };

  const onGetLeftTableData = async (initial = false) => {
    setLoading(true);
    const selectedItems = mainData.filter(
      (v) => v.is_mapping == false && v.sku != null && v.sku != '',
    );
    let params = {
      size: paginationModel.size,
      client_id: client_id,
      page: paginationModel.page,
      channel: selectedChannels,
      store: selectedStores,
      search: {
        product_name: selectedSearchOption == 'name' ? search : '',
        sku: selectedSearchOption == 'sku' ? search : '',
      },
    };

    try {
      await requestProductsMasterSKU(params).then((res) => {
        if (res.status == 200) {
          setPageInfo(res.data.page_info);
          setcheckboxOptions(res.data.product_listing);
          if (initial) {
            if (selectedItemsFiltered.length == 0) {
              dispatch(setselectedItemsFiltered(selectedItems));
            }
            if (checkboxOptionsFiltered.length == 0) {
              dispatch(setcheckboxOptionsFiltered(res.data.product_listing));
            }
          }
        }
      });
    } catch (error) {
      if (error?.response?.status === 400) {
        route.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const truncateVariantName = (name) => {
    return name != null && name.length > 6
      ? `${name.substring(0, 6)}...`
      : name;
  };

  const onGetStoreList = async () => {
    try {
      await getStoreList(
        client_id,
        selectedChannels.length > 0 ? selectedChannels : 0,
      ).then((res) => {
        if (res.status == 200) {
          setstoreList(res.data.stores);
        }
      });
    } catch (error) {
      if (error?.response?.status === 400) {
        route.push('/login');
      }
    }
  };

  const handleCheckLeftTable = (value, checked) => {
    if (checked) {
      if (checkboxOptionsFiltered.length <= 19) {
        dispatch(
          setcheckboxOptionsFiltered([...checkboxOptionsFiltered, value]),
        );
        dispatch(setselectedItemsFiltered([...selectedItemsFiltered, value]));
      } else {
        setTooltipOver(true);
      }
    } else {
      let newArr = [...checkboxOptionsFiltered];
      newArr.splice(checkboxOptionsFiltered.indexOf(value), 1);
      dispatch(setcheckboxOptionsFiltered(newArr));

      let newRightDataFiltered = [...selectedItemsFiltered];
      let id = selectedItemsFiltered
        .map((v) => v.child_product_listing_id)
        .indexOf(value.child_product_listing_id);

      if (id != -1) {
        newRightDataFiltered.splice(id, 1);
        dispatch(setselectedItemsFiltered(newRightDataFiltered));
      }
    }
  };

  const handleRemoveFromList = (value) => {
    let newArr = [...selectedItemsFiltered];
    newArr.splice(selectedItemsFiltered.indexOf(value), 1);
    dispatch(setselectedItemsFiltered(newArr));

    let newLeftDataFiltered = [...checkboxOptionsFiltered];
    let id = checkboxOptionsFiltered
      .map((v) => v.child_product_listing_id)
      .indexOf(value.child_product_listing_id);

    if (id != -1) {
      newLeftDataFiltered.splice(id, 1);
      dispatch(setcheckboxOptionsFiltered(newLeftDataFiltered));
    }
  };

  const onPostData = async () => {
    const selectedItemsId = selectedItemsFiltered.map(
      (v) => v.child_product_listing_id,
    );
    await postProductsMasterSingleSKU({
      product_listing: selectedItemsId,
    }).then((res) => {
      if (res.status == 201 && res.data.created) {
        setModalSucces(true);
        setTimeout(() => {
          setModalSucces(false);
          onBackClick();
        }, 2000);
      }
    });
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      setPaginationModel({ page: 1, size: paginationModel.size });
      onGetLeftTableData();
    }
  };

  const handleSelectChannel = (e) => {
    setPaginationModel({ page: 1, size: paginationModel.size });
    const selectedValues = e.value;
    setSelectedChannels(selectedValues);
  };

  const handleSelectStores = (e) => {
    setPaginationModel({ page: 1, size: paginationModel.size });
    const selectedValues = e.value;
    setselectedStores(selectedValues);
  };

  useEffect(() => {
    onGetLeftTableData(true);
  }, []);

  useEffect(() => {
    onGetLeftTableData();
  }, [paginationModel, selectedChannels, selectedStores]);

  useEffect(() => {
    onGetStoreList();
  }, [selectedChannels]);

  return (
    <>
      <Head title="Master SKU" />
      <Content>
        <div className="wrapper-bg-light" style={{ width: 'auto' }}>
          <p className="text-primary" style={{ fontSize: 12 }}>
            PRODUK TOKO&nbsp; / &nbsp;{storeName.toUpperCase()}&nbsp; / &nbsp;
            <span className="text-header-sm-seconds">{pageSubtitle}</span>
          </p>
          <BlockTitle>Tambah Master Single SKU dari Produk Toko</BlockTitle>
          <p style={{ color: '#4C4F54', fontSize: '12px', fontWeight: 400 }}>
            Hubungkan Master SKU kamu dari Daftar Produk sehingga kamu dapat
            mengintegrasikan stok toko kamu
          </p>
          <div className="form-wrap">
            <Row>
              <Col lg={4} md={3} sm={12} className="mt-1">
                <MultiSelect
                  value={selectedChannels}
                  id={'channel'}
                  optionLabel="label"
                  color={colors.black}
                  placeholder={'Filter Channel'}
                  onChange={handleSelectChannel}
                  display={'chip'}
                  options={channelList}
                  style={{
                    height: '40px',
                    width: '100%',
                    padding: '10px',
                  }}
                  itemTemplate={(list) => (
                    <div className="p-multiselect-representative">
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '400',
                          marginTop: '4px',
                        }}
                      >
                        {list.label}
                      </span>
                    </div>
                  )}
                />
              </Col>
              <Col lg={4} md={3} sm={12} className="mt-1">
                <MultiSelect
                  value={selectedStores}
                  id={'store'}
                  optionLabel="store_name"
                  optionValue="store_id"
                  placeholder="Filter Toko"
                  color={colors.black}
                  display={'chip'}
                  onChange={handleSelectStores}
                  options={storeList}
                  style={{
                    height: '40px',
                    width: '100%',
                    padding: '10px',
                  }}
                  itemTemplate={(list) => (
                    <div className="p-multiselect-representative">
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '400',
                          marginTop: '4px',
                        }}
                      >
                        {list.store_name}
                      </span>
                    </div>
                  )}
                />
              </Col>
              <Col lg={4} md={3} sm={12} className="d-flex mt-1">
                <DropdownOption
                  className="filter-dropdown"
                  options={optionMasterSku}
                  optionLabel={'name'}
                  placeholder={'Nama Produk'}
                  value={selectedSearchOption}
                  onChange={(e) => setSelectedSearchOption(e.target.value)}
                />
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
                    onChange={(e) => setsearch(e.target.value)}
                    onKeyDown={handleSearchEnter}
                    style={{ width: 'auto' }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row xs="2" className="mt-5">
              <Col xs="12" lg="6">
                <div
                  style={{
                    border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                    height: 500,
                    overflowY: 'auto',
                  }}
                >
                  {loading ? (
                    <LoadingMappingProduct />
                  ) : checkboxOptions.length > 0 ? (
                    checkboxOptions.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: 110,
                          }}
                        >
                          <div
                            style={{
                              width: '85%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div>
                              <Image
                                width={44}
                                height={44}
                                src={ilustrationCamera}
                                style={{ alignSelf: 'center' }}
                                alt="Image Product"
                              />
                            </div>
                            <div
                              style={{
                                marginLeft: 14,
                                width: '85%',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Image
                                  width={13}
                                  height={13}
                                  src={channelLogo(option.channel_name)}
                                  style={{
                                    alignSelf: 'center',
                                    marginRight: 4,
                                    marginTop: -2,
                                  }}
                                  alt="Image Channel"
                                />
                                <span>{option?.store_name}</span>
                              </div>
                              <p className="text-header-bold text-truncate">
                                {option?.product_name}
                              </p>
                              <Row>
                                <Col
                                  md={5}
                                  className="text-header-text-sub-connect-product text-truncate"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Kode Produk: {option?.sku || '-'}
                                </Col>
                                <Col
                                  md={7}
                                  className="text-header-text-sub-connect-product"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Varian:{' '}
                                  {option.is_single_product ? (
                                    <>{'-'}</>
                                  ) : (
                                    <>
                                      {truncateVariantName(
                                        option.variant_name_1,
                                      )}
                                      {option.variant_name_2 &&
                                        `, ${truncateVariantName(
                                          option.variant_name_2,
                                        )}`}
                                      {option.variant_name_3 &&
                                        `, ${truncateVariantName(
                                          option.variant_name_3,
                                        )}`}
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div style={{ alignSelf: 'center' }}>
                            <FormGroup
                              id={
                                checkboxOptionsId
                                  .toString()
                                  .includes(option?.child_product_listing_id)
                                  ? 'id'
                                  : !option.is_has_sku
                                    ? 'TooltipCheck'
                                    : checkboxOptionsFiltered.length == 20
                                      ? 'TooltipOver'
                                      : ''
                              }
                              style={{ margin: 0 }}
                              check
                              inline
                            >
                              <Input
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: option.is_has_sku
                                    ? ''
                                    : '#E9E9EA',
                                }}
                                type="checkbox"
                                // disabled={option.is_has_sku == false}
                                checked={checkboxOptionsId
                                  .toString()
                                  .includes(option?.child_product_listing_id)}
                                onChange={(e) => {
                                  if (option.is_has_sku)
                                    handleCheckLeftTable(
                                      option,
                                      e.target.checked,
                                    );
                                }}
                              />
                              {!option.is_has_sku && (
                                <Tooltip
                                  isOpen={tooltipOpen}
                                  target="TooltipCheck"
                                  toggle={toggle}
                                  placement={'right'}
                                >
                                  {'Tambahkan kode produk terlebih dahulu'}
                                </Tooltip>
                              )}
                              {tooltipOver && (
                                <Tooltip
                                  isOpen={
                                    checkboxOptionsFiltered.length == 20
                                      ? tooltipOver
                                      : false
                                  }
                                  target="TooltipOver"
                                  toggle={
                                    checkboxOptionsFiltered.length == 20
                                      ? toggleOver
                                      : () => {}
                                  }
                                  placement={'right'}
                                >
                                  {'Maksimal 10 Produk'}
                                </Tooltip>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div
                        className="d-flex flex-column text-center gap-3"
                        style={{ marginTop: 170 }}
                      >
                        <Image
                          width={120}
                          height={80}
                          src={Nodata}
                          style={{ alignSelf: 'center' }}
                          alt="Image Product"
                        />
                        <p style={{ color: '#4C4F54', fontSize: 13 }}>
                          Data tidak ditemukan
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className={'dataTables_wrapper mt-4 mb-4'}>
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start" style={{ paddingLeft: 0 }}>
                      {checkboxOptions.length > 0 && (
                        <PaginationComponent
                          itemPerPage={paginationModel.size}
                          totalItems={pageInfo?.total_record}
                          paginate={handlePageChange}
                          currentPage={pageInfo.current_page}
                        />
                      )}
                    </div>
                    {checkboxOptions.length > 0 ? (
                      <PagginationFilter
                        pageSize={paginationModel.size}
                        setPageSize={(value) => handlePerPage(value)}
                      />
                    ) : null}

                    {/* <div className="td-flex justify-content-between align-items-center g-2">
                      {checkboxOptions.length > 0 ? (
                        <div className="datatable-filter text-end">
                          <div
                            className="dataTables_length text-center"
                            id="DataTables_Table_0_length"
                          >
                            <label>
                              <span style={{fontSize: 12}} className="d-none d-sm-inline-block">
                                Data Per Halaman
                              </span>
                              <div className="form-control-select">
                                <select
                                  name="DataTables_Table_0_length"
                                  className="custom-select custom-select-sm form-control form-control-sm"
                                  value={paginationModel.size}
                                  onChange={(e) =>
                                    handlePerPage(e.target.value)
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
                      ) : null}
                    </div> */}
                  </div>
                </div>
              </Col>
              <Col xs="12" lg="6">
                <div
                  style={{
                    border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                    height: 500,
                    overflowY: 'auto',
                  }}
                >
                  {selectedItemsFiltered.length > 0 ? (
                    selectedItemsFiltered.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: 110,
                          }}
                        >
                          <div
                            style={{
                              width: '85%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div>
                              <Image
                                width={44}
                                height={44}
                                src={ilustrationCamera}
                                style={{ alignSelf: 'center' }}
                                alt="Image Product"
                              />
                            </div>
                            <div
                              style={{
                                width: '85%',
                                marginLeft: 14,
                                fontSize: '12px',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Image
                                  src={channelLogo(option.channel_name)}
                                  alt="channel_name"
                                  width={13}
                                  height={13}
                                />
                                <span>&nbsp;&nbsp;{option.store_name}</span>
                              </div>
                              <p className="text-header-bold text-truncate">
                                {option?.product_name}
                              </p>
                              <Row>
                                <Col
                                  md={6}
                                  className="text-header-text-sub-connect-product text-truncate"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                    fontSize: '12px',
                                  }}
                                >
                                  Kode Produk: {option?.sku || '-'}
                                </Col>
                                <Col
                                  md={6}
                                  className="text-header-text-sub-connect-product"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Varian:{' '}
                                  {option.is_single_product ? (
                                    <>{'-'}</>
                                  ) : (
                                    <>
                                      {truncateVariantName(
                                        option.variant_name_1,
                                      )}
                                      {option.variant_name_2 &&
                                        `, ${truncateVariantName(
                                          option.variant_name_2,
                                        )}`}
                                      {option.variant_name_3 &&
                                        `, ${truncateVariantName(
                                          option.variant_name_3,
                                        )}`}
                                    </>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div
                            style={{
                              alignSelf: 'center',
                              width: '5%',
                              cursor: 'pointer',
                            }}
                          >
                            <div onClick={() => handleRemoveFromList(option)}>
                              <IconTrashOutlined />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div
                        className="d-flex flex-column text-center gap-3"
                        style={{ marginTop: 170 }}
                      >
                        <Image
                          width={120}
                          height={80}
                          src={NodataSKU}
                          style={{ alignSelf: 'center' }}
                          alt="Image Product"
                        />
                        <p style={{ color: '#4C4F54', fontSize: 13 }}>
                          {
                            'Kamu belum menghubungkan SKU Toko apa pun ke Master Produk'
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 dataTables_wrapper">
                  <div
                    style={{ height: 35 }}
                    className="d-flex align-items-center"
                  >
                    <p style={{ fontSize: 12 }}>Terpilih : {totalItems}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <div
              style={{
                gap: 16,
                display: 'flex',
                marginTop: 40,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="d-flex align-items-center gap-2 w-50">
                <div style={{ alignSelf: 'center' }}>
                  <FormGroup style={{ margin: 0 }} check inline>
                    <Input
                      type="checkbox"
                      checked={acceptRule}
                      onChange={(e) => setacceptRule(e.target.checked)}
                      style={{ width: 16, height: 16 }}
                    />
                  </FormGroup>
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 400, color: '#4C4F54' }}
                >
                  Saya setuju, Jika Kode Produk yang dipilih sudah ada di Master
                  SKU (Single atau Bundling), secara otomatis akan dipetakan ke
                  Master SKU yang sudah ada.
                </span>
              </div>
              <div className="d-flex">
                <Button
                  // onClick={() => isValueChange ? handleClickActionShow() : handleBackForm()}
                  onClick={() => {
                    totalItems > 0 ? setModalConfirmation(true) : onBackClick();
                  }}
                  type="button"
                  className={'bg-white text-primary justify-center'}
                  style={{
                    height: 43,
                    width: 180,
                    fontSize: 14,
                    textAlign: 'center',
                    border: 'none',
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    onPostData();
                  }}
                  className={`justify-center ${
                    totalItems > 0 && acceptRule
                      ? 'btn-primary'
                      : 'btn-disabled'
                  }`}
                  disabled={totalItems > 0 && acceptRule ? false : true}
                  color="primary"
                  style={{ height: 43, width: 180, fontSize: 14 }}
                >
                  {'Simpan'}
                </Button>
              </div>
            </div>

            {modalConfirmation && (
              <ModalConfirm
                icon={verificationYesNo}
                modalContentStyle={{ width: 350 }}
                widthImage={350}
                heightImage={320}
                modalBodyStyle={{
                  borderTopLeftRadius: '60%',
                  borderTopRightRadius: '60%',
                  borderBottomLeftRadius: 6,
                  borderBottomRightRadius: 6,
                  marginTop: '-100px',
                  height: '185px',
                }}
                title={'Apakah Kamu Yakin?'}
                subtitle={
                  'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
                }
                buttonConfirmation
                useTimer={false}
                handleClickCancelled={handleClickCancelled}
                handleClickYes={handleClickYes}
                stylesCustomTitle={{
                  paddingTop: 0,
                }}
                singleButtonConfirmation={false}
                textSingleButton={''}
              />
            )}

            {modalSucces && (
              <ModalConfirm
                icon={successGif}
                widthImage={350}
                heightImage={320}
                modalContentStyle={{ width: 350 }}
                buttonConfirmation={false}
                modalBodyStyle={{
                  borderTopLeftRadius: '60%',
                  borderTopRightRadius: '60%',
                  borderBottomLeftRadius: '60%',
                  borderBottomRightRadius: '60%',
                  marginTop: '-100px',
                  height: '120px',
                  buttonConfirmation: true,
                }}
                title={'Berhasil Menambahkan Produk ke Master SKU!'}
                stylesCustomTitle={{
                  paddingTop: 0,
                }}
                singleButtonConfirmation={false}
                textSingleButton={''}
              />
            )}
          </div>
        </div>
      </Content>
    </>
  );
}

export default TambahMasterSingleSKU;
