import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';
import colors from '@/utils/colors';

function ModalCancel({
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
  textSubmit = 'Yakin',
  textCancel = 'Batal',
  toggle,
  children = null,
  btnSubmitWidth = '50%',
  btnCancelWidth = '50%',
  separatedRound = false,
  disableBtnSubmit = false,
  iconStyle = {},
  buttonConfirmStyle = {},
  footerStyle = {},
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (useTimer) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [useTimer]);

  return (
    <div>
      <Modal toggle={toggle} isOpen={isOpen} style={{ ...modalContentStyle }}>
        <ModalHeader className="border-0 p-0 center">
          <Image
            src={icon}
            width={widthImage}
            height={heightImage}
            alt="illustration"
            style={{ borderRadius: 16, ...iconStyle }}
          />
        </ModalHeader>
        <ModalBody
          style={{
            ...modalBodyStyle,
          }}
          className="bg-white"
        >
          {separatedRound && (
            <div
              style={{ marginTop: '-60px' }}
              className="position-relative d-flex justify-content-center mb-5"
            >
              <div
                style={{
                  borderRadius: '100%',
                  overflow: 'hidden',
                  width: widthImage,
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: 0,
                  zIndex: 2,
                  height: '80px',
                }}
              >
                &nbsp;
              </div>
            </div>
          )}
          <div style={{ zIndex: 3 }} className="position-relative">
            <div className="text-center mt-3">
              <h5 style={{ color: '#4C4F54', fontSize: 24 }}>{title}</h5>
              <span style={{ color: colors.black }}>{subtitle}</span>
            </div>
            <>{children}</>
            {buttonConfirmation && (
              <div
                className="flex justify-center"
                style={{ marginTop: 16, ...footerStyle }}
              >
                <Button
                  style={{
                    width: btnCancelWidth,
                    fontSize: 14,
                    color: '#203864',
                  }}
                  className={'justify-center'}
                  onClick={handleClickCancelled}
                >
                  <>{textCancel}</>
                </Button>
                <Button
                  className={`${
                    disableBtnSubmit ? 'btn-disabled' : 'btn-primary'
                  } justify-center`}
                  style={{
                    width: btnSubmitWidth,
                    fontSize: 14,
                    ...buttonConfirmStyle,
                  }}
                  onClick={handleClickYes}
                  disabled={disableBtnSubmit}
                >
                  <>{textSubmit}</>
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalCancel;
