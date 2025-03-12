// React and Next import
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// component
import {
  AuthFooter,
  Head,
  Row,
  Button,
  ModalConfirm,
  MultiSelectOption,
  DropdownOption,
} from '@/components';

// third party
import {
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
  Col,
  InputGroup,
  InputGroupText,
  FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

// utils
import { getChannel, getProduct, getLevelOrder } from '@/utils/getSelectOption';
import { clearEmojiInput } from '@/utils/formater';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import gifLogin from '@/assets/gift/profile-bisnis.gif';
import illustrationCompletepProfile from '@/assets/images/illustration/illustration-completep-profile.svg';

// redux & service
import { useSelector, useDispatch } from 'react-redux';
import { completeProfile } from '@/services/auth';
import { setUser } from '@/redux/action/auth';

const CompleteProfile = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  // next route
  const router = useRouter();

  // redux
  const dispatch = useDispatch();
  const { client_id, email } = useSelector((state) => state.auth.user);
  const dataUser = useSelector((state) => state.auth.user);
  const emailUser = email;
  const clientId = client_id;

  // validation
  const schema = yup.object().shape({
    businessOwnerName: yup
      .string()
      .required('Nama pemilik bisnis di perlukan')
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
    businessName: yup
      .string()
      .required('Nama bisnis di perlukan')
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
      .required('Nomor handphone di perlukan')
      .min(7, 'Masukan minimal 7 angka'),
    levelorder: yup.string().required('Pilih minimal 1 level order'),
    product: yup.array().required('Pilih minimal 1 product'),
    channel: yup.array().required('Pilih minimal 1 channel'),
  });

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await completeProfile({
        client_id: clientId,
        full_name: data.businessOwnerName,
        client_name: data.businessName,
        email: emailUser,
        phone: data.phone,
        level_order: data.levelorder,
        product_category: data.product,
        channel_category: data.channel,
      });
      
      dispatch(setUser({
        ...dataUser, 
        is_complete_profile: true, 
        full_name: data.businessOwnerName, 
        client_name: data.businessName
      }));
      setIsSuccess('success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          router.push('/login');
        }
      }
      // console.log("eerrorrr", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Complete Profile" />
      <div className="bg-img-complete-profile d-md-flex justify-content-md-center flex-md-column">
        <div className="container d-md-flex justify-content-md-center flex-md-column mt-md-auto">
          <div className="d-flex justify-content-center pt-5 pt-md-3">
            <Image
              src={illustrationCompletepProfile}
              width={130}
              className="d-none d-lg-flex"
              style={{ marginTop: 230, marginRight: -30, zIndex: 2 }}
              alt="illustration"
            />
            <div
              className="card shadow-sm rounded-5 p-4"
              style={{ maxWidth: 900, width: 900 }}
            >
              <div className="card-body">
                <div className="card-title d-flex justify-content-between">
                  <h4 className="text-color-primary fs-2">Profil Bisnis</h4>
                  <Image
                    src={waizlyLogo}
                    width={50}
                    height={50}
                    style={{ marginTop: '-10px' }}
                    alt="waizly-logo"
                  />
                </div>

                <p
                  className="card-text text-color-secondary"
                  style={{ marginTop: '-3px', width: 400 }}
                >
                  Sebelum mulai mengelola bisnismu, lengkapi profil bisnismu
                  terlebih dahulu ya!
                </p>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={5}>
                      <p
                        className="overline-title mt-1"
                        style={{ color: '#4C4F54', marginBottom: 38 }}
                      >
                        INFORMASI BISNIS
                      </p>

                      <FormGroup style={{ paddingTop: '6px' }}>
                        <Label
                          for="namabisnis"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Nama Pemilik Bisnis
                        </Label>

                        <Controller
                          name="businessOwnerName"
                          control={control}
                          render={({ field }) => {
                            const { onChange, value } = field;

                            return (
                              <>
                                <Input
                                  onChange={(event) =>
                                    onChange(event?.target?.value)
                                  }
                                  onInput={(e) => {
                                    clearEmojiInput(e);
                                  }}
                                  value={value}
                                  onFocus={() => {
                                    clearErrors('businessOwnerName');
                                  }}
                                  invalid={!!errors.businessOwnerName}
                                  {...field}
                                  className="shadow-none field-input-border-primary"
                                  id="businessOwnerName"
                                  placeholder="Masukkan Pemilik Bisnis"
                                  type="text"
                                  maxLength={50}
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
                            {errors.businessName?.message}
                          </span>
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup style={{ paddingTop: '6px' }}>
                        <Label
                          for="namabisnis"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Nama Bisnis
                        </Label>

                        <Controller
                          name="businessName"
                          control={control}
                          render={({ field }) => {
                            const { onChange, value } = field;

                            return (
                              <>
                                <Input
                                  onChange={(event) =>
                                    onChange(event?.target?.value)
                                  }
                                  onInput={(e) => {
                                    clearEmojiInput(e);
                                  }}
                                  value={value}
                                  onFocus={() => {
                                    clearErrors('businessName');
                                  }}
                                  invalid={!!errors.businessName}
                                  {...field}
                                  className="shadow-none field-input-border-primary"
                                  id="businessName"
                                  placeholder="Masukkan Nama Bisnis"
                                  type="text"
                                  maxLength={50}
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
                            {errors.businessName?.message}
                          </span>
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup style={{ paddingTop: '19px' }}>
                        <Label
                          for="email"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Email
                        </Label>
                        <Input
                          disabled={true}
                          defaultValue={emailUser}
                          className="shadow-none field-input-border-primary"
                          id="email"
                          name="email"
                          placeholder="Masukkan Email"
                          type="email"
                        />
                      </FormGroup>
                      <FormGroup style={{ paddingTop: '18px' }}>
                        <Label
                          for="phone"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          No. Handphone
                        </Label>
                        <InputGroup>
                          <InputGroupText
                            style={{ backgroundColor: 'transparent' }}
                          >
                            +62
                          </InputGroupText>
                          <Controller
                            control={control}
                            name="phone"
                            render={({ field }) => {
                              const { onChange, value } = field;
                              return (
                                <>
                                  <Input
                                    onChange={(event) =>
                                      onChange(event?.target?.value)
                                    }
                                    value={value}
                                    onFocus={() => {
                                      clearErrors('phone');
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
                                    invalid={!!errors.phone}
                                    {...field}
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Masukkan no handphone"
                                    className="shadow-none field-input-border-primary"
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
                    <Col
                      md={1}
                      className="center position-relative d-none d-md-flex"
                    >
                      <div
                        style={{
                          marginTop: -80,
                          borderLeft: '1.4px solid #E5E5E5',
                          height: '350px',
                        }}
                      ></div>
                    </Col>
                    <Col md={6}>
                      <h6
                        className="overline-title mt-1"
                        style={{ color: '#4C4F54' }}
                      >
                        DETAIL BISNIS
                      </h6>
                      <FormGroup className="mt-md-4">
                        <Label
                          for="levelorder"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Level Order
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#4C4F54',
                              fontWeight: 'normal',
                            }}
                          >
                            Berapa perkiraan jumlah order di bisnismu
                            perbulannya?
                          </p>
                        </Label>
                        <Controller
                          name="levelorder"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;
                            return (
                              <>
                                <DropdownOption
                                  value={value}
                                  onChange={(event) => {
                                    onChange(event?.target?.value);
                                  }}
                                  onFocus={() => {
                                    clearErrors('levelorder');
                                  }}
                                  className={
                                    errors.levelorder ? 'p-invalid' : ''
                                  }
                                  options={getLevelOrder}
                                  optionLabel={'name'}
                                  placeholder={'Pilih level order'}
                                />
                              </>
                            );
                          }}
                        />
                        <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.levelorder?.message}
                        </span>
                      </FormGroup>
                      <FormGroup>
                        <Label
                          for="product"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Produk
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#4C4F54',
                              fontWeight: 'normal',
                            }}
                          >
                            Apa saja jenis produk yang kamu jual?
                          </p>
                        </Label>
                        <Controller
                          name="product"
                          control={control}
                          render={({ field }) => {
                            return (
                              <>
                                <MultiSelectOption
                                  {...field}
                                  value={selectedProducts}
                                  onChange={(e) => {
                                    setSelectedProducts(e.value);
                                    field.onChange(e.value);
                                    clearErrors('product');
                                  }}
                                  onFocus={() => {
                                    clearErrors('product');
                                  }}
                                  className={errors.product ? 'p-invalid' : ''}
                                  option={getProduct}
                                  display={'chip'}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Product'}
                                />
                              </>
                            );
                          }}
                        />
                        <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.product?.message}
                        </span>
                      </FormGroup>
                      <FormGroup>
                        <Label
                          for="channel"
                          className="form-label fs-6 text-color-primary fw-bold"
                        >
                          Channel
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#4C4F54',
                              fontWeight: 'normal',
                            }}
                          >
                            Dimana saja kamu menjual produk tersebut?
                          </p>
                        </Label>
                        <Controller
                          name="channel"
                          control={control}
                          render={({ field }) => {
                            return (
                              <>
                                <MultiSelectOption
                                  {...field}
                                  value={selectedChannels}
                                  onChange={(e) => {
                                    setSelectedChannels(e.value);
                                    field.onChange(e.value);
                                    clearErrors('channel');
                                  }}
                                  onFocus={() => {
                                    clearErrors('channel');
                                  }}
                                  className={errors.channel ? 'p-invalid' : ''}
                                  option={getChannel}
                                  display={'chip'}
                                  optionLabel={'name'}
                                  placeholder={'Pilih Channel'}
                                />
                              </>
                            );
                          }}
                        />
                        <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.channel?.message}
                        </span>
                      </FormGroup>

                      <Button
                        size="lg"
                        className={`btn w-100 center shadow-none mt-5 ${
                          !isValid ||
                          !selectedProducts.length ||
                          !selectedChannels.length
                            ? 'btn-disabled'
                            : 'btn-primary'
                        }`}
                        type={
                          loading ||
                          !isValid ||
                          !selectedProducts.length ||
                          !selectedChannels.length
                            ? 'button'
                            : 'submit'
                        }
                        disabled={
                          !isValid ||
                          !selectedProducts.length ||
                          !selectedChannels.length
                        }
                      >
                        {loading &&
                        isValid &&
                        selectedProducts.length &&
                        selectedChannels.length ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          'Simpan'
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <AuthFooter />
        {isSuccess === 'success' && (
          <ModalConfirm
            icon={gifLogin}
            widthImage={350}
            heightImage={320}
            modalContentStyle={{ width: 350 }}
            modalBodyStyle={{
              width: 400,
              borderTopLeftRadius: '50%',
              borderTopRightRadius: '50%',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              marginLeft: '-25px',
              marginTop: '-125px',
              height: '135px',
              marginBottom: 13,
            }}
            title={'Selamat!'}
            subtitle={
              'Profil bisnismu sudah berhasil disimpan. Selamat mengelola bisnismu!'
            }
            stylesCustomTitle={{
              paddingTop: 0
            }}
            singleButtonConfirmation={false}
            textSingleButton={''}
          />
        )}
      </div>
    </>
  );
};

CompleteProfile.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default CompleteProfile;
