/* eslint-disable react-hooks/exhaustive-deps */
// react
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// layout
import Content from '@/layout/content/Content';
import OrderInfo from '@/layout/order/create/section/form-info-order/styles';
import AddSKUInventory from '../add-product-sku';
import ProductSku from '@/components/organism/mapping-product-sku/styles';
import {stylesFormInventory, TransferInfo} from './style';

// component
import { Row, Col, Label, Form, Spinner, Input } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { Block, BlockBetween, BlockHeadContent, Button, DropdownOption, Icon, EmptyDataProductSku, ModalConfirm, ModalCancel, InfoWarning } from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import DatePicker from 'react-datepicker';

// asset
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifSuccess from '@/assets/gift/Highfive.gif';
import Warning from '@/assets/gift/Anxiety.gif';

// utils
import classNames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { schemaInventoryTransfer } from '@/utils/validation/yup-validation';
import { getOptionStockInventoryTransfer } from '@/utils/getSelectOption';

// redux & service
import { useSelector } from 'react-redux';
import Product from '@/components/organism/product-sku-table/styles';
import { clearEmojiInput } from '@/utils/formater';
import { getTransferDetail, patchTrasnfer, postCreateTrasnfer } from '@/services/inventory';
import { uniq } from 'lodash';
import ListTableProduct from '@/components/molecules/table/table-inventory-transfer/table-sku';

interface WarehouseState {
  originValue: number;
  destinationValue: number;
}

