/* eslint-disable react-hooks/exhaustive-deps */
//next
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

//component
import { Head, ModalConfirm } from '@/components';
import { Button, DropdownOption, Select, optionWerehouse, Icon, BlockTitle } from '@/components';
import { FormInput } from '@/components/atoms/form-input';

//layout
import Content from '@/layout/content/Content';

//third party
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Form, FormFeedback, FormGroup, Input, Label, Row, Spinner, InputGroup, InputGroupText, Tooltip } from 'reactstrap';

//utils
import { UseDelay } from '@/utils/formater';
import { schemaSettingWerehouse } from '@/utils/validation/yup-validation';
import { getWerehouse } from '@/utils/getSelectOption';
import {
  capitalizeFirstLetter,
  specialCapitalizeFirstLetter,
} from '@/utils/capitalizeFirstLetter';
import { formatDateText } from '@/utils';

//assets
import successGif from '@/assets/gift/success-create-sku.gif';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';
import contactus from '@/assets/gift/contact-us.gif';

// redux & api
import { useSelector } from 'react-redux';
import {
  getProvince,
  getCities,
  getDistricts,
  getSubDistricts,
  addWerehouse,
  getDetailWerehouse,
  updateWerehouse,
  getEthixWerehouseLocation,
} from '@/services/locations';

