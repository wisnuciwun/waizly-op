import { Head } from '@/components';
import Content from '@/layout/content/Content';
import DownloadOrder from '@/layout/order/download';

const Downlaod = () => {
    return(
        <>
            <Head title="Pesanan - Download" />
            <Content>
                <DownloadOrder formData={null}/>
            </Content>
        </>
    );

};

export default Downlaod;