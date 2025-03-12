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

// component
import {
  Row,
  Col,
  Label,
  Form,
  Spinner,
  Input,
  FormFeedback,
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import {
  Block,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Button,
  DropdownOption,
  Icon,
  EmptyDataProductSku,
  Select,
  ModalConfirm,
  ModalCancel,
  InfoWarning,
} from '@/components';
import { PreviewCard } from '@/components/molecules/preview/index';
import DatePicker from 'react-datepicker';

// asset
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifSuccess from '@/assets/gift/Highfive.gif';

// utils
import classNames from 'classnames';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';

// redux & service
import { useSelector } from 'react-redux';

import { getCourier, getLocationDropdown } from '@/services/order';
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';
import Product from '@/components/organism/product-sku-table/styles';
import { clearEmojiInput } from '@/utils/formater';
import {
  getOrderDetail,
  patchPurchaseOrder,
  postCreateOrder,
} from '@/services/inventory';
import { uniq } from 'lodash';
import { formatCurrency } from '@/utils/formatCurrency';
import ListTableProduct from '@/components/molecules/table/table-inventory/table-sku';
import Head from 'next/head';
import {
  SKUFormInfo,
  SKUTableHead,
  styles,
} from '@/components/organism/inventory-purchasing';

const InventoryPurchaseForm = ({ alter = false, edit = false }) => {
  const [listCourier, setListCourier] = useState<SelectItemOptionsType>([]);
  const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [ismodalSuccess, setismodalSuccess] = useState(false);
  const [showAddSKUPage, setshowAddSKUPage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idSearch = searchParams.get('id');
  const [courierNumber, setcourierNumber] = useState<string>('');
  const [externalId, setexternalId] = useState<string>('');
  const [supplier, setsupplier] = useState<string>('');
  const [note, setnote] = useState<string>('');
  const [courier, setcourier] = useState<any>('');
  const { client_id } = useSelector((state: any) => state.auth.user);
  const [list, setlist] = useState([]);
  const [alreadyChanged, setalreadyChanged] = useState(false);

  const schema = yup.object().shape({
    purchase_date: yup.string(),
    warehouse: yup
      .string()
      .trim()
      .required('Harap mengisi Gudang Tujuan di Bebas Kirim'),
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getListLocation = async () => {
    const response = await getLocationDropdown(client_id);
    if (response && response.data) {
      let datas: SelectItem[] = [];

      response.data.forEach((data) => {
        datas.push({
          value: data.location_id.toString(),
          label: data.location_name,
        });
      });
      setListWarehouse(datas);
    }
  };

  const handleGetCourier = async () => {
    const response = await getCourier();

    if (response?.status == 200) {
      let datas = [];

      response.data.forEach((data) => {
        datas.push({
          value: data.logistic_carrier_id,
          label: data.logistic_carrier,
        });
      });

      setListCourier(datas);
    }
  };

  const validateValueForBackBtn = () => {
    if (!alreadyChanged) {
      router.back();
    } else {
      setisModalOpen(true);
    }
  };

  const onFormSubmit = async (data: any) => {
    const payload = {
      purchase_date: moment(data.purchase_date).format('DD/MM/YYYY'),
      client_id: client_id,
      location_id: parseInt(data.warehouse),
      tracking_number: courierNumber,
      external_id: externalId,
      supplier_name: supplier,
      logistic_id: courier?.value || null,
      notes: note,
      products: list.length != 0 && list.filter((v) => v.quantity),
    };

    if (edit) {
      setLoading(true);
      await patchPurchaseOrder(idSearch, payload).then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          setismodalSuccess(true);
          setTimeout(() => {
            router.push('/inventory/list-table/pembelian');
          }, 3000);
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(true);
      await postCreateOrder(payload).then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          setismodalSuccess(true);
          setTimeout(() => {
            router.push('/inventory/list-table/pembelian');
          }, 3000);
        } else {
          setLoading(false);
        }
      });
    }
  };

  const onChangeDeleteProduct = (id) => {
    !alreadyChanged && setalreadyChanged(true);
    let newList = [...list];
    newList.splice(id, 1);
    setlist(newList);
  };

  const onChangeQuantityOrPrice = (id, type, value) => {
    !alreadyChanged && setalreadyChanged(true);
    let newList = [...list];
    newList[id][type] = value;
    setlist(newList);
  };

  const handleGetPurchaseDetail = async () => {
    await getOrderDetail(idSearch).then((res) => {
      if (res?.status == 200) {
        const data = res.data;
        const courierValue = listCourier.filter(
          (v) => v.value == data.courier_id
        )[0];

        setValue('purchase_date', data.purchase_date);
        setValue('warehouse', data.location);
        setcourierNumber(data.tracking_number);
        setexternalId(data.external_purchase_code);
        setsupplier(data.supplier_name);
        setcourier(courierValue);
        setlist(
          data.purchase_details.map((v) => {
            return {
              ...v,
              unit_price: parseInt(v.unit_price),
            };
          })
        );
        setnote(data.notes);
        control._updateValid(true);
      }
    });
  };

  useEffect(() => {
    getListLocation();
    handleGetCourier();
  }, []);

  useEffect(() => {
    if (idSearch != null && edit && listCourier.length != 0) {
      handleGetPurchaseDetail();
    }
  }, [idSearch, listCourier]);

  const formClass = classNames({
    'form-validate': true,
    'is-alter': alter,
  });

  return (
    <>
      <Head>
        <title>{edit ? 'Edit' : 'Tambah'} Pembelian | Bebas Kirim</title>
      </Head>
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
                        INVENTORI&nbsp;&nbsp;/&nbsp;&nbsp;PEMBELIAN&nbsp;&nbsp;/&nbsp;&nbsp;
                        <span style={{ color: '#BDC0C7' }}>
                          {edit ? 'Edit' : 'Tambah'} Pembelian
                        </span>
                      </p>
                    </li>
                  </ul>
                </BlockHeadContent>
              </BlockBetween>
              <Form
                noValidate
                onSubmit={
                  alreadyChanged &&
                  isValid &&
                  list.length != 0 &&
                  !list.some((v) => !v.quantity)
                    ? handleSubmit(onFormSubmit)
                    : (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                }
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
                      <BlockTitle fontSize={32}>
                        {edit ? 'Edit Pembelian' : 'Tambah Pembelian'}
                      </BlockTitle>
                    </BlockHeadContent>
                  </BlockBetween>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="purchase_date"
                        style={{ fontWeight: 'bold' }}
                      >
                        Waktu Pembelian
                      </Label>
                      {edit ? (
                        <OrderInfo.ContainerTime>
                          <Input value={getValues('purchase_date')} disabled />
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
                      ) : (
                        <Controller
                          name="purchase_date"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;

                            return (
                              <>
                                <div className="form-control-wrap">
                                  <OrderInfo.ContainerTime>
                                    <DatePicker
                                      dateFormat="dd/MM/yyyy"
                                      name="purchase_date"
                                      disabled={edit}
                                      className={`form-control ${
                                        errors.purchase_date?.message
                                          ? 'border-danger'
                                          : ''
                                      }`}
                                      selected={value}
                                      onChange={(date) => {
                                        onChange(date);
                                      }}
                                      placeholderText={
                                        'Masukkan Waktu Pembelian'
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
                                  <Input
                                    hidden
                                    {...field}
                                    invalid={!!errors.purchase_date?.message}
                                    value={value}
                                  />
                                  <FormFeedback>
                                    <span
                                      className="text-danger position-absolute"
                                      style={{ fontSize: 12 }}
                                    >
                                      {errors.purchase_date?.message}
                                    </span>
                                  </FormFeedback>
                                </div>
                              </>
                            );
                          }}
                        />
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="store_url"
                        style={{ fontWeight: 'bold' }}
                      >
                        Gudang Tujuan
                        <span style={{ color: 'red' }}>*</span>
                      </Label>
                      {edit ? (
                        <OrderInfo.ContainerTime>
                          <Input
                            style={{ paddingRight: 30 }}
                            value={getValues('warehouse')}
                            disabled
                          />
                          <Icon
                            className="position-absolute"
                            style={{
                              right: 0,
                              marginRight: 10,
                              marginTop: 10,
                              fontSize: 16,
                            }}
                            name="chevron-down"
                          />
                        </OrderInfo.ContainerTime>
                      ) : (
                        <Controller
                          name="warehouse"
                          control={control}
                          render={({ field }) => {
                            const { value, onChange } = field;

                            return (
                              <>
                                <div className="form-control-wrap">
                                  <DropdownOption
                                    id={'warehouse'}
                                    required
                                    disabled={edit}
                                    placeholder={'Pilih Gudang Asal'}
                                    value={value}
                                    onChange={async (e) => {
                                      onChange(e.target.value);
                                    }}
                                    options={listWarehouse}
                                    className={
                                      errors.warehouse?.message
                                        ? 'p-invalid w-100'
                                        : 'w-100'
                                    }
                                    optionLabel="label"
                                    optionValue="value"
                                  />
                                </div>
                                <Input
                                  {...field}
                                  hidden
                                  invalid={!!errors.warehouse?.message}
                                  value={value}
                                />
                                <FormFeedback>
                                  <span
                                    className="text-danger position-absolute"
                                    style={{ fontSize: 12 }}
                                  >
                                    {errors.warehouse?.message}
                                  </span>
                                </FormFeedback>
                              </>
                            );
                          }}
                        />
                      )}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="courier_number"
                        style={{ fontWeight: 'bold' }}
                      >
                        Nomor Resi
                      </Label>
                      <div className="form-control-wrap">
                        <Input
                          type={'text'}
                          id="courier_number"
                          maxLength={50}
                          placeholder="Masukkan Nomor Resi"
                          className={'shadow-none field-input-border-primary'}
                          value={courierNumber}
                          onInput={(e) => clearEmojiInput(e)}
                          onChange={(e) => setcourierNumber(e.target.value)}
                        />
                      </div>
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
                      <div className="form-control-wrap">
                        <Input
                          type="text"
                          className="shadow-none field-input-border-primary"
                          id="external_id"
                          maxLength={50}
                          placeholder="Masukkan External ID"
                          value={externalId}
                          onInput={(e) => clearEmojiInput(e)}
                          onChange={(e) => setexternalId(e.target.value)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="supplier"
                        style={{ fontWeight: 'bold' }}
                      >
                        Pemasok
                      </Label>
                      <div className="form-control-wrap">
                        <Input
                          type={'text'}
                          id="supplier"
                          maxLength={50}
                          placeholder="Masukkan Pemasok"
                          className={'shadow-none field-input-border-primary'}
                          value={supplier}
                          onInput={(e) => clearEmojiInput(e)}
                          onChange={(e) => setsupplier(e.target.value)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <Label
                        className="form-label"
                        htmlFor="fv-topics"
                        style={{ fontWeight: 'bold' }}
                      >
                        Jasa Kirim
                      </Label>
                      <div className="form-control-wrap">
                        <Select
                          options={listCourier}
                          value={courier || undefined}
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                          onChange={(selectedOption) => {
                            setcourier(selectedOption);
                            !alreadyChanged && setalreadyChanged(true);
                          }}
                          placeholderText={'Pilih Jasa Kirim'}
                          isValid={false}
                        />
                      </div>
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
                    {list.length != 0 ? (
                      <>
                        <div style={{ overflowX: 'auto' }}>
                          <Product.Table>
                            <SKUTableHead />
                            {list.map((data, index) => (
                              <ListTableProduct
                                key={index}
                                image={data?.product_image_url || ''}
                                productName={data.product_name}
                                productCode={data?.product_sku}
                                quantity={data.quantity || ''}
                                setQuantity={(value) =>
                                  onChangeQuantityOrPrice(
                                    index,
                                    'quantity',
                                    value
                                  )
                                }
                                price={parseInt(data.unit_price)}
                                setPrice={(value) =>
                                  onChangeQuantityOrPrice(
                                    index,
                                    'unit_price',
                                    value
                                  )
                                }
                                totalProduct={parseInt(data.unit_price)}
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
                                        setalreadyChanged(true);
                                      setshowAddSKUPage(true);
                                    }}
                                    style={styles.underline}
                                  >
                                    {'+ Tambah SKU'}
                                  </Product.TextFooter>
                                </td>
                                <td className="ps-1">
                                  <span>
                                    Jumlah barang dibeli:{' '}
                                    {list
                                      .map((v) => v.quantity || 0)
                                      .reduce((x, y) => x + y)}
                                  </span>
                                </td>
                                <td className="ps-1">
                                  <span>
                                    Subtotal:{' '}
                                    <b>
                                      {' '}
                                      Rp{' '}
                                      {formatCurrency(
                                        parseFloat(
                                          list
                                            .map(
                                              (v) =>
                                                v.unit_price * v.quantity || 0
                                            )
                                            .reduce((x, y) => x + y)
                                            ?.toString()
                                        )
                                      )}{' '}
                                    </b>
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    Total SKU:{' '}
                                    {
                                      uniq(list.map((item) => item.product_sku))
                                        .length
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
                        overflow={list.length == 0 ? 'hidden' : 'scroll'}
                        border={list.length == 0 ? 'dashed' : 'solid'}
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
                                  Kamu belum menambahkan SKU Pesanan apa pun
                                </div>
                                <div className="d-flex justify-content-center">
                                  <Button
                                    size="lg"
                                    type="button"
                                    style={{ textAlign: 'center' }}
                                    className="btn center shadow-none btn-primary mt-2"
                                    onClick={() => {
                                      setshowAddSKUPage(true);
                                      !alreadyChanged &&
                                        setalreadyChanged(true);
                                    }}
                                  >
                                    Tambah Master SKU
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
                    <SKUFormInfo
                      list={list}
                      alreadyChanged={alreadyChanged}
                      edit={edit}
                    />
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
                      <div className="form-control-wrap">
                        <div className="form-control-wrap">
                          <Input
                            onChange={(e) => setnote(e.target.value)}
                            value={note}
                            type="textarea"
                            className="shadow-none field-input-border-primary"
                            id="note"
                            placeholder="Masukkan Catatan"
                            onInput={(e) => clearEmojiInput(e)}
                            maxLength={500}
                          />
                        </div>
                      </div>
                    </BlockHeadContent>
                  </Col>
                  <BlockHeadContent>
                    <ul className="nk-block-tools g-3 d-flex justify-content-end">
                      <li>
                        <div
                          className="toggle d-inline-flex"
                          style={{ cursor: 'pointer' }}
                        >
                          <span
                            style={{
                              fontWeight: 'bolder',
                              marginRight: '35px',
                            }}
                          >
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
                          style={{ width: 180, height: 43 }}
                          className={`btn center shadow-none ${
                            !alreadyChanged ||
                            !isValid ||
                            list.length == 0 ||
                            list.some((v) => !v.quantity)
                              ? 'btn-disabled'
                              : 'btn-primary'
                          }`}
                          type={'submit'}
                          disabled={
                            !alreadyChanged ||
                            !isValid ||
                            list.length == 0 ||
                            list.some((v) => !v.quantity)
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
                  </BlockHeadContent>
                </Row>
              </Form>
            </PreviewCard>
          </Block>
        </Content>
      </div>
      <AddSKUInventory
        backButton={() => setshowAddSKUPage(false)}
        setProduct={(v) => setlist(v)}
        product={list}
        edit={edit}
        show={showAddSKUPage}
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
          title={`Berhasil ${
            edit ? 'Memperbarui Pembelian' : 'Membuat Daftar Pembelian'
          }`}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
};
export default InventoryPurchaseForm;
