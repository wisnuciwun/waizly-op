import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';
import colors from '@/utils/colors';

function ModalConfirm({
  icon,
  modalContentStyle,
  modalBodyStyle,
  title,
  subtitle,
  useTimer = true,
  buttonConfirmation = false,
  handleClickYes,
  handleClickCancelled,
  widthImage,
  heightImage,
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (useTimer) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [useTimer]);

  return (
    <div>
      <Modal isOpen={isOpen} style={{ ...modalContentStyle, overflow: 'hidden' }}>
        <ModalHeader className="border-0 p-0 center">
          <Image
            src={icon}
            width={widthImage}
            height={heightImage}
            alt="illustration"
            style={{ borderRadius: 16, marginBottom: 4  }}
          />
        </ModalHeader>
        <ModalBody
          className="bg-white"
          style={modalBodyStyle}
        >
          <div className="text-center mt-3">
            <h5 style={{ color: '#4C4F54', fontSize: 24 }}>{title}</h5>
            <span style={{color: colors.black}}>{subtitle}</span>
          </div>

          {buttonConfirmation && (
            <div className="flex justify-center" style={{ marginTop: 16, marginRight: 16, marginLeft: 16 }}>
              <Button
                style={{ width: 168, fontSize: 14 }}
                className={'justify-center'}
                onClick={handleClickCancelled}
              >
                <>{'Batal'}</>
              </Button>
              <Button
                className={'btn-primary justify-center'}
                style={{ width: 168, fontSize: 14 }}
                onClick={handleClickYes}
              >
                <>{'Yakin'}</>
              </Button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

// const styles = {
//   infoModal : {
//     width: 400,
//     borderTopLeftRadius: '50%',
//     borderTopRightRadius: '50%',
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//     marginTop: '-125px',
//     marginLeft: '-25px',
//     height: 168,
//     marginBottom: 13,
//   }
// };

export default ModalConfirm;