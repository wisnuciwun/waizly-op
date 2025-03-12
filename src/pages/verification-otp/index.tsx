/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// react and next import
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// component
import { AuthFooter, Button } from '@/components';
import { Head, Row } from '@/components';
import {
  LoadingResend,
  ModalVerificationSuccess,
} from '@/components/molecules/auth';

//utils
import useCountdownTimer from '@/utils/countDownTimer';
import { UseDelay } from '@/utils/formater';

// third party
import { Spinner, Label, Input, Form } from 'reactstrap';
import { useSelector } from 'react-redux';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import ilustrationRegister from '@/assets/images/illustration/ilustration-verification.svg';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

// api
import { resendOtp, verifyAccount } from '@/services/auth';
import { useForm } from 'react-hook-form';

function Verification({}) {
  const router = useRouter();
  const { handleSubmit } = useForm();
  const { email } = useSelector((state: any) => state.register);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResend, setLoadingResend] = useState<boolean>(false);
  const [isArrayFill, setIsArrayFill] = useState<boolean>(true);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isError, setIsError] = useState<boolean>(false);
  const [modalSucces, setModalSucces] = useState<boolean>(false);
  const [resetTimer, setResetTimer] = useState<number>(0);
  const [errorText, setErrorText] = useState<string>('');

  const inputRefs = Array(otp.length)
    .fill(0)
    .map(() => useRef(null));
  const secondsRemaining: number = useCountdownTimer(60, resetTimer);

  const handleResetTimer = () => {
    setResetTimer((prevKey) => prevKey + 1);
  };

  const handleInputOtp = (
    element: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value, nextSibling, previousSibling } = element.target;
    const keyDown = (element.nativeEvent as InputEvent).inputType;
    const isPasteEvent = keyDown === 'insertFromPaste';

    if (!isPasteEvent) {
      if (!/^\d+$/.test(value) && keyDown !== 'deleteContentBackward') {
        return false;
      }
    }
    const newOtp = [...otp];
    if (isPasteEvent) {
      const pastedValue = value.replace(/\D/g, '');
      for (let i = 0; i < newOtp.length; i++) {
        newOtp[i] = pastedValue[i];
      }
    } else {
      newOtp[index] = value.substring(value.length - 1);
    }

    setIsError(false);
    setOtp(newOtp);
    handleButtonVerification();

    if (isPasteEvent) {
      const lastFilledIndex = newOtp.findIndex((item) => item === '') - 1;
      const focusIndex =
        lastFilledIndex >= 0 ? lastFilledIndex : newOtp.length - 1;
      inputRefs[focusIndex]?.current?.focus();
    } else {
      if (nextSibling && keyDown !== 'deleteContentBackward') {
        let nextSiblings = element.target.nextSibling as HTMLElement | null;
        nextSiblings?.focus();
      } else if (previousSibling && keyDown === 'deleteContentBackward') {
        newOtp[index] = '';
        setOtp(newOtp);
        inputRefs[index - 1]?.current?.focus();
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleButtonVerification = () => {
    const allArrFilled = otp.some(
      (item) =>
        !(
          typeof item === 'string' &&
          item.trim() !== '' &&
          !isNaN(Number(item))
        )
    );
    setIsArrayFill(allArrFilled);
  };

  const handleSubmitVerification = async () => {
    try {
      setLoading(true);
      const requestBodyData = {
        email,
        otp_code: otp?.join(''),
      };
      const response = await verifyAccount(requestBodyData);
      if (response?.status === 200) {
        setModalSucces((prev) => !prev);
        await UseDelay(2000);
        router.push('/login');
      }
    } catch (error) {
      const errorType = error.response.data.error?.type;
      setIsError(true);
      setIsArrayFill(true);
      switch (errorType) {
        case 'ACTIVATION_CODE_EXPIRED':
          return setErrorText('Kode Kedaluwarsa');
        case 'OTP_INVALID':
          return setErrorText('Kode tidak valid');
        case 'OTP_CODE_INCORRECT':
          return setErrorText('Kode tidak valid');
        default:
          return setErrorText('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoadingResend(true);
      const requestBodyData = {
        email,
      };
      const response = await resendOtp(requestBodyData);
      if (response?.status === 200) {
        handleResetTimer();
      }
    } catch (error) {
    } finally {
      setLoadingResend(false);
    }
  };

  useEffect(() => {
    handleButtonVerification();
  }, [otp]);

  useEffect(() => {
    inputRefs[0].current.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head title="Verification Account" />
      <div className="bg-img-verification d-flex justify-content-center flex-column">
        <div className="container d-flex justify-content-center flex-column mt-auto">
          <Row>
            <div className="col center">
              <div className="card mt-2 shadow-sm rounded-5 p-4 card-wrapper">
                <Form
                  noValidate
                  onSubmit={handleSubmit(handleSubmitVerification)}
                >
                  <div className="card-body">
                    <div className="card-title d-flex justify-content-between">
                      <h5
                        className="text-color-primary"
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          letterSpacing: 0.12,
                        }}
                      >
                        Verifikasi Akun
                      </h5>
                      <Image
                        src={waizlyLogo}
                        width={50}
                        height={50}
                        style={{ marginTop: -10 }}
                        alt="waizly-logo"
                      />
                    </div>
                    <p
                      className="card-text text-color-secondary"
                      style={{ marginTop: -1 }}
                    >
                      Kami telah mengirimkan kode verifikasi ke email kamu {''}
                      <span className="fw-bold">{email}</span>. Silakan masukkan
                      kode verifikasi yang dikirimkan pada kolom di bawah ini
                    </p>
                    <Label>Masukkan Kode Verifikasi</Label>
                    <div
                      style={{
                        gap: 8,
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="d-flex"
                    >
                      {otp.map((_, index) => {
                        return (
                          <Input
                            value={_}
                            innerRef={inputRefs[index]}
                            key={index}
                            style={{ width: 60 }}
                            className={`inputOtp ${
                              isError ? 'errorOtp' : ''
                            } form-control shadow-none field-input-border-primary`}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => handleInputOtp(e, index)}
                          />
                        );
                      })}
                    </div>
                    <p
                      className={`${
                        isError ? 'isErrorValidation' : 'normalValidation'
                      } text-danger position-absolute`}
                      style={{ fontSize: 12 }}
                    >
                      {errorText}
                    </p>
                    <Button
                      size="lg"
                      className={`btn w-100 center shadow-none mt-5 ${
                        isArrayFill || loading ? 'btn-disabled' : 'btn-primary'
                      }`}
                      disabled={isArrayFill || loading}
                      type={isArrayFill || loading ? 'button' : 'submit'}
                    >
                      {loading ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        'Verifikasi Email'
                      )}
                    </Button>
                    <LoadingResend
                      loadingResend={loadingResend}
                      secondsRemaining={secondsRemaining}
                      handleResendOtp={handleResendOtp}
                    />
                  </div>
                </Form>
              </div>
            </div>
            <div className="col center d-none d-lg-flex">
              <Image src={ilustrationRegister} width={500} alt="illustration" />
            </div>
          </Row>
        </div>
        <AuthFooter />
        <ModalVerificationSuccess modalSucces={modalSucces} />
      </div>
    </>
  );
}

Verification.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;

export default Verification;
