/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// React
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// layout
import Content from '@/layout/content/Content';
import { MultiSelect } from 'primereact/multiselect';

import {
  Head,
  BlockHeadContent,
  BlockTitle,
  Button,
  DropdownOption,
  Icon,
  PaginationComponent,
  ModalConfirm,
} from '@/components';
import classNames from 'classnames';
import { channelLogo } from '@/utils/channelLogo';

//api
import { getStore, CreateSyncOrderStore } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { bulkActionOptions } from '@/utils/index';

import { Col, Form, FormGroup, Input, Row, Spinner } from 'reactstrap';
import moment from 'moment';

// img
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import Nodata from '@/assets/images/illustration/no-data.svg';
import Shopify from '@/assets/images/marketplace/shopify.png';
import gifSuccess from '@/assets/gift/Highfive.gif';
import emptyAddBundling from '@/assets/images/empty/sync-notfound.svg';
import { UseDelay } from '@/utils/formater';

const syncStore = ({ alter }) => {
  const { client_id } = useSelector((state) => state.auth.user);
  const [listItem, setListItem] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedCheckboxesId, setSelectedCheckboxesId] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
  const [pageInfo, setPageInfo] = useState({ total_record: 8 });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { setValue, handleSubmit } = useForm({});
  const [hasSelectedCheckboxes, setHasSelectedCheckboxes] = useState(false);
  const [selectedCheckboxesIds, setSelectedCheckboxesIds] = useState([]);
  const [isSucces, setIsSuccess] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('store_name_op');

  useEffect(() => {
    const ids = selectedCheckboxes.map((option) => option.id);
    setSelectedCheckboxesIds(ids);
  }, [selectedCheckboxes]);

  useEffect(() => {
    setHasSelectedCheckboxes(selectedCheckboxes.length > 0);
  }, [selectedCheckboxes]);

  const getImageSrc = (channelName) => {
    const formattedName = channelName.toLowerCase().replace(/\s+/g, '');
    switch (formattedName) {
      case 'shopify':
        return Shopify;
      default:
        return Shopify;
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      updatePayload();
    }
  };

  const handleMultiSelectChange = (e) => {
    const selectedValues = e.value;
    setSelectedChannels(selectedValues);
    fetchGetStore({
      channels: selectedValues,
    });
  };

  const updatePayload = () => {
    fetchGetStore({
      searchParams: {
        store_name_op: selectedSearchOption === 'store_name_op' ? search : null,
        store_name_channel:
          selectedSearchOption === 'store_name_channel' ? search : null,
      },
    });
  };

  // GetList
  const fetchGetStore = async (param) => {
    const { searchParams } = param || { searchParams: {} };
    try {
      const res = await getStore({
        client_id: client_id,
        channel: [6],
        location: [],
        status: [5],
        order_api: true,
        search: searchParams || {
          store_name_op: null,
          store_name_channel: null,
        },
        page: paginationModel.page,
        size: paginationModel.size,
      });
      const newArray = res?.data?.store_list?.map((item) => {
        return { ...item, id: String(item.id) };
      });
      setPageInfo(res?.data?.page_info);
      setListItem(newArray);
    } catch (error) {
      console.log(error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setSelectedPageSize(newSize);
    setPaginationModel((prev) => ({ ...prev, size: newSize, page: 1 }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    paginate(pageNumber);
    setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
  };

  const handleCheckboxChange = (value) => {
    if (selectedCheckboxes.includes(value)) {
      return (
        setSelectedCheckboxes(
          selectedCheckboxes.filter((item) => item !== value),
        ),
        setSelectedCheckboxesId(
          selectedCheckboxesId.filter((item) => item !== value?.id),
        ),
        setValue(value?.id, '')
      );
    }
    return (
      setSelectedCheckboxesId([...selectedCheckboxesId, value?.id]),
      setSelectedCheckboxes([...selectedCheckboxes, value]),
      setValue(value?.id, '')
    );
  };

  const handleRemoveFromList = (id) => {
    const removeValue = selectedCheckboxes.filter((item) => item?.id !== id);
    const removeValueId = selectedCheckboxesId.filter((item) => item !== id);
    setValue(id, '');
    setSelectedCheckboxes(removeValue);
    setSelectedCheckboxesId(removeValueId);
  };

  const onFormSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        store: selectedCheckboxesIds,
      };
      const response = await CreateSyncOrderStore(payload);
      if (response.status === 200) {
        setIsSuccess(true);
        await UseDelay(2000);
        router.back();
      }
    } catch (error) {
      console.error('Error in response:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onBackClick = () => {
    router.back();
  };

  const truncateVariantName = (name) => {
    return name.length > 25 ? `${name.substring(0, 25)}...` : name;
  };

  useEffect(() => {
    fetchGetStore();
  }, [currentPage, paginationModel.page, paginationModel.size]);

  useEffect(() => {
    if (listItem?.length > 0 && search.length == 0) {
      updatePayload();
    }
  }, [search]);

  const formClass = classNames({
    'form-validate': true,
    'is-alter': alter,
  });

  const disabled = selectedCheckboxes?.length === 10;

  return (
    <>
      <Head title="Sync Pesanan" />
      <Content>
        <div className="wrapper-bg-light">
          <p className="text-primary" style={{ fontSize: 12 }}>
            PESANAN&nbsp; / &nbsp;
            <span style={{ color: '#BDC0C7', fontSize: 12 }}>
              Sinkron Pesanan
            </span>
          </p>
          <BlockTitle style={{ fontSize: 32 }}>Sinkron Pesanan</BlockTitle>
          <p style={{ color: '#4C4F54', fontSize: 12 }}>
            Pilih toko yang ingin kamu sinkronisasikan pesanannya. Maksimum 10
            Toko bisa dipilih untuk 1 kali sinkronisasi
          </p>
          <Form
            className={formClass}
            onSubmit={handleSubmit(onFormSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            <div className="mt-5 mb-5">
              <BlockHeadContent>
                <div className="toggle-wrap nk-block-tools-toggle mt-4">
                  <ul className="nk-block-tools">
                    <li style={{ marginRight: '18px' }}>
                      <div className="form-wrap">
                        <MultiSelect
                          value={selectedChannels}
                          onChange={handleMultiSelectChange}
                          options={[{ value: 6, label: 'Shopify' }]}
                          optionLabel="label"
                          placeholder="Filter Channel"
                          style={{
                            height: '43px',
                            width: '365px',
                            padding: '10px',
                          }}
                          maxSelectedLabels={3}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="d-flex">
                        <div className="form-wrap">
                          <DropdownOption
                            className="filter-dropdown"
                            placeholder={'Pilih'}
                            optionLabel={'label'}
                            value={selectedSearchOption}
                            options={bulkActionOptions}
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
                    </li>
                  </ul>
                </div>
              </BlockHeadContent>
            </div>
            <Row xs="2" className="mt-5">
              <Col xs="12" lg="6">
                <div
                  style={{
                    border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                    height: 500,
                    overflowY: 'auto',
                  }}
                >
                  {listItem.length > 0 ? (
                    listItem.map((option, idx) => (
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
                              width: '50%%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div
                              style={{
                                marginLeft: 14,
                                width: 200,
                                fontSize: '12px',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Image
                                  src={channelLogo(option?.channel_name)}
                                  width={13}
                                  height={13}
                                  alt="Marketplace-logo"
                                />
                                <span
                                  style={{ marginLeft: 4 }}
                                  className="text-truncate"
                                >
                                  {option?.store_name_op}
                                </span>
                              </div>
                              <p className="text-header-bold text-truncate">
                                {option?.store_name_channel}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              alignSelf: 'center',
                              marginLeft: 0,
                              width: 100,
                            }}
                          >
                            <div>
                              <span className="tb-product text-truncate">
                                <span
                                  className="title"
                                  style={{
                                    fontWeight: 'bold',
                                    color: '#BDC0C7',
                                    fontSize: '12px',
                                  }}
                                >
                                  Terakhir Sinkronisasi
                                </span>
                              </span>
                            </div>
                            <div>
                              <span
                                className="title text-nowrap"
                                style={{ color: '#BDC0C7', fontSize: '12px' }}
                              >
                                {option?.last_sync_order
                                  ? moment(option?.last_sync_order).format(
                                      'DD/MM/YYYY HH:mm',
                                    )
                                  : moment(option?.updated_at).format(
                                      'DD/MM/YYYY HH:mm',
                                    )}
                              </span>
                            </div>
                          </div>
                          <div style={{ alignSelf: 'center' }}>
                            <FormGroup
                              style={{ margin: 0, marginLeft: '25px' }}
                              check
                              inline
                            >
                              <Input
                                type="checkbox"
                                value={selectedCheckboxesId.includes(
                                  option?.id,
                                )}
                                checked={selectedCheckboxesId.includes(
                                  option?.id,
                                )}
                                onChange={() => handleCheckboxChange(option)}
                                disabled={
                                  !selectedCheckboxesId.includes(option?.id) &&
                                  disabled
                                }
                              />
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
                <div className={'dataTables_wrapper mt-4'}>
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start">
                      {listItem.length > 0 && (
                        <PaginationComponent
                          itemPerPage={selectedPageSize}
                          totalItems={pageInfo?.total_record}
                          paginate={handlePageChange}
                          currentPage={currentPage}
                        />
                      )}
                    </div>
                    <div className="text-center">
                      {listItem.length > 0 ? (
                        <div className="datatable-filter text-end">
                          <div className="dataTables_length text-center">
                            <label>
                              <span className="d-none d-sm-inline-block">
                                Data Per Halaman
                              </span>
                              <div className="form-control-select">
                                <select
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
                      ) : null}
                    </div>
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
                  {selectedCheckboxes.length > 0 ? (
                    selectedCheckboxes.map((option, idx) => (
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
                              width: '50%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div
                              style={{
                                marginLeft: 14,
                                width: 200,
                                fontSize: '12px',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Image
                                  src={getImageSrc(option?.channel_name)}
                                  width={13}
                                  height={13}
                                  alt="Marketplace-logo"
                                />
                                <span>&nbsp;&nbsp;{option?.store_name_op}</span>
                              </div>
                              <p className="text-header-bold">
                                {truncateVariantName(
                                  option?.store_name_channel,
                                )}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              alignSelf: 'center',
                              marginRight: 14,
                              width: 100,
                            }}
                          >
                            <div>
                              <span className="tb-product text-truncate">
                                <span
                                  className="title"
                                  style={{
                                    fontWeight: 'bold',
                                    color: '#BDC0C7',
                                    fontSize: '12px',
                                  }}
                                >
                                  Terakhir Sinkronisasi
                                </span>
                              </span>
                            </div>
                            <div>
                              <span
                                className="title text-nowrap"
                                style={{ color: '#BDC0C7', fontSize: '12px' }}
                              >
                                {option?.last_sync_order
                                  ? moment(option?.last_sync_order).format(
                                      'DD/MM/YYYY HH:mm',
                                    )
                                  : moment(option?.updated_at).format(
                                      'DD/MM/YYYY HH:mm',
                                    )}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              alignSelf: 'center',
                              width: '5%',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              onClick={() => handleRemoveFromList(option?.id)}
                            >
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
                          width={90}
                          height={80}
                          src={emptyAddBundling}
                          style={{ alignSelf: 'center' }}
                          alt="Image Product"
                        />
                        <p style={{ color: '#4C4F54', fontSize: 13 }}>
                          Kamu belum memilih Toko apa pun
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
                    <p style={{ fontSize: 12 }}>
                      Terpilih : {selectedCheckboxes?.length}
                    </p>
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
                justifyContent: 'end',
              }}
            >
              <div className="d-flex">
                <Button
                  onClick={onBackClick}
                  type="button"
                  className={'bg-white text-primary justify-center'}
                  style={{
                    height: 43,
                    width: 'auto',
                    fontSize: 14,
                    textAlign: 'center',
                    border: 'none',
                    marginRight: 35,
                  }}
                >
                  Batal
                </Button>
                <Button
                  className={`btn-primary justify-center ${
                    !hasSelectedCheckboxes ? 'btn-disabled' : 'btn-primary'
                  }`}
                  color="primary"
                  type={loading ? 'button' : 'submit'}
                  disabled={!hasSelectedCheckboxes}
                  style={{ height: 43, width: 180, fontSize: 14 }}
                >
                  {loading ? (
                    <Spinner size="sm" color="light" />
                  ) : (
                    'Sinkron Pesanan'
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Content>
      {isSucces && (
        <ModalConfirm
          icon={gifSuccess}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
          }}
          title={'Berhasil Sinkronisasi Pesanan!'}
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
export default syncStore;
