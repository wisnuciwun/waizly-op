/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Label,
  Form,
  Spinner,
  Input,
  FormFeedback,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import Content from '@/layout/content/Content';
import classNames from 'classnames';
import Link from 'next/link';
import {
  Block,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Button,
  DropdownOption,
  InputSelect,
  ModalConfirm,
  TabForm,
} from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import ModalConfirmPopup from '@/components/atoms/modal/modal-confirm/modalConfirm';
import ModalError from '@/components/atoms/modal/modal-confirm/modalAlertStore';
import {
  getChannel,
  getChannelPenjualan,
  getLocation,
  authStoreTokopedia,
  getStoreByName,
} from '@/services/storeIntegration/index';
import Image from 'next/image';
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Other from '@/assets/images/marketplace/offline.png';
import SocialCommerce from '@/assets/images/marketplace/social-commerce.png';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifErrorUrl from '@/assets/gift/Anxiety.gif';
import gifSuccess from '@/assets/gift/Highfive.gif';
import { createStore } from '@/services/storeIntegration/index';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { titleCase } from '@/utils/formater';
import { getLocationDropdown } from '@/services/order';
import { Skeleton } from 'primereact/skeleton';
import colors from '@/utils/colors';
import { setShopifyValue } from '@/redux/action/product';
import { getStoreLocation, postLocationMapping } from '@/services/locations';

