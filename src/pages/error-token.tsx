import Image from 'next/image';
import ilustrationErrorToken from '@/assets/images/illustration/ilustration-error-token.svg';
// layout
import BlankLayout from '@/layout/Index-nosidebar';

function ErrorToken() {
  return (
    <div className="error-wrapper">
      <div className="error-card">
        <Image src={ilustrationErrorToken} width={300} alt="illustration" />
        <h5 style={{ fontSize: 32, color: '#4C4F54' }}>
          Whoops! Link tersebut sudah kadaluwarsa <br /> atau sudah pernah
          digunakan
        </h5>
        <p style={{ fontSize: 14, marginTop: 20 }}>
          Demi alasan keamanan, link pengaturan ulang kata sandi akan
          kedaluwarsa <br /> setelah 15 menit dan hanya dapat diakses sekali.
          Jika kamu masih perlu mengatur <br /> ulang kata sandi, kamu dapat
          meminta email pengaturan ulang yang baru
        </p>
      </div>
    </div>
  );
}

ErrorToken.getLayout = (page) => <BlankLayout title={'Token Page'}>{page}</BlankLayout>;

export default ErrorToken;
