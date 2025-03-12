import { Head } from '@/components';
import Content from '@/layout/content/Content';
import UploadOrder from '@/layout/order/upload';
const Upload = () => {

    return(
        <>
            <Head title="Pesanan - Upload" />
            <Content>
                <UploadOrder formData={null}/>
            </Content>
        </>
    );

};

export default Upload;