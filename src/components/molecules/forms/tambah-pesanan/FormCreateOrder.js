/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
//next
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';

//component
import { Head, ModalConfirm } from '@/components';
import {
  Button,
  DropdownOption,
  Block,
} from '@/components';
import { FormInput } from '@/components/atoms/form-input';

//layout
import Content from '@/layout/content/Content';

//third party
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  InputGroup,
  InputGroupText,
} from 'reactstrap';

//utils
import { UseDelay } from '@/utils/formater';
//assets
import successGif from '@/assets/gift/success-create-sku.gif';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';

// redux & api
import { useSelector } from 'react-redux';
// import {
//   getProvince,
//   getCities,
//   getDistricts,
//   getSubDistricts,
//   addWerehouse,
// } from "@/services/locations";

const schema = yup.object().shape({
  pic: yup
    .string()
    .required('Harap mengisi Nama Penanggung Jawab')
    .test(
      'no-leading-space',
      'karakter pertama tidak boleh di awali dengan space',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  phone: yup
    .string()
    .min(7, 'Masukan minimal 7 angka')
    .transform((value) => value.trim()),
  location_code: yup
    .string()
    .required('Harap mengisi Kode Gudang')
    .test(
      'no-leading-space',
      'karakter pertama tidak boleh di awali dengan space',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  location_name: yup
    .string()
    .required('Harap mengisi Nama Gudang')
    .test(
      'no-leading-space',
      'karakter pertama tidak boleh di awali dengan space',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  location_type: yup
    .string()
    .required('Harap mengisi Tipe Gudang')
    .transform((value) => value.trim()),
  province_id: yup
    .string()
    .required('Harap mengisi Provinsi')
    .transform((value) => value.trim()),
  city_id: yup
    .string()
    .required('Harap mengisi Kabupaten/Kota')
    .transform((value) => value.trim()),
  district_id: yup
    .string()
    .required('Harap mengisi Kecamatan')
    .transform((value) => value.trim()),
  sub_district_id: yup
    .string()
    .required('Harap mengisi Kelurahan')
    .transform((value) => value.trim()),
  postal_code: yup
    .string()
    .required('Harap mengisi Kode Pos')
    .min(5, 'Masukan minimal 5 angka')
    .transform((value) => value.trim()),
  full_address: yup
    .string()
    .required('Harap mengisi Detail Alamat')
    .test(
      'no-leading-space',
      'karakter pertama tidak boleh di awali dengan space',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    )
    .min(10, 'Masukan minimal 10 karakter'),
});

function FormWerehouse({}) {
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCities, setDataCities] = useState([]);
  const [dataDistricts, setDataDistricts] = useState([]);
  const [dataSubDistricts, setDataSubDistricts] = useState([]);
  const [textTypeAction, setTextTypeAction] = useState('');
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  // state location
  const [provinceId, setProvinceId] = useState();
  const [citiesId, setCitiesId] = useState();
  const [districtsId, setdistrictsId] = useState();

  // state disabled
  const [disabledCities, setIsDisabledCities] = useState(false);
  const [disabledDistricts, setDisabledDistricts] = useState(false);
  const [disabledSubDistricts, setDisabledSubDistricts] = useState(false);

  const [startDate, setStartDate] = useState(
    // setHours(setMinutes(new Date(), 0), 9),
  );

  // redux
  const { client_id } = useSelector((state) => state.auth.user);
  // next route & next search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const idSearch = searchParams.get('id');

  const textSuccesCreate = 'Berhasil Menambahkan Lokasi!';
  const textSuccesEdit = 'Berhasil Memperbarui Lokasi!';

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
    resolver: yupResolver(schema),
  });

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

  // handle submit form
  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);
      const res = await addWerehouse({
        client_id,
        pic: data.pic,
        phone: data.phone,
        location_code: data.location_code,
        location_name: data.location_name,
        location_type: data.location_type,
        province_id: data.province_id,
        city_id: data.city_id,
        district_id: data.district_id,
        sub_district_id: data.sub_district_id,
        postal_code: data.postal_code,
        full_address: data.full_address,
      });
      if (res?.status === 201 || res?.status === 200) {
        setModalSucces(true);
        await UseDelay(2000);
        router.push('/pengaturan/gudang');
      }
    } catch (error) {
      if (error.response) {
        const statusErr = error.response.status;
        const errorLocationName = error.response.data.errors.trace;

        if (statusErr === 400) {
          switch (errorLocationName) {
            case 'THE LOCATION NAME FOR THIS CLIENT ALREADY BEEN TAKEN.':
              setError('location_name', {
                type: 'manual',
                message: 'Name lokasi ini sudah di gunakan',
              });
              break;
            default:
              setError('location_name', {
                type: 'manual',
                message: 'Name lokasi ini sudah di gunakan',
              });
              break;
          }
        }
      }
      // console.log("errrr", error);
    } finally {
      setLoadingButton(false);
    }
  };

  // handle check condition if have value and wanna back to list werehouse
  const handleBackButton = () => {
    const formValues = watch();
    const hasValue = Object.values(formValues).some((value) => value !== '');
    if (actionParams === 'add') {
      if (hasValue) {
        setModalConfirmation(true);
      } else {
        clearErrors();
        router.push('/pengaturan/gudang');
      }
    }
  };

  // handle confirm back to list werehouse or stay in form werehouse
  const handleClickCancelled = () => setModalConfirmation(false);
  const handleClickYes = () => router.push('/pengaturan/gudang');

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
      const res = await getCities(provinceId);
      setDataCities(res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    }
  };

  // fetch get district
  const fetchGetDistrict = async () => {
    try {
      const res = await getDistricts(citiesId);
      setDataDistricts(res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    }
  };

  // fetch get subdistrict
  const fetchGetSubDistrict = async () => {
    try {
      const res = await getSubDistricts(districtsId);
      setDataSubDistricts(res.data);
      // console.log("ressss", res.data);
    } catch (error) {
      // console.log("errrror", error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    }
  };

  // get province
  useEffect(() => {
    fetchGetProvince();
    setIsDisabledCities(true);
    setDisabledDistricts(true);
    setDisabledSubDistricts(true);
  }, []);

  // get cities
  useEffect(() => {
    if (provinceId) {
      fetchGetCities();
    }
    setIsDisabledCities(!provinceId);
    setDisabledDistricts(true);
    clearErrors('city_id');
    setDisabledSubDistricts(true);
  }, [provinceId]);

  // get district
  useEffect(() => {
    if (citiesId) {
      fetchGetDistrict();
    }
    setDisabledDistricts(!citiesId);
    setDisabledSubDistricts(true);
    clearErrors('district_id');
  }, [citiesId]);

  // get sub district
  useEffect(() => {
    if (districtsId) {
      fetchGetSubDistrict();
    }
    setDisabledSubDistricts(!districtsId);
    clearErrors('sub_district_id');
  }, [districtsId]);

  // check query
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      // fetchDataDetail(idSearch);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (actionParams) return checkTypeAction(actionParams);
  }, [actionParams]);

  return (
    <>
      <Head title="Gudang" />
      <Content>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Block>
            <Row className="gy-5">
              <Col lg="8">
                <div className="wrapper-bg-light">
                  <p className="text-primary">
                    PENGATURAN&nbsp; / &nbsp;GUDANG&nbsp; / &nbsp;
                    <span style={{ color: '#BDC0C7' }}>{textTypeAction}</span>
                  </p>
                  <p className="text-header-xl" style={{ fontSize: 32 }}>
                    {textTypeAction}
                  </p>
                  {/* row warehouse */}
                  <Row>
                    <Col xs="4">
                      <Label htmlFor="werehouse_type" className="fw-bold">
                        Toko<span style={{ color: '#FF6E5D' }}>*</span>
                      </Label>
                      <FormGroup className="mb-4">
                        <Controller
                          name="location_type"
                          control={control}
                          render={({ field }) => {
                            // const { onChange, value } = field;

                            return (
                              <>
                                <DropdownOption
                                  {...field}
                                //   value={value}
                                //   register={register}
                                //   onChange={(e) => {
                                //     setValue("location_type", e.target.value);
                                //     onChange(e.target.value);
                                //     trigger("location_type");
                                //   }}
                                //   itemTemplate={optionWerehouse}
                                //   className={
                                //     errors.location_type ? "p-invalid" : ""
                                //   }
                                //   options={getWerehouse}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Nama Toko'}
                                />
                              </>
                            );
                          }}
                        />
                        {/* <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.location_type?.message}
                        </span> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="werehouse_code" className="fw-bold">
                          Channel<span style={{ color: '#FF6E5D' }}>*</span>
                        </Label>
                        <Controller
                          name="channel"
                          control={control}
                          render={({ field }) => {
                            // const { onChange, value } = field;

                            return (
                              <>
                                <FormInput
                                  {...field}
                                //   invalid={Boolean(errors?.channel)}
                                  name="channel"
                                  register={register}
                                  placeholder="TOKO OFFLINE"
                                  className="shadow-none"
                                  value="TOKO OFFLINE"
                                // //   onChange={(e) => {
                                // //     setValue("channel", e.target.value);
                                // //     onChange(e.target.value);
                                // //     trigger("channel");
                                // //   }}
                                //   maxLength={50}
                                  disabled
                                />
                              </>
                            );
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <Label htmlFor="werehouse_type" className="fw-bold">
                        Gudang Asal<span style={{ color: '#FF6E5D' }}>*</span>
                      </Label>
                      <FormGroup className="mb-4">
                        <Controller
                          name="original_location"
                          control={control}
                          render={({ field }) => {
                            // const { onChange, value } = field;

                            return (
                              <>
                                <DropdownOption
                                  {...field}
                                //   value={value}
                                //   register={register}
                                //   onChange={(e) => {
                                //     setValue("original_location", e.target.value);
                                //     onChange(e.target.value);
                                //     trigger("original_location");
                                //   }}
                                //   itemTemplate={optionWerehouse}
                                //   className={
                                //     errors.original_location ? "p-invalid" : ""
                                //   }
                                //   options={getWerehouse}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Nama Toko'}
                                />
                              </>
                            );
                          }}
                        />
                        {/* <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.original_location?.message}
                        </span> */}
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="werehouse_name" className="fw-bold">
                          Nama Pembeli<span style={{ color: '#FF6E5D' }}>*</span>
                        </Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => {
                            const { onChange, value } = field;

                            return (
                              <>
                                <FormInput
                                  {...field}
                                  invalid={Boolean(errors?.name)}
                                  name="name"
                                  register={register}
                                  placeholder="Masukkan Nama Pembeli"
                                  className="shadow-none"
                                  value={value}
                                  onChange={(e) => {
                                    setValue('name', e.target.value);
                                    onChange(e.target.value);
                                    trigger('name');
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
                            {errors?.location_name?.message}
                          </span>
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="no_handphone" className="fw-bold">
                          No. Handphone Pembeli
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
                                      inputValue = inputValue.replace(
                                        /^0+/,
                                        ''
                                      );
                                      e.target.value = inputValue
                                        .slice(0, 13)
                                        .replace(/[^0-9]/g, '');
                                    }}
                                    type="text"
                                    className="field-input-border-primary shadow-none"
                                  />
                                </>
                              );
                            }}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="werehouse_name" className="fw-bold">
                          Email Pembeli
                        </Label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => {
                            // const { onChange, value } = field;

                            return (
                              <>
                                <FormInput
                                  {...field}
                                //   invalid={Boolean(errors?.email)}
                                  name="email"
                                  register={register}
                                  placeholder="Masukkan Email Pembeli"
                                  className="shadow-none"
                                //   value={value}
                                //   onChange={(e) => {
                                //     setValue("email", e.target.value);
                                //     onChange(e.target.value);
                                //     trigger("email");
                                //   }}
                                  maxLength={150}
                                />
                              </>
                            );
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="werehouse_name" className="fw-bold">
                          Nomor Pesanan<span style={{ color: '#FF6E5D' }}>*</span>
                        </Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => {
                            const { onChange, value } = field;

                            return (
                              <>
                                <FormInput
                                  {...field}
                                //   invalid={Boolean(errors?.name)}
                                  name="name"
                                  register={register}
                                  placeholder="Masukkan Nama Pembeli"
                                //   className="shadow-none"
                                //   value={value}
                                //   onChange={(e) => {
                                //     setValue("name", e.target.value);
                                //     onChange(e.target.value);
                                //     trigger("name");
                                //   }}
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
                            {errors?.location_name?.message}
                          </span>
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                      <FormGroup className="mb-4">
                        <Label htmlFor="werehouse_name" className="fw-bold">
                          Waktu Pemesanan<span style={{ color: '#FF6E5D' }}>*</span>
                        </Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => {
                            const { onChange, value } = field;

                            return (
                              <>
                                <div className="form-control-wrap">
                                  <DatePicker
                                    {...field}
                                    //   invalid={Boolean(errors?.name)}
                                    name="name"
                                    register={register}
                                    placeholderText={'Pilih Tanggal'}
                                    className="form-control shadow-none"
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    // excludeDates={[new Date(), subDays(new Date(), 1)]}
                                    showTimeSelect
                                    filterTime={''}
                                    dateFormat="d/yyyy/h:mm"
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                    }}
                               
                                    //   value={value}
                                    //   onChange={(e) => {
                                    //     setValue("name", e.target.value);
                                    //     onChange(e.target.value);
                                    //     trigger("name");
                                    //   }}
                                  />
                                </div>
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
                                  invalid={Boolean(errors?.full_address)}
                                  name="full_address"
                                  register={register}
                                  type="textarea"
                                  placeholder="Masukkan Nomor Pesanan"
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
                    style={{
                      gap: 16,
                      display: 'flex',
                      marginTop: 20,
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
                      disabled={!isValid}
                      className={`${
                        !isValid ? 'btn-disabled' : 'btn-primary'
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
              </Col>
              <Col lg="4">
                <div className="wrapper-bg-light">
                  <Row>
                    <Col sm="12" lg="4">
                      <p className="fw-bold" style={{ fontSize: '12px' }}>
                        Pemasukan
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Block>
        </Form>
      </Content>

      {modalConfirmation && (
        <ModalConfirm
          icon={verificationYesNo}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
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
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
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