const FormValidationComponent = ({ alter }) => {
  const params = useSearchParams();
  const [isChannel11Selected, setIsChannel11Selected] = useState(false);
  const [sm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedChannelName, setSelectedChannelName] = useState('');
  const [channels, setChannels] = useState([]);
  const [location, setLocations] = useState([]);
  const [warehouse, setWarehouse] = useState('');
  const [listWarehouse, setListWarehouse] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] = useState(location);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelsList, setChannelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { client_id, user_id } = useSelector((state) => state.auth.user);
  const { shopifyValue } = useSelector((state) => state.product);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isErrorUrl, setIsErrorUrl] = useState(false);
  const [isSucces, setIsSuccess] = useState(false);
  const [loadingChanel, setLoadingChannel] = useState(false);
  const [urlStore, setUrlStore] = useState('');
  const [nameStore, setNameStore] = useState('');
  const [modalErrorAlready, setModalErroAlready] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalErrorAlreadyTokopedia, setModalErroAlreadyTokopedia] =
    useState(false);
  const [methodAdd, setMethodAdd] = useState(1);
  // next route
  const router = useRouter();
  const dispatch = useDispatch();
  const [listMultiWarehouse, setMultiWarehouse] = useState([]);
  const [tableMultiWarehouse, settableMultiWarehouse] = useState(null);
  const [selectedMultipleWarehose, setselectedMultipleWarehose] = useState([]);
  const [storeId, setstoreId] = useState('');
  const [storeDataByName, setstoreDataByName] = useState(null);
  const tableClass = classNames({
    table: true,
  });
  const onlyTwoStep =
    selectedChannels.length != 0 &&
    (selectedChannels[0] == 6 ||
      selectedChannels[0] == 11 ||
      selectedChannels[0] == 14);

  const schema = yup.object().shape({
    ...(selectedChannels[0] == 1 ||
    selectedChannels[0] == 3 ||
    selectedChannels[0] == 4
      ? {
          store_name: yup
            .string()
            .trim()
            .required('Harap mengisi Nama Toko di Bebas Kirim'),
          // warehouse: yup.string().required('Harap mengisi Gudang'),
        }
      : selectedChannels[0] == 2 && !params.get('storeId')
        ? {
            // warehouse: yup.string().required("Harap mengisi Gudang"),
            store_name: yup
              .string()
              .trim()
              .required('Harap mengisi Nama Toko di Bebas Kirim'),
            store_url: yup.string().required('Harap mengisi URL'),
          }
        : selectedChannels[0] == 2 && params.get('storeId')
          ? {
              store_name: yup
                .string()
                .trim()
                .required('Harap mengisi Nama Toko di Bebas Kirim'),
              // warehouse: yup.string().required('Harap mengisi Gudang'),
              // store_url: yup.string().required("Harap mengisi URL"),
            }
          : selectedChannels[0] == 11
            ? {
                store_name: yup
                  .string()
                  .trim()
                  .required('Harap mengisi Nama Toko di Bebas Kirim'),
                selectedSearchOption: yup
                  .string()
                  .required('Harap mengisi Gudang'),
                selectedChannelOption: yup
                  .string()
                  .required('Harap mengisi Channel Penjualan'),
              }
            : methodAdd == 1
              ? {
                  // warehouse: yup.string().required("Harap mengisi Gudang"),
                  selectedSearchOption: yup
                    .string()
                    .required('Harap mengisi Gudang'),
                  store_url: yup.string().required('Harap mengisi URL'),
                }
              : isChannel11Selected
                ? {
                    store_name: yup
                      .string()
                      .trim()
                      .required('Harap mengisi Nama Toko di Bebas Kirim'),
                    selectedSearchOption: yup
                      .string()
                      .required('Harap mengisi Gudang'),
                    selectedChannelOption: yup
                      .string()
                      .required('Harap mengisi Channel Penjualan'),
                  }
                : {
                    store_name: yup
                      .string()
                      .trim()
                      .required('Harap mengisi Nama Toko di Bebas Kirim'),
                    selectedSearchOption: yup
                      .string()
                      .required('Harap mengisi Gudang'),
                    access_token: yup
                      .string()
                      .trim()
                      .required('Harap mengisi Access Token'),
                    store_api_password: yup
                      .string()
                      .trim()
                      .required('Harap mengisi API Key Aplikasi Custom App'),
                    store_api_secret: yup
                      .string()
                      .trim()
                      .required(
                        'Harap mengisi API Secret Key Aplikasi Custom App',
                      ),
                    store_url: yup.string().required('Harap mengisi URL'),
                  }),
  });

  const getImageSrc = (channelName = null, channelId = null) => {
    const formattedName =
      channelName && channelName.toLowerCase().replace(/\s+/g, '');

    if ((formattedName && formattedName == 'tokopedia') || channelId == 2) {
      return Tokopedia;
    } else if ((formattedName && formattedName == 'shopee') || channelId == 1) {
      return Shopee;
    } else if ((formattedName && formattedName == 'lazada') || channelId == 3) {
      return Lazada;
    } else if ((formattedName && formattedName == 'tiktok') || channelId == 4) {
      return Tiktok;
    } else if (
      (formattedName && formattedName == 'shopify') ||
      channelId == 6
    ) {
      return Shopify;
    } else if (
      (formattedName && formattedName == 'socialecommerce') ||
      channelId == 14
    ) {
      return SocialCommerce;
    } else {
      return Other;
    }
  };

  const listMethodAdd = [
    {
      label: 'Integrasi Shopify Plugin',
      value: '1',
    },
    {
      label: 'Tambah Toko Manual',
      value: '2',
    },
  ];

  const {
    getValues,
    register,
    handleSubmit,
    trigger,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });

  const validateApiSecret = async () => {
    await trigger('store_api_secret');
  };

  const validateApiKey = async () => {
    await trigger('store_api_password');
  };

  const validateToken = async () => {
    await trigger('access_token');
  };

  const validateUrl = async () => {
    await trigger('store_url');
  };

  const validateStoreName = async () => {
    await trigger('store_name');
  };

  const validateWarehouse = async () => {
    await trigger('warehouse');
  };

  const onFormSubmit = async (data) => {
    try {
      setLoading(true);
      // if (params.get('storeId')) {
      // const storeId = params.get('storeId');
      // const response = await authStoreTokopedia(
      //   storeId,
      //   parseInt(data.warehouse),
      //   user_id,
      // );
      // if (response.status === 201) {
      //   onFormNext();
      // } else {
      //   setModalErroAlreadyTokopedia(true);
      //   setTimeout(() => {
      //     setModalErroAlreadyTokopedia(false);
      //     router.push('/toko-terintegrasi');
      //   }, 3000);
      // }
      // } else {
      const payload = {
        store_name: data.store_name || null,
        store_url: data.store_url || null,
        channel_id: selectedChannels.length > 0 ? selectedChannels[0] : null,
        client_id: client_id || null,
        location_id:
          selectedChannels[0] < 5
            ? parseInt(data.warehouse)
            : selectedSearchOption.id || null,
        other_channel_id: isChannel11Selected
          ? selectedChannel.channel_id
          : null,
        store_channel_id: data.store_channel_id || null,
        store_api_password: data.store_api_password || null,
        store_api_secret: data.store_api_secret || null,
        access_token: data.access_token || null,
        ...(selectedChannels.includes(11) && {
          description: data.description || null,
        }),
        ...(selectedChannels.includes(14) && {
          description: data.description || null,
        }),
      };

      const response = await createStore(payload);

      if (response.status === 201 && !response.data.is_pop_up) {
        setIsSuccess(true);
        dispatch(setShopifyValue({}));
        setTimeout(() => {
          setIsSuccess(false);
          router.push('/toko-terintegrasi');
        }, 2000);
      } else if (
        (response.status === 201 || response.status === 200) &&
        response.data.is_pop_up
      ) {
        onShowPopUp(response.data.auth_url);
      }
      // }
    } catch (error) {
      setLoading(false);
      const status = error.response.status || 0;
      const errorMessage = error.response.data.error?.type || '';
      if (status === 400) {
        switch (errorMessage) {
          case 'STORE URL_ALREADY_USED_BY_THIS_CLIENT':
            setError('store_url', {
              type: 'manual',
              message: 'Toko sudah terhubung dengan akun pengguna',
            });
            break;
          case 'STORE URL_ALREADY_USED_BY_OTHER_CLIENT':
            setError('store_url', {
              type: 'manual',
              message: 'Toko sudah terhubung dengan akun pengguna lain',
            });
            break;
          case 'STORE_NAME_ALREADY_USED':
            setError('store_name', {
              type: 'manual',
              message: 'Nama toko sudah pernah dipakai',
            });
            break;
          case 'ACCESS_TOKEN_MUST_BE_UNIQUE':
            setIsErrorUrl(true);
            setTimeout(() => {
              setIsErrorUrl(false);
            }, 5000);
            break;
          case 'STORE_API_PASSWORD_MUST_BE_UNIQUE':
            setIsErrorUrl(true);
            setTimeout(() => {
              setIsErrorUrl(false);
            }, 5000);
            break;
          case 'STORE_API_SECRET_MUST_BE_UNIQUE':
            setIsErrorUrl(true);
            setTimeout(() => {
              setIsErrorUrl(false);
            }, 5000);
            break;
          default:
            setError('store_url', {
              type: 'manual',
            });
            break;
        }
      } else if (status === 500) {
        setIsErrorUrl(true);
        setTimeout(() => {
          setIsErrorUrl(false);
        }, 5000);
      } else if (status == 401) {
        if (params.get('storeId')) {
          setModalErroAlreadyTokopedia(true);
          setTimeout(() => {
            setModalErroAlreadyTokopedia(false);
            router.push('/toko-terintegrasi');
          }, 3000);
        }
      } else {
        console.error('Error in response:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onShowPopUp = (authUrl) => {
    const width = window.screen.width - 60;
    const height = window.screen.height - 60;
    const x = window.screen.width / 2 - width / 2;
    const y = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      'popup',
      `width=${width},height=${height},left=${x},top=${y},resizable=yes,scrollbars=yes`,
    );

    window.addEventListener('message', function (event) {
      if (event.source === popup) {
        if (event.data === 'login_success') {
          if (onlyTwoStep) {
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(false);
              router.push('/toko-terintegrasi');
            }, 3000);
            dispatch(setShopifyValue({}));
          } else {
            onFormNext();
          }
        } else if (event.data === 'Store Already Authorized by This Client') {
          setModalErroAlready(true);
          setTimeout(() => {
            setModalErroAlready(false);
          }, 3000);
          return;
        } else if (event.data === 'Store Already Authorized by Other Client') {
          setModalErroAlready(true);
          setTimeout(() => {
            setModalErroAlready(false);
          }, 3000);
          return;
        } else {
          setModalError(true);
          setTimeout(() => {
            setModalError(false);
          }, 3000);
        }
      }
    });
  };

  const onFormNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const [formData, setFormData] = useState({
    store_name: '',
    store_url: '',
    access_token: '',
    store_api_password: '',
    store_api_secret: '',
    description: '',
  });

  const onBackClick = () => {
    let isFormDataAvailable = false;
    let store_url = getValues('store_url');
    let store_name = getValues('store_name');

    if (!onlyTwoStep && currentStep == 3) {
      setCurrentStep(2);
    } else {
      if (selectedChannels[0] <= 4) {
        isFormDataAvailable =
          selectedChannels[0] != 2
            ? store_name?.value?.trim() || warehouse
            : store_name?.value?.trim() ||
              store_url?.value?.trim() ||
              warehouse;
      } else if (selectedChannels[0] == 11) {
        isFormDataAvailable =
          store_name?.value?.trim() ||
          selectedSearchOption?.length > 1 ||
          selectedChannel?.length > 1;
      } else if (methodAdd == 1) {
        isFormDataAvailable = store_url?.value?.trim() || selectedLocation;
      } else {
        isFormDataAvailable = isChannel11Selected
          ? !!store_name?.value.trim() || description?.value.trim()
          : !!store_name?.value.trim() ||
            !!store_url?.value.trim() ||
            !!access_token?.value.trim() ||
            !!store_api_password?.value.trim() ||
            !!store_api_secret?.value.trim();
      }

      dispatch(setShopifyValue({}));
      const isLocationSelected = selectedLocation !== null;

      if (isFormDataAvailable || isLocationSelected) {
        setIsModalOpen(true);
      } else {
        if (
          (selectedSearchOption && selectedSearchOption.length > 0) ||
          selectedChannel
        ) {
          setIsModalOpen(true);
        } else {
          resetData();
          setCurrentStep((prevStep) => prevStep - 1);
          if (params.get('storeId')) {
            router.push('/toko-terintegrasi');
          }
        }
      }
    }
  };

  const resetData = () => {
    setValue('store_name', '');
    setValue('store_url', '');
    setValue('access_token', '');
    setValue('store_api_password', '');
    setValue('store_api_secret', '');
    setValue('selectedChannelOption', '');
    setValue('selectedSearchOption', '');
    setNameStore('');
    setUrlStore('');
    setWarehouse('');
    setValue('warehouse', '');
    clearErrors();
    setSelectedSearchOption([]);
    setSelectedChannel(null);
    setSelectedLocation(null);
  };

  const handleConfirm = () => {
    setFormData({
      store_name: '',
      store_url: '',
      access_token: '',
      store_api_password: '',
      store_api_secret: '',
      description: '',
    });

    setValue('store_name', '');
    setValue('warehouse', '');
    setValue('store_url', '');
    setValue('access_token', '');
    setValue('store_api_password', '');
    setValue('store_api_secret', '');
    setValue('description', '');
    setValue('selectedChannelOption', '');
    setValue('selectedSearchOption', '');
    setWarehouse('');
    setNameStore('');
    setUrlStore('');
    clearErrors();
    setSelectedChannels([]);
    setSelectedSearchOption([]);
    setSelectedChannel(null);
    setSelectedLocation(null);

    setCurrentStep((prevStep) => prevStep - 1);
    if (params.get('storeId')) {
      router.push('/toko-terintegrasi');
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannels([channelId]);
    setIsChannel11Selected(channelId === 11 || channelId === 14);
  };

  const fetchChannelData = async () => {
    try {
      setLoadingChannel(true);
      const response = await getChannel();
      if (response.status === 200) {
        const filteredChannels = response.data.channel.filter((channel) =>
          [1, 2, 3, 4, 6, 11, 14].includes(channel.channel_id),
        );
        setChannels(filteredChannels);
      } else {
        console.error('Error fetching channel data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
      return [];
    } finally {
      setLoadingChannel(false);
    }
  };

  const fetchLocationData = async () => {
    const payload = {
      client_id: client_id,
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

  const getListWarehouse = async () => {
    const response = await getLocationDropdown(client_id);

    if (response && response.data) {
      let datas = [];
      response.data.forEach((data) => {
        datas.push({
          value: data.location_id.toString(),
          label: data.location_name,
        });
      });

      setListWarehouse(datas);
    }
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
    fetchChannelData();
    fetchLocationData();
    getListWarehouse();
    fetchListChannelPenjualan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formClass = classNames({
    'form-validate': true,
    'is-alter': alter,
  });

  const handleSetValueURL = () => {
    if (
      selectedChannels[0] == 1 ||
      selectedChannels[0] == 3 ||
      selectedChannels[0] == 4
    ) {
      setValue('store_url', 'tokowaizlytech');
      setUrlStore('tokowaizlytech');
    } else if (selectedChannels[0] == 2 && currentStep == 1) {
      setValue('store_url', '');
      setUrlStore('');
    }
  };

  useEffect(() => {
    handleSetValueURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannels]);

  const handleSetDataShopify = () => {
    setCurrentStep(2);
    setSelectedChannels([6]);

    const storeURL = params.get('store_url');
    if (storeURL) {
      setValue('store_url', storeURL);
      setUrlStore(storeURL);

      dispatch(
        setShopifyValue({
          store_url: storeURL,
          channel_id: 6,
          channel_name: 'SHOPIFY',
        }),
      );
    }
  };

  useEffect(() => {
    if (params.get('storeId')) {
      const urlStore = params.get('storeUrl');
      const nameStore = params.get('storeName');
      setCurrentStep(3);
      setSelectedChannels([2]);
      setValue('store_url', 'tokowaizlytech');
      setUrlStore(urlStore);
      setValue('store_name', nameStore.replace('-', ' '));
      setNameStore(nameStore.replace('-', ' '));
    }

    if (shopifyValue?.store_url) {
      setCurrentStep(2);
      setSelectedChannels([6]);
      setValue('store_url', shopifyValue.store_url);
      setUrlStore(shopifyValue.store_url);
    } else if (!shopifyValue?.store_url && params.get('channel_name')) {
      const channelName = params.get('channel_name');
      if (channelName === 'SHOPIFY') {
        handleSetDataShopify();
      }
    } else {
      // todo
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handlePostMultiwarehouse = () => {
    setLoading(true);
    const payload = {
      mapping_list: tableMultiWarehouse.map((v, id) => {
        return {
          store_id: params.get('storeId')
            ? parseInt(params.get('storeId'))
            : parseInt(storeId),
          location_id:
            parseInt(selectedMultipleWarehose[id]) ||
            selectedMultipleWarehose[id],
          store_location_id: parseInt(v.store_location_id),
        };
      }),
    };

    try {
      postLocationMapping(payload).then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
          setIsSuccess(true);
          dispatch(setShopifyValue({}));
          setTimeout(() => {
            setIsSuccess(false);
            router.push('/toko-terintegrasi');
          }, 2000);
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      console.log('err', error);
    }
  };

  const onChangeMultipleWarehouse = (id, value) => {
    setselectedMultipleWarehose((prev) => {
      let newData = [...prev];
      newData[id] = value;
      return newData;
    });
  };

  const onGetStoreIdentity = async () => {
    const payload = {
      store_name: getValues('store_name'),
      client_id,
    };

    setTimeout(() => {
      getStoreByName(payload).then(async (res) => {
        if (
          res.data &&
          params.get('storeId') &&
          res.data.store_name_channel == null
        ) {
          try {
            const response = await authStoreTokopedia(
              storeId,
              res.data.location_id,
              user_id,
            );
            onGetStoreIdentity();
          } catch (error) {
            setModalErroAlreadyTokopedia(true);
            setTimeout(() => {
              setModalErroAlreadyTokopedia(false);
              router.push('/toko-terintegrasi');
            }, 3000);
            return;
          }
        } else if (res.data) {
          onHandleTableWarehouses(res);
        }
      });
    }, 1250);
  };

  const onHandleTableWarehouses = (res) => {
    onHandleStoreData(res);
    if (res.status == 200 && res.data) {
      getStoreLocation(res.data.store_id).then((res) => {
        if (res.status == 200 || res.status == 201) {
          settableMultiWarehouse(res.data.location);
          setselectedMultipleWarehose(
            res.data.location.map((v) => v.location_id),
          );
        }
      });
    }
  };

  const onHandleStoreData = (res) => {
    setstoreDataByName(res.data);
    setSelectedChannels([res.data.channel_id]);
    setValue('store_name', res.data.store_name_bekir);
    setValue('store_url', res.data.store_url || '');
    setSelectedChannelName(res.data?.channel_name?.toLowerCase());
    setstoreId(res.data.store_id);
  };

  useEffect(() => {
    if (currentStep === 3) {
      onGetStoreIdentity();
      if (params.get('storeName')) {
        setValue('store_name', params.get('storeName'));
        setValue('store_url', params.get('storeUrl'));
      }
    }
  }, [currentStep]);

  return (
    <>
      <Content>
        <Block>
          <PreviewCard>
            {currentStep === 1 && (
              <Form className={formClass}>
                <Row className="g-gs">
                  <Col md="12">
                    <BlockBetween>
                      <BlockHeadContent>
                        <ul className="nk-block-tools g-3">
                          <li>
                            <p style={{ color: '#203864', fontSize: 12 }}>
                              TOKO TERINTEGRASI /
                              <span style={{ color: '#BDC0C7' }}>
                                {' '}
                                Tambah Toko
                              </span>
                            </p>
                          </li>
                        </ul>
                      </BlockHeadContent>
                      <BlockHeadContent>
                        <ul className="nk-block-tools g-3">
                          <li>
                            <p style={{ color: '#203864' }}>
                              LANGKAH 1 DARI {onlyTwoStep ? 2 : 3}
                            </p>
                          </li>
                        </ul>
                      </BlockHeadContent>
                    </BlockBetween>
                  </Col>
                  <BlockBetween>
                    <BlockHeadContent>
                      <BlockTitle style={{ fontSize: 32 }}>
                        Tambah Toko
                      </BlockTitle>
                    </BlockHeadContent>
                  </BlockBetween>
                  <Col md="9">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="fv-email">
                        Marketplace
                      </Label>
                      <div className="form-control-wrap">
                        <Row className="gx-3 gy-2" style={{ marginTop: -5 }}>
                          {loadingChanel ? (
                            <>
                              {Array.from({ length: 4 }, (_, i) => (
                                <Col key={i} xl={'3'} lg={'4'} md={'6'} sm={12}>
                                  <Skeleton
                                    width={'185px'}
                                    height={'58px'}
                                    shape={'rectangle'}
                                  />
                                </Col>
                              ))}
                            </>
                          ) : (
                            <>
                              {channels
                                .filter(
                                  (channel) =>
                                    channel.channel_id != 6 &&
                                    channel.channel_id != 11 &&
                                    channel.channel_id != 14,
                                )
                                .map((channel, idx) => (
                                  <Col
                                    key={idx}
                                    xl={'3'}
                                    lg={'4'}
                                    md={'6'}
                                    sm={12}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: (
                                          selectedChannels || []
                                        ).includes(channel.channel_id)
                                          ? '#E7EAEE'
                                          : '#fff',
                                        color: '#4C4F54',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() =>
                                        handleChannelClick(channel.channel_id)
                                      }
                                    >
                                      <Image
                                        src={getImageSrc(channel.channel_name)}
                                        width={40}
                                        height={40}
                                        alt="waizly-logo"
                                      />
                                      <span
                                        style={{
                                          marginLeft: '18px',
                                          fontSize: 'large',
                                          flexGrow: 1,
                                        }}
                                      >
                                        {titleCase(channel.channel_name)}
                                      </span>
                                    </div>
                                  </Col>
                                ))}
                            </>
                          )}
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col md="9">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="fv-email">
                        Web Store
                      </Label>
                      <div className="form-control-wrap">
                        <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                          {loadingChanel ? (
                            <>
                              <Col xl={'3'} lg={'4'} md={'6'} sm={12}>
                                <Skeleton
                                  width={'185px'}
                                  height={'58px'}
                                  shape={'rectangle'}
                                />
                              </Col>
                            </>
                          ) : (
                            <>
                              {channels
                                .filter((channel) => channel.channel_id === 6)
                                .map((channel, idx) => (
                                  <Col key={idx} size="3" md="3">
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: (
                                          selectedChannels || []
                                        ).includes(channel.channel_id)
                                          ? '#E7EAEE'
                                          : '#fff',
                                        color: '#4C4F54',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() =>
                                        handleChannelClick(channel.channel_id)
                                      }
                                    >
                                      <Image
                                        src={getImageSrc(channel.channel_name)}
                                        width={40}
                                        height={40}
                                        alt="waizly-logo"
                                      />
                                      <span
                                        style={{
                                          marginLeft: '18px',
                                          fontSize: 'large',
                                        }}
                                      >
                                        {titleCase(channel.channel_name)}
                                      </span>
                                    </div>
                                  </Col>
                                ))}
                            </>
                          )}
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col md="9">
                    <div className="form-group">
                      <Label className="form-label" htmlFor="fv-email">
                        Lainya
                      </Label>
                      <div className="form-control-wrap">
                        <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                          {loadingChanel ? (
                            <>
                              <Col xl={'3'} lg={'4'} md={'6'} sm={12}>
                                <Skeleton
                                  width={'185px'}
                                  height={'58px'}
                                  shape={'rectangle'}
                                />
                              </Col>
                            </>
                          ) : (
                            <>
                              {channels
                                .filter(
                                  (channel) =>
                                    channel.channel_id != 1 &&
                                    channel.channel_id != 2 &&
                                    channel.channel_id != 3 &&
                                    channel.channel_id != 4 &&
                                    channel.channel_id != 6 &&
                                    channel.channel_id != 14,
                                )
                                .map((channel, idx) => (
                                  <Col key={idx} size="3" md="3">
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: (
                                          selectedChannels || []
                                        ).includes(channel.channel_id)
                                          ? '#E7EAEE'
                                          : '#fff',
                                        color: '#4C4F54',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() =>
                                        handleChannelClick(channel.channel_id)
                                      }
                                    >
                                      <Image
                                        src={getImageSrc(channel.channel_name)}
                                        width={40}
                                        height={40}
                                        alt="waizly-logo"
                                      />
                                      <span
                                        style={{
                                          marginLeft: '18px',
                                          fontSize: 'large',
                                        }}
                                      >
                                        {titleCase(channel.channel_name)}
                                      </span>
                                    </div>
                                  </Col>
                                ))}
                            </>
                          )}
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col md="12">
                    <BlockBetween>
                      <BlockHeadContent></BlockHeadContent>
                      <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                          <div
                            className="toggle-expand-content"
                            style={{ display: sm ? 'block' : 'none' }}
                          >
                            <ul className="nk-block-tools g-3">
                              <li>
                                <Link
                                  href="/toko-terintegrasi"
                                  className="text-decoration-underline text-color-primary"
                                >
                                  <Button className="toggle d-none d-md-inline-flex">
                                    <div
                                      style={{
                                        fontWeight: 'bold',
                                        color: '#203864',
                                      }}
                                    >
                                      Kembali
                                    </div>
                                  </Button>
                                </Link>
                              </li>
                              <li>
                                <Button
                                  className={`toggle d-none d-md-inline-flex  ${
                                    !selectedChannels ||
                                    selectedChannels.length === 0
                                      ? 'btn-disabled'
                                      : ''
                                  }`}
                                  color="primary"
                                  onClick={onFormNext}
                                  disabled={
                                    !selectedChannels ||
                                    selectedChannels.length === 0
                                  }
                                >
                                  <div style={{ fontSize: 14 }}>
                                    Selanjutnya
                                  </div>
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
            )}
            {currentStep === 2 && (
              <Form className={formClass} onSubmit={handleSubmit(onFormSubmit)}>
                <Row className="g-gs">
                  <Col md="12">
                    <BlockBetween>
                      <BlockHeadContent>
                        <ul className="nk-block-tools g-3">
                          <li>
                            <p style={{ color: '#203864', fontSize: 12 }}>
                              TOKO TERINTEGRASI /
                              <span style={{ color: '#BDC0C7' }}>
                                {' '}
                                Tambah Toko
                              </span>
                            </p>
                          </li>
                        </ul>
                      </BlockHeadContent>
                    </BlockBetween>
                  </Col>
                  <BlockBetween>
                    <BlockHeadContent className={'d-flex ju'}>
                      <BlockTitle style={{ fontSize: 32 }}>
                        Tambah Toko
                      </BlockTitle>
                    </BlockHeadContent>
                    <BlockHeadContent>
                      <ul className="nk-block-tools g-3">
                        <li>
                          <p style={{ color: '#203864', fontSize: 12 }}>
                            LANGKAH 2 DARI {onlyTwoStep ? 2 : 3}
                          </p>
                        </li>
                      </ul>
                    </BlockHeadContent>
                  </BlockBetween>
                  {selectedChannels.includes(2) && (
                    <Col md={12} style={{ marginTop: 4 }}>
                      <div
                        className={'d-flex align-items-center'}
                        style={styles.info}
                      >
                        <em
                          className="icon ni ni-alert-circle"
                          style={styles.iconInfo}
                        />
                        <div style={styles.desc}>
                          <strong style={styles.strong}>{'TIPS! '}</strong>
                          {
                            'Sebelum melakukan integrasi, mohon tingkatkan level toko kamu ke Power Merchant dan pastikan tidak terhubung dengan aplikasi pihak ketiga atau omnichannel lainnya.'
                          }
                        </div>
                      </div>
                    </Col>
                  )}
                  {selectedChannels && selectedChannels[0] <= 4 ? (
                    <>
                      <Col lg={6} sm={12}>
                        <div className="form-group">
                          <Label
                            style={{ fontWeight: '700' }}
                            className="form-label"
                            htmlFor="store_name"
                          >
                            Nama Toko di Channel
                            <span style={{ color: 'red' }}>*</span>
                          </Label>
                          <div className="form-control-wrap">
                            <Input
                              type="text"
                              className="shadow-none field-input-border-primary"
                              id="store_name"
                              disabled
                              value={'Toko Waizly'}
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
                        </div>
                      </Col>
                      <Col lg={6} sm={12}>
                        <div className="form-group">
                          <Label
                            style={{ fontWeight: '700' }}
                            className="form-label"
                            htmlFor="store_name"
                          >
                            Nama Toko di Bebas Kirim
                            <span style={{ color: 'red' }}>*</span>
                          </Label>
                          <div className="form-control-wrap">
                            <Input
                              invalid={!!errors.store_name}
                              {...register('store_name')}
                              onChange={(e) => {
                                setValue('store_name', e.target.value);
                                setNameStore(e.target.name);
                                validateStoreName();
                              }}
                              disabled={params.get('storeId')}
                              type="text"
                              defaultValue={getValues('store_name')}
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
                        </div>
                      </Col>
                      <Col lg={12} sm={12}>
                        <div className="form-group">
                          <Label
                            style={{ fontWeight: '700' }}
                            className="form-label"
                            htmlFor="store_url"
                          >
                            URL
                            <span style={{ color: 'red' }}>*</span>
                          </Label>
                          <div
                            className="form-control-wrap"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ marginRight: 4, fontSize: 12 }}>
                              {selectedChannels.includes(1)
                                ? 'https://shopee.com/'
                                : selectedChannels.includes(2)
                                  ? 'https://tokopedia.com/'
                                  : selectedChannels.includes(3)
                                    ? 'https://lazada.com/'
                                    : 'https://tiktok.com/'}
                            </span>
                            <Input
                              invalid={!!errors.store_url}
                              {...register('store_url')}
                              disabled={
                                selectedChannels[0] != 2 ||
                                params.get('storeId')
                              }
                              onChange={(e) => {
                                if (selectedChannels[0] == 2) {
                                  setValue('store_url', e.target.value);
                                  setUrlStore(e.target.value);
                                  validateUrl();
                                }
                              }}
                              style={{ fontSize: 12 }}
                              defaultValue={getValues('store_url')}
                              type="text"
                              id="store_url"
                              placeholder="Masukkan URL"
                            />
                          </div>

                          <FormFeedback
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            <span
                              style={{ marginRight: 28, color: colors.white }}
                            >
                              {selectedChannels.includes(1)
                                ? 'https://shopee.com/'
                                : selectedChannels.includes(2)
                                  ? 'https://tokopedia.com/'
                                  : selectedChannels.includes(3)
                                    ? 'https://lazada.com/'
                                    : 'https://tiktok.com/'}
                            </span>
                            <span
                              className="text-danger position-absolute"
                              style={{ fontSize: 12, marginRight: 200 }}
                            >
                              {errors.store_url?.message}
                            </span>
                          </FormFeedback>
                        </div>
                      </Col>
                    </>
                  ) : (
                    <>
                      {selectedChannels[0] == 6 && (
                        <Col lg={12} style={{ marginTop: 0 }}>
                          <div className="form-group">
                            <Label
                              className={'mb-2 mt-4'}
                              style={{ fontWeight: '700' }}
                            >
                              {'Pilih Metode Penambahan'}
                              <span style={{ color: 'red' }}>*</span>
                            </Label>
                            <TabForm
                              edit={false}
                              selected={methodAdd.toString()}
                              list={listMethodAdd}
                              onClick={(value) => {
                                resetData();
                                setMethodAdd(parseInt(value));
                              }}
                            />
                          </div>
                        </Col>
                      )}

                      {methodAdd == 1 && selectedChannels[0] == 6 ? (
                        <>
                          <Col md="6">
                            <div className="form-group">
                              <Label
                                style={{ fontWeight: '700' }}
                                className="form-label"
                                htmlFor="fv-topics"
                              >
                                Gudang<span style={{ color: 'red' }}>*</span>
                              </Label>
                              <div className="form-control-wrap">
                                <DropdownOption
                                  style={{
                                    width: '100%',
                                    border: errors.selectedSearchOption?.message
                                      ? '1px solid rgb(232, 83, 71)'
                                      : '',
                                    height: 36,
                                  }}
                                  options={[
                                    {
                                      location_id: 88,
                                      location_code: '',
                                      location_name: '',
                                      sub_district_id: 66,
                                    },
                                    ...location,
                                  ]}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Gudang'}
                                  value={selectedSearchOption}
                                  {...register('selectedSearchOption')}
                                  onChange={(e) => {
                                    setValue(
                                      'selectedSearchOption',
                                      e.target.value?.name,
                                    );
                                    setSelectedSearchOption(e.target.value);
                                    setSelectedLocation(e.target.value);
                                  }}
                                />
                                <Input
                                  hidden
                                  invalid={
                                    !!errors.selectedSearchOption?.message
                                  }
                                />
                                <FormFeedback>
                                  <span
                                    className="text-danger position-absolute"
                                    style={{ fontSize: 12 }}
                                  >
                                    {errors.selectedSearchOption?.message}
                                  </span>
                                </FormFeedback>
                              </div>
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <Label
                                style={{ fontWeight: '700' }}
                                className="form-label"
                                htmlFor="store_url"
                              >
                                URL Toko Shopify
                                <span style={{ color: 'red' }}>*</span>
                              </Label>
                              <div
                                className="form-control-wrap"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Input
                                  invalid={!!errors.store_url}
                                  {...register('store_url')}
                                  onChange={(e) => {
                                    setValue('store_url', e.target.value);
                                    setUrlStore(e.target.value);
                                    validateUrl();
                                  }}
                                  type="text"
                                  defaultValue={urlStore}
                                  className="shadow-none field-input-border-primary flex-1"
                                  id="store_url"
                                  placeholder="Masukkan URL"
                                />
                                <span
                                  style={{ marginLeft: '5px', fontSize: 12 }}
                                >
                                  .myshopify.com
                                </span>
                              </div>
                              <FormFeedback
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <span
                                  className="text-danger position-absolute"
                                  style={{ fontSize: 12 }}
                                >
                                  {errors.store_url?.message}
                                </span>
                              </FormFeedback>
                            </div>
                          </Col>
                        </>
                      ) : (
                        <>
                          <Col md={`${isChannel11Selected ? '12' : '6'}`}>
                            <div className="form-group">
                              <Label
                                style={{ fontWeight: '700' }}
                                className="form-label"
                                htmlFor="store_name"
                              >
                                Nama Toko di Bebas Kirim
                                <span style={{ color: 'red' }}>*</span>
                              </Label>
                              <div className="form-control-wrap">
                                <Input
                                  invalid={!!errors.store_name}
                                  {...register('store_name')}
                                  onChange={(e) => {
                                    setValue('store_name', e.target.value);
                                    validateStoreName();
                                  }}
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
                            </div>
                          </Col>
                          {!isChannel11Selected && (
                            <>
                              <Col md="6">
                                <div className="form-group">
                                  <Label
                                    style={{ fontWeight: '700' }}
                                    className="form-label"
                                    htmlFor="store_url"
                                  >
                                    URL
                                    <span style={{ color: 'red' }}>*</span>
                                  </Label>
                                  <div
                                    className="form-control-wrap"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Input
                                      invalid={!!errors.store_url}
                                      {...register('store_url')}
                                      onChange={(e) => {
                                        setValue('store_url', e.target.value);
                                        validateUrl();
                                      }}
                                      type="text"
                                      className="shadow-none field-input-border-primary flex-1"
                                      id="store_url"
                                      placeholder="Masukkan URL"
                                    />
                                    <span
                                      style={{
                                        marginLeft: '5px',
                                        fontSize: 12,
                                      }}
                                    >
                                      .myshopify.com
                                    </span>
                                  </div>
                                  <FormFeedback
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <span
                                      className="text-danger position-absolute"
                                      style={{ fontSize: 12 }}
                                    >
                                      {errors.store_url?.message}
                                    </span>
                                  </FormFeedback>
                                </div>
                              </Col>
                              <Col md="6">
                                <div className="form-group">
                                  <Label
                                    style={{ fontWeight: '700' }}
                                    className="form-label"
                                    htmlFor="access_token"
                                  >
                                    Access Token
                                    <span style={{ color: 'red' }}>*</span>
                                  </Label>
                                  <div className="form-control-wrap">
                                    <Input
                                      invalid={!!errors.access_token}
                                      {...register('access_token')}
                                      onChange={(e) => {
                                        setValue(
                                          'access_token',
                                          e.target.value,
                                        );
                                        validateToken();
                                      }}
                                      type="text"
                                      className="shadow-none field-input-border-primary"
                                      id="access_token"
                                      placeholder="Masukkan Access Token"
                                    />
                                    <FormFeedback>
                                      <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                      >
                                        {errors.access_token?.message}
                                      </span>
                                    </FormFeedback>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <div className="form-group">
                                  <Label
                                    className="form-label"
                                    htmlFor="store_api_password"
                                    style={{ fontWeight: '700' }}
                                  >
                                    API Key Aplikasi Custom App
                                    <span style={{ color: 'red' }}>*</span>
                                  </Label>
                                  <div className="form-control-wrap">
                                    <Input
                                      invalid={!!errors.store_api_password}
                                      {...register('store_api_password')}
                                      onChange={(e) => {
                                        setValue(
                                          'store_api_password',
                                          e.target.value,
                                        );
                                        validateApiKey();
                                      }}
                                      type="text"
                                      className="shadow-none field-input-border-primary"
                                      id="store_api_password"
                                      placeholder="Masukkan API Key"
                                    />
                                    <FormFeedback>
                                      <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                      >
                                        {errors.store_api_password?.message}
                                      </span>
                                    </FormFeedback>
                                  </div>
                                </div>
                              </Col>
                              <Col md="6">
                                <div className="form-group">
                                  <Label
                                    className="form-label"
                                    htmlFor="store_api_secret"
                                    style={{ fontWeight: '700' }}
                                  >
                                    API Secret Key Aplikasi Custom App
                                    <span style={{ color: 'red' }}>*</span>
                                  </Label>
                                  <div className="form-control-wrap">
                                    <Input
                                      invalid={!!errors.store_api_secret}
                                      {...register('store_api_secret')}
                                      onChange={(e) => {
                                        setValue(
                                          'store_api_secret',
                                          e.target.value,
                                        );
                                        validateApiSecret();
                                      }}
                                      type="text"
                                      className="shadow-none field-input-border-primary"
                                      id="store_api_secret"
                                      placeholder="Masukkan API Secret Key"
                                    />
                                    <FormFeedback>
                                      <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                      >
                                        {errors.store_api_secret?.message}
                                      </span>
                                    </FormFeedback>
                                  </div>
                                </div>
                              </Col>
                            </>
                          )}
                          <Col md="6">
                            <div className="form-group">
                              <Label
                                style={{ fontWeight: '700' }}
                                className="form-label"
                                htmlFor="fv-topics"
                              >
                                Gudang<span style={{ color: 'red' }}>*</span>
                              </Label>
                              <div className="form-control-wrap">
                                <DropdownOption
                                  style={{
                                    width: '100%',
                                    border: errors.selectedSearchOption?.message
                                      ? '1px solid rgb(232, 83, 71)'
                                      : '',
                                    height: 36,
                                  }}
                                  options={[
                                    {
                                      location_id: 88,
                                      location_code: '',
                                      location_name: '',
                                      sub_district_id: 66,
                                    },
                                    ...location,
                                  ]}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Gudang'}
                                  value={selectedSearchOption}
                                  {...register('selectedSearchOption')}
                                  onChange={(e) => {
                                    setValue(
                                      'selectedSearchOption',
                                      e.target.value?.name,
                                    );
                                    setSelectedSearchOption(e.target.value);
                                    setSelectedLocation(e.target.value);
                                  }}
                                />
                                <Input
                                  hidden
                                  invalid={
                                    !!errors.selectedSearchOption?.message
                                  }
                                />
                                <FormFeedback>
                                  <span
                                    className="text-danger position-absolute"
                                    style={{ fontSize: 12 }}
                                  >
                                    {errors.selectedSearchOption?.message}
                                  </span>
                                </FormFeedback>
                              </div>
                            </div>
                          </Col>
                          {isChannel11Selected && (
                            <Col md="6">
                              <div className="form-group">
                                <Label
                                  className="form-label"
                                  htmlFor="fv-topics"
                                >
                                  Channel Penjualan
                                  <span style={{ color: 'red' }}>*</span>
                                </Label>
                                <div className="form-control-wrap">
                                  <DropdownOption
                                    style={{
                                      width: '100%',
                                      border: errors.selectedChannelOption
                                        ?.message
                                        ? '1px solid rgb(232, 83, 71)'
                                        : '',
                                      height: 36,
                                    }}
                                    options={[
                                      {
                                        location_id: 88,
                                        location_code: '',
                                        location_name: '',
                                        sub_district_id: 66,
                                      },
                                      ...channelsList,
                                    ]}
                                    optionLabel={'channel_name'}
                                    placeholder={'Pilih'}
                                    value={selectedChannel}
                                    {...register('selectedChannelOption')}
                                    onChange={(e) => {
                                      setValue(
                                        'selectedChannelOption',
                                        e.target.value?.channel_name,
                                      );
                                      setSelectedChannel(e.target.value);
                                    }}
                                  />
                                  <Input
                                    hidden
                                    invalid={
                                      !!errors.selectedChannelOption?.message
                                    }
                                  />
                                  <FormFeedback>
                                    <span
                                      className="text-danger position-absolute"
                                      style={{ fontSize: 12 }}
                                    >
                                      {errors.selectedChannelOption?.message}
                                    </span>
                                  </FormFeedback>
                                </div>
                              </div>
                            </Col>
                          )}
                          {selectedChannels &&
                            (selectedChannels.includes(11) ||
                              selectedChannels.includes(14)) && (
                              <Col md="12">
                                <div className="form-group">
                                  <Label
                                    className="form-label"
                                    htmlFor="description"
                                  >
                                    Deskripsi Toko
                                  </Label>
                                  <Input
                                    {...register('description')}
                                    onChange={(e) => {
                                      setValue('description', e.target.value);
                                    }}
                                    type="textarea"
                                    className="shadow-none field-input-border-primary"
                                    id="description"
                                    placeholder="Masukkan Deskripsi Toko"
                                    maxLength={255}
                                  />
                                </div>
                              </Col>
                            )}
                        </>
                      )}
                    </>
                  )}

                  <Col md="12">
                    <BlockBetween>
                      <BlockHeadContent></BlockHeadContent>
                      <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                          <div
                            className="toggle-expand-content"
                            style={{ display: sm ? 'block' : 'none' }}
                          >
                            <ul className="nk-block-tools g-3">
                              <li>
                                <div
                                  onClick={onBackClick}
                                  className="toggle d-none d-md-inline-flex"
                                >
                                  <span
                                    style={{
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      marginRight: '39px',
                                      color: '#203864',
                                    }}
                                  >
                                    Kembali
                                  </span>
                                </div>
                              </li>
                              <li>
                                {onlyTwoStep ? (
                                  <Button
                                    size="lg"
                                    className={`btn center shadow-none ${
                                      !isValid ? 'btn-disabled' : 'btn-primary'
                                    }`}
                                    type={loading ? 'button' : 'submit'}
                                    disabled={!isValid}
                                    style={{ width: '180px' }}
                                  >
                                    {loading ? (
                                      <Spinner size="sm" color="light" />
                                    ) : (
                                      <div style={{ fontSize: 14 }}>
                                        {'Simpan'}
                                      </div>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    className={`toggle d-none d-md-inline-flex  ${
                                      getValues('store_name') == '' ||
                                      getValues('store_url') == ''
                                        ? 'btn-disabled'
                                        : ''
                                    }`}
                                    color="primary"
                                    type="submit"
                                    disabled={
                                      getValues('store_name') == '' ||
                                      getValues('store_url') == '' ||
                                      loading
                                    }
                                  >
                                    <div style={{ fontSize: 14 }}>
                                      Selanjutnya
                                    </div>
                                  </Button>
                                )}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </BlockHeadContent>
                    </BlockBetween>
                  </Col>
                </Row>
              </Form>
            )}
            {currentStep === 3 && (
              <Form className={formClass}>
                <Row className="g-gs mb-1">
                  <Col md="12">
                    <BlockBetween>
                      <BlockHeadContent>
                        <ul className="nk-block-tools g-3">
                          <li>
                            <p style={{ color: '#203864', fontSize: 12 }}>
                              TOKO TERINTEGRASI /
                              <span style={{ color: '#BDC0C7' }}>
                                {' '}
                                Tambah Toko
                              </span>
                            </p>
                          </li>
                        </ul>
                      </BlockHeadContent>
                    </BlockBetween>
                  </Col>
                  <BlockBetween>
                    <BlockHeadContent className={'d-flex ju'}>
                      <BlockTitle style={{ fontSize: 32 }}>
                        Tambah Toko
                      </BlockTitle>
                    </BlockHeadContent>
                    <BlockHeadContent>
                      <ul className="nk-block-tools g-3">
                        <li>
                          <p style={{ color: '#203864', fontSize: 12 }}>
                            LANGKAH 3 DARI {onlyTwoStep ? 2 : 3}
                          </p>
                        </li>
                      </ul>
                    </BlockHeadContent>
                  </BlockBetween>
                </Row>
                <div
                  className="d-flex align-items-center"
                  style={{ color: '#4C4F54' }}
                >
                  Channel:{' '}
                  <Image
                    src={getImageSrc(null, selectedChannels[0])}
                    width={16}
                    height={16}
                    alt="waizly-logo"
                    style={{ marginLeft: 6, marginRight: 3 }}
                  />{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {selectedChannelName}
                  </span>
                </div>
                <div style={{ color: '#4C4F54' }}>
                  Nama Toko di Bebas Kirim: {getValues('store_name')}
                </div>
                <div style={{ color: '#4C4F54' }}>
                  Nama Toko di Channel:{' '}
                  {storeDataByName?.store_name_channel || '-'}
                </div>
                <div
                  hidden={!storeDataByName || !storeDataByName?.store_url}
                  style={{ color: '#4C4F54' }}
                >
                  Domain Toko: {storeDataByName?.store_url}
                </div>
                <table
                  className={`table-activity-history-wrap mt-2 mb-5 ${tableClass}`}
                >
                  <thead className="table-primary">
                    <tr>
                      <th
                        style={{ minWidth: 250, paddingLeft: 8, fontSize: 12 }}
                      >
                        Nama Gudang
                      </th>
                      <th style={{ fontSize: 12 }}>Detail Gudang</th>
                      <th
                        style={{ minWidth: 300, paddingRight: 8, fontSize: 12 }}
                      >
                        Gudang Bebas Kirim
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableMultiWarehouse != null &&
                      tableMultiWarehouse.length != 0 &&
                      tableMultiWarehouse.map((v, idx) => {
                        return (
                          <tr key={v.store_location_id}>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                paddingLeft: 8,
                                color: '#4C4F54',
                                fontSize: 12,
                              }}
                            >
                              {v.location_name}
                            </td>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                color: '#4C4F54',
                                fontSize: 12,
                              }}
                            >
                              {v.full_address}
                            </td>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                paddingRight: 8,
                                color: '#4C4F54',
                              }}
                            >
                              <DropdownOption
                                options={listWarehouse}
                                value={selectedMultipleWarehose[idx]}
                                style={{ fontSize: 12 }}
                                placeholder={'Pilih Gudang'}
                                onChange={(event) =>
                                  onChangeMultipleWarehouse(
                                    idx,
                                    event.target.value,
                                  )
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <Col md="12">
                  <BlockBetween>
                    <BlockHeadContent></BlockHeadContent>
                    <BlockHeadContent>
                      <div className="toggle-wrap nk-block-tools-toggle">
                        <div
                          className="toggle-expand-content"
                          style={{ display: sm ? 'block' : 'none' }}
                        >
                          <ul className="nk-block-tools g-3">
                            <li hidden={selectedChannels[0] == 2}>
                              <div
                                onClick={onBackClick}
                                className="toggle d-none d-md-inline-flex"
                              >
                                <span
                                  style={{
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    marginRight: '39px',
                                    color: '#203864',
                                  }}
                                >
                                  Kembali
                                </span>
                              </div>
                            </li>
                            <li>
                              <Button
                                size="lg"
                                className="btn center shadow-none"
                                color="primary"
                                type="button"
                                disabled={loading}
                                style={{ width: '180px' }}
                                onClick={handlePostMultiwarehouse}
                              >
                                {loading ? (
                                  <Spinner size="sm" color="light" />
                                ) : (
                                  <div style={{ fontSize: 14 }}>{'Simpan'}</div>
                                )}
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </BlockHeadContent>
                  </BlockBetween>
                </Col>
              </Form>
            )}
          </PreviewCard>
        </Block>
      </Content>
      {isModalOpen && (
        <ModalConfirmPopup
          icon={gifConfirm}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={true}
          handleClickYes={handleConfirm}
          handleClickCancelled={handleCancel}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-135px',
            height: '195px',
            buttonConfirmation: true,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
        />
      )}
      {isErrorUrl && (
        <ModalError
          icon={gifErrorUrl}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 440,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingLeft: 55,
            paddingRight: 55,
            height: '180px',
            marginLeft: '-44px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={'Kami tidak dapat mengakses toko Anda'}
          subtitle={
            'cek lagi URL, Access Token, API Key dan API Secretmu. Pastikan bahwa semua kredensial tokomu sudah sesuai'
          }
        />
      )}
      {isSucces && (
        <ModalError
          icon={gifSuccess}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 440,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingLeft: 55,
            paddingRight: 55,
            height: '126px',
            marginLeft: '-44px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={'Berhasil Menambahkan Toko!'}
        />
      )}

      {modalErrorAlready && (
        <ModalConfirm
          hideCallback={() => {
            // setisSucces({ show: false, text: "" });
          }}
          useTimer={false}
          icon={gifErrorUrl}
          widthImage={400}
          heightImage={320}
          modalContentStyle={{ width: 400 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 480,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingLeft: 54,
            paddingRight: 54,
            height: '150px',
            marginLeft: '-40px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={'Oops, Gagal melakukan Otorisasi Toko'}
          subtitle={`Toko ini telah terdaftar di Bebas Kirim sebelumnya. Silakan gunakan akun ${selectedChannels[0] == 1 ? 'Shopee' : selectedChannels[0] == 3 ? 'Lazada' : 'Tiktok'} lainnya.`}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalErrorAlreadyTokopedia && (
        <ModalConfirm
          hideCallback={() => {
            // setisSucces({ show: false, text: "" });
          }}
          useTimer={false}
          icon={gifErrorUrl}
          widthImage={400}
          heightImage={320}
          modalContentStyle={{ width: 400 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 480,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingLeft: 54,
            paddingRight: 54,
            height: '150px',
            marginLeft: '-40px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={'Oops, Gagal melakukan Otorisasi Toko'}
          subtitle={
            'Tokomu belum terdaftar pada API Tokopedia kami. Silakan hubungi tim support Bebas Kirim. '
          }
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalError && (
        <ModalError
          icon={gifErrorUrl}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 440,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingLeft: 55,
            paddingRight: 55,
            height: '126px',
            marginLeft: '-44px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={'Oops, Terjadi Kesalahan'}
        />
      )}
    </>
  );
};

const styles = {
  info: {
    width: '100%',
    backgroundColor: '#FFF7E6',
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  iconInfo: {
    color: '#FFAF00',
    fontSize: 20,
    marginRight: 12,
  },
  desc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFAF00',
  },
  strong: {
    fontWeight: '700',
  },
};
export default FormValidationComponent;
