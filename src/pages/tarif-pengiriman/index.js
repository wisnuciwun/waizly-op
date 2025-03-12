//next
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

//component
import { Head, Icon, Button, BlockTitle } from '@/components';
import SelectWidthAsync from '@/components/atoms/select/select-shipping';

import { TableCourier } from '@/components/molecules/table/table-courier';

//layout
import Content from '@/layout/content/Content';

//third party
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';

// css style
// import styles from "@/assets/css/shipping-rate.module.css";

//utils
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

// redux & api
import { getDestination, getShipping } from '@/services/shipping';

function ShippingRate({}) {
  const [dataDestination, setDataDestination] = useState([]);
  const [dataShipping, setDataShipping] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const [noOptionMessage, setNoOptionMessage] = useState('');

  // schema validation
  const schema = yup.object().shape({
    delivery_area: yup
      .string()
      .required('Harap mengisi Daerah')
      .test(
        'no-leading-space',
        'Karakter pertama tidak boleh di awali dengan spasi',
        (value) => {
          if (value && /^\s/.test(value)) {
            return false;
          }

          return true;
        }
      ),
    recipient_area: yup
      .string()
      .required('Harap mengisi Daerah')
      .test(
        'no-leading-space',
        'Karakter pertama tidak boleh di awali dengan spasi',
        (value) => {
          if (value && /^\s/.test(value)) {
            return false;
          }

          return true;
        }
      ),
    weight: yup.string().required('Harap mengisi Berat Paket'),
    length: yup.string(),
    width: yup.string(),
    height: yup.string(),
  });

  // next route & next search params
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    clearErrors,
    setError,
    trigger,
    setValue,
    watch,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // handle submit form
  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);

      // // Check if either length, width, or height is filled
      const isAnyDimensionFilled = data.length || data.width || data.height;

      // // Check if any dimension is filled but others are not
      if (isAnyDimensionFilled && !(data.length && data.width && data.height)) {
        if (!data.length)
          setError('length', {
            message: 'Harap mengisi Panjang Paket',
          });
        if (!data.width)
          setError('width', {
            message: 'Harap mengisi Lebar Paket',
          });
        if (!data.height)
          setError('height', {
            message: 'Harap mengisi Tinggi Paket',
          });
        setLoadingButton(false);
        return;
      }

      const requestBody = {
        origin_code: isSwitched ? data.recipient_area : data.delivery_area,
        destination_code: isSwitched ? data.delivery_area : data.recipient_area,
        weight: data.weight,
        dimension: {
          width: data.width || null,
          length: data.length || null,
          height: data.height || null,
        },
      };

      const res = await getShipping(requestBody);
      if (res?.status === 200) {
        // console.log("resss", res?.data);
        setShowTable(true);
        setDataShipping(res?.data);
      }
    } catch (error) {
      // console.log("errrr", error);
      // if (error?.response?.status === 400) {
      //   router.push("/login");
      // }
    } finally {
      setLoadingButton(false);
    }
  };

  // fetch get destination
  const fetchGetDestination = async (inputValue) => {
    try {
      // Check if inputValue length is at least 3 characters
      if (inputValue.length >= 3) {
        setLoading(true);
        const res = await getDestination(inputValue);
        if (res?.status === 200) {
          setDataDestination(res?.data?.data);
          if (!res?.data?.data || res?.data?.data.length === 0) {
            setNoOptionMessage('Tidak terdapat lokasi yang di pilih');
          }
          setLoading(false);
          return res?.data?.data;
        }
      } else {
        // If input length is less than 3 characters, clear destination data
        setNoOptionMessage('Harap mengisi minimal 3 karakter');
        setDataDestination([]);
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        router.push('/login');
      }
      setLoading(false);
      return [];
    }
  };

  // handle if no option select
  const noOptionsMessage = () => {
    return noOptionMessage;
  };

  // handle switch
  const handleSwitchField = () => {
    setIsSwitched((prevIsSwitched) => !prevIsSwitched);
  };

  useEffect(() => {
    setNoOptionMessage('Harap mengisi minimal 3 karakter');
  }, []);

  return (
    <>
      <Head title="Shipping" />
      <Content>
        {/* form input */}
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper-bg-light">
          <BlockTitle className={'mb-4'} fontSize={32}>{'Tarif Pengiriman'}</BlockTitle>
            {/* <p className="text-header-xl" style={{ fontSize: 32 }}>
              Tarif Pengiriman
            </p> */}
            {/* row location */}
            {/* row label */}
            <Row className="d-none d-sm-flex">
              <Col sm="6">
                <Label htmlFor="delivery_area" className="fw-bold">
                  Daerah Asal
                  <span style={{ color: '#FF6E5D' }}>*</span>
                </Label>
              </Col>
              <Col sm="6">
                <Label
                  htmlFor="recipient_area"
                  className="fw-bold"
                  style={{ marginLeft: 29 }}
                >
                  Daerah Tujuan
                  <span style={{ color: '#FF6E5D' }}>*</span>
                </Label>
              </Col>
            </Row>
            <div className="d-flex justify-content-between flex-sm-row flex-column">
              <div className={`w-100 ${isSwitched ? 'order-2' : 'order-1'}`}>
                <FormGroup className="mb-4">
                  <Label
                    htmlFor="delivery_area"
                    className="fw-bold d-flex d-sm-none"
                  >
                    Daerah Pengiriman
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name={'delivery_area'}
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        <>
                          <SelectWidthAsync
                            {...field}
                            value={
                              isSwitched
                                ? dataDestination?.find(
                                    (option) =>
                                      option?.region_code ===
                                      watch('recipient_area')
                                  ) || null
                                : dataDestination?.find(
                                    (option) => option?.region_code === value
                                  ) || null
                            }
                            register={register}
                            isValid={!!errors.delivery_area}
                            getOptionValue={(option) => option?.region_code}
                            getOptionLabel={(option) => {
                              return `${capitalizeFirstLetter(
                                option.sub_district_name
                              )}, ${capitalizeFirstLetter(
                                option.district_name
                              )}, ${option.city_name}, ${capitalizeFirstLetter(
                                option.province_name
                              )}`;
                            }}
                            onChange={(selectedOption) => {
                              onChange(selectedOption?.region_code);
                              clearErrors('delivery_area');
                            }}
                            placeholderText={'Masukkan Daerah'}
                            noOptionsMessage={noOptionsMessage}
                            loadOptions={fetchGetDestination}
                            isLoading={loading}
                          />
                        </>
                      );
                    }}
                  />
                  <div
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['delivery_area']?.message}
                  </div>
                </FormGroup>
              </div>

              <div className={`w-100 ${isSwitched ? 'order-1' : 'order-2'}`}>
                <FormGroup className="mb-4">
                  <Label
                    htmlFor="recipient_area"
                    className="fw-bold d-flex d-sm-none"
                  >
                    Daerah Penerima
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="recipient_area"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        <>
                          <SelectWidthAsync
                            {...field}
                            value={
                              isSwitched
                                ? dataDestination?.find(
                                    (option) =>
                                      option?.region_code ===
                                      watch('delivery_area')
                                  ) || null
                                : dataDestination?.find(
                                    (option) => option?.region_code === value
                                  ) || null
                            }
                            register={register}
                            isValid={!!errors.recipient_area}
                            getOptionValue={(option) => option?.region_code}
                            getOptionLabel={(option) => {
                              return `${capitalizeFirstLetter(
                                option.sub_district_name
                              )}, ${capitalizeFirstLetter(
                                option.district_name
                              )}, ${option.city_name}, ${capitalizeFirstLetter(
                                option.province_name
                              )}`;
                            }}
                            onChange={(selectedOption) => {
                              onChange(selectedOption?.region_code);
                              clearErrors('recipient_area');
                            }}
                            placeholderText={'Masukkan Daerah'}
                            noOptionsMessage={noOptionsMessage}
                            loadOptions={fetchGetDestination}
                            isLoading={loading}
                          />
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors['recipient_area']?.message}
                  </span>
                </FormGroup>
              </div>
              <div
                className={`align-self-center text-center d-none d-sm-block ${
                  isSwitched ? 'order-1' : 'order-1'
                }`}
                style={{ marginTop: -23 }}
              >
                <Button size="xl" type="button" onClick={handleSwitchField}>
                  <Icon
                    name="exchange"
                    style={{ color: '#203864', fontSize: 20 }}
                  />
                </Button>
              </div>
            </div>

            {/* row dimensions */}
            <Row>
              <Col sm="3">
                <FormGroup className="mb-4">
                  <Label htmlFor="weight" className="fw-bold">
                    Berat Paket
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <div className="form-control-wrap">
                            <div className="form-icon form-icon-right">
                              <span style={{ fontSize: 12 }}>gram</span>
                            </div>
                            <Input
                              {...field}
                              invalid={Boolean(errors?.weight)}
                              name="weight"
                              register={register}
                              placeholder="Masukkan Berat Paket"
                              className="shadow-none"
                              value={value}
                              type="text"
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/^0/g, '')
                                  .replace(/\D/g, '');
                              }}
                              onChange={(e) => {
                                setValue('weight', e.target.value);
                                onChange(e.target.value);
                                trigger('weight');
                              }}
                              maxLength={6}
                            />
                          </div>
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors.weight?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup className="mb-4">
                  <Label htmlFor="length" className="fw-bold">
                    Panjang Paket
                  </Label>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <div className="form-control-wrap">
                            <div className="form-icon form-icon-right">
                              <span style={{ fontSize: 12 }}>cm</span>
                            </div>
                            <Input
                              {...field}
                              invalid={Boolean(errors?.length)}
                              name="length"
                              register={register}
                              placeholder="Masukkan Panjang Paket"
                              className="shadow-none"
                              value={value}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/^0/g, '')
                                  .replace(/\D/g, '');
                              }}
                              onChange={(e) => {
                                setValue('length', e.target.value);
                                onChange(e.target.value);
                                trigger('length');
                              }}
                              maxLength={4}
                            />
                          </div>
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors.length?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup className="mb-4">
                  <Label htmlFor="width" className="fw-bold">
                    Lebar Paket
                  </Label>
                  <Controller
                    name="width"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <div className="form-control-wrap">
                            <div className="form-icon form-icon-right">
                              <span style={{ fontSize: 12 }}>cm</span>
                            </div>
                            <Input
                              {...field}
                              invalid={Boolean(errors?.width)}
                              name="width"
                              register={register}
                              placeholder="Masukkan Lebar Paket"
                              className="shadow-none"
                              value={value}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/^0/g, '')
                                  .replace(/\D/g, '');
                              }}
                              onChange={(e) => {
                                setValue('width', e.target.value);
                                onChange(e.target.value);
                                trigger('width');
                              }}
                              maxLength={4}
                            />
                          </div>
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors.width?.message}
                  </span>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup className="mb-4">
                  <Label htmlFor="height" className="fw-bold">
                    Tinggi Paket
                  </Label>
                  <Controller
                    name="height"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <div className="form-control-wrap">
                            <div className="form-icon form-icon-right">
                              <span style={{ fontSize: 12 }}>cm</span>
                            </div>
                            <Input
                              {...field}
                              invalid={Boolean(errors?.height)}
                              name="height"
                              register={register}
                              placeholder="Masukkan Tinggi Paket"
                              className="shadow-none"
                              value={value}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/^0/g, '')
                                  .replace(/\D/g, '');
                              }}
                              onChange={(e) => {
                                setValue('height', e.target.value);
                                onChange(e.target.value);
                                trigger('height');
                              }}
                              maxLength={4}
                            />
                          </div>
                        </>
                      );
                    }}
                  />
                  <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                  >
                    {errors.height?.message}
                  </span>
                </FormGroup>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
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
                  'Periksa'
                )}
              </Button>
            </div>
          </div>
        </Form>

        {/* content table */}
        {showTable && (
          <div className="wrapper-bg-light mt-2">
            <TableCourier dataShipping={dataShipping} />
          </div>
        )}
      </Content>
    </>
  );
}

export default ShippingRate;
