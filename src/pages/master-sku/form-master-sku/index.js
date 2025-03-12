/* eslint-disable react-hooks/exhaustive-deps */
//next
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

//component
import { Head, ModalConfirm } from '@/components';
import { Button } from '@/components';
import { FormInput } from '@/components/atoms/form-input';

//layout
import Content from '@/layout/content/Content';

//third party
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button as ButtonConnect,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Row,
  Spinner,
} from 'reactstrap';

//utils
import { UseDelay } from '@/utils/formater';
import UseCurrencyInput from '@/utils/useCurrencyInput';

//assets
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import ilustrationNoData from '@/assets/images/illustration/ilustration-nodata.svg';
import successGif from '@/assets/gift/success-create-sku.gif';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';

//api
import {
  createSingle,
  getDetailMasterSku,
  updateMasterSku,
} from '@/services/master';
import { handleErrorFormMasterSku } from '@/utils/errorsHandle';
import { handleInputNumeric } from '@/utils/handleInput';

const schema = yup.object().shape({
  name_sku: yup
    .string()
    .required('Harap isi Nama SKU')
    .max(255, 'Nama SKU maksimal 255 character')
    .transform((value) => value.trim()),
  code_sku: yup
    .string()
    .required('Harap isi Kode SKU')
    .max(50, 'Code SKU maksimal 50 character')
    .transform((value) => value.trim()),
  reference_price: yup
    .string()
    .nullable()
    .transform((defaultValue, valueChange) =>
      defaultValue === '' ? null : valueChange
    )
    .max(15, 'Harga Referensi maksimal 12 character'),
  product_weight: yup
    .string()
    .nullable()
    .transform((defaultValue, valueChange) =>
      defaultValue === '' ? null : valueChange
    )
    .max(8, 'Berat Produk maksimal 8 character'),
  product_length: yup
    .string()
    .max(8, 'Panjang Produk maksimal 8 character')
    .transform((value) => value.trim()),
  product_width: yup
    .string()
    .max(8, 'Lebar Produk maksimal 8 character')
    .transform((value) => value.trim()),
  product_height: yup
    .string()
    .max(8, 'Tinggi Produk maksimal 8 character')
    .transform((value) => value.trim()),
});

