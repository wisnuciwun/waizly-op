// react and next import
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

// component
import { AuthFooter } from '@/components';
import { Head, Row } from '@/components';
import { FormInput } from '@/components/atoms/form-input';
import { ModalVerificationSent } from '@/components/molecules/auth';

// third party
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Spinner,
  Label,
  Button,
  Form,
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import { useForm } from 'react-hook-form';

// asset
import waizlyLogo from '@/assets/svg/waizly-logo.svg';
import ilustrationRegister from '@/assets/images/illustration/ilustration-verification.svg';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

// utils
import { UseDelay } from '@/utils/formater';

// api
import { forgotPassword } from '@/services/auth';

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
});

function VerificationEmail({}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    trigger,
    setValue,
    getValues,
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });
  const email = getValues('email');

  const validateEmail = async () => {
    await trigger('email');
  };

  const handleSubmitVerification = async (data: yup.AnyObject) => {
    try {
      setLoading(true);
      const requestBodyData = {
        email: data?.email,
      };
      const response = await forgotPassword(requestBodyData);
      if (response?.status === 200) {
        setModalSuccess((prev) => !prev);
        await UseDelay(2000);
        router.push('/login');
      }
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 400) {
        setError('email', {
          type: 'manual',
          message: 'Email tidak terdaftar',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Konfirmasi Email" />
      <div className="bg-img-verification d-flex justify-content-center flex-column">
        <div className="container  d-flex justify-content-center flex-column mt-auto">
          <Row>
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
                      Konfirmasi Email
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
                    Jika kamu lupa Kata Sandi, kami akan mengirimkan email
                    instruksi untuk mengubah Kata Sandi kamu.
                  </p>
                  <Form
                    noValidate
                    onSubmit={handleSubmit(handleSubmitVerification)}
                  >
                    <FormGroup className="mb-4">
                      <Label htmlFor="email">Email</Label>
                      <FormInput
                        invalid={Boolean(errors?.email)}
                        type="email"
                        name="email"
                        register={register}
                        className="form-control shadow-none field-input-border-primary"
                        placeholder="Masukkan Alamat Email"
                        onChange={(e) => {
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
                    <Button
                      size="lg"
                      className={`btn w-100 center mt-2 shadow-nonem  ${
                        !isValid ? 'btn-disabled' : 'btn-primary'
                      }`}
                      disabled={!isValid}
                      type={loading ? 'button' : 'submit'}
                    >
                      {loading ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        <div style={{ fontSize: '14px' }}>
                          Kirim Link Reset Kata Sandi
                        </div>
                      )}
                    </Button>
                    <div className="text-center mt-3">
                      <Link href={'/login'} className="text-reset">
                        Kembali ke halaman login
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className="col center d-none d-lg-flex">
              <Image src={ilustrationRegister} width={500} alt="illustration" />
            </div>
          </Row>
        </div>
        <AuthFooter />
        <ModalVerificationSent modalSuccess={modalSuccess} email={email} />
      </div>
    </>
  );
}

VerificationEmail.getLayout = (page: any) => <BlankLayout>{page}</BlankLayout>;

export default VerificationEmail;
