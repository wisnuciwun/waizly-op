/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Content from '@/layout/content/Content';
import Link from 'next/link';
import {
  Row,
  Col,
  Label,
  Form,
  Spinner,
  Input,
  FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import classNames from 'classnames';
import {
  Block,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Button,
  DropdownOption,
} from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import ModalError from '@/components/atoms/modal/modal-confirm/index';
import {
  getStoreId,
  getLocation,
} from '@/services/storeIntegration/index';
import gifSuccess from '@/assets/gift/Highfive.gif';
import {
  editStore,
  getChannelPenjualan,
} from '@/services/storeIntegration/index';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/navigation';

const FormValidationComponent = ({ alter }) => {
  const [sm] = useState(false);
  const [location, setLocations] = useState([]);
  const [channelsList, setChannelsList] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedSearchOption, setSelectedSearchOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSucces, setIsSuccess] = useState(false);
  const [isSuccesSync, setIsSuccessSync] = useState(false);
  const [storeData, setDataStore] = useState({
    store_name_op: '',
    location: '',
    description: '',
    stock_api: false,
  });
  const [isStoreNameOpChanged, setIsStoreNameOpChanged] = useState(false);
  const [originalStoreName, setOriginalStoreName] = useState('');

  const [isDescriptionOpChanged, setIsDescriptionOpChanged] = useState(false);
  const [originalDescription, setOriginalDescription] = useState('');

  const [isOrderApiChanged, setIsOrderApiChanged] = useState(false);
  const [isProductApiChanged, setIsProductApiChanged] = useState(false);
  const [isStockApiChanged, setIsStockApiChanged] = useState(false);

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLocationChanged, setIsLocationChanged] = useState([]);
  const [isOtherChanneChanged, setIsOtherChanneChanged] = useState(false);
  const [initialLocation, setInitialLocation] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const idSearch = searchParams.get('id');

  // redux
  const { client_id } = useSelector((state) => state.auth.user);
  const clientId = client_id;

  const schema = yup.object().shape({
    store_name: yup
      .string()
      .trim()
      .required('Harap mengisi Nama Toko di Bebas Kirim'),
    order_api: yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      store_name: storeData ? storeData.store_name_op : '',
      stock_api: storeData ? storeData.stock_api : '',
      description: storeData ? storeData.description : '',
    },
  });
  const validateStoreName = async () => {
    await trigger('store_name');
  };

  const fetchLocationData = async () => {
    const payload = {
      client_id: clientId,
      status: 'ACTIVE',
      page: 1,
      size: 100,
    };

    try {
      const response = await getLocation(payload);

      if (response.status === 200) {
        const location = response.data.location_list;

        setLocations(location);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const getStorebyId = async () => {
    try {
      if (!idSearch) {
        console.error('idSearch is not available');
        return;
      }

      const response = await getStoreId(idSearch);

      if (response.status === 200) {
        const storeData = response.data;
        setDataStore(storeData);
        setValue('store_name', storeData?.store_name_op);
        setValue('description', storeData?.description);

        const selectedLocation = location.find(
          (loc) => loc.id === storeData.location_id,
        );
        const selectedOtherChannel = channelsList.find(
          (channel) => channel.channel_id === storeData.other_channel_id,
        );
        if (selectedLocation || selectedOtherChannel) {
          setSelectedSearchOption(selectedLocation);
          setSelectedChannel(selectedOtherChannel);
        } else {
          console.warn('Selected location not found for storeData:', storeData);
        }
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
      return [];
    }
  };

  const onFormSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        store_id: idSearch,
        store_name: data.store_name,
        description: data.description,
        location_id: selectedSearchOption.id,
        order_api: storeData.order_api,
        stock_api: storeData.stock_api,
        product_api: storeData.product_api,
        other_channel_id: selectedChannel.channel_id,
      };

      const response = await editStore(payload);

      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          router.push('/toko-terintegrasi');
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      const status = error.response.status;
      const errorMessage = error.response.data.error?.type;
      if (status === 400) {
        switch (errorMessage) {
          case 'STORE_NAME_ALREADY_USED':
            setError('store_name', {
              type: 'manual',
              message: 'Nama toko sudah pernah dipakai',
            });
            break;
        }
      }
    }
  };

  const [formData, setFormData] = useState({
    store_name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue('store_name', newValue);
    validateStoreName();
    setFormData((prevData) => ({
      ...prevData,
      store_name: newValue,
    }));

    // Check if the input value matches the original store name
    if (newValue === originalStoreName) {
      setIsStoreNameOpChanged(false);
    } else {
      setIsStoreNameOpChanged(true);
    }
  };

  const handleInputChangeTeks = (e) => {
    const newValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      description: newValue,
    }));

    // Check if the input value matches the original store name
    if (newValue === originalDescription) {
      setIsDescriptionOpChanged(false);
    } else {
      setIsDescriptionOpChanged(true);
    }
  };

  const toggleIsStockApiChanged = () => {
    setIsStockApiChanged((prevValue) => !prevValue);
  };

  const handleStockApiChange = (e) => {
    const isChecked = e.target.checked;
    setDataStore((prevData) => ({
      ...prevData,
      stock_api: isChecked,
    }));
    toggleIsStockApiChanged();
  };

  const handleClickRiwayatStore = (id) => {
    router.push({
      pathname: '/toko-terintegrasi/riwayat-toko-lainnya',
      query: { id },
    });
  };

  const fetchListChannelPenjualan = async () => {
    try {
      const response = await getChannelPenjualan();
      setChannelsList(response?.data?.channel);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchListChannelPenjualan();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (idSearch) {
        await fetchLocationData();
        await getStorebyId();
      }
    };
    fetchData();
  }, [idSearch]);

  useEffect(() => {
    if (location.length > 0 && selectedLocationId && !initialLocation) {
      setInitialLocation(selectedSearchOption);
    }
  }, [location, selectedLocationId, initialLocation, selectedSearchOption]);

  useEffect(() => {
    if (location.length > 0) {
      getStorebyId();
    }
  }, [location]);

  useEffect(() => {
    setOriginalStoreName(storeData.store_name_op);
  }, [storeData]);

  useEffect(() => {
    setOriginalDescription(storeData.description);
  }, [storeData]);

  useEffect(() => {
    if (location.length > 0 && selectedLocationId) {
      getStorebyId();
      setInitialLocation(selectedSearchOption);
    }
  }, [location, selectedLocationId]);

  useEffect(() => {
    if (storeData && selectedSearchOption) {
      const isLocationSame = storeData.location_id === selectedSearchOption.id;
      setIsLocationChanged(!isLocationSame);
    }
  }, [storeData, selectedSearchOption]);

  const formClass = classNames({
    'form-validate': true,
    'is-alter': alter,
  });

  return (
    <>
      <Content>
        <Block>
          <PreviewCard>
            <BlockBetween>
              <BlockHeadContent>
                <ul className="nk-block-tools g-3">
                  <li>
                    <p style={{ color: '#203864' }}>
                      TOKO TERINTEGRASI /
                      <span style={{ color: '#BDC0C7' }}> Detail Toko</span>
                    </p>
                  </li>
                </ul>
              </BlockHeadContent>
              <BlockHeadContent>
                <ul className="nk-block-tools g-3">
                  <li>
                    <Button
                      size="lg"
                      className={'btn w-100 center shadow-none btn-danger'}
                    >
                      Hapus Toko
                    </Button>
                  </li>
                </ul>
              </BlockHeadContent>
            </BlockBetween>
            <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-gs">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle>Detail Toko</BlockTitle>
                  </BlockHeadContent>
                </BlockBetween>
                <Col md="12">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="store_name"
                      style={{ fontWeight: 'bold' }}
                    >
                      Nama Toko di Bebas Kirim
                      <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <Controller
                      name="store_name"
                      control={control}
                      render={({ field }) => {
                        const { onChange, value } = field;

                        return (
                          <>
                            <div className="form-control-wrap">
                              <Input
                                invalid={!!errors.store_name}
                                onChange={(e) => {
                                  handleInputChange(e);
                                  onChange(e);
                                }}
                                onKeyPress={(e) => {
                                  if (
                                    e.key === 'Enter' &&
                                    !isStoreNameOpChanged
                                  ) {
                                    e.preventDefault(); // Prevent default form submission on Enter key when no changes
                                  }
                                }}
                                value={value}
                                type="text"
                                className="shadow-none field-input-border-primary"
                                id="store_name"
                                placeholder="Masukkan Nama Toko di Bebas Kirim"
                                maxLength={50}
                              />
                              <FormFeedback>
                                <span
                                  className="text-danger position-absolute"
                                  style={{ fontSize: 12 }}
                                >
                                  {errors.store_name?.message}
                                </span>
                              </FormFeedback>
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ fontWeight: 'bold' }}
                    >
                      Gudang<span style={{ color: 'red' }}>*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <DropdownOption
                        style={{ width: '100%' }}
                        options={location}
                        optionLabel={'name'}
                        placeholder={'Pilih'}
                        value={selectedSearchOption}
                        {...register('selectedSearchOption')}
                        onChange={(e) => {
                          setSelectedSearchOption(e.target.value);
                          setIsLocationChanged(true);
                        }}
                      />
                    </div>
                  </div>
                </Col>

                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ fontWeight: 'bold' }}
                    >
                      Channel Penjualan<span style={{ color: 'red' }}>*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <DropdownOption
                        style={{ width: '100%' }}
                        options={channelsList}
                        optionLabel={'channel_name'}
                        placeholder={'Pilih'}
                        value={selectedChannel}
                        {...register('selectedChannelOption')}
                        onChange={(e) => {
                          setSelectedChannel(e.target.value);
                          setIsOtherChanneChanged(true);
                        }}
                      />
                    </div>
                  </div>
                </Col>

                <Col md="12">
                  <BlockHeadContent>
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ fontWeight: 'bold' }}
                    >
                      Deskripsi Toko
                    </Label>
                    <div className="form-control-wrap">
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => {
                          const { onChange, value } = field;

                          return (
                            <>
                              <div className="form-control-wrap">
                                <Input
                                  invalid={!!errors.description}
                                  onChange={(e) => {
                                    handleInputChangeTeks(e);
                                    onChange(e);
                                  }}
                                  onBlur={(e) => {
                                    handleInputChangeTeks(e);
                                  }}
                                  value={value}
                                  type="textarea"
                                  className="shadow-none field-input-border-primary"
                                  id="description"
                                  placeholder="Masukkan Deskripsi Toko"
                                  maxLength={255}
                                />
                              </div>
                            </>
                          );
                        }}
                      />
                    </div>
                  </BlockHeadContent>
                </Col>
                <Col md="12" style={{ marginBottom: '30px' }}>
                  <Row className="g-1">
                    {/* Integrasi pesanan */}
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ marginBottom: '5px', fontWeight: 'bold' }}
                    >
                      Config
                    </Label>
                    {/* Stock Validation */}
                    <Col md="11">
                      <div className="form-group">
                        <div style={{ color: '#4C4f54' }}>Stock Validation</div>
                      </div>
                    </Col>
                    <Col md="1" style={{ textAlign: 'right' }}>
                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="stock_api_switch"
                            checked={storeData.stock_api}
                            onChange={handleStockApiChange}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="stock_api_switch"
                          ></label>
                        </div>
                      </div>
                    </Col>
                    {/* End Stock Validation */}
                    <Col md="12">
                      <Button
                        type="button"
                        onClick={() =>
                          handleClickRiwayatStore(storeData?.store_id)
                        }
                        className="p-0 mt-5 text-decoration-underline text-primary"
                        style={{ fontWeight: 400 }}
                      >
                        Lihat Riwayat Toko
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col md="12">
                  <BlockBetween>
                    <BlockHeadContent>
                      <div>
                        <span
                          style={{
                            marginRight: '10px',
                            fontWeight: 'bolder',
                            color: '#4C4F54',
                          }}
                        >
                          Waktu Dibuat{' '}
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4f54' }}
                          >
                            {moment(storeData.created_at).format(
                              'DD-MM-YYYY HH:mm',
                            )}
                          </span>
                        </span>
                        <span
                          style={{
                            marginRight: '10px',
                            fontWeight: 'bolder',
                            color: '#4C4F54',
                          }}
                        >
                          Terakhir Diperbarui{' '}
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4f54' }}
                          >
                            {moment(storeData.updated_at).format(
                              'DD-MM-YYYY HH:mm',
                            )}
                          </span>
                        </span>
                      </div>
                    </BlockHeadContent>

                    <BlockHeadContent>
                      <div className="toggle-wrap nk-block-tools-toggle">
                        <div
                          className="toggle-expand-content"
                          style={{ display: sm ? 'block' : 'none' }}
                        >
                          <ul className="nk-block-tools g-3">
                            <li>
                              <div
                                className="toggle d-none d-md-inline-flex"
                                style={{ cursor: 'pointer' }}
                              >
                                <span
                                  style={{
                                    fontWeight: 'bolder',
                                    marginRight: '35px',
                                  }}
                                >
                                  <Link
                                    href="/toko-terintegrasi"
                                    className=" text-color-primary"
                                  >
                                    Kembali
                                  </Link>
                                </span>
                              </div>
                            </li>
                            <li>
                              <Button
                                size="lg"
                                className={`btn w-100 center shadow-none ${
                                  isStoreNameOpChanged ||
                                  isDescriptionOpChanged ||
                                  isLocationChanged ||
                                  isOrderApiChanged ||
                                  isProductApiChanged ||
                                  isStockApiChanged ||
                                  isOtherChanneChanged
                                    ? 'btn-primary'
                                    : 'btn-disabled'
                                }`}
                                type={loading ? 'button' : 'submit'}
                                disabled={
                                  loading ||
                                  (!isStoreNameOpChanged &&
                                    !isDescriptionOpChanged &&
                                    !isLocationChanged &&
                                    !isOrderApiChanged &&
                                    !isProductApiChanged &&
                                    !isStockApiChanged &&
                                    !isOtherChanneChanged)
                                }
                                onClick={() => {
                                  console.log(
                                    'isOrderApiChanged:',
                                    isOrderApiChanged,
                                  );
                                  console.log(
                                    'isProductApiChanged:',
                                    isProductApiChanged,
                                  );
                                  console.log(
                                    'isStockApiChanged:',
                                    isStockApiChanged,
                                  );
                                }}
                              >
                                {loading ? (
                                  <Spinner size="sm" color="light" />
                                ) : (
                                  'Simpan'
                                )}
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </BlockHeadContent>
                  </BlockBetween>
                </Col>
              </Row>
            </Form>
          </PreviewCard>
        </Block>
      </Content>
      {isSucces && (
        <ModalError
          icon={gifSuccess}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          buttonConfirmation={false}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '120px',
            buttonConfirmation: true,
          }}
          title={'Berhasil Memperbarui Toko!'}
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
export default FormValidationComponent;
