import {useState} from 'react';
import {Modal, ModalHeader, ModalBody, Label, Spinner, Input} from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';

import Icon from '../../icon';
import Create, {styles} from './styles';
import colors from '@/utils/colors';
import { UseDelay } from '@/utils/formater';
import {checkProgressFile, downloadTemplate, importDataMasterSku} from '@/services/master';
import {useSelector} from 'react-redux';

function ModalImport({icon, errorTypeFile, defaultFiles, setDefaultFiles, modalContentStyle, handleSuccesUpload, modalBodyStyle, handleClickCancelled, widthImage, heightImage, isOpen, handleClickShowConfirm, handlePendingModal, operationCounts}) {
  const {client_id} = useSelector((state: any) => state.auth.user);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const handleDownloadTemplate = async () => {
    try {
      setLoadingButton(true);
      const response = await downloadTemplate();
      if (response.status === 200) {
        window.open(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  const onCancelledExport = () => {
    if (defaultFiles) {
      handleClickCancelled();
      handleClickShowConfirm();
    } else {
      handleClickCancelled();
      setDefaultFiles(null);
    }
  };

  // const onSubmit = async () => {
  //   try {
  //     setLoadingButton(true);
  //     const payload = new FormData();
  //     payload.append('file', defaultFiles);
  //     payload.append('client_id', client_id);

  //     const response = await importDataMasterSku(payload);
  //     const idProcess = response?.data?.data?.product_import_process_id;

  //     if (response?.status === 200) {
  //       await UseDelay(2000);
  //       handlePendingModal();

  //       let checkProgressResponse: any;
  //       let index = 0;
  //       const maxAttempts = 20;
  //       const delayMultiplier = 1000;

  //       while (index < maxAttempts) {
  //         await UseDelay(delayMultiplier * index);
  //         checkProgressResponse = await checkProgressFile(idProcess, client_id);
  //         if (['FAILED', 'SUCCESS'].includes(checkProgressResponse?.product_import_process_status_name)) {
  //           break;
  //         }
  //         index++;
  //       }

  //       if (
  //         index === maxAttempts && 
  //         !['FAILED', 'SUCCESS'].includes(checkProgressResponse?.product_import_process_status_name)
  //       ) {
  //         errorTypeFile();
  //         return;
  //       }
        
  //       operationCounts({
  //         successCount: checkProgressResponse?.total_product_success ?? 0,
  //         failedCount: checkProgressResponse?.total_product_failed ?? 0,
  //       });
        
  //       const urlReupload = checkProgressResponse?.revision_file_url;
  //       await UseDelay(2000);
  //       handleSuccesUpload();
  //       urlReupload && window.open(urlReupload);
        
  //       if (
  //         checkProgressResponse?.total_product_failed === 0 &&
  //         checkProgressResponse?.total_product_success === 0
  //       ) {
  //         if (urlReupload) {
  //           errorTypeFile();
  //           window.open(urlReupload);
  //           return;
  //         }
  //         errorTypeFile();
  //       }
        
  //     } else if (response?.type === 'The file must be a file of type: xlsx, xls.') {
  //       errorTypeFile();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoadingButton(false);
  //   }
  // };

  const onSubmit = async () => {
    try {
      setLoadingButton(true);
      const payload = new FormData();
      payload.append('file', defaultFiles);
      payload.append('client_id', client_id);
  
      const response = await importDataMasterSku(payload);
      const idProcess = response?.data?.data?.product_import_process_id;
  
      if (response?.status === 200) {
        await UseDelay(2000);
        handlePendingModal();
  
        let checkProgressResponse: any;
        let index = 0;
        const maxAttempts = 20;
        const delayMultiplier = 1000;
  
        // Start checking the process status in a loop
        while (index < maxAttempts) {
          await UseDelay(delayMultiplier * index);
          checkProgressResponse = await checkProgressFile(idProcess, client_id);
  
          // Break out of the loop if the status is either FAILED or SUCCESS
          if (['FAILED', 'SUCCESS'].includes(checkProgressResponse?.product_import_process_status_name)) {
            break;
          }
          index++;
        }
  
        // If we hit the maxAttempts and the status is not FAILED or SUCCESS, trigger an error and stop execution
        if (index === maxAttempts && !['FAILED', 'SUCCESS'].includes(checkProgressResponse?.product_import_process_status_name)) {
          errorTypeFile();
          return; // Ensure early return to stop further execution
        }
  
        // Update the operation counts
        operationCounts({
          successCount: checkProgressResponse?.total_product_success ?? 0,
          failedCount: checkProgressResponse?.total_product_failed ?? 0,
        });
  
        // If there is a reupload URL, wait and then open it
        const urlReupload = checkProgressResponse?.revision_file_url;
        await UseDelay(2000);
        
        if (checkProgressResponse?.total_product_failed === 0 && checkProgressResponse?.total_product_success === 0) {
          if (urlReupload) {
            errorTypeFile();
            window.open(urlReupload);
            return; // Ensure early return
          }
          errorTypeFile();
          return; // Ensure early return
        }
  
        // Only call handleSuccessUpload if the process status is SUCCESS and no error occurred
        handleSuccesUpload();
        urlReupload && window.open(urlReupload);
        
      } else if (response?.type === 'The file must be a file of type: xlsx, xls.') {
        errorTypeFile();
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingButton(false);
    }
  };
  
  return (
    <Modal toggle={onCancelledExport} isOpen={isOpen} style={{...modalContentStyle, overflow: 'hidden'}}>
      <ModalHeader className="border-0 p-0 center">
        <Image src={icon} width={widthImage} height={heightImage} alt="illustration" style={{borderRadius: 16}} />
      </ModalHeader>
      <ModalBody
        className="bg-white"
        style={{
          ...modalBodyStyle,
        }}
      >
        <Create.ButtonDownloadTemplate onClick={handleDownloadTemplate}>
          {loadingButton ? (
            <Spinner size="sm" color="light" />
          ) : (
            <>
              <Icon name="download-cloud" style={styles.IconCloudDownload}></Icon>
              <span style={styles.TextDownloadInnerButton}>Unduh Template</span>
            </>
          )}
        </Create.ButtonDownloadTemplate>

        <Create.WrapperDividerWithText>
          <Create.DividerX />
          Atau
          <Create.DividerX />
        </Create.WrapperDividerWithText>

        <div className="form-group">
          <label className="form-label">Unggah File</label>
          <div className="form-control-wrap">
            <div className="form-file">
              <Input accept=".xlsx" type="file" id="customFile" style={styles.HideOriginalInputFile} onChange={(e) => setDefaultFiles(e.target.files[0])} />
              <Label for="customFile" style={styles.LabelCutomInput}>
                <Create.CustomInputFile isColor={!defaultFiles?.name ? colors.gray : colors.black} id="file-name">
                  {defaultFiles?.name ?? 'Pilih File'}
                </Create.CustomInputFile>
                <Create.CustomButtonBrowseFile className={'btn center shadow-none btn-primary'}>Telusuri</Create.CustomButtonBrowseFile>
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button type="button" style={styles.ButtonBack} className={'justify-center'} onClick={onCancelledExport}>
            Kembali
          </Button>
          <Button type={loadingButton ? 'button' : 'submit'} disabled={Boolean(!defaultFiles?.name)} className={`btn center shadow-none ${Boolean(!defaultFiles?.name) ? 'btn-disabled' : 'btn-primary'}`} style={styles.ButtonSubmit} onClick={onSubmit}>
            {loadingButton ? <Spinner size="sm" color="light" /> : 'Unggah SKU'}
          </Button>
        </div>

        <Create.WrapperAlert>
          <Icon name="alert-circle" style={styles.IconAlert}></Icon>
          Hanya dapat mengunggah maksimal 500 baris dalam
          <br />1 file
        </Create.WrapperAlert>
      </ModalBody>
    </Modal>
  );
}

export default ModalImport;
