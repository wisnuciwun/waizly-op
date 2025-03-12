/* eslint-disable react-hooks/exhaustive-deps */
// react and next import
import { useEffect, useState } from 'react';
import Image from 'next/image';

// component
import { AuthFooter, Icon } from '@/components';
import { Head, Row } from '@/components';
import { FormInput } from '@/components/atoms/form-input';
import {
  ModalRegistrationSuccess,
  PasswordInputTooltip,
  RegisterButton,
  RegistratioPageHeader,
} from '@/components/molecules/auth';

// third party
import * as yup from 'yup';
import { Form, Label, FormGroup, FormFeedback } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// asset
import ilustrationRegister from '@/assets/images/illustration/ilustration-register.svg';

// api
import { registerAccount } from '@/services/auth';

// layout
import BlankLayout from '@/layout/Index-nosidebar';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
  email: yup
    .string()
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
    .min(8, 'Password minimal 8 character')
    .max(25, 'Password maksimal 25 character'),
  confirmationPassword: yup.string(),
});

function RegisterAccount({}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassHelperText, setShowPassHelperText] = useState<boolean>(false);
  const [passState, setPassState] = useState<boolean>(false);
  const [passConfirmationState, setPassConfirmationState] =
    useState<boolean>(false);
  const [validateInputConfirmation, setValidateInputConfirmation] =
    useState<boolean>(false);
  const [lengthPassword, setLengthPassword] = useState<boolean>(false);
  const [upperLowerCase, setUpperLowerCase] = useState<boolean>(false);
  const [containsNumber, setContainsNumber] = useState<boolean>(false);
  const [containsSymbol, setContainsSymbol] = useState<boolean>(false);
  const [isInputsFilled, setIsInputsFilled] = useState<boolean>(true);
  const [showModalSuccess, setShowModallSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
    setValue,
  } = useForm({ mode: 'onBlur', resolver: yupResolver(schema) });
  const isPasswordsTyping = watch('password');
  const isPasswordsConfirmation = watch('confirmationPassword');
  const isEmail = watch('email');
  const isObjectErrorNull = Object.keys(errors).length === 0;

  const validateEmail = async () => {
    await trigger('email');
  };

  const onSubmit = async (data: yup.AnyObject) => {
    try {
      setLoading(true);
      const requestBodyData = {
        email: data?.email,
        password: data?.password,
        confirm_password: data?.confirmationPassword,
      };
      const response = await registerAccount(requestBodyData);
      if (response?.data?.registration?.success) {
        setEmail(data?.email);
        setShowModallSuccess(true);
        // router.push("/verification-otp");
        // dispatch(setEmail(data?.email));
      }
    } catch (error: any) {
      if (error?.response?.data?.error?.is_verify == false) {
        // dispatch(setEmail(data?.email));
        // router.push("/verification-otp");
        setEmail(data?.email);
        setPassword(data?.password);
        setShowModallSuccess(true);
      } else {
        setError('email', {
          type: 'manual',
          message: 'Email sudah terdaftar',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkInputsDisabledButton = (validate: boolean) => {
    if (
      Boolean(isPasswordsConfirmation) &&
      Boolean(isPasswordsTyping) &&
      Boolean(isEmail) &&
      !validate &&
      isObjectErrorNull
    )
      return setIsInputsFilled(false);
    return setIsInputsFilled(true);
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

  const toggleTooltipPassword = () => {
    if (isPasswordsTyping?.length > 0) {
      if (lengthPassword && upperLowerCase && containsNumber && containsSymbol)
        return setShowPassHelperText(false);
      return setShowPassHelperText(true);
    }
    setShowPassHelperText(false);
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
  }, [
    isPasswordsTyping,
    isPasswordsConfirmation,
    isEmail,
    validateInputConfirmation,
    isObjectErrorNull,
  ]);

  useEffect(() => {
    checkConfirmationPassword(isPasswordsConfirmation);
  }, [isPasswordsTyping]);

  return (
    <>
      <Head title="Register" />
      <div className="bg-img-register d-flex justify-content-center flex-column">
        <div className="container d-flex justify-content-center flex-column mt-auto">
          <Row>
            <div className="col center">
              <div className="card mt-2 shadow-sm rounded-5 p-4 card-wrapper">
                <div className="card-body">
                  <RegistratioPageHeader />
                  <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup className="mb-4">
                      <Label htmlFor="email">Email</Label>
                      <FormInput
                        invalid={Boolean(errors?.email)}
                        type="email"
                        name="email"
                        register={register}
                        className="form-control shadow-none field-input-border-primary"
                        placeholder="Masukkan Alamat Email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setValue('email', e.target.value);
                          validateEmail();
                        }}
                      />
                      <FormFeedback>
                        <span
                          className="text-danger position-absolute"
                          style={{ fontSize: 12 }}
                        >
                          {errors['email']?.message}
                        </span>
                      </FormFeedback>
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <Label htmlFor="password">Kata Sandi</Label>
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
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const inputValue = e.target.value;
                            const sanitizedValue = inputValue.replace(
                              /\s/g,
                              ''
                            );
                            e.target.value = sanitizedValue;
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

                    <FormGroup className="mb-5">
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
                          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                            checkConfirmationPassword(e.target.value)
                          }
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
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

                    <RegisterButton
                      isInputsFilled={isInputsFilled}
                      loading={loading}
                    />
                  </Form>
                </div>
              </div>
            </div>

            <div className="col center d-none d-lg-flex">
              <Image src={ilustrationRegister} width={600} alt="illustration" />
            </div>
          </Row>
        </div>
        <AuthFooter />
        <ModalRegistrationSuccess
          email={email}
          showModalSuccess={showModalSuccess}
          hideCallback={() => {
            setShowModallSuccess(false);
            router.push({
              pathname: '/login',
              query: {
                email: email,
                password: password
              }
            });
          }}
        />
      </div>
    </>
  );
}

RegisterAccount.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;

export default RegisterAccount;