const InventoryTransferForm = ({ 
  alter = false, 
  edit = false, 
  listWarehouseOrigin, 
  listWarehouseDestination,
  setSelectedOrigin,
  setSelectedDestination 
  }) => {
  const [sm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [ismodalSuccess, setismodalSuccess] = useState(false);
  const [showAddSKUPage, setshowAddSKUPage] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idSearch = searchParams.get('id');
  const { client_id } = useSelector((state: any) => state.auth.user);
  const [listSku, setListSku] = useState([]);
  const [alreadyChanged, setalreadyChanged] = useState(false);
  const [alreadyChangedSku, setalreadyChangedSku] = useState(false);
  const [warehouse, setWarehouse] = useState<WarehouseState>({
    originValue: null,
    destinationValue: null
  });

  // toggle for modal
  const toggle = () => setShowModalError(!showModalError);

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schemaInventoryTransfer),
  });

  const stockSourceValue = watch('stock_source');
  const originValue = watch('origin_warehouse');
  const destinationValue = watch('destination_warehouse');
  const watchAllFields = watch();

  const validateValueForBackBtn = () => {
    if (!alreadyChanged) {
      router.back();
    } else {
      setisModalOpen(true);
    }
  };

  const onFormSubmit = async (data: any) => {
    const payload = {
      client_id: client_id,
      transfer_date: moment(data.trasnfer_date).unix() || '',
      origin_id: edit ? warehouse.originValue : parseInt(data.origin_warehouse),
      destination_id: edit ? warehouse.destinationValue : parseInt(data.destination_warehouse),
      external_id: data.external_id || '',
      source_stock: data.stock_source,
      notes: data.note || '',
      items: listSku.length
        ? listSku
            .filter((v) => v.quantity)
            .map((v) => ({
              product_id: v.product_id,
              qty: v.quantity,
            }))
        : [],
    };
  
    setLoading(true);
  
    try {
      const response = edit
        ? await patchTrasnfer(idSearch, payload)
        : await postCreateTrasnfer(payload);
  
      if (response?.status === 201 || response?.status === 200) {
        setismodalSuccess(true);
        setTimeout(() => {
          router.push('/inventory/transfer');
        }, 3000);
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.type === 'INSUFFICIENT_STOCK' || 
        error.response?.data?.errors?.type === 'UNPROCESSABLE_REQUEST') {
        setShowModalError(true);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };  

  const onChangeDeleteProduct = (id) => {
    !alreadyChanged && setalreadyChangedSku(true);
    let newList = [...listSku];
    newList.splice(id, 1);
    setListSku(newList);
  };

  const onTransferStock = (id, type, value) => {
    !alreadyChanged && setalreadyChangedSku(true);
    let newList = [...listSku];
    newList[id][type] = value;
    setListSku(newList);
  };

  const handleGetPurchaseDetail = async () => {
    await getTransferDetail(idSearch).then((res) => {
      if (res?.status == 200) {
        const data = res.data;
        setWarehouse({
          originValue: data.transfer.origin_id,
          destinationValue: data.transfer.destination_id
        });
        setValue('destination_warehouse', data.transfer.destination_name);
        setValue('origin_warehouse', data.transfer.origin_name);
        setValue('trasnfer_date', moment(data?.transfer?.transfer_date).format('DD/MM/YY'));
        setValue('external_id', data.transfer.external_id);
        setValue('stock_source', data.transfer.source_stock);
        setListSku(
          data.transfer.items.map((v) => {
            return {
              ...v,
              quantity: parseInt(v.quantity),
            };
          })
        );
        setValue('note', data.transfer.notes);
        control._updateValid(true);
      }
    });
  };


  const formClass = classNames({
    'form-validate': true,
    'is-alter': alter,
  });

  useEffect(() => {
    if (edit) {
      handleGetPurchaseDetail();
    }
  }, [idSearch != null]);

  useEffect(() => {
    if (!edit) {
      const isAnyFieldChanged = Object.values(watchAllFields).some(value => value !== undefined);
      if (isAnyFieldChanged) {
        setalreadyChanged(true);
      }
    }
  }, [watchAllFields, edit]);
  
  return (
    <>
      <div hidden={showAddSKUPage}>
        <Content>
          <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
          <Block size="lg">
            <PreviewCard className="" bodyClass="">
              <BlockBetween>
                <BlockHeadContent>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <p style={{ color: '#203864', fontSize: 12 }}>
                        INVENTORI&nbsp;&nbsp;/&nbsp;&nbsp;TRANSFER&nbsp;&nbsp;/&nbsp;&nbsp;
                        <span style={{ color: '#BDC0C7' }}>
                          {edit ? 'Edit' : 'Tambah'} Transfer
                        </span>
                      </p>
                    </li>
                  </ul>
                </BlockHeadContent>
              </BlockBetween>
              <Form
                noValidate
                onSubmit={handleSubmit(onFormSubmit)}
                onChange={() => {
                  if (!alreadyChanged) {
                    setalreadyChanged(true);
                  }
                }}
                className={`${formClass} mt-4`}
              >
                <Row className="g-gs">
                  <BlockBetween>
                    <BlockHeadContent>
                      <h3 style={{fontSize: 32}}>{edit ? 'Edit' : 'Tambah'} Transfer</h3>
                    </BlockHeadContent>
                  </BlockBetween>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="origin_warehouse"
                        style={{ fontWeight: 'bold' }}
                      >
                        Gudang Asal
                        <span style={{ color: 'red' }}>*</span>
                      </Label>
                      {edit ? (
                        <>
                          <TransferInfo.ContainerTime>
                          <Input value={getValues('origin_warehouse')} disabled />
                          <Icon
                            className="position-absolute"
                            style={{
                              color: '#203864',
                              right: 0,
                              marginRight: 10,
                              marginTop: 8,
                              fontSize: 20,
                            }}
                            name="chevron-down"
                          />
                        </TransferInfo.ContainerTime>
                        </>
                      ) : ( 
                        <>
                          <Controller
                            name="origin_warehouse"
                            control={control}
                            render={({ field }) => {
                              const { value, onChange } = field;
                              return (
                                <>
                                  <div className="form-control-wrap">
                                    <DropdownOption
                                      id={'origin_warehouse'}
                                      required
                                      disabled={edit}
                                      placeholder={edit ? '' : 'Pilih Gudang Asal'}
                                      value={value}
                                      onChange={(e) => {
                                        onChange(e.target.value);
                                        setValue('origin_warehouse', e.target.value);
                                        trigger('origin_warehouse');
                                        setSelectedOrigin(e.target.value);
                                        setListSku([]);
                                      }}
                                      options={listWarehouseOrigin}
                                      className={
                                        errors.origin_warehouse?.message
                                          ? 'p-invalid w-100'
                                          : 'w-100'
                                      }
                                      optionLabel="label"
                                      optionValue="value"
                                    />
                                  </div>
                                  <span
                                    className="text-danger position-absolute"
                                    style={{ fontSize: 12 }}
                                  >
                                    {errors.origin_warehouse?.message}
                                  </span>
                                </>
                              );
                            }}
                          />
                        </>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="destination_warehouse"
                        style={{ fontWeight: 'bold' }}
                      >
                        Gudang Tujuan
                        <span style={{ color: 'red' }}>*</span>
                      </Label>
                      {edit ? (
                        <>
                          <TransferInfo.ContainerTime>
                          <Input value={getValues('destination_warehouse')} disabled />
                          <Icon
                            className="position-absolute"
                            style={{
                              color: '#203864',
                              right: 0,
                              marginRight: 10,
                              marginTop: 8,
                              fontSize: 20,
                            }}
                            name="chevron-down"
                          />
                        </TransferInfo.ContainerTime>
                        </>
                      ) : ( 
                      <>
                        <Controller
                          name="destination_warehouse"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;
                            return (
                              <>
                                <div className="form-control-wrap">
                                  <DropdownOption
                                    id={'destination_warehouse'}
                                    required
                                    disabled={edit}
                                    placeholder={edit ? '' : 'Pilih Gudang Tujuan'}
                                    value={value}
                                    onChange={(e) => {
                                      onChange(e.target.value);
                                      setValue('destination_warehouse', e.target.value);
                                      trigger('destination_warehouse');
                                      setSelectedDestination(e.target.value);
                                    }}
                                    options={listWarehouseDestination}
                                    className={
                                      errors.destination_warehouse?.message
                                        ? 'p-invalid w-100'
                                        : 'w-100'
                                    }
                                    optionLabel="label"
                                    optionValue="value"
                                  />
                                </div>
                                <span
                                  className="text-danger position-absolute"
                                  style={{ fontSize: 12 }}
                                >
                                  {errors.destination_warehouse?.message}
                                </span>
                              </>
                            );
                          }}
                        />
                      </> 
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="trasnfer_date"
                        style={{ fontWeight: 'bold' }}
                      >
                        Waktu Transfer
                      </Label>
                      {edit ? (
                        <>
                          <TransferInfo.ContainerTime>
                          <Input value={getValues('trasnfer_date')} disabled />
                          <Icon
                            className="position-absolute"
                            style={{
                              right: 0,
                              marginRight: 10,
                              marginTop: 10,
                              fontSize: 16,
                            }}
                            name="calendar"
                          />
                        </TransferInfo.ContainerTime>
                        </>
                      ) : (
                        <>
                        <Controller
                          name="trasnfer_date"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;
                            return (
                              <>
                                <div className="form-control-wrap">
                                  <OrderInfo.ContainerTime>
                                    <DatePicker
                                      dateFormat="dd/MM/yyyy"
                                      name="trasnfer_date"
                                      disabled={edit}
                                      className={'form-control'}
                                      selected={value}
                                      onChange={(date) => {
                                        onChange(date);
                                      }}
                                      placeholderText={
                                        edit ? '' : 'Masukkan Waktu Transfer'
                                      }
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                    <Icon
                                      className="position-absolute"
                                      style={{
                                        right: 0,
                                        marginRight: 10,
                                        marginTop: 10,
                                        fontSize: 16,
                                      }}
                                      name="calendar"
                                    />
                                  </OrderInfo.ContainerTime>
                                </div>
                              </>
                            );
                          }}
                        />
                        </>
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="external_id"
                        style={{ fontWeight: 'bold' }}
                      >
                        External ID
                      </Label>
                      <Controller 
                        name="external_id"
                        control={control}
                        render={({ field }) => {
                          const {value, onChange} = field;
                          return (
                            <>
                              <div className="form-control-wrap">
                                <Input
                                  type="text"
                                  className="shadow-none field-input-border-primary"
                                  id="external_id"
                                  maxLength={50}
                                  placeholder="Masukkan External ID"
                                  value={value}
                                  onInput={(e) => clearEmojiInput(e)}
                                  onChange={(e) => {
                                    onChange(e.target.value);
                                    setValue('external_id', e.target.value);
                                    trigger('external_id');
                                  }}
                                />
                              </div>
                            </>
                          );
                        }}
                      />
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="stock_source"
                        style={{ fontWeight: 'bold' }}
                      >
                        Sumber Stok
                        <span style={{ color: 'red' }}>*</span>
                      </Label>
                        <Controller
                          name="stock_source"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;
                            return (
                              <>
                                <div className="form-control-wrap">
                                  <DropdownOption
                                    id={'stock_source'}
                                    required
                                    disabled={edit}
                                    placeholder={edit ? '' : 'Pilih Sumber Stok'}
                                    value={value}
                                    onChange={async (e) => {
                                      onChange(e.target.value);
                                      setValue('stock_source', e.target.value);
                                      trigger('stock_source');
                                    }}
                                    options={getOptionStockInventoryTransfer}
                                    className={
                                      errors.stock_source?.message
                                        ? 'p-invalid w-100'
                                        : 'w-100'
                                    }
                                    optionLabel="name"
                                    optionValue="value"
                                  />
                                </div>
                                <span
                                  className="text-danger position-absolute"
                                  style={{ fontSize: 12 }}
                                >
                                  {errors.stock_source?.message}
                                </span>
                              </>
                            );
                          }}
                        />
                    </div>
                  </Col>
                  <Col md="12">
                    <Label
                      className="form-label"
                      htmlFor="store_url"
                      style={{ fontWeight: 'bold' }}
                    >
                      Master SKU
                      <span style={{ color: 'red' }}>*</span>
                    </Label>
                    {listSku.length != 0 ? (
                      <>
                        <div style={{ overflowX: 'auto' }}>
                          <Product.Table>
                            <thead
                              className="table-primary"
                              style={{ border: '1px solid #E9E9EA' }}
                            >
                              <tr style={stylesFormInventory.header}>
                                <th style={stylesFormInventory.listHeader}>Informasi SKU</th>
                                <th style={stylesFormInventory.listHeader}>
                                  Stok Saat Ini<span style={{ color: 'red' }}>*</span>
                                </th>
                                <th style={stylesFormInventory.listHeader}>Stok Transfer<span style={{ color: 'red' }}>*</span></th>
                                {true && (
                                  <th style={stylesFormInventory.listHeader}>Aksi</th>
                                )}
                              </tr>
                            </thead>
                            {listSku.map((data, index) => (
                              <ListTableProduct
                                key={index}
                                image={data?.image_path || ''}
                                productName={data?.name}
                                productCode={data?.sku}
                                transferStock={data?.quantity || ''}
                                setTransferStock={(value) =>
                                  onTransferStock(
                                    index,
                                    'quantity',
                                    value
                                  )
                                }
                                currentStock={getValues('stock_source') === 'goods' ? parseInt(data.available_quantity): parseInt(data.damages_quantity)}
                                // totalProduct={parseInt(data.available_quantity)}
                                onDelete={() => onChangeDeleteProduct(index)}
                              />
                            ))}
                            <tbody
                              style={{
                                whiteSpace: 'nowrap',
                                fontSize: 12,
                                border: '1px solid white',
                              }}
                            >
                              <tr
                                style={{
                                  fontSize: 12,
                                  fontWeight: 400,
                                  color: '#4C4F54',
                                }}
                              >
                                <td className="pt-2 pb-2">
                                  <Product.TextFooter
                                    onClick={() => {
                                      !alreadyChanged &&
                                      setalreadyChangedSku(true);
                                      setshowAddSKUPage(true);
                                    }}
                                    style={stylesFormInventory.underline}
                                  >
                                    {'+ Tambah SKU'}
                                  </Product.TextFooter>
                                </td>
                                <td style={{position: 'absolute', right: 25}} className="pt-2">
                                  <span>
                                    Total SKU:{' '}
                                    {
                                      uniq(listSku.map((item) => item.sku)).length 
                                    }
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </Product.Table>
                        </div>
                      </>
                    ) : (
                      <ProductSku.Container
                        overflow={listSku.length == 0 ? 'hidden' : 'scroll'}
                        border={listSku.length == 0 ? 'dashed' : 'solid'}
                        style={{ height: 251 }}
                      >
                        <EmptyDataProductSku
                          customStyle={{ marginTop: 22 }}
                          iconHeight={100}
                          iconWidth={150}
                          type={false ? 'sku' : 'product'}
                          text={
                            true ? (
                              <div className="mt-2 text-center">
                                <div>
                                  {'Kamu belum menambahkan SKU Pesanan apa pun'}
                                </div>
                                <div className="d-flex justify-content-center">
                                  <Button
                                    size="lg"
                                    style={{ textAlign: 'center' }}
                                    className={`btn center shadow-none mt-2 ${
                                      !stockSourceValue || !originValue || !destinationValue
                                      ? 'btn-disabled'
                                      : 'btn-primary'
                                    }`}
                                    disabled={!stockSourceValue || !originValue || !destinationValue}
                                    onClick={() => {
                                      setshowAddSKUPage(true);
                                      !alreadyChangedSku &&
                                      setalreadyChangedSku(true);
                                    }}
                                    type="button"
                                  >
                                    {'Tambah Master SKU'}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              'Data tidak ditemukan'
                            )
                          }
                        />
                      </ProductSku.Container>
                    )}
                    <div
                      hidden={
                        (listSku.length == 0 && !alreadyChangedSku) ||
                        (listSku.length != 0 && alreadyChangedSku) ||
                        (listSku.length != 0 && edit)
                      }
                      style={{ fontSize: 12 }}
                      className="text-end mt-2"
                    >
                      <div className="text-muted">SKU: 0</div>
                      <div className="text-danger">
                        Jumlah SKU dalam transfer minimal 1
                      </div>
                    </div>
                  </Col>
                  <Col md="12">
                    <BlockHeadContent>
                      <Label
                        className="form-label"
                        htmlFor="note"
                        style={{ fontWeight: 'bold' }}
                      >
                        Catatan
                      </Label>
                      <Controller 
                        name="note"
                        control={control}
                        render={({ field }) => {
                          const { value, onChange } = field;
                          return (
                            <>
                              <div className="form-control-wrap">
                                <Input
                                  value={value}
                                  type="textarea"
                                  className="shadow-none field-input-border-primary"
                                  style={{resize: 'none'}}
                                  id="note"
                                  placeholder="Masukkan Catatan"
                                  onInput={(e) => clearEmojiInput(e)}
                                  onChange={(e) => {
                                    onChange(e.target.value);
                                    setValue('note', e.target.value);
                                    trigger('note');
                                  }}
                                  maxLength={500}
                                />
                              </div>
                            </>
                          );
                        }}
                      />
                    </BlockHeadContent>
                  </Col>
                  <BlockHeadContent>
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <div
                        className="toggle-expand-content"
                        style={{ display: sm ? 'block' : 'none' }}
                      >
                        <ul className="nk-block-tools g-3 d-flex justify-content-end">
                          <li>
                            <div
                              className="toggle d-none d-md-inline-flex"
                              style={{ cursor: 'pointer' }}
                            >
                              <span style={{fontWeight: 'bolder', marginRight: '35px'}}>
                                <div
                                  className=" text-color-primary"
                                  onClick={() => validateValueForBackBtn()}
                                >
                                  Kembali
                                </div>
                              </span>
                            </div>
                          </li>
                          <li>
                            <Button
                              size="lg"
                              style={{ width: 180, height: 43, fontSize: 14 }}
                              className={`btn center shadow-none ${
                                !alreadyChanged ||
                                !isValid ||
                                listSku.length == 0 ||
                                listSku.some((v) => !v.quantity)
                                  ? 'btn-disabled'
                                  : 'btn-primary'
                              }`}
                              type={!alreadyChanged || !isValid || listSku.length == 0 || listSku.some((v) => !v.quantity) ? 'button' : 'submit'}
                              disabled={
                                !alreadyChanged ||
                                !isValid ||
                                listSku.length == 0 ||
                                listSku.some((v) => !v.quantity)
                              }
                            >
                              {loading ? (
                                <Spinner size="sm" color="light" />
                              ) : (
                                'Simpan'
                              )}
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </BlockHeadContent>
                </Row>
              </Form>
            </PreviewCard>
          </Block>
        </Content>
      </div>

      <AddSKUInventory
        backButton={() => setshowAddSKUPage(false)}
        setProduct={(v) => setListSku(v)}
        product={listSku}
        edit={edit}
        show={showAddSKUPage}
        originId={parseInt(getValues('origin_warehouse'))}
        werehouseOriginId={warehouse.originValue}
      />

      {isModalOpen && (
        <ModalCancel
          toggle={false}
          icon={gifConfirm}
          buttonConfirmStyle={{ height: 46 }}
          modalContentStyle={{ width: 400, height: 474 }}
          iconStyle={{ zoom: 1.2, objectFit: 'scale-down' }}
          footerStyle={{ marginTop: 30 }}
          widthImage={400}
          heightImage={333}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-120px',
            height: 194.413,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setisModalOpen(false)}
          handleClickYes={() => {
            setisModalOpen(false);
            router.back();
          }}
        />
      )}
      
      {ismodalSuccess && (
        <ModalConfirm
          hideCallback={() => {
            setismodalSuccess(false);
          }}
          subtitle=""
          useTimer={true}
          toggle={false}
          icon={gifSuccess}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
            marginLeft: '-25px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={`Berhasil\n${
            edit ? 'Memperbarui Pembelian' : 'Membuat Daftar Pembelian'
          }`}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {showModalError && (
        <ModalConfirm
          icon={Warning}
          widthImage={390}
          heightImage={320}
          modalContentStyle={{ width: 390 }}
          modalBodyStyle={{
            width: 440,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            marginLeft: '-25px',
            paddingLeft: 40,
            paddingRight: 40,
            marginBottom: 13,
            height: '140px',
          }}
          toggle={toggle}
          title={'Oops! Barang Tidak Cukup!'}
          subtitle={
            'Tidak dapat melakukan transfer karena jumlah stok yang ingin ditransfer, melebihi stok yang tersedia saat ini.'
          }
          useTimer={false}
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};

export default InventoryTransferForm;