function FormWerehouse({ }) {
  const textSuccesCreate = 'Berhasil Menambahkan Lokasi!';
  const textSuccesEdit = 'Berhasil Memperbarui Lokasi!';

  const [dataDetail, setDataDetail] = useState([]);
  const [dataEthixWerehouse, setDataEthixWerehouse] = useState([]);
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCities, setDataCities] = useState([]);
  const [dataDistricts, setDataDistricts] = useState([]);
  const [dataSubDistricts, setDataSubDistricts] = useState([]);
  const [temporaryDataEdit, setTemporaryDataEdit] = useState([]);
  const [textTypeAction, setTextTypeAction] = useState('');
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [isEthixSelected, setIsEthixSelected] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(false);
  const [loadingField, setLoadingField] = useState(false);

  // state location
  const [provinceId, setProvinceId] = useState();
  const [citiesId, setCitiesId] = useState();
  const [districtsId, setDistrictsId] = useState();

  // state disabled
  const [disabledCities, setIsDisabledCities] = useState(false);
  const [disabledDistricts, setDisabledDistricts] = useState(false);
  const [disabledSubDistricts, setDisabledSubDistricts] = useState(false);

  // tooltip
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  // redux
  const { client_id } = useSelector((state) => state.auth.user);
  // next route & next search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const idSearch = searchParams.get('id');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    clearErrors,
    trigger,
    setValue,
    setError,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schemaSettingWerehouse),
  });

  const locationType = watch('location_type');

  // handle check action type params
  const checkTypeAction = (action) => {
    switch (action) {
      case 'add':
        return setTextTypeAction('Tambah Gudang');
      case 'edit':
        return setTextTypeAction('Detail Gudang');
      default:
        return setTextTypeAction('');
    }
  };

  const handleSuccesSendData = async () => {
    setModalSucces(true);
    await UseDelay(2000);
    router.push('/pengaturan/gudang');
  };

  // handle submit form
  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);
      const requestBody = {
        client_id,
        pic: data.pic,
        phone: data.phone,
        location_code: data.location_code,
        location_name: data.location_name,
        ...(actionParams === 'add' && { location_type: data.location_type }),
        province_id: data.province_id,
        city_id: data.city_id,
        district_id: data.district_id,
        sub_district_id: data.sub_district_id,
        postal_code: data.postal_code,
        full_address: data.full_address,
      };

      const url =
        actionParams === 'add'
          ? addWerehouse(requestBody)
          : updateWerehouse(idSearch, requestBody);

      const res = await url;
      if (res?.status === 201 || res?.status === 200) {
        if (actionParams === 'add' && requestBody.location_type === '2') {
          setIsEthixSelected(true);
        } else {
          handleSuccesSendData();
        }
      }
    } catch (error) {
      // console.log("errrr", error);
      if (error.response) {
        const errorLocationName = error.response.data.errors?.trace[0];
        switch (errorLocationName) {
          case 'THE LOCATION NAME FOR THIS CLIENT ALREADY BEEN TAKEN.':
            setError('location_name', {
              type: 'manual',
              message: 'Nama Gudang sudah pernah dipakai',
            });
            break;
          case 'THE LOCATION CODE FOR THIS CLIENT ALREADY BEEN TAKEN.':
            setError('location_code', {
              type: 'manual',
              message: 'Kode Gudang sudah pernah dipakai',
            });
            break;
          default:
            setError('location_name', {
              type: 'manual',
              message: '',
            });
            break;
        }
      }
      // console.log("errrr", error);
    } finally {
      setLoadingButton(false);
    }
  };

  // fetch get ethix werehouse
  const fetchParseDatawerehouse = async () => {
   const response = await getEthixWerehouseLocation();
   setDataEthixWerehouse(response.data.location);
  };

  // fetch detail werehouse
  const fetchDataDetail = async (id) => {
    try {
      const response = await getDetailWerehouse(id);
      const dataResponse = response?.data?.location;

      if (response?.status === 200) {
        setDataDetail(dataResponse);
        setTemporaryDataEdit(dataResponse);
        setValue('pic', dataResponse?.pic, { shouldValidate: true });
        setValue('phone', dataResponse?.phone, { shouldValidate: true });
        setValue('location_code', dataResponse?.location_code, { shouldValidate: true });
        setValue('location_name', dataResponse?.location_name, { shouldValidate: true });
        setValue('location_type', dataResponse?.location_type, { shouldValidate: true });
        setValue('province_id', dataResponse?.province_id, { shouldValidate: true });
        setValue('city_id', dataResponse?.city_id, { shouldValidate: true });
        setValue('district_id', dataResponse?.district_id, { shouldValidate: true });
        setValue('sub_district_id', dataResponse?.sub_district_id, { shouldValidate: true });
        setValue('postal_code', dataResponse?.postal_code, { shouldValidate: true });
        setValue('full_address', dataResponse?.full_address, { shouldValidate: true });
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // handle check condition if have value and wanna back to list werehouse
  const handleBackButton = () => {
    const formValues = watch();
    const hasValue = Object.values(formValues).some(
      (value) => value?.length > 0
    );
    if (actionParams === 'add') {
      if (hasValue) {
        setModalConfirmation(true);
      } else {
        clearErrors();
        router.push('/pengaturan/gudang');
      }
    } else {
      const isDataChanged = Object.keys(formValues).some(
        (key) => formValues[key] !== temporaryDataEdit[key]
      );
      if (isDataChanged) {
        clearErrors();
        setModalConfirmation(true);
      } else {
        router.push('/pengaturan/gudang');
      }
    }
  };

  // handle check disable button
  const handleDisableButton = () => {
    if (actionParams === 'edit') {
      const formValues = watch();
      const isDataChanged = Object.keys(formValues).every(
        (key) => formValues[key] !== '' && temporaryDataEdit[key]
      );
      setIsDisabledButton(!isDataChanged);
    }
  };

  // handle confirm back to list werehouse or stay in form werehouse
  const handleClickCancelled = () => setModalConfirmation(false);
  const handleClickYes = () => router.push('/pengaturan/gudang');
  const handleClickConfirmisEthix = () => {
    setIsEthixSelected(false);
    handleSuccesSendData();
  };

  //  handle go to activity history
  const handleClickActivityHistory = (id) => {
    router.push({
      pathname: '/pengaturan/gudang/activity-history',
      query: { id },
    });
  };

  //  handle on change warehouse
  const handleOnchangeTypeWarehouse = (e) => {
    const { value } = e.target;
    setValue('location_type', value);
    trigger('location_type');
  };

  // fetch get province
  const fetchGetProvince = async () => {
    try {
      const res = await getProvince();
      setDataProvince(res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    }
  };

  // fetch get cities
  const fetchGetCities = async () => {
    try {
      const res = await getCities(provinceId || dataDetail?.province_id);
      setDataCities(res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    } finally {
      setLoadingField(false);
    }
  };

  // fetch get district
  const fetchGetDistrict = async () => {
    try {
      const res = await getDistricts(citiesId || dataDetail?.city_id);
      setDataDistricts(res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    } finally {
      setLoadingField(false);
    }
  };

  // fetch get subdistrict
  const fetchGetSubDistrict = async () => {
    try {
      const res = await getSubDistricts(districtsId || dataDetail?.district_id);
      setDataSubDistricts(res.data);
      // console.log("ressss", res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    } finally {
      setLoadingField(false);
    }
  };

  // get parse data for ethix werehouse
  useEffect(() => {
    if (locationType === 2) {
      fetchParseDatawerehouse();
    }
  }, [locationType]);

  // get province
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      fetchGetProvince();
    } else {
      fetchGetProvince();
      setIsDisabledCities(true);
      setDisabledDistricts(true);
      setDisabledSubDistricts(true);
    }
  }, []);

  // get cities
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      if (dataDetail?.province_id) {
        fetchGetCities();
      }
      setIsDisabledCities(!dataDetail?.province_id);
      setDisabledDistricts(true);
      clearErrors('city_id');
      setDisabledSubDistricts(true);
    } else {
      if (provinceId) {
        fetchGetCities();
      }
      setIsDisabledCities(!provinceId);
      setDisabledDistricts(true);
      clearErrors('city_id');
      setDisabledSubDistricts(true);
    }
  }, [provinceId, dataDetail?.province_id]);

  // get district
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      if (dataDetail?.city_id) {
        fetchGetDistrict();
      }
      setDisabledDistricts(!dataDetail?.city_id);
      setDisabledSubDistricts(true);
      clearErrors('district_id');
    } else {
      if (citiesId) {
        fetchGetDistrict();
      }
      setDisabledDistricts(!citiesId);
      setDisabledSubDistricts(true);
      clearErrors('district_id');
    }
  }, [citiesId, dataDetail?.city_id]);

  // get sub district
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      if (dataDetail?.district_id) {
        fetchGetSubDistrict();
      }
      setDisabledSubDistricts(!dataDetail?.district_id);
      clearErrors('sub_district_id');
    } else {
      if (districtsId) {
        fetchGetSubDistrict();
      }
      setDisabledSubDistricts(!districtsId);
      clearErrors('sub_district_id');
    }
  }, [districtsId, dataDetail?.district_id]);

  // check query
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      fetchDataDetail(idSearch);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (actionParams) return checkTypeAction(actionParams);
  }, [actionParams]);

  useEffect(() => {
    handleDisableButton();
  }, [watch(), temporaryDataEdit]);

  return (
    <>
      <Head title="Gudang" />
      <Content>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper-bg-light">
            <p className="text-primary" style={{ fontSize: 12 }}>
              PENGATURAN&nbsp; / &nbsp;GUDANG&nbsp; / &nbsp;
              <span style={{ color: '#BDC0C7' }}>{textTypeAction}</span>
            </p>
            <BlockTitle fontSize={32}>
              {textTypeAction}
            </BlockTitle>
            <p
              style={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: '20px',
                color: '#4C4F54'
              }}>
              Informasi gudang ini akan digunakan oleh kurir saat melakukan pickup.
            </p>
            {/* row warehouse */}
            <Row>
              <Col md="6">
                <FormGroup className="mb-4">
                  <Label htmlFor="name" className="fw-bold">
                    Nama Penanggung Jawab
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="pic"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <FormInput
                            {...field}
                            invalid={Boolean(errors?.pic)}
                            name="pic"
                            register={register}
                            placeholder="Masukkan Nama Penanggung Jawab"
                            className="shadow-none"
                            value={value}
                            onChange={(e) => {
                              setValue('pic', e.target.value);
                              onChange(e.target.value);
                              trigger('pic');
                            }}
                            maxLength={150}
                          />
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['pic']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup className="mb-4">
                  <Label htmlFor="no_handphone" className="fw-bold">
                    No. Handphone Penanggung Jawab
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <InputGroup>
                    <InputGroupText
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: 12,
                      }}
                    >
                      +62
                    </InputGroupText>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => {
                        const { onChange, value } = field;
                        return (
                          <>
                            <Input
                              {...field}
                              value={value}
                              onChange={(e) => {
                                setValue('phone', e.target.value);
                                onChange(e.target.value);
                                trigger('phone');
                              }}
                              onInput={(e) => {
                                let inputValue = e.target.value;
                                inputValue = inputValue.replace(/^0+/, '');
                                e.target.value = inputValue
                                  .slice(0, 13)
                                  .replace(/[^0-9]/g, '');
                              }}
                              invalid={!!errors.phone}
                              type="text"
                              className="field-input-border-primary shadow-none"
                              placeholder="Masukkan Nomor Handphone"
                            />
                          </>
                        );
                      }}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors.phone?.message}
                      </span>
                    </FormFeedback>
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup className="mb-4">
                  <Label htmlFor="werehouse_code" className="fw-bold">
                    Kode Gudang<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="location_code"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <FormInput
                            {...field}
                            invalid={Boolean(errors?.location_code)}
                            name="location_code"
                            register={register}
                            disabled={actionParams === 'add' ? false : true}
                            placeholder="Masukkan Kode Gudang"
                            className="shadow-none"
                            value={value}
                            onChange={(e) => {
                              setValue('location_code', e.target.value);
                              onChange(e.target.value);
                              trigger('location_code');
                            }}
                            maxLength={40}
                          />
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['location_code']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="4">
                <FormGroup className="mb-4">
                  <div className="d-flex">
                    <Label htmlFor="werehouse_name" className="fw-bold">
                      Nama Gudang<span style={{ color: '#FF6E5D' }}>*</span>
                    </Label>
                    <div style={{ marginLeft: 1 }}>
                      <Button type="button" size="sm" className="p-0">
                        <Icon
                          name="info"
                          id="info"
                          style={{ color: '#e9e9ea' }}
                        />
                      </Button>
                      <Tooltip
                        placement="right"
                        isOpen={tooltipOpen}
                        target="info"
                        toggle={toggle}
                        style={{
                          padding: '10px 15px 10px 15px',
                          fontSize: 12,
                          color: '#4C4F54',
                          textAlign: 'left',
                          marginTop: 30,
                        }}
                      >
                        Nama gudang dapat diisi <br />
                        panggilan toko atau gudang mu
                      </Tooltip>
                    </div>
                  </div>
                  <Controller
                    name="location_name"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                        {locationType === 2 ? (
                          <> 
                            <Select
                            {...field}
                            value={
                              dataEthixWerehouse?.find(
                                (option) => option.name === value
                              ) || null
                            }
                            register={register}
                            options={dataEthixWerehouse}
                            getOptionLabel={(option) =>
                              option.name
                            }
                            getOptionValue={(option) => option.name}
                            onChange={(selectedOption) => {
                                setProvinceId(selectedOption?.province_id);
                                setCitiesId(selectedOption?.city_id);
                                setDistrictsId(selectedOption?.district_id);
                                // set value form
                                setValue('location_name', selectedOption?.name);
                                setValue('province_id', selectedOption?.province_id);
                                setValue('city_id', selectedOption?.city_id);
                                setValue('district_id', selectedOption?.district_id);
                                setValue('sub_district_id', selectedOption?.subdistrict_id);
                                setValue('postal_code', selectedOption?.postcode);
                                setValue('full_address', selectedOption?.address);
                                setValue('location_code', selectedOption?.code);
                                trigger(['location_name','province_id', 'city_id', 'district_id', 'sub_district_id', 'postal_code', 'full_address', 'location_code']);
                                onChange(selectedOption?.name);
                                setLoadingField(true);
                            }}
                            isValid={!!errors.location_name}
                            isDisabled={false}
                            placeholderText={'Masukkan Nama Gudang'}
                          />
                           <span
                              className="text-danger position-absolute"
                              style={{ fontSize: 12 }}
                            >
                              {errors['location_name']?.message}
                            </span>
                          </>
                        ) : (
                          <> 
                            <FormInput
                              {...field}
                              invalid={Boolean(errors?.location_name)}
                              name="location_name"
                              register={register}
                              placeholder="Masukkan Nama Gudang"
                              className="shadow-none"
                              value={value}
                              onChange={(e) => {
                                setValue('location_name', e.target.value);
                                onChange(e.target.value);
                                trigger('location_name');
                              }}
                              maxLength={150}
                            />
                          </>
                        )}
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors?.location_name?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="4">
                <Label htmlFor="werehouse_type" className="fw-bold">
                  Tipe Gudang<span style={{ color: '#FF6E5D' }}>*</span>
                </Label>
                <FormGroup className="mb-4">
                  <Controller
                    name="location_type"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <DropdownOption
                            {...field}
                            value={value}
                            disabled={actionParams === 'add' ? false : true}
                            register={register}
                            onChange={(e) => {
                                setProvinceId();
                                setCitiesId();
                                setDistrictsId();
                                // set value form
                                setValue('location_name','');
                                setValue('province_id', '');
                                setValue('city_id', '');
                                setValue('district_id', '');
                                setValue('sub_district_id', '');
                                setValue('postal_code', '');
                                setValue('full_address', '');
                                setValue('location_code', '');
                                clearErrors();
                                handleOnchangeTypeWarehouse(e);
                                setLoadingField(false);
                                onChange(e.target.value);
                            }}
                            itemTemplate={optionWerehouse}
                            className={errors.location_type ? 'p-invalid' : ''}
                            options={getWerehouse}
                            optionLabel={'name'}
                            placeholder={'Pilih Tipe Gudang'}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors.location_type?.message}
                  </span>
                </FormGroup>
              </Col>
            </Row>
            {/* row location warehouse */}
            <Row>
              <Col sm="12" lg="4">
                <FormGroup>
                  <Label htmlFor="province" className="fw-bold">
                    Provinsi<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="province_id"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <Select
                            {...field}
                            value={
                              dataProvince.find(
                                (option) => option.province_id === value
                              ) || null
                            }
                            register={register}
                            options={dataProvince}
                            getOptionLabel={(option) =>
                              specialCapitalizeFirstLetter(option.province_name)
                            }
                            getOptionValue={(option) => option.province_id}
                            onChange={(selectedOption) => {
                              setProvinceId(selectedOption?.province_id);
                              setValue(
                                'province_id',
                                selectedOption?.province_id
                              );
                              setValue('city_id', '');
                              setValue('district_id', '');
                              setValue('sub_district_id', '');
                              trigger('province_id');
                              onChange(selectedOption?.province_id);
                            }}
                            isValid={!!errors.province_id}
                            placeholderText={'Pilih Provinsi'}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['province_id']?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="12" lg="4">
                <FormGroup>
                  <Label htmlFor="district" className="fw-bold">
                    Kabupaten/Kota<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="city_id"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        <>
                          <Select
                            {...field}
                            value={
                              dataCities.find(
                                (option) => option.city_id === value
                              ) || null
                            }
                            register={register}
                            options={dataCities}
                            getOptionLabel={(option) =>
                              capitalizeFirstLetter(option.city_name)
                            }
                            getOptionValue={(option) => option.city_id}
                            onChange={(selectedOption) => {
                              if (selectedOption?.city_id !== value) {
                                setCitiesId(selectedOption?.city_id);
                                setValue('city_id', selectedOption?.city_id);
                                setValue('district_id', '');
                                setValue('sub_district_id', '');
                                trigger('city_id');
                                onChange(selectedOption?.city_id);
                              }
                            }}
                            isValid={!!errors.city_id}
                            isDisabled={disabledCities || loadingField}
                            placeholderText={loadingField ? 'Mengambil data...' : 'Pilih Kabupaten/Kota'}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['city_id']?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="12" lg="4">
                <FormGroup>
                  <Label htmlFor="subdistrict" className="fw-bold">
                    Kecamatan<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="district_id"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <Select
                            {...field}
                            value={
                              dataDistricts.find(
                                (option) => option.district_id === value
                              ) || null
                            }
                            register={register}
                            options={dataDistricts}
                            getOptionLabel={(option) =>
                              capitalizeFirstLetter(option.district_name)
                            }
                            getOptionValue={(option) => option.district_id}
                            onChange={(selectedOption) => {
                              if (selectedOption?.district_id !== value) {
                                setDistrictsId(selectedOption?.district_id);
                                setValue(
                                  'district_id',
                                  selectedOption?.district_id
                                );
                                setValue('sub_district_id', '');
                                trigger('district_id');
                                onChange(selectedOption?.district_id);
                              }
                            }}
                            isValid={!!errors.district_id}
                            isDisabled={disabledDistricts || loadingField}
                            placeholderText={loadingField ? 'Mengambil data...' : 'Pilih Kecamatan'}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['district_id']?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="12" lg="6">
                <FormGroup>
                  <Label htmlFor="ward" className="fw-bold">
                    Kelurahan<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="sub_district_id"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <Select
                            {...field}
                            value={
                              dataSubDistricts.find(
                                (option) => option.sub_district_id === value
                              ) || null
                            }
                            register={register}
                            options={dataSubDistricts}
                            getOptionLabel={(option) =>
                              capitalizeFirstLetter(option.sub_district_name)
                            }
                            getOptionValue={(option) => option.sub_district_id}
                            onChange={(selectedOption) => {
                              if (selectedOption?.sub_district_id !== value) {
                                setValue(
                                  'sub_district_id',
                                  selectedOption?.sub_district_id
                                );
                                trigger('sub_district_id');
                                onChange(selectedOption?.sub_district_id);
                              }
                            }}
                            isValid={!!errors.sub_district_id}
                            isDisabled={disabledSubDistricts || loadingField}
                            placeholderText={loadingField ? 'Mengambil data...' : 'Pilih Kelurahan'}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['sub_district_id']?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="12" lg="6">
                <FormGroup className="mb-4">
                  <Label htmlFor="postal_code" className="fw-bold">
                    Kode Pos
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="postal_code"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <FormInput
                            {...field}
                            invalid={Boolean(errors?.postal_code)}
                            name="postal_code"
                            register={register}
                            placeholder="Masukkan Kode Pos"
                            className="shadow-none"
                            value={value}
                            onChange={(e) => {
                              setValue('postal_code', e.target.value);
                              onChange(e.target.value);
                              trigger('postal_code');
                            }}
                            onInput={(e) => {
                              let inputValue = e.target.value;
                              inputValue = inputValue
                                .slice(0, 5)
                                .replace(/[^0-9]/g, '');
                              e.target.value = inputValue;
                            }}
                            maxLength={5}
                          />
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['postal_code']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup className="mb-4">
                  <Label htmlFor="address details" className="fw-bold">
                    Detail Alamat
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="full_address"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <Input
                            {...field}
                            value={value}
                            invalid={Boolean(errors?.full_address)}
                            name="full_address"
                            register={register}
                            type="textarea"
                            placeholder="Masukkan Detail Alamat"
                            className="shadow-none"
                            style={{ resize: 'none' }}
                            onChange={(e) => {
                              setValue('full_address', e.target.value);
                              onChange(e.target.value);
                              trigger('full_address');
                            }}
                            maxLength={500}
                          />
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['full_address']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>

            <div
              className={`${typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                ? 'd-block'
                : 'd-none'
                }`}
            >
              <Button
                type="button"
                onClick={() =>
                  handleClickActivityHistory(dataDetail?.location_id)
                }
                className="p-0 mt-5 text-decoration-underline text-primary"
                style={{ fontSize: 12, fontWeight:'normal' }}
              >
                Lihat Riwayat Aktivitas
              </Button>
            </div>
            <div
              className={`${typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                ? 'd-flex justify-content-between'
                : ''
                }`}
            >
              <div
                className={`${typeof router.query.id !== 'undefined' &&
                  router.query.id !== null
                  ? 'd-flex align-items-center '
                  : 'd-none'
                  }`}
                style={{
                  paddingTop: 30,
                }}
              >
                <div className="d-flex">
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Waktu Dibuat:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {formatDateText(temporaryDataEdit?.created_at) ?? '-'}
                    </span>
                  </p>
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                      paddingLeft: 15,
                    }}
                  >
                    Terakhir Diperbarui:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {formatDateText(temporaryDataEdit?.updated_at) ?? '-'}
                    </span>
                  </p>
                </div>
              </div>
              <div
                style={{
                  gap: 16,
                  display: 'flex',
                  marginTop: 18,
                  justifyContent: 'end',
                }}
              >
                <Button
                  type="button"
                  className="justify-center"
                  style={{
                    height: 43,
                    width: 180,
                    fontSize: 14,
                    color: '#203864',
                  }}
                  onClick={handleBackButton}
                >
                  Kembali
                </Button>
                <Button
                  type={loadingButton ? 'button' : 'submit'}
                  disabled={!isValid || isDisabledButton}
                  className={`${!isValid || isDisabledButton
                    ? 'btn-disabled'
                    : 'btn-primary'
                    } justify-center`}
                  color="primary"
                  style={{ height: 43, width: 180, fontSize: 14 }}
                >
                  {loadingButton ? (
                    <Spinner size="sm" color="light" />
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Content>

      {isEthixSelected && (
        <ModalConfirm
          icon={contactus}
          widthImage={400}
          heightImage={380}
          modalContentStyle={{ width: 400, height: 380 }}
          modalBodyStyle={{
            width: 500,
            borderTopLeftRadius: '48%',
            borderTopRightRadius: '48%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            paddingLeft: 68,
            paddingRight: 68,
            marginLeft: '-50px',
            marginTop: '-130px',
            height: '210px',
            paddingTop: '50px',
            marginBottom: 13,
          }}
          title={'Penggunaan Gudang Ethix'}
          subtitle={
            'Untuk pengaturan lebih lanjut terkait penggunaan gudang ethix, silahkan hubungi tim support Bebas Kirim.'
          }
          textSingleButton={'Mengerti'}
          useTimer={false}
          singleButtonConfirmation
          handleClickYes={handleClickConfirmisEthix}
        />
      )}

      {modalConfirmation && (
        <ModalConfirm
          icon={verificationYesNo}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
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
            paddingTop: 0
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
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '135px',
          }}
          title={actionParams === 'add' ? textSuccesCreate : textSuccesEdit}
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

export default FormWerehouse;
