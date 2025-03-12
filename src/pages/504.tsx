import Image from 'next/image';
import ilustrationError504 from '@/assets/images/illustration/ilustration-error-504.svg';

// layout
import BlankLayout from '@/layout/Index-nosidebar';

function Custom504() {
    return (
        <div className="error-wrapper">
            <div className="error-card">
                <Image src={ilustrationError504} width={300} alt="illustration" />
                <h5>Gateway Timeout Error</h5>
                <p>Kami mohon maaf atas ketidaknyamanan ini. Sepertinya kamu mencoba <br /> mengakses halaman yang telah dihapus atau tidak pernah ada.</p>
            </div>
        </div >
    );
}

Custom504.getLayout = (page) => <BlankLayout title={'504 Page'}>{page}</BlankLayout>;

export default Custom504;