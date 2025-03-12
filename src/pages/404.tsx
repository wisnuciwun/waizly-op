import Image from 'next/image';
import ilustrationError404 from '@/assets/images/illustration/ilustration-error-404.svg';
// layout
import BlankLayout from '@/layout/Index-nosidebar';

function Custom404() {
  return (
    <div className="error-wrapper">
      <div className="error-card">
        <Image src={ilustrationError404} width={300} alt="illustration" />
        <h3 style={{ color: '#4C4F54' }}>Ups! Kenapa kamu di sini?</h3>
        <p>
          Kami mohon maaf atas ketidaknyamanan ini. Sepertinya kamu mencoba{' '}
          <br /> mengakses halaman yang telah dihapus atau tidak pernah ada.
        </p>
      </div>
    </div> 
  );
}

Custom404.getLayout = (page) => <BlankLayout title={'404 Page'}>{page}</BlankLayout>;

export default Custom404;
