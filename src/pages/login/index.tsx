/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// react and next import
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

// component
import {
  Head,
  Row,
  Icon,
  Button,
  AuthFooter,
} from '@/components';
import {
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
  FormFeedback,
} from 'reactstrap';
import { ModalSuccess } from '@/components/molecules/auth';

// third party
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import illustrationLogin from '@/assets/images/illustration/illustration-login.svg';

// redux & service
import { useDispatch } from 'react-redux';
import { login, getUser, accessPermissions } from '@/services/auth/index';
import { setMenu, setToken, setUser, setFirstLogin } from '@/redux/action/auth';
import { setEmail } from '@/redux/action/register';
import { AuthPayload, AuthResponseProps } from '@/utils/type/onboarding';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [passState, setPassState] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<string>('');
  const [isCompleteProfile, setIsCompleteProfile] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email('Pastikan email yang kamu masukkan aktif dan valid')
      .transform((value) => value.trim())
      .test(
        'valid-email',
        'Pastikan email yang kamu masukkan aktif dan valid',
        (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      )
      .required('  '),
    password: yup
      .string()
      .required(' ')
      .min(8, 'Kata sandi minimal 8 karakter'),
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });

  const validateEmail = async () => {
    await trigger('email');
  };

  const validatePassword = async () => {
    await trigger('password');
  };

  const handleRedirectVerif = (data: AuthPayload) => {
    dispatch(setEmail(data?.email));
    router.push('/verification-otp');
  };

  const fetchGetUser = async () => {
    const res = await getUser();
    setIsCompleteProfile(res.data.user.is_complete_profile);
    dispatch(setUser(res.data.user));
  };

  const getAccess = async () => {
    const menus = await accessPermissions();
    dispatch(setMenu(menus.data));
    dispatch(setFirstLogin(false));
  };

  const handleLogin = async (data: AuthPayload) => {
    try {
      setLoading(true);
      const response: AuthResponseProps = await login({
        email: data.email,
        password: data.password,
      });
      const token: string = response?.data?.token;
      setIsLogin('success');
      setTimeout(async () => {
        if (token) {
          dispatch(setFirstLogin(true));
          dispatch(setToken(token));
          await fetchGetUser();
          await getAccess();
          setTimeout(() => {
            setRedirect(true);
          }, 2000);
        }
      }, 2000);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const status: number = error.response.status;
        const errorForEmail: string = error.response.data.error?.type;
        const errorPassword: string = error.response.data.errors?.type;

        if (status === 400) {
          switch (errorForEmail) {
            case 'EMAIL_MUST_EXIST':
              setError('email', {
                type: 'manual',
                message: 'Email belum terdaftar',
              });
              break;
            case 'EMAIL_ALREADY_REGISTERED_AND_NOT_VERIFIED': 
              handleRedirectVerif(data);
              break;
            default:
              setError('email', {
                type: 'manual',
              });
              setError('password', {
                type: 'manual',
              });
              break;
          }
        } else if (status === 401) {
          switch (errorPassword) {
            case 'INCORRECT_PASSWORD':
              setError('password', {
                type: 'manual',
                message: 'Kata sandi salah',
              });
              break;
            case 'ACCOUNT_LOCKED':
              setError('email', {
                type: 'manual',
                message: 'Akun anda sudah terblokir',
              });
              setError('password', {
                type: 'manual',
                message: 'Akun anda sudah terblokir',
              });
              break;
            default:
              setError('email', {
                type: 'manual',
              });
              setError('password', {
                type: 'manual',
              });
              break;
          }
        }
      }
    }
  };

  const handleSetDefaultValue = () => {
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    console.log('emaulkdsds', email, password);
    setValue('email', email);
    setValue('password', password);
  };

  useEffect(() => {
    if (isLogin === 'success' && redirect) {
      const destination = isCompleteProfile
        ? '/dashboard'
        : '/complete-profile';
      router.push(destination);
    }
  }, [isLogin, redirect, isCompleteProfile, router]);

  useEffect(()=> {
    if(searchParams.get('email') || searchParams.get('password')) {
      handleSetDefaultValue();
    }
  }, [searchParams]);

  return (
    <>
      <Head title="Login" />
      <div className="bg-img-login d-flex justify-content-center flex-column">
        <div className="container d-flex justify-content-center flex-column mt-auto">
          <Row className="pb-3">
            <div className="col center">
              <div
                className="card mt-4 shadow-sm rounded-5 p-4"
                style={{ width: '480px' }}
              >
                <div className="card-body">
                  <div className="card-title d-flex justify-content-between">
                    <h5 className="text-color-primary fs-3">Masuk</h5>
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
                    style={{ marginTop: '-3px' }}
                  >
                    Menghadirkan kesempurnaan di setiap sentuhan dalam kemudahan
                    mengelola bisnismu!
                  </p>
                  <Form autocomplete="off" noValidate onSubmit={handleSubmit(handleLogin)}>
                    <FormGroup className="mb-4">
                      <Label
                        htmlFor="email"
                        className="form-label fs-6 text-color-primary"
                      >
                        Email
                      </Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => {
                          const { value } = field;
                          return (
                            <Input
                              autoComplete="disabled"
                              role="presentation"
                              value={value}
                              invalid={!!errors.email}
                              {...register('email')}
                              onChange={async (e) => {
                                setValue('email', e.target.value);
                                validateEmail();
                              }}
                              type="email"
                              className="shadow-none field-input-border-primary"
                              id="email"
                              placeholder="Masukkan Alamat Email"
                            />
                          );
                        }}
                      />
                      <FormFeedback>
                        <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors.email?.message}
                        </span>
                      </FormFeedback>
                    </FormGroup>
                    <FormGroup className="mb-4">
                      <Label
                        htmlFor="password"
                        className="fs-6 text-color-primary"
                      >
                        Kata Sandi
                      </Label>
                      <div className="form-control-wrap">
                        <a
                          href=""
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
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => {
                            const { value } = field;
                            return (
                              <Input
                                autoComplete="disabled"
                                role="presentation"
                                invalid={!!errors.password}
                                value={value}
                                {...register('password')}
                                onChange={(e) => {
                                  setValue('password', e.target.value);
                                  validatePassword();
                                }}
                                type={passState ? 'text' : 'password'}
                                id="password"
                                placeholder="Masukkan Kata Sandi"
                                className={`form-control shadow-none field-input-border-primary ${passState ? 'is-hidden' : 'is-shown'
                                  }`}
                              />
                            );
                          }}
                        />
                        <FormFeedback>
                          <span
                            className="text-danger position-absolute"
                            style={{ fontSize: 12 }}
                          >
                            {errors.password?.message}
                          </span>
                        </FormFeedback>
                      </div>
                    </FormGroup>
                    <p className="text-decoration-underline text-color-primary">
                      <Link href="/verification-email" className="text-reset">
                        Lupa Kata Sandi?
                      </Link>
                    </p>
                    <Button
                      size="lg"
                      className={`btn w-100 center shadow-none ${
                        !isValid ? 'btn-disabled' : 'btn-primary'
                      }`}
                      type={loading ? 'button' : 'submit'}
                      disabled={!isValid}
                    >
                      {loading ? <Spinner size="sm" color="light" /> : 'Masuk'}
                    </Button>
                  </Form>
                  <p className="mt-2 center text-nowrap">
                    Belum punya akun?&#160;
                    <Link
                      href="/register"
                      className="text-decoration-underline text-color-primary"
                    >
                      Buat akun baru
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col center d-none d-lg-flex">
              <Image src={illustrationLogin} width={600} alt="illustration" />
            </div>
          </Row>
        </div>
        <AuthFooter />
        <ModalSuccess isCompleteProfile={isCompleteProfile} isLogin={isLogin} />
      </div>
    </>
  );
};

Login.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;

export default Login;
