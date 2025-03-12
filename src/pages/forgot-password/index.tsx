/* eslint-disable react-hooks/exhaustive-deps */
// react and next import
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

// component
import {
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Spinner,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import {
  ButtonResetPassword,
  ModalPasswordSuccess,
  PasswordInputTooltip,
} from '@/components/molecules/auth';

// third party
import { AuthFooter, Head, Icon, Row } from '@/components';
import { FormInput } from '@/components/atoms/form-input';

//utils
import useDecrypt from '@/utils/decrptData';
import { UseDelay } from '@/utils/formater';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import ilustrationForgotPassword from '@/assets/images/illustration/ilustration-forgot-password.svg';

// api
import { reNewPassword, validateForgotPassword } from '@/services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  password: yup.string(),
  confirmationPassword: yup.string(),
});

function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [loadingToken, setLoadingToken] = useState<boolean>(false);
  const [passState, setPassState] = useState<boolean>(false);
  const [passConfirmationState, setPassConfirmationState] =
    useState<boolean>(false);
  const [showPassHelperText, setShowPassHelperText] = useState<boolean>(false);
  const [lengthPassword, setLengthPassword] = useState<boolean>(false);
  const [upperLowerCase, setUpperLowerCase] = useState<boolean>(false);
  const [containsNumber, setContainsNumber] = useState<boolean>(false);
  const [containsSymbol, setContainsSymbol] = useState<boolean>(false);
  const [isInputsFilled, setIsInputsFilled] = useState<boolean>(true);
  const [modalSucces, setModalSucces] = useState<boolean>(false);
  const [validateInputConfirmation, setValidateInputConfirmation] =
    useState<boolean>(false);
  const codeParams = searchParams.get('code');
  const userIdParams = searchParams.get('user_id');
  const decryptedUserId = useDecrypt(userIdParams, true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });
  const isPasswordsTyping = watch('password');
  const isPasswordsConfirmation = watch('confirmationPassword');

  const toggleTooltipPassword = () => {
    if (isPasswordsTyping?.length > 0) {
      if (
        lengthPassword &&
        upperLowerCase &&
        containsNumber &&
        containsSymbol
      ) {
        setShowPassHelperText(false);
      } else {
        setShowPassHelperText(true);
      }
    } else {
      setShowPassHelperText(false);
    }
  };

  const validationInputPassword = (isPassword: string) => {
    isPassword?.length > 7 ? setLengthPassword(true) : setLengthPassword(false);
    new RegExp('(?=.*[a-z])(?=.*[A-Z])').test(isPassword)
      ? setUpperLowerCase(true)
      : setUpperLowerCase(false);
    new RegExp('(?=.*[0-9])').test(isPassword)
      ? setContainsNumber(true)
      : setContainsNumber(false);
    new RegExp('(?=.*[-!$%^&*()@#_+|~=`{}\\[\\]:";\'<>?,.\\/])').test(
      isPassword
    )
      ? setContainsSymbol(true)
      : setContainsSymbol(false);
  };

  const checkConfirmationPassword = (passwordConfirmation: string) => {
    if (Boolean(passwordConfirmation)) {
      if (passwordConfirmation === isPasswordsTyping) {
        clearErrors('confirmationPassword');
        setValidateInputConfirmation(false);
      } else if (passwordConfirmation !== isPasswordsTyping) {
        setError('confirmationPassword', {
          type: 'manual',
          message: 'Konfirmasi kata sandi tidak cocok',
        });
        setValidateInputConfirmation(true);
      }
    }
  };

  const checkInputsDisabledButton = (validate: boolean) => {
    if (
      Boolean(isPasswordsConfirmation) &&
      Boolean(isPasswordsTyping) &&
      !validate
    )
      return setIsInputsFilled(false);
    return setIsInputsFilled(true);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const requestBodyData = {
        user_id: decryptedUserId,
        unique_code: codeParams,
        password: data?.password,
        confirm_password: data?.confirmationPassword,
      };
      const response = await reNewPassword(requestBodyData);
      if (response?.status === 200) {
        setModalSucces((prev) => !prev);
        await UseDelay(2000);
        router.push('/login');
      }
    } catch (error: any) {
      const errorType = error.response.data.error?.type;
      setValidateInputConfirmation(true);
      switch (errorType) {
        case 'ACTIVATION_CODE_EXPIRED':
          setError('confirmationPassword', {
            type: 'manual',
            message: 'Token Kedaluwarsa',
          });
          break;
        case 'OTP_CODE_INCORRECT':
          setError('confirmationPassword', {
            type: 'manual',
            message: 'Token Salah',
          });
          break;
        default:
          setError('confirmationPassword', {
            type: 'manual',
          });
      }
    } finally {
      setLoading(false);
    }
  };

  const validationOtpCheck = async () => {
    try {
      setLoadingToken(true);
      const requestBodyData = {
        user_id: decryptedUserId,
        unique_code: codeParams,
      };
      await validateForgotPassword(requestBodyData);
    } catch (error: any) {
      const errorType = error.response.data.error?.type;
      switch (errorType) {
        case 'USER ID_CANNOT_BE_EMPTY':
        case 'UNIQUE CODE_CANNOT_BE_EMPTY':
        case 'USER ID_MUST_BE_EXISTS':
        case 'OTP_CODE_INCORRECT':
          return router.push('/404');
        case 'OTP_INVALID':
        case 'ACTIVATION_CODE_EXPIRED':
          return router.push('/error-token');
        default:
          return router.push('/verification-email');
      }
    } finally {
      setLoadingToken(false);
    }
  };

  useEffect(() => {
    if (Boolean(isPasswordsTyping)) {
      toggleTooltipPassword();
    }
    validationInputPassword(isPasswordsTyping);
  }, [
    isPasswordsTyping,
    lengthPassword,
    upperLowerCase,
    containsNumber,
    containsSymbol,
  ]);

  useEffect(() => {
    checkInputsDisabledButton(validateInputConfirmation);
  }, [validateInputConfirmation, isPasswordsConfirmation, isPasswordsTyping]);

  useEffect(() => {
    checkConfirmationPassword(isPasswordsConfirmation);
  }, [isPasswordsTyping]);

  useEffect(() => {
    if (
      typeof router?.query?.user_id !== 'undefined' &&
      router?.query?.user_id !== null &&
      typeof router?.query?.user_id !== 'undefined' &&
      router?.query?.unique_code !== null
    ) {
      validationOtpCheck();
    }
  }, [router?.query?.user_id, router?.query?.unique_code]);

  return (
    <>
      <Head title="Forgot Password" />
      {loadingToken ? (
        <div className="loading-wrapper ">
          <div className="loading-card ">
            <Spinner />
          </div>
        </div>
      ) : (
        <div className="bg-img-forgot-password d-flex justify-content-center flex-column">
          <div className="container d-flex justify-content-center flex-column mt-auto">
            <Row>
              <div className="col center">
                <div className="card mt-2 shadow-sm rounded-5 p-4 card-wrapper">
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between">
                      <h5 className="text-color-primary">Ubah Kata Sandi</h5>
                      <Image
                        src={waizlyLogo}
                        width={50}
                        height={50}
                        style={{ marginTop: '-13px' }}
                        alt="waizly-logo"
                      />
                    </div>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                      <FormGroup className="mb-3">
                        <Label htmlFor="password">Kata Sandi Baru</Label>
                        <div className="form-control-wrap">
                          <div
                            onClick={() => setPassState(!passState)}
                            className={`form-icon form-icon-right passcode-switch ${
                              passState ? 'is-hidden' : 'is-shown'
                            }`}
                          >
                            <Icon
                              name="eye"
                              className="passcode-icon icon-show"
                            />
                            <Icon
                              name="eye-off"
                              className="passcode-icon icon-hide"
                            />
                          </div>
                          <FormInput
                            type={passState ? 'text' : 'password'}
                            name="password"
                            placeholder="Masukkan Kata Sandi"
                            register={register}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const inputValue = e.target.value;
                              const sanitizedValue = inputValue.replace(
                                /\s/g,
                                ''
                              );
                              e.target.value = sanitizedValue;
                              toggleTooltipPassword();
                            }}
                            onFocus={toggleTooltipPassword}
                            onBlur={toggleTooltipPassword}
                            id="tooltipValidationPassword"
                            className={`form-control shadow-none field-input-border-primary ${
                              passState ? 'is-hidden' : 'is-shown'
                            }`}
                          />
                          <PasswordInputTooltip
                            showPassHelperText={showPassHelperText}
                            lengthPassword={lengthPassword}
                            upperLowerCase={upperLowerCase}
                            containsNumber={containsNumber}
                            containsSymbol={containsSymbol}
                          />
                        </div>
                      </FormGroup>

                      <FormGroup className="mb-4">
                        <Label htmlFor="confirmationPassword">
                          Konfirmasi Kata Sandi
                        </Label>
                        <div className="form-control-wrap">
                          <div
                            onClick={() =>
                              setPassConfirmationState(!passConfirmationState)
                            }
                            className={`form-icon form-icon-right passcode-switch ${
                              passConfirmationState ? 'is-hidden' : 'is-shown'
                            }`}
                          >
                            <Icon
                              name="eye"
                              className="passcode-icon icon-show"
                            />
                            <Icon
                              name="eye-off"
                              className="passcode-icon icon-hide"
                            />
                          </div>
                          <FormInput
                            type={passConfirmationState ? 'text' : 'password'}
                            name="confirmationPassword"
                            placeholder="Masukkan Kata Sandi"
                            register={register}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const inputValue = e.target.value;
                              const sanitizedValue = inputValue.replace(
                                /\s/g,
                                ''
                              );
                              e.target.value = sanitizedValue;
                              checkConfirmationPassword(sanitizedValue);
                            }}
                            invalid={validateInputConfirmation}
                            className={`form-control shadow-none field-input-border-primary ${
                              passConfirmationState ? 'is-hidden' : 'is-shown'
                            }`}
                          />
                          {validateInputConfirmation && (
                            <FormFeedback>
                              <span
                                className="text-danger position-absolute"
                                style={{ fontSize: 12 }}
                              >
                                {errors['confirmationPassword']?.message}
                              </span>
                            </FormFeedback>
                          )}
                        </div>
                      </FormGroup>

                      <ButtonResetPassword
                        isInputsFilled={isInputsFilled}
                        loading={loading}
                      />
                    </Form>
                  </div>
                </div>
              </div>
              <div className="col center d-none d-lg-flex">
                <Image
                  src={ilustrationForgotPassword}
                  width={500}
                  alt="illustration"
                />
              </div>
            </Row>
          </div>
          <AuthFooter />
          <ModalPasswordSuccess modalSucces={modalSucces} />
        </div>
      )}
    </>
  );
}

ForgotPassword.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;

export default ForgotPassword;
