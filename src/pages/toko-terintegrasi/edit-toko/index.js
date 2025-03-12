/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Icon,
} from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import ModalError from '@/components/atoms/modal/modal-confirm/index';
import {
  getStoreId,
  getLocation,
  postStoreId,
} from '@/services/storeIntegration/index';
import gifSuccess from '@/assets/gift/Highfive.gif';
import { editStore } from '@/services/storeIntegration/index';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import TooltipComponent from '@/components/template/tooltip';

const FormValidationComponent = ({ alter }) => {
  const [sm] = useState(false);
  const [location, setLocations] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSucces, setIsSuccess] = useState(false);
  const [isSuccesSync, setIsSuccessSync] = useState(false);
  const [storeData, setDataStore] = useState({
    store_name_op: '',
    store_url: '',
    access_token: '',
    store_api_password: '',
    store_api_secret: '',
    location: '',
    description: '',
    order_api: false,
    product_api: false,
    stock_api: false,
    order_split: false,
  });
  const [syncStoreLoading, setSyncStoreLoading] = useState(false);
  const [isStoreNameOpChanged, setIsStoreNameOpChanged] = useState(false);
  const [originalStoreName, setOriginalStoreName] = useState('');

  const [isDescriptionOpChanged, setIsDescriptionOpChanged] = useState(false);
  const [originalDescription, setOriginalDescription] = useState('');

  const [isOrderApiChanged, setIsOrderApiChanged] = useState(false);
  const [isProductApiChanged, setIsProductApiChanged] = useState(false);
  const [isStockApiChanged, setIsStockApiChanged] = useState(false);
  const [isSplitApiChanged, setIsSplitApiChanged] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLocationChanged, setIsLocationChanged] = useState([]);
  const [initialLocation, setInitialLocation] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const idSearch = searchParams.get('id');
  const [passState, setPassState] = useState(false);
  const [passStateApi, setPassStateApi] = useState(false);

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
    formState: { errors, isValid  },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      store_name: storeData ? storeData.store_name_op : '',
      order_api: storeData ? storeData.order_api : '',
      stock_api: storeData ? storeData.stock_api : '',
      product_api: storeData ? storeData.product_api : '',
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

        if (selectedLocation) {
          setSelectedSearchOption(selectedLocation);
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
        order_split: storeData.order_split,
        other_channel_id: null,
      };

      if (storeData.channel_id != 3) {
        delete payload.order_split;
      }

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

  const syncStoreSubmit = async () => {
    try {
      setSyncStoreLoading(true);

      if (!idSearch) {
        console.error('idSearch is not available');
        return;
      }

      const response = await postStoreId(idSearch);

      if (response.status === 200) {
        setIsSuccessSync(true);
        setTimeout(() => {
          setIsSuccessSync(false);
          getStorebyId();
        }, 2000);
      }
    } catch (error) {
    } finally {
      setSyncStoreLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState({
    store_name: '',
    store_url: '',
    access_token: '',
    store_api_password: '',
    store_api_secret: '',
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

  const toggleIsOrderApiChanged = () => {
    setIsOrderApiChanged((prevValue) => !prevValue);
  };

  const handleOrderApiChange = (e) => {
    const isChecked = e.target.checked;
    setDataStore((prevData) => ({
      ...prevData,
      order_api: isChecked,
    }));
    toggleIsOrderApiChanged();
  };

  const toggleIsProductApiChanged = () => {
    setIsProductApiChanged((prevValue) => !prevValue);
  };

  const handleProductApiChange = (e) => {
    const isChecked = e.target.checked;
    setDataStore((prevData) => ({
      ...prevData,
      product_api: isChecked,
    }));
    toggleIsProductApiChanged();
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

  const handleSplitApiChange = (e) => {
    const isChecked = e.target.checked;
    setDataStore((prevData) => ({
      ...prevData,
      order_split: isChecked,
    }));
    setIsSplitApiChanged((prev) => !prev);
  };

  const handleClickRiwayatStore = (id) => {
    router.push({
      pathname: '/toko-terintegrasi/riwayat-toko',
      query: { id },
    });
  };

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

  // style table
  const tableClass = classNames({
    table: true,
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
                      className={'btn w-100 center shadow-none btn-primary'}
                      type={loading ? 'button' : 'submit'}
                      disabled={
                        syncStoreLoading ||
                        storeData?.status_name !== 'Connected'
                      }
                      onClick={() => syncStoreSubmit()}
                    >
                      <Icon name="reload" style={{ marginRight: '10px' }} />
                      {syncStoreLoading ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        'Sinkron Toko'
                      )}
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="lg"
                      className={'btn w-100 center shadow-none btn-danger'}
                      // type={loading ? "button" : "submit"}
                    >
                      {/* {loading ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        "Putuskan Hubungan"
                      )} */}
                      Putuskan Hubungan
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
                <Col md="6">
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
                      htmlFor="store_name"
                      style={{ fontWeight: 'bold' }}
                    >
                      Nama Toko Channel
                    </Label>
                    <div className="form-control-wrap">
                      <Input
                        disabled
                        type="text"
                        className="shadow-none field-input-border-primary"
                        id="store_name"
                        placeholder="Masukkan API Secret Key"
                        value={storeData ? storeData.store_name_channel : ''}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="store_url"
                      style={{ fontWeight: 'bold' }}
                    >
                      URL
                    </Label>
                    <div
                      className="form-control-wrap"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Input
                        disabled
                        type="text"
                        className="shadow-none field-input-border-primary flex-1"
                        id="store_url"
                        placeholder="Masukkan URL"
                        defaultValue={storeData ? storeData.store_url : ''}
                      />
                      <span style={{ marginLeft: '5px' }}>.myshopify.com</span>
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="access_token"
                      style={{ fontWeight: 'bold' }}
                    >
                      Access Token<span style={{ color: 'red' }}>*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <a
                        href="#access_token"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPassState(!passState);
                        }}
                        className={`form-icon form-icon-right passcode-switch ${
                          passState ? 'is-hidden' : 'is-shown'
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>
                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>
                      <Input
                        disabled
                        type={passState ? 'text' : 'password'}
                        id="access_token"
                        defaultValue={storeData ? storeData.access_token : ''}
                        placeholder="Masukkan Access Token"
                        className={`shadow-none field-input-border-primary ${
                          passState ? 'is-hidden' : 'is-shown'
                        }`}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="store_api_password"
                      style={{ fontWeight: 'bold' }}
                    >
                      API Key Aplikasi Custom App
                      <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <Input
                        disabled
                        type="text"
                        className="shadow-none field-input-border-primary"
                        id="store_api_password"
                        placeholder="Masukkan API Key"
                        defaultValue={
                          storeData ? storeData.store_api_password : ''
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="store_api_secret"
                      style={{ fontWeight: 'bold' }}
                    >
                      API Secret Key Aplikasi Custom App
                      <span style={{ color: 'red' }}>*</span>
                    </Label>
                    <div className="form-control-wrap">
                      <a
                        href="#store_api_secret"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPassStateApi(!passStateApi);
                        }}
                        className={`form-icon form-icon-right passcode-switch ${
                          passStateApi ? 'is-hidden' : 'is-shown'
                        }`}
                      >
                        <Icon
                          name="eye"
                          className="passcode-icon icon-show"
                        ></Icon>
                        <Icon
                          name="eye-off"
                          className="passcode-icon icon-hide"
                        ></Icon>
                      </a>
                      <Input
                        disabled
                        type={passStateApi ? 'text' : 'password'}
                        id="store_api_secret"
                        defaultValue={
                          storeData ? storeData.store_api_secret : ''
                        }
                        placeholder="Masukkan API Secret key"
                        className={`shadow-none field-input-border-primary ${
                          passStateApi ? 'is-hidden' : 'is-shown'
                        }`}
                      />
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <div className="form-group">
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ fontWeight: 'bold' }}
                    >
                      Lokasi<span style={{ color: 'red' }}>*</span>
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
                <Col md="12">
                  <BlockHeadContent>
                    <Label
                      className="form-label"
                      htmlFor="fv-topics"
                      style={{ fontWeight: 'bold' }}
                    >
                      List Lokasi Toko
                    </Label>
                    <table
                      className={`table-activity-history-wrap ${tableClass}`}
                    >
                      <thead className="table-primary">
                        <tr>
                          <th>Nama Lokasi</th>
                          <th>Detail Lokasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storeData.store_location &&
                          storeData.store_location.map((location, idx) => {
                            return (
                              <tr key={idx}>
                                <td className="table-activity-history-body-text">
                                  {location.store_location_name}
                                </td>
                                <td className="table-activity-history-body-text">
                                  {location.full_address}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </BlockHeadContent>
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
                    <Col md="11">
                      <div className="form-group">
                        <div style={{ color: '#4C4f54' }}>
                          Integrasi Pesanan
                        </div>
                      </div>
                    </Col>
                    <Col md="1" style={{ textAlign: 'right' }}>
                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="order_api_switch"
                            checked={storeData.order_api}
                            onChange={handleOrderApiChange}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="order_api_switch"
                          ></label>
                        </div>
                      </div>
                    </Col>
                    {/* End intgerasi pesanan */}

                    {/* Product Validation */}
                    <Col md="11">
                      <div className="form-group">
                        <div style={{ color: '#4C4f54' }}>
                          Product Validation
                        </div>
                      </div>
                    </Col>
                    <Col md="1" style={{ textAlign: 'right' }}>
                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="product_api_switch"
                            checked={storeData.product_api}
                            onChange={handleProductApiChange}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="product_api_switch"
                          ></label>
                        </div>
                      </div>
                    </Col>
                    {/* End Product Validation */}

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

                    {/* Split Paket */}
                    <Col
                      hidden={
                        !(storeData.channel_id == 3 && storeData.connected)
                      }
                      md="11"
                    >
                      <div
                        style={{ gap: 6 }}
                        className="form-group d-flex align-items-center"
                      >
                        <div style={{ color: '#4C4f54' }}>Split Paket</div>
                        <TooltipComponent
                          icon="help-fill"
                          iconClass="card-hint"
                          direction="right"
                          id="tooltip-split-paket"
                          text="Item dengan dimensi dan berat besar secara otomatis akan dipisah pengelolaannya per kuantitas sesuai ketentuan Lazada"
                          style={{
                            width: '27rem',
                            borderRadius: 8,
                            textAlign: 'start',
                            fontSize: 14,
                          }}
                        />
                      </div>
                    </Col>
                    <Col
                      hidden={
                        !(storeData.channel_id == 3 && storeData.connected)
                      }
                      md="1"
                      style={{ textAlign: 'right' }}
                    >
                      <div className="form-group">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="split_api_switch"
                            checked={storeData.order_split}
                            onChange={handleSplitApiChange}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="split_api_switch"
                          ></label>
                        </div>
                      </div>
                    </Col>
                    {/* End Split Paket */}

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
                        <span
                          style={{ fontWeight: 'bolder', color: '#4C4F54' }}
                        >
                          Terakhir Sinkronisasi{' '}
                          <span
                            style={{ fontWeight: 'normal', color: '#4C4f54' }}
                          >
                            {moment(storeData.last_sync_store).format(
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
                                  isSplitApiChanged
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
                                    !isSplitApiChanged)
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
