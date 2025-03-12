/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';
import colors from '@/utils/colors';
import { styles } from './styles';

function ModalConfirm({
  icon,
  modalContentStyle,
  modalBodyStyle,
  title,
  timeOut = 2000,
  subtitle,
  useTimer = true,
  buttonConfirmation = false,
  handleClickYes = () => { },
  handleClickCancelled = () => { },
  widthImage,
  heightImage,
  textSubmit = 'Yakin',
  toggle,
  hideCallback = () => { },
  isCountAction = false,
  successCount = 0,
  failedCount = 0,
  stylesCustomTitle = {},
  singleButtonConfirmation = false,
  textSingleButton = '',
  iconStyle = {},
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (useTimer) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        hideCallback();
      }, timeOut);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [useTimer]);

  return (
    <div>
      <Modal toggle={toggle} isOpen={isOpen} style={{ ...modalContentStyle, overflow: 'hidden' }}>
        <ModalHeader className="border-0 p-0 center">
          <Image
            src={icon}
            width={widthImage}
            height={heightImage}
            alt="illustration"
            style={{ ...styles.Image, ...iconStyle }}
          />
        </ModalHeader>
        <ModalBody
          className="bg-white"
          style={modalBodyStyle}
        >
          <div className="text-center mt-3">
            <h5 style={{ ...styles.TitleStyleFonts, ...stylesCustomTitle }}>{title}</h5>
            {isCountAction &&
              <div style={styles.WrapperCountAction}>
                <span style={styles.SuccesCount}>Berhasil: {successCount}</span>
                <span style={styles.FailedCount}>Gagal: {failedCount}</span>
              </div>
            }
            <span style={{ color: colors.black }}>{subtitle}</span>
          </div>

          {buttonConfirmation && (
            <div className="flex justify-center" style={{ marginTop: 16 }}>
              <Button
                style={{ ...styles.StyleButtonFit, color: '#203864' }}
                className={'justify-center'}
                onClick={handleClickCancelled}
              >
                <>{'Batal'}</>
              </Button>
              <Button
                className={'btn-primary justify-center'}
                style={styles.StyleButtonFit}
                onClick={handleClickYes}
              >
                <>{textSubmit}</>
              </Button>
            </div>
          )}

          {singleButtonConfirmation && (
            <div className="flex justify-center" style={{ marginTop: 30 }}>
              <Button
                style={{ ...styles.StyleButtonFit, color: '#203864' }}
                className={'justify-center'}
                onClick={handleClickYes}
              >
                <>{textSingleButton}</>
              </Button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div >
  );
}


export default ModalConfirm;
