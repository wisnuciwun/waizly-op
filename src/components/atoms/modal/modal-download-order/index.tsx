/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Spinner,
  FormGroup,
} from 'reactstrap';
import Image from 'next/image';
import Button from '../../button';
import { Controller, useForm } from 'react-hook-form';
import { getOptionExport } from '@/utils/getSelectOption';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '../../select';
import { convertDate, decraseMonth, UseDelay } from '@/utils/formater';
import DatePicker from 'react-datepicker';

import { useSelector } from 'react-redux';
import moment from 'moment';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { getLocationDropdown } from '@/services/order';
import { exportInbound, exportPurchaseOrder, exportTranfer } from '@/services/inventory';

const schema = yup.object().shape({
  type_export: yup.string().required('Harap memilih Tipe File'),
  warehouse: yup.string().required('Harap memilih Gudang'),
});

interface Props {
  icon?: any;
  modalContentStyle?: any;
  modalBodyStyle?: any;
  handleClickYes?: any;
  handleClickCancelled?: any;
  widthImage?: any;
  heightImage?: any;
  isOpen?: boolean;
  type: 'PURCHASE_ORDER' | 'INBOUND' | 'TRANSFER';
}

function ModalDownload({
  icon,
  modalContentStyle,
  modalBodyStyle,
  handleClickYes,
  handleClickCancelled,
  widthImage,
  heightImage,
  isOpen,
  type
}: Props) {
  const { client_id } = useSelector((state: any) => state?.auth?.user);
  const [loadingButton, setLoadingButton] = useState(false);
  const [rangeDate, setRangeDate] = useState({ start: null, end: null });
  const [warehouse, setWarehouse] = useState<string>('');
  const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
  const [error, setError] = useState({date: '', warehouse: ''});
  const [openDate, setOpenDate] = useState<boolean>(false);
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

    const onRangeChange = (dates: any) => {
      setError({
        date: '',
        warehouse: error.warehouse
      });
        const [start, end] = dates;
        setRangeDate({ start, end });
        if (start && end) {
            setOpenDate(false);
        }
    };
    const handleCalendarClose = () => {
        if (rangeDate.start && !rangeDate.end) {
        const today = new Date();
        setRangeDate({ start: today, end: today });
        }
    };
    const difFromToday = () => {
        let dateFrom = moment(rangeDate.start).add(7, 'hours');
        let dateTo = moment(new Date());
        const diff =  dateTo.diff(dateFrom, 'days');
        if(diff > 30) {
            return 30;
        }
        return diff;
    };
    const getListLocation = async() => {
        const response = await getLocationDropdown(client_id);
        if(response && response.data) {
            let datas: any[] = [];

            response.data.forEach((data) => {
                datas.push({
                    value: data.location_id.toString(),
                    name: data.location_name,
                });
            });

            setListWarehouse(datas);
        }
        
  };

  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);
      const dateStart = new Date(convertDate(rangeDate.start));
      const start = dateStart.getTime()/1000;
      const dateEnd = new Date(convertDate(rangeDate.end));
      dateEnd.setHours(23,59,59);
      const end = dateEnd.getTime()/1000;
      const payload = {
        client_id,
        start_date: start,
        end_date: end,
        location_id: [data?.warehouse],
        file_type: data?.type_export,
      };
      const fileName = `report_inventory_${type}_${new Date().getTime()}.${data.type_export}`;
      let response: any = {};
      if(type === 'PURCHASE_ORDER') {
        response = await exportPurchaseOrder(payload);
      } else if (type === 'INBOUND') {
        response = await exportInbound(payload);
      } else {
        response = await exportTranfer(payload);
      }
      
      if (response) {
        const url = window.URL.createObjectURL(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        );
        const link = document.createElement('a');
  
        link.href = url;
        link.setAttribute('download', fileName);
  
        document.body.appendChild(link);
        link.click();
  
        link.remove();
      }
  
      await UseDelay(1000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
      onCancelledExport();
      setRangeDate({ start: null, end: null });
      setWarehouse('');
    }
  };

    useEffect(()=> {
        getListLocation();
    },[]);

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
          height: error.date ? 380 : 360
        }}
      >
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label htmlFor={'warehouse'} style={{ fontWeight: 700 }}>
                  Gudang<span className="text-color-danger">*</span>
              </Label>
              <Controller
                  name={'warehouse'}
                  control={control}
                  render={({ field }) => {
                  const { value, onChange } = field;
                  return (
                    <>
                      <Select
                          placeholderText={'Pilih...'}
                          {...field}
                          value={
                            listWarehouse.find(
                              (option) => option.value === value
                            ) || null
                          }
                          options={listWarehouse}
                          onChange={(selectedOption) => {
                            onChange(selectedOption?.value);
                          }}
                          getOptionLabel={(option) => option.name}
                          register={register}
                          getOptionValue={(option) => option.value}
                          placeholder={'Pilih Gudang'}
                          isValid={!!errors.warehouse}
                      />
                    </>
                  );
                  }}
                />
                <span
                    className="text-danger position-absolute"
                    style={{ fontSize: 12 }}
                >
                    {errors.warehouse?.message}
                </span>
            </FormGroup>
            
            <FormGroup>
                <Label htmlFor="date" style={{ fontWeight: 700 }}>
                 Rentang Tanggal<span className="text-color-danger">*</span>
                </Label>
                <DatePicker
                    selected={rangeDate.start}
                    startDate={rangeDate.start}
                    onChange={onRangeChange}
                    placeholderText={'Pilih Rentang Tanggal'}
                    onCalendarClose={handleCalendarClose}
                    endDate={rangeDate.end}
                    
                    selectsRange
                    showIcon={rangeDate.start == null}
                    isClearable
                    className="form-control"
                    onChangeRaw={(e) => e.preventDefault()}
                    maxDate={new Date()}
                    minDate={decraseMonth(new Date(), 3)}
                    dateFormat="dd/MM/yyyy"
                    open={openDate}
                    onFocus={()=> setOpenDate(true)}
                    onBlur={()=> {
                      if(!rangeDate.start) {
                        setError({
                          date: 'Harap Memilih Rentang Tanggal',
                          warehouse: error.warehouse
                        });}
                    }}
                    onClickOutside={() => {
                      if(!rangeDate.start) {
                        setError({
                          date: 'Harap Memilih Rentang Tanggal',
                          warehouse: error.warehouse
                        });}
                        setOpenDate(false);
                    }}
                    icon={
                      <svg
                          viewBox="0 0 18 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={()=> setOpenDate(true)}
                      >
                          <path
                          d="M4 11.6602C4 11.4388 4.07812 11.25 4.23438 11.0938C4.40365 10.9245 4.60547 10.8398 4.83984 10.8398H7.33984C7.5612 10.8398 7.75 10.9245 7.90625 11.0938C8.07552 11.25 8.16016 11.4388 8.16016 11.6602C8.16016 11.8945 8.07552 12.0964 7.90625 12.2656C7.75 12.4219 7.5612 12.5 7.33984 12.5H4.83984C4.60547 12.5 4.40365 12.4219 4.23438 12.2656C4.07812 12.0964 4 11.8945 4 11.6602ZM10.25 12.5H13.5898C13.8112 12.5 14 12.4219 14.1562 12.2656C14.3255 12.0964 14.4102 11.8945 14.4102 11.6602C14.4102 11.4388 14.3255 11.25 14.1562 11.0938C14 10.9245 13.8112 10.8398 13.5898 10.8398H10.25C10.0156 10.8398 9.8138 10.9245 9.64453 11.0938C9.48828 11.25 9.41016 11.4388 9.41016 11.6602C9.41016 11.8945 9.48828 12.0964 9.64453 12.2656C9.8138 12.4219 10.0156 12.5 10.25 12.5ZM17.3398 5V14.1602C17.3398 14.8503 17.0924 15.4427 16.5977 15.9375C16.1159 16.4193 15.5299 16.6602 14.8398 16.6602H3.16016C2.47005 16.6602 1.8776 16.4193 1.38281 15.9375C0.901042 15.4427 0.660156 14.8503 0.660156 14.1602V5C0.660156 4.3099 0.901042 3.72396 1.38281 3.24219C1.8776 2.7474 2.47005 2.5 3.16016 2.5H4.83984V1.66016C4.83984 1.4388 4.91797 1.25 5.07422 1.09375C5.24349 0.924479 5.4388 0.839844 5.66016 0.839844C5.89453 0.839844 6.08984 0.924479 6.24609 1.09375C6.41536 1.25 6.5 1.4388 6.5 1.66016V2.5H11.5V1.66016C11.5 1.4388 11.5781 1.25 11.7344 1.09375C11.9036 0.924479 12.1055 0.839844 12.3398 0.839844C12.5612 0.839844 12.75 0.924479 12.9062 1.09375C13.0755 1.25 13.1602 1.4388 13.1602 1.66016V2.5H14.8398C15.5299 2.5 16.1159 2.7474 16.5977 3.24219C17.0924 3.72396 17.3398 4.3099 17.3398 5ZM2.33984 7.5H15.6602V5C15.6602 4.76562 15.5755 4.57031 15.4062 4.41406C15.25 4.24479 15.0612 4.16016 14.8398 4.16016H13.1602V5C13.1602 5.23438 13.0755 5.4362 12.9062 5.60547C12.75 5.76172 12.5612 5.83984 12.3398 5.83984C12.1055 5.83984 11.9036 5.76172 11.7344 5.60547C11.5781 5.4362 11.5 5.23438 11.5 5V4.16016H6.5V5C6.5 5.23438 6.41536 5.4362 6.24609 5.60547C6.08984 5.76172 5.89453 5.83984 5.66016 5.83984C5.4388 5.83984 5.24349 5.76172 5.07422 5.60547C4.91797 5.4362 4.83984 5.23438 4.83984 5V4.16016H3.16016C2.9388 4.16016 2.74349 4.24479 2.57422 4.41406C2.41797 4.57031 2.33984 4.76562 2.33984 5V7.5ZM15.6602 9.16016H2.33984V14.1602C2.33984 14.3945 2.41797 14.5964 2.57422 14.7656C2.74349 14.9219 2.9388 15 3.16016 15H14.8398C15.0612 15 15.25 14.9219 15.4062 14.7656C15.5755 14.5964 15.6602 14.3945 15.6602 14.1602V9.16016Z"
                          fill="#203864"
                          />
                      </svg>
                    }
                />
                <span
                  className="text-danger"
                  style={{ fontSize: 12, marginTop: -22 }}
                >
                  {error.date}
                </span>
            </FormGroup>
            <FormGroup>
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
                          placeholderText={'Pilih...'}
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
            </FormGroup>
            {/* <FormGroup>
              <InputSelect
                id={'warehouse'}
                label={'Gudang'}
                required
                placeholder={'Pilih Gudang'}
                value={warehouse}
                onChange={(value) => {
                  setError({
                    date: error.date,
                    warehouse: ''
                  });
                  setWarehouse(value);
                }}
                options={listWarehouse}
                onBlur={()=> {
                  console.log("onblur gars")
                  setTimeout(() => {
                    if(!warehouse) {
                      setError({
                        date: error.date,
                        warehouse: 'Harap Memilih Gudang'
                      });}
                  }, 8000);
                  
                }}
              />
              <span
                className="text-danger position-absolute"
                style={{ fontSize: 12, marginTop: -22 }}
              >
                {error.warehouse}
              </span>
            </FormGroup> */}
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
              disabled={!isValid || !rangeDate.start}
              className={`btn center shadow-none ${
                !isValid || !rangeDate.start ? 'btn-disabled' : 'btn-primary'
              }`}
              style={{ width: 168, fontSize: 14 }}
              onClick={handleClickYes}
            >
              {loadingButton ? (
                <Spinner size="sm" color="light" />
              ) : (
                `${type === 'INBOUND' ? 'Unduh Inbound' : type === 'TRANSFER' ? 'Unduh Transfer' : 'Unduh Pembelian'}`
              )}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default ModalDownload;
