//next import
import Image from 'next/image';

// component
import {BlockTitle, Button} from '@/components';

//third party
import {Col, Modal, ModalBody, Row} from 'reactstrap';

//assets image
import ilustrationGift from '@/assets/images/illustration/ilustration-gift.svg';
import ilustrationBundlingGift from '@/assets/images/illustration/ilustration-bundlinggift.svg';

import {usePermissions} from '@/utils/usePermissions';

function ModalConfirmationFormMasterSku({isOpenModal, handleActionCloseModal, handleClickSingleSKU, handleClickBundling}) {
  const permissions = usePermissions();

  return (
    <div>
      <Modal size="lg" isOpen={isOpenModal} toggle={handleActionCloseModal} style={{maxWidth: 821, width: '100%'}}>
        <ModalBody style={{padding: '40px 80px'}}>
          <div>
            <BlockTitle fontSize={24}>{'Tambah Master SKU'}</BlockTitle>
          </div>
          <Row>
            <Col sm={5}>
              <div style={{marginTop: 40}} className="flex justify-center">
                <Image src={ilustrationGift} width={138} height={162} alt="illustration" />
              </div>
              <div style={{marginTop: 40}} className="text-center">
                <p style={{fontSize: 12}}>
                  Pilih Single SKU jika ingin membuat produk <br /> satuan
                </p>
                <Button onClick={handleClickSingleSKU} style={{border: '1px solid #203864', marginTop: 16, fontSize: 14, color: '#203864'}} className={!permissions?.includes('Tambah Single SKU') && 'btn-disabled'} disabled={!permissions?.includes('Tambah Single SKU')}>
                  Single SKU
                </Button>
              </div>
            </Col>
            <Col sm={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{width: 1, background: '#D9D9D9', height: 250}}></div>
            </Col>
            <Col sm={5}>
              <div style={{marginTop: 40}} className="flex justify-center">
                <Image src={ilustrationBundlingGift} width={138} height={162} alt="illustration" />
              </div>
              <div style={{marginTop: 40}} className="text-center">
                <p style={{fontSize: 12}}>
                  Pilih Bundling SKU jika ingin membuat paket <br /> produk dari kombinasi Single SKU
                </p>
                <Button onClick={handleClickBundling} style={{border: '1px solid #203864', marginTop: 16, fontSize: 14, color: '#203864'}} className={!permissions?.includes('Tambah Bundling SKU') && 'btn-disabled'} disabled={!permissions?.includes('Tambah Bundling SKU')}>
                  Bundling SKU
                </Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalConfirmationFormMasterSku;
