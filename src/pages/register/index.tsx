// react and next import
import Link from 'next/link';
import Image from 'next/image';

// component
import { AuthFooter } from '@/components';
import { Head, Row } from '@/components';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import whatsappLogo from '@/assets/svg/whatsapp.svg';
import emailLogo from '@/assets/svg/email-logo.svg';
import ilustrationRegister from '@/assets/images/illustration/ilustration-register.svg';

// layout
import BlankLayout from '@/layout/Index-nosidebar';
import colors from '@/utils/colors';
import styled from 'styled-components';

function Register() {
  const handleRedirectWhatsApp = () => {
    const phoneNumber: string = '6281779044937';
    const message: string = 'Halo, saya tertarik untuk menggunakan aplikasi Bebas Kirim. Dapatkah saya mendapatkan informasi mengenai registrasi akun/harga/cara penggunaan dari aplikasi Bebas Kirim? \n\nTerima kasih';
    const whatsappUrl: string = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl);
  };

  const handleRedirectGmail = () => {
    const email: string = process.env.REACT_APP_EMAIL_ADDRESS;
    const subject: string = process.env.REACT_APP_EMAIL_SUBJECT;
    const body: string = process.env.REACT_APP_EMAIL_TEMPLATE;
    const gmailUrl: string = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl);
  };

  return (
    <>
      <Head title="Register" />
      <div className="bg-img-register d-flex justify-content-center flex-column">
        <div className="container d-flex justify-content-center flex-column mt-auto">
          <Row className="">
            <div className="col center">
              <div className="card mt-2 shadow-sm rounded-5 p-4 card-wrapper">
                <div className="card-body">
                  <div className="card-title d-flex justify-content-between">
                    <h5
                      className="text-color-primary"
                      style={{
                        fontSize: 24,
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
                    {
                      'Hubungi Customer Service kami untuk membuat akun Bebas Kirim untuk mendapatkan akses mudah dalam mengelola bisnismu'
                    }
                  </p>

                  <RegisterPage.ContainerButton
                    onClick={handleRedirectWhatsApp}
                  >
                    <Image
                      src={whatsappLogo}
                      width={20}
                      height={20}
                      alt="whatsapp-logo"
                    />
                    <RegisterPage.TextButton>
                      {'0817-7904-4937'}
                    </RegisterPage.TextButton>
                  </RegisterPage.ContainerButton>

                  <RegisterPage.ContainerLine>
                    <RegisterPage.Line />
                    <RegisterPage.TextLine>
                      {'atau melalui'}
                    </RegisterPage.TextLine>
                    <RegisterPage.Line />
                  </RegisterPage.ContainerLine>

                  <RegisterPage.ContainerButton onClick={handleRedirectGmail}>
                    <Image
                      src={emailLogo}
                      width={20}
                      height={20}
                      alt="whatsapp-logo"
                    />
                    <RegisterPage.TextButton>
                      {'hello@ethix.id '}
                    </RegisterPage.TextButton>
                  </RegisterPage.ContainerButton>
                  <p className="mt-4 center text-nowrap">
                    Sudah memiliki akun?&#160;
                    <Link
                      href="/login"
                      className="text-decoration-underline text-color-primary"
                    >
                      Masuk
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="col center d-none d-lg-flex">
              <Image src={ilustrationRegister} width={600} alt="illustration" />
            </div>
          </Row>
        </div>
        <AuthFooter />
      </div>
    </>
  );
}

const RegisterPage = {
  ContainerButton: styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
    border: 1px solid ${colors.blue};
    border-radius: 3px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    cursor: pointer;
  `,
  TextButton: styled.p`
    font-size: 14px;
    line-height: 22px;
    font-weight: 700;
    color: ${colors.blue};
  `,
  ContainerLine: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  `,
  Line: styled.div`
    width: 100%;
    height: 1px;
    background-color: #e9e9ea;
    margin-top: 8px;
    margin-bottom: 8px;
  `,
  TextLine: styled.div`
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: #4c4f54;
    padding-left: 8px;
    padding-right: 8px;
    min-width: 100px;
  `,
};

Register.getLayout = (page: any) => (
  <BlankLayout title={''}>{page}</BlankLayout>
);

export default Register;
