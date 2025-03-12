import { Button, ModalConfirm } from '@/components/atoms';
import React from 'react';
import gifLogin from '@/assets/gift/login.gif';
import gifVerification from '@/assets/gift/verification.gif';
import { Spinner } from 'reactstrap';
import gifVerificationEmail from '@/assets/gift/verification-email.gif';
import gifForgotPassword from '@/assets/gift/forgot-pass.gif';
import Image from 'next/image';
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import { TooltipStyle } from '@/assets/styled/tooltip';
import { IconCircleCheck } from '@/components/atoms/icon/IconCircleChecked';
import { IconCircleUncheck } from '@/components/atoms/icon/IconCircleUncheck';
import Link from 'next/link';

type ModalSucessProps = {
  isLogin: string;
  isCompleteProfile: boolean;
};

type ModalVerificationSuccessProps = {
  modalSucces: boolean;
};

type LoadingResendProps = {
  loadingResend: boolean;
  secondsRemaining: number;
  handleResendOtp: VoidFunction;
};

type ModalVerificationSentProps = {
  modalSuccess: boolean;
  email: string;
};

function ModalSuccess({
  isLogin = '',
  isCompleteProfile = false,
}: ModalSucessProps) {
  return (
    <>
      {isLogin === 'success' && (
        <ModalConfirm
          toggle={false}
          icon={gifLogin}
          useTimer={false}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-135px',
            height: '135px',
          }}
          title={'Login Berhasil!🎉'}
          subtitle={
            isCompleteProfile === true
              ? 'Selamat mengelola bisnismu!'
              : 'Selanjutnya, lengkapi profil bisnis kamu yuk!'
          }
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

function ModalVerificationSuccess({
  modalSucces,
}: ModalVerificationSuccessProps) {
  return (
    <>
      {modalSucces && (
        <ModalConfirm
          toggle={false}
          widthImage={350}
          heightImage={320}
          icon={gifVerification}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-80px',
            marginLeft: '-25px',
            height: '135px',
            marginBottom: 13,
          }}
          title={'Terima Kasih'}
          subtitle={
            <span>
              Registrasi Kamu Telah Berhasil! <br /> Yuk, login ke akun kamu
              sekarang!
            </span>
          }
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

function LoadingResend({
  loadingResend,
  secondsRemaining,
  handleResendOtp,
}: LoadingResendProps) {
  return (
    <>
      {loadingResend ? (
        <div className="mt-2 center text-nowrap">
          <Spinner size="sm" color="light" />
        </div>
      ) : (
        <>
          {secondsRemaining > 0 ? (
            <p className="mt-2 center text-nowrap">
              Harap tunggu{' '}
              <div className="fw-bold px-1">{secondsRemaining}</div> detik untuk
              mengirim ulang kode OTP
            </p>
          ) : (
            <p
              className="mt-2 center text-nowrap"
              style={{ cursor: 'pointer' }}
              onClick={handleResendOtp}
            >
              Kirim Ulang Kode Verifikasi
            </p>
          )}
        </>
      )}
    </>
  );
}

function ModalVerificationSent({
  modalSuccess,
  email,
}: ModalVerificationSentProps) {
  return (
    <>
      {modalSuccess && (
        <ModalConfirm
          toggle={false}
          icon={gifVerificationEmail}
          widthImage={420}
          heightImage={350}
          modalContentStyle={{ width: 420 }}
          modalBodyStyle={{
            width: 500,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-80px',
            height: '170px',
            marginLeft: '-40px',
            marginBottom: 13,
          }}
          title={
            <span style={{ fontSize: 24 }}>Permintaan Ubah Kata Sandi</span>
          }
          subtitle={
            <span>
              Tautan ubah Kata Sandi telah dikirimkan ke alamat <br />
              email:{' '}
              <span
                style={{ fontWeight: 'bold', color: '#4C4F54', fontSize: 14 }}
              >
                {email}.
              </span>{' '}
              Silakan ikuti <br />
              instruksi di dalam untuk melanjutkan.
            </span>
          }
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

function ModalRegistrationSuccess({ showModalSuccess, email, hideCallback }) {
  return (
    <>
      {showModalSuccess && (
        <ModalConfirm
          hideCallback={hideCallback}
          toggle={false}
          useTimer={true}
          icon={gifLogin}
          widthImage={350}
          timeOut={3000}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-135px',
            height: '165px',
          }}
          title={'Registrasi Berhasil!🎉'}
          subtitle={`Registrasi ${email} berhasil! Mulai eksplor Bebas Kirim sekarang!`}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

function RegistratioPageHeader() {
  return (
    <>
      <div className="card-title d-flex justify-content-between">
        <h5
          className="text-color-primary"
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '0.12px',
          }}
        >
          Registrasi
        </h5>
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
        Buat akun baru untuk mendapatkan akses mudah dalam mengelola bisnismu
      </p>
    </>
  );
}

function PasswordInputTooltip({
  showPassHelperText,
  lengthPassword,
  upperLowerCase,
  containsNumber,
  containsSymbol,
}) {
  return (
    <TooltipStyle
      isOpen={showPassHelperText}
      target="tooltipValidationPassword"
      placement="bottom"
    >
      <p className="isShowValidationPassword">
        {lengthPassword ? <IconCircleCheck /> : <IconCircleUncheck />} Minimal 8
        karakter
      </p>
      <p className="isShowValidationPassword">
        {upperLowerCase ? <IconCircleCheck /> : <IconCircleUncheck />} Campuran
        huruf besar dan kecil
      </p>
      <p className="isShowValidationPassword">
        {containsNumber ? <IconCircleCheck /> : <IconCircleUncheck />} Campuran
        huruf dan angka
      </p>
      <p className="isShowValidationPassword">
        {containsSymbol ? <IconCircleCheck /> : <IconCircleUncheck />}{' '}
        Penyertaan setidaknya satu karakter khusus, seperti ! @ _ & ]
      </p>
    </TooltipStyle>
  );
}

function RegisterButton({ isInputsFilled, loading }) {
  return (
    <>
      <Button
        size="lg"
        className={`btn w-100 center shadow-none ${
          isInputsFilled ? 'btn-disabled' : 'btn-primary'
        }`}
        type={loading || isInputsFilled ? 'button' : 'submit'}
        disabled={isInputsFilled}
      >
        {loading ? <Spinner size="sm" color="light" /> : 'Registrasi'}
      </Button>
      <p className="mt-2 center text-nowrap">
        Sudah memiliki akun?&#160;
        <Link
          href="/login"
          className="text-decoration-underline text-color-primary"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}

function ModalPasswordSuccess({ modalSucces }) {
  return (
    <>
      {modalSucces && (
        <ModalConfirm
          toggle={false}
          icon={gifForgotPassword}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-80px',
            height: '135px',
            marginLeft: '-25px',
            marginBottom: 13,
          }}
          title={'Ubah Kata Sandi Berhasil!'}
          subtitle={<span>Kata Sandi kamu telah berhasil diubah!</span>}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

function ButtonResetPassword({ isInputsFilled, loading }) {
  return (
    <Button
      size="lg"
      className={`btn w-100 center shadow-none ${
        isInputsFilled ? 'btn-disabled' : 'btn-primary'
      }`}
      type={loading ? 'button' : 'submit'}
      disabled={isInputsFilled}
    >
      {loading ? <Spinner size="sm" color="light" /> : 'Ubah Kata Sandi'}
    </Button>
  );
}

export {
  ModalSuccess,
  ModalVerificationSuccess,
  LoadingResend,
  ModalVerificationSent,
  ModalRegistrationSuccess,
  RegistratioPageHeader,
  PasswordInputTooltip,
  RegisterButton,
  ModalPasswordSuccess,
  ButtonResetPassword,
};
