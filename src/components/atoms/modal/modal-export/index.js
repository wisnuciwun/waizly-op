import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Spinner,
} from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';
import { Controller, useForm } from 'react-hook-form';
import { getOptionExport } from '@/utils/getSelectOption';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../../select';
import { UseDelay } from '@/utils/formater';
import { UseExportBlob } from '@/utils/useExportBlob';
import { exportDataMasterSku } from '@/services/master';

import { useSelector } from 'react-redux';

const schema = yup.object().shape({
  type_export: yup.string().required('Harap memilih Tipe File'),
});

function ModalExport({
  icon,
  modalContentStyle,
  modalBodyStyle,
  handleClickYes,
  handleClickCancelled,
  widthImage,
  heightImage,
  isOpen,
}) {
  const { client_id } = useSelector((state) => state.auth.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    register,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onCancelledExport = () => {
    handleClickCancelled();
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);
      const payload = {
        client_id,
        file_type: data?.type_export,
      };
      const fileName = `report_${new Date().getTime()}.${data.type_export}`;
      const response = await exportDataMasterSku(payload);
      await UseExportBlob(response.data, fileName);
      await UseDelay(100);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
      onCancelledExport();
    }
  };

  return (
    <Modal
      toggle={onCancelledExport}
      isOpen={isOpen}
      style={{ ...modalContentStyle, overflow: 'hidden' }}
    >
      <ModalHeader className="border-0 p-0 center">
        <Image
          src={icon}
          width={widthImage}
          height={heightImage}
          alt="illustration"
          style={{ borderRadius: 16 }}
        />
      </ModalHeader>
      <ModalBody
        className="bg-white"
        style={{
          ...modalBodyStyle,
        }}
      >
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="type_export" style={{ fontWeight: 700 }}>
            Tipe File<span className="text-color-danger">*</span>
          </Label>
          <Controller
            name="type_export"
            control={control}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <>
                  <Select
                    {...field}
                    value={
                      getOptionExport.find(
                        (option) => option.value === value
                      ) || null
                    }
                    options={getOptionExport}
                    onChange={(selectedOption) => {
                      onChange(selectedOption?.value);
                    }}
                    getOptionLabel={(option) => option.name}
                    register={register}
                    getOptionValue={(option) => option.value}
                    placeholder={'Pilih Tipe File'}
                    isValid={!!errors.type_export}
                  />
                </>
              );
            }}
          />
          <span
            className="text-danger position-absolute"
            style={{ fontSize: 12 }}
          >
            {errors.type_export?.message}
          </span>

          <div className="flex justify-center" style={{ marginTop: 30 }}>
            <Button
              type="button"
              style={{ width: 168, fontSize: 14, color: '#203864' }}
              className={'justify-center'}
              onClick={onCancelledExport}
            >
              Kembali
            </Button>
            <Button
              type={loadingButton ? 'button' : 'submit'}
              disabled={!isValid}
              className={`btn center shadow-none ${
                !isValid ? 'btn-disabled' : 'btn-primary'
              }`}
              style={{ width: 168, fontSize: 14 }}
              onClick={handleClickYes}
            >
              {loadingButton ? (
                <Spinner size="sm" color="light" />
              ) : (
                'Unduh SKU'
              )}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default ModalExport;
