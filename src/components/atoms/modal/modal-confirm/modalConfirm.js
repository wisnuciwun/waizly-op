/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  timeOut = 2000,
  useTimer = false,
  buttonConfirmation = false,
  handleClickYes,
  handleClickCancelled,
  confirmText = 'Yakin',
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (useTimer) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, timeOut);

      return () => clearTimeout(timer);
    }
  }, [useTimer]);

  return (
    <div>
      <Modal isOpen={isOpen} style={{ ...modalContentStyle, overflow: 'hidden' }}>
        <ModalHeader className="border-0 p-0 center">
          <Image
            src={icon}
            width={350}
            height={320}
            alt="illustration"
            style={{ borderRadius: 16 }}
          />
        </ModalHeader>
        <ModalBody
          className="bg-white"
          style={styles.infoModal}
        >
          <div className="text-center mt-3">
            <h5>{title}</h5>
            <span style={{ color: colors.black }}>{subtitle}</span>
          </div>

          {buttonConfirmation && (
            <div className="flex justify-center" style={{ marginTop: 16, marginRight: 16, marginLeft: 16 }}>
              <Button
                style={{ width: 168 }}
                className={'justify-center'}
                onClick={handleClickCancelled}
              >
                <>Batal</>
              </Button>
              <Button
                className={'btn-primary justify-center'}
                style={{ width: 168 }}
                onClick={handleClickYes}
              >
                <>{confirmText}</>
              </Button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

const styles = {
  infoModal: {
    width: 400,
    borderTopLeftRadius: '50%',
    borderTopRightRadius: '50%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: '-125px',
    marginLeft: '-25px',
    height: 168,
    marginBottom: 24,
    paddingRight: 44,
    paddingLeft: 44
  }
};

export default ModalConfirm;