function FormMasterSKU({}) {
  const textSuccesCreate = 'Berhasil Menambahkan Master SKU!';
  const textSuccesEdit = 'Berhasil Memperbarui Master SKU!';

  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const idSearch = searchParams.get('id');

  const { user } = useSelector((state) => state.auth);

  const [textTypeAction, setTextTypeAction] = useState('');
  const [isDisabledButton, setIsDisabledButton] = useState(true);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [dataDetail, setDataDetail] = useState([]);
  const [modalSucces, setModalSucces] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [temporaryDataEdit, setTemporaryDataEdit] = useState({});
  const [placeHolderNull, setIsPlaceHolderNull] = useState({
    product_weight: true,
    product_length: true,
    product_width: true,
    product_height: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
    setValue,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const [
    showNameSku,
    showCodeSku,
    showProductHeight,
    showProductLength,
    showProductWeight,
    showProductWidth,
    showReferenceNumber,
  ] = watch([
    'name_sku',
    'code_sku',
    'product_height',
    'product_length',
    'product_weight',
    'product_width',
    'reference_price',
  ]);
  const isObjectErrorNull = Object.keys(errors).length === 0;

  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);
      const currencyPriceToNumber =
        data?.reference_price !== null
          ? parseInt(data?.reference_price.replaceAll('.', ''))
          : 0;
      const requestBody = {
        name: data?.name_sku,
        sku: data?.code_sku,
        barcode: data?.code_sku,
        reference_price: currencyPriceToNumber,
        weight: Boolean(data?.product_weight)
          ? parseInt(data?.product_weight)
          : 0,
        length: Boolean(data?.product_length)
          ? parseInt(data?.product_length)
          : 0,
        width: Boolean(data?.product_width) ? parseInt(data?.product_width) : 0,
        height: Boolean(data?.product_height)
          ? parseInt(data?.product_height)
          : 0,
        client_id: user?.client_id,
      };

      const url =
        actionParams === 'add'
          ? createSingle(requestBody)
          : updateMasterSku(idSearch, requestBody);
      const response = await url;
      if (response?.status === 201 || response?.status === 200) {
        setModalSucces(true);
        await UseDelay(2000);
        router.push('/master-sku');
      }
    } catch (error) {
      handleErrorFormMasterSku(error, data, setError);
    } finally {
      setLoadingButton(false);
    }
  };

  const checkTypeAction = (action) => {
    switch (action) {
      case 'add':
        return setTextTypeAction('Tambah Single SKU');
      case 'edit':
        return setTextTypeAction('Detail Master SKU');
      default:
        return setTextTypeAction('');
    }
  };

  const handledimensionFill = () => {
    if (
      showProductLength?.length > 0 ||
      showProductWidth?.length > 0 ||
      showProductHeight?.length > 0
    ) {
      if (!showProductHeight) {
        setError('product_height', {
          type: 'manual',
          message: 'Harap mengisi Tinggi Produk',
        });
      } else {
        clearErrors('product_height');
      }
      if (!showProductWidth) {
        setError('product_width', {
          type: 'manual',
          message: 'Harap mengisi Lebar Produk',
        });
      } else {
        clearErrors('product_width');
      }
      if (!showProductLength) {
        setError('product_length', {
          type: 'manual',
          message: 'Harap mengisi Panjang Produk',
        });
      } else {
        clearErrors('product_length');
      }
    } else {
      clearErrors();
    }
  };

  useEffect(() => {
    handledimensionFill();
  }, [
    showProductWidth?.length,
    showProductHeight?.length,
    showProductLength?.length,
  ]);

  const handleBackButton = () => {
    if (actionParams === 'add') {
      if (
        showNameSku?.length > 0 ||
        showCodeSku?.length > 0 ||
        showProductHeight?.length > 0 ||
        showProductLength?.length > 0 ||
        showProductWeight?.length > 0 ||
        showProductWidth?.length > 0 ||
        showReferenceNumber?.length > 0
      )
        return clearErrors, setModalConfirmation(true);
      return router.push('/master-sku');
    } else {
      if (
        showNameSku?.length !== temporaryDataEdit?.product_name?.length ||
        showCodeSku?.length !== temporaryDataEdit?.sku?.length ||
        showProductWeight?.length !=
          temporaryDataEdit?.weight_in_gram?.toString()?.length ||
        (showReferenceNumber?.length !=
          temporaryDataEdit?.price?.toString()?.length &&
          showReferenceNumber.length > 0) ||
        (showProductHeight?.length !=
          temporaryDataEdit?.dimension?.height?.toString()?.length &&
          showProductHeight.length > 0) ||
        (showProductLength?.length !=
          temporaryDataEdit?.dimension?.length?.toString()?.length &&
          showProductLength.length > 0) ||
        (showProductWidth?.length !=
          temporaryDataEdit?.dimension?.width?.toString()?.length &&
          showProductWidth.length > 0)
      )
        return clearErrors, setModalConfirmation(true);
      return router.push('/master-sku');
    }
  };

  const handleClickCancelled = () => setModalConfirmation(false);
  const handleClickYes = () => router.push('/master-sku');

  const checkDisableButton = () => {
    if (actionParams === 'add') {
      if (isObjectErrorNull && showNameSku && showCodeSku)
        return setIsDisabledButton(false);
      return setIsDisabledButton(true);
    } else {
      if (
        (showNameSku !== temporaryDataEdit?.product_name ||
          showCodeSku !== temporaryDataEdit?.sku ||
          showProductWeight != temporaryDataEdit?.weight_in_gram?.toString() ||
          showReferenceNumber != temporaryDataEdit?.price?.toString() ||
          showProductHeight !=
            temporaryDataEdit?.dimension?.height?.toString() ||
          showProductLength !=
            temporaryDataEdit?.dimension?.length?.toString() ||
          showProductWidth !=
            temporaryDataEdit?.dimension?.width?.toString()) &&
        isObjectErrorNull
      )
        return setIsDisabledButton(false);
      return setIsDisabledButton(true);
    }
  };

  const fetchDataDetail = async (id) => {
    try {
      const response = await getDetailMasterSku(id);
      const dataResponse = response?.data?.product;

      if (response?.status === 200) {
        setDataDetail(dataResponse);
        setTemporaryDataEdit(dataResponse);
        setValue('name_sku', dataResponse?.product_name);
        setValue('code_sku', dataResponse?.sku);
        setValue('reference_price', dataResponse?.price?.toString());
        dataResponse?.weight_in_gram !== 0
          ? setValue('product_weight', dataResponse?.weight_in_gram?.toString())
          : setIsPlaceHolderNull((prevState) => ({
              ...prevState,
              product_weight: false,
            }));
        dataResponse?.dimension?.length !== 0
          ? setValue(
              'product_length',
              dataResponse?.dimension?.length?.toString()
            )
          : setIsPlaceHolderNull((prevState) => ({
              ...prevState,
              product_length: false,
            }));
        dataResponse?.dimension?.width !== 0
          ? setValue(
              'product_width',
              dataResponse?.dimension?.width?.toString()
            )
          : setIsPlaceHolderNull((prevState) => ({
              ...prevState,
              product_width: false,
            }));
        dataResponse?.dimension?.height !== 0
          ? setValue(
              'product_height',
              dataResponse?.dimension?.height?.toString()
            )
          : setIsPlaceHolderNull((prevState) => ({
              ...prevState,
              product_height: false,
            }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //  handle go to activity history
  const handleClickActivityHistory = (id) => {
    router.push({
      pathname: '/master-sku/activity-history',
      query: { id },
    });
  };

  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      fetchDataDetail(idSearch);
    }
  }, [router.query.id]);

  useEffect(() => {
    checkDisableButton();
  }, [
    isObjectErrorNull,
    showNameSku,
    showCodeSku,
    showProductHeight,
    showProductLength,
    showProductWeight,
    showProductWidth,
    showReferenceNumber,
  ]);

  useEffect(() => {
    if (actionParams) return checkTypeAction(actionParams);
  }, [actionParams]);
  useEffect(() => {
    if (actionParams) return checkTypeAction(actionParams);
  }, [actionParams]);

  return (
    <>
      <Head title="Master SKU" />
      <Content>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper-bg-light">
            <p className="text-header-sm">
              MASTER SKU /{' '}
              <span className="text-header-sm-seconds">{textTypeAction}</span>
            </p>
            <p className="text-header-xl" style={{ fontSize: 32 }}>
              {textTypeAction}
            </p>
            <Row>
              <Col xs="4">
                <div className="wrapper-gif-camera">
                  <Image alt='image' src={ilustrationCamera} height={200} width={200} />
                </div>
              </Col>
              <Col xs="8">
                <FormGroup className="mb-4">
                  <Label htmlFor="name_sku">
                    Nama SKU<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <FormInput
                    invalid={Boolean(errors?.name_sku)}
                    name="name_sku"
                    register={register}
                    placeholder="Masukkan Nama SKU"
                    onChange={(e) => {
                      setValue('name_sku', e.target.value);
                      trigger('name_sku');
                    }}
                    maxLength={255}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['name_sku']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
                <FormGroup className="mb-4">
                  <Label htmlFor="code_sku">
                    Kode SKU<span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <FormInput
                    invalid={Boolean(errors?.code_sku)}
                    register={register}
                    name="code_sku"
                    placeholder="Masukkan Kode SKU"
                    onChange={(e) => {
                      setValue('code_sku', e.target.value);
                      trigger('code_sku');
                    }}
                    maxLength={50}
                    disabled={actionParams === 'edit'}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors['code_sku']?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
                <FormGroup className="mb-4">
                  <Label htmlFor="reference_price">Harga Referensi</Label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-left">
                      <span style={{ fontSize: 12 }}>Rp</span>
                    </div>
                    <FormInput
                      invalid={Boolean(errors?.reference_price)}
                      register={register}
                      name="reference_price"
                      placeholder="Masukkan Harga Referensi"
                      maxLength={15}
                      onInput={(e) => {
                        UseCurrencyInput(e, setValue, 'reference_price', 12);
                        trigger('reference_price');
                      }}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors['reference_price']?.message}
                      </span>
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm="12" lg="3">
                <FormGroup>
                  <Label htmlFor="product_weight" className="form-label">
                    Berat Produk
                  </Label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <span style={{ fontSize: 12 }}>gram</span>
                    </div>
                    <FormInput
                      invalid={Boolean(errors?.product_weight)}
                      placeholder={
                        placeHolderNull?.product_weight
                          ? 'Masukkan Berat Produk'
                          : '0'
                      }
                      register={register}
                      name="product_weight"
                      onChange={(e) => {
                        handleInputNumeric(e, setValue, 'product_weight', 8);
                        trigger('product_weight');
                      }}
                      maxLength={8}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors['product_weight']?.message}
                      </span>
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12" lg="3">
                <FormGroup>
                  <Label htmlFor="product_length" className="form-label">
                    Panjang Produk
                  </Label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <span style={{ fontSize: 12 }}>cm</span>
                    </div>
                    <FormInput
                      invalid={Boolean(errors?.product_length)}
                      placeholder={
                        placeHolderNull?.product_length
                          ? 'Masukkan Panjang Produk'
                          : '0'
                      }
                      register={register}
                      name="product_length"
                      onChange={(e) => {
                        handleInputNumeric(e, setValue, 'product_length');
                      }}
                      onBlur={() => handledimensionFill()}
                      maxLength={8}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors['product_length']?.message}
                      </span>
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12" lg="3">
                <FormGroup>
                  <Label htmlFor="product_width" className="form-label">
                    Lebar Produk
                  </Label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <span style={{ fontSize: 12 }}>cm</span>
                    </div>
                    <FormInput
                      invalid={Boolean(errors?.product_width)}
                      placeholder={
                        placeHolderNull?.product_width
                          ? 'Masukkan Lebar Produk'
                          : '0'
                      }
                      register={register}
                      name="product_width"
                      onChange={(e) => {
                        handleInputNumeric(e, setValue, 'product_width');
                      }}
                      onBlur={() => handledimensionFill()}
                      maxLength={8}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors['product_width']?.message}
                      </span>
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="12" lg="3">
                <FormGroup>
                  <Label htmlFor="product_height" className="form-label">
                    Tinggi Produk
                  </Label>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <span style={{ fontSize: 12 }}>cm</span>
                    </div>
                    <FormInput
                      placeholder={
                        placeHolderNull?.product_height
                          ? 'Masukkan Tinggi Produk'
                          : '0'
                      }
                      register={register}
                      name="product_height"
                      invalid={Boolean(errors?.product_height)}
                      onChange={(e) =>
                        handleInputNumeric(e, setValue, 'product_height')
                      }
                      onBlur={() => handledimensionFill()}
                      maxLength={8}
                    />
                    <FormFeedback>
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        {errors['product_height']?.message}
                      </span>
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <div style={{ marginTop: 40 }}>
              <p className="text-header-sm" style={{ fontSize: 14 }}>
                Hubungkan dengan Produk Toko
              </p>
              <p className="text-sub-connect-product" style={{ fontSize: 12 }}>
                Hubungkan Master SKU kamu dari Daftar Produk sehingga kamu dapat
                mengintegrasikan stok toko kamu
              </p>
              <div className="border-connect-product">
                <Image
                  src={ilustrationNoData}
                  width={150}
                  height={100}
                  alt="illustration"
                />
                <p className="text-header-text-sub-connect-product">
                  Kamu belum menghubungkan SKU Toko apa pun ke Master Produk ini
                </p>
                <ButtonConnect
                  disabled
                  className="btn-disabled"
                  color="primary"
                  style={{ height: 43 }}
                >
                  Hubungkan Produk Toko
                </ButtonConnect>
              </div>
            </div>

            <div
              className={`${
                typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                  ? 'd-block'
                  : 'd-none'
              }`}
            >
              <Button
                type="button"
                onClick={() =>
                  handleClickActivityHistory(dataDetail?.product_id)
                }
                className="p-0 mt-5 text-decoration-underline text-primary"
                style={{ fontSize: 12 }}
              >
                Lihat Riwayat Aktivitas
              </Button>
            </div>
            <div
              className={`${
                typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                  ? 'd-flex justify-content-between mt-3'
                  : ''
              }`}
            >
              <div
                className={` ${
                  typeof router.query.id !== 'undefined' &&
                  router.query.id !== null
                    ? 'd-flex justify-content-between align-items-center'
                    : 'd-none'
                }`}
              >
                <div
                  className="d-flex"
                  style={{
                    paddingTop: 12,
                  }}
                >
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Waktu Dibuat:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {temporaryDataEdit?.created_at ?? '-'}
                    </span>
                  </p>
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                      paddingLeft: 13,
                    }}
                  >
                    Terakhir Diperbarui:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {temporaryDataEdit?.updated_at ?? '-'}
                    </span>
                  </p>
                </div>
              </div>
              <div
                style={{
                  gap: 16,
                  display: 'flex',
                  justifyContent: 'end',
                  marginTop:
                    typeof router.query.id !== 'undefined' &&
                    router.query.id !== null
                      ? 0
                      : 30,
                }}
              >
                <Button
                  type="button"
                  className={'justify-center'}
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
                  type="submit"
                  disabled={isDisabledButton}
                  className={`${
                    isDisabledButton ? 'btn-disabled' : 'btn-primary'
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

export default FormMasterSKU;
