import { useState } from 'react';

// component
import { Button } from '@/components';
import CollapseShow from './collapse';

// style
import { styles } from './styles';

// third party
import { Modal, ModalHeader, ModalBody, Input, Form, Spinner, FormGroup, Label } from 'reactstrap';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// service
import { parseOrder } from '@/services/order';


function ModalParseData({
  modalContentStyle, 
  modalBodyStyle, 
  handleClickCancelled, 
  handleClickSubmit,
  selectedOption,
  setSelectedOption}) {
    
  // validation
  const schema = Yup.object().shape({
    data: Yup.string().required(' '),
  });

  // state
  const [isOpen] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  // hooks
  const {
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setValue,
    setError,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (value) => {
      setLoadingButton(true);
      const parsedData = value.data;
      const requestBody = { data: parsedData };
      const response = await parseOrder(requestBody);
      if (response.status === 200) {
        handleClickSubmit(response?.data?.data);
      } else if (response.status === 500) {
        setLoadingButton(false);
        setError('data', {
          type: 'manual',
          message: response?.errors?.trace,
        });
      } else if (response.status === 400) {
        setLoadingButton(false);
        setError('data', {
          type: 'manual',
          message: response?.errors?.message,
        });
      }
  };

  const handleClickTypeShipping = (option) => {
    setSelectedOption(prevOption => (prevOption === option ? null : option));
  };

  return (
    <div>
      <Modal isOpen={isOpen} style={{ ...modalContentStyle }} size="lg">
        <ModalHeader className="border-0 p-4">
          <p className="fs-3">Parse Data</p>
        </ModalHeader>
        <ModalBody
          className="bg-white"
          style={{
            ...modalBodyStyle,
          }}
        >
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                invalid={!!errors.data}
                type="textarea"
                placeholder="Masukan Data"
                style={styles.TextArea}
                onChange={(e) => {
                  setValue('data', e.target.value);
                  trigger('data');
                }}
              />
              {errors.data && <p style={styles.titleInfoError} className="text-danger">{errors.data.message}</p>}
              <p style={styles.titleInfo} className={errors.data ? 'd-none' : 'd-block'}>
                Pastikan memasukan data yang sesuai untuk menghindari kesalahan
                yang terjadi
              </p>
            </div>
            <div className="mt-3">
              <p style={styles.titleChoice}>
                Silakan pilih jenis pengiriman yang ingin digunakan:
              </p>
            <div style={styles.checkboxWrapper}>
              <FormGroup>
                <Input 
                type="checkbox" 
                style={styles.checkbox} 
                checked={selectedOption === 1}
                onChange={() => handleClickTypeShipping(1)}
                />
                  <Label style={styles.label}>
                    Pengiriman Bebas Kirim
                  </Label>
              </FormGroup>
              <FormGroup style={{marginLeft: 20}}>
                <Input 
                type="checkbox" 
                style={styles.checkbox} 
                checked={selectedOption === 2}
                onChange={() => handleClickTypeShipping(2)}
                />
                  <Label style={styles.label}>
                    Pengiriman Sendiri
                  </Label>
              </FormGroup>
            </div>
            </div>
            <div className="my-3">
              <CollapseShow />
              <div style={styles.ButtonContainer}>
                <Button
                  style={{ width: 168, fontSize: 14 }}
                  className={'justify-center text-primary'}
                  onClick={handleClickCancelled}
                >
                  Kembali
                </Button>
                <Button
                  type={loadingButton ? 'button' : 'submit'}
                  disabled={!isValid || !selectedOption}
                  style={{ width: 150, height: 40, fontSize: 14 }}
                  className={`${
                    !isValid || !selectedOption ? 'btn-disabled' : 'btn-primary'
                  } justify-center`}
                  color="primary"
                >
                   {loadingButton ? (
                <Spinner size="sm" color="light" />
              ) : (
                'Parse Data'
              )}
                </Button>
              </div>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalParseData;
