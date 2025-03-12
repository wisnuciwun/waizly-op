/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Create, { styles } from './styles';
import { Button, Input, InputSelect, ModalConfirm, ModalConfirmPopup } from '@/components';
import { Col, FormGroup, Label, Row, Spinner, Input as InputFromReactStrap } from 'reactstrap';
import { ProductSku } from '@/components/organism';
import { ProductListingProps, ProductSingelProps } from '@/utils/type/product';
import {
  ErrorForm,
  FormDataSingleSku,
  ImagesUploadState,
} from '@/utils/type/masterSku';
import ProductSingleSku from '@/components/organism/product-single-sku';
import {
  checkNotEmptyValueInObject,
  checkSapace,
  clearEmojiInput,
  checkValueListNull,
  inputNumber,
  lastPath,
} from '@/utils/formater';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import { useRouter } from 'next/router';
import UseCurrencyInput from '@/utils/useCurrencyInput';
import { convertTimestamp } from '@/utils/convertTimeStamp';
import colors from '@/utils/colors';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import DragAndDropUploadCard from '../drag-drop-upload';
import { getOptionManagedByEthix, getOptionManagedByProduct } from '@/utils/getSelectOption';
import gifAnxiety from '@/assets/gift/Anxiety.gif';
import CascaderCustomInput from '../cascader';

interface Props {
  title: string;
  listProductSync: ProductListingProps[] | null;
  listProductSingle: ProductSingelProps[] | null;
  dataForm: FormDataSingleSku;
  loading: boolean;
  loadingButton: boolean;
  errorField: 'NAME_IS_EXIST' | 'SKU_IS_EXIST' | null;
  formEdit?: string;
  edit: boolean;
  setValueSingle: (index: number, value: string) => void;
  onAddSingle: () => void;
  onDeleteSingle: (id: number) => void;
  setDataForm: (data: FormDataSingleSku) => void;
  onAddProduct: () => void;
  onDeleteProduct: (id: number) => void;
  onSave: () => void;
  setDataImagesUpload: React.Dispatch<React.SetStateAction<ImagesUploadState[]>>;
  dataImagesUpload: ImagesUploadState[];
}

const CreateBundleSku = ({
  title,
  listProductSync,
  listProductSingle,
  dataForm,
  loading,
  loadingButton,
  errorField,
  formEdit,
  edit,
  setValueSingle,
  onAddSingle,
  onDeleteSingle,
  setDataForm,
  onAddProduct,
  onDeleteProduct,
  onSave,
  setDataImagesUpload,
  dataImagesUpload,
}: Props) => {
  const route = useRouter();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [totalSku, setTotalSku] = useState<number>(0);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [indexImages,setIndexImages] = useState<number | null>(null);
  const [modalError, setModalError] = useState<boolean>(false);
  const [isFirstSelectEthix, setIsFirstSelectEthix] = useState<boolean>(edit && dataForm.managedByEthix == 'yes' ? true : false);
  const [errorForm, setErrorForm] = useState<ErrorForm>({
    skuName: false,
    skuCode: false,
    skuDescription: false,
    referencePrice: false,
    weightProduct: false,
    lengthProduct: false,
    widthProduct: false,
    heightProduct: false,
    outboundExp: false,
    inboundExp: false,
    barcode: false,
    outerBarcode: false,
    categorySku: false,
    conversionUnit: false,
    firstImageValue: false
  });
 const disabledConditionStorage = dataForm.managedByEthix === 'no' ||dataForm.managedByEthix === '';

  const handleDisableVolume = (total: number) => {
    if (
      dataForm.heightProduct ||
      dataForm.lengthProduct ||
      dataForm.widthProduct
    ) {
      if (
        !dataForm.heightProduct ||
        !dataForm.lengthProduct ||
        !dataForm.widthProduct
      ) {
        setDisableButton(true);
      } else {
        if (listProductSingle && listProductSingle.length > 0) {
          if (checkValueListNull(listProductSingle) || total < 2) {
            setDisableButton(true);
          } else setDisableButton(false);
        } else setDisableButton(true);
      }
    } else {
      if (listProductSingle && listProductSingle.length > 0) {
        if (checkValueListNull(listProductSingle) || total < 2) {
          setDisableButton(true);
        } else setDisableButton(false);
      } else setDisableButton(true);
    }
  };

  const handleValidation = (total: number) => {
    if(!edit){
      const checkFileValue = dataImagesUpload.filter(fileImages => fileImages.fileType !== null).map(fileImages => fileImages.fileType);
  
      const validateForm = (dataForm :FormDataSingleSku, checkFileValue) => {
        const requiredFields = [
          'skuName', 'skuCode', 'widthProduct', 'heightProduct',
          'lengthProduct', 'categorySku',
          'skuDescription', 'referencePrice', 
          'weightProduct'
        ];
      
        if (dataForm.managedByEthix === 'yes' && dataForm.managedByProduct === 'fefo') {
          requiredFields.push('outerBarcode', 'barcode', 'conversionUnit', 'outboundExp', 'inboundExp');
        } 
  
        if (dataForm.managedByEthix === 'yes' && (dataForm.managedByProduct === 'fifo'  || dataForm.managedByProduct === '')) {
          requiredFields.push('outerBarcode', 'barcode', 'conversionUnit');
        } 
      
        const hasMissingFields = requiredFields.some(field => !dataForm[field]);
      
        const hasNoFiles = checkFileValue.length === 0; 
  
        return hasMissingFields || hasNoFiles;
      };
      
      const disableButton = validateForm(dataForm, checkFileValue);
      setDisableButton(disableButton);
      
      if (!disableButton) {
        handleDisableVolume(total);
      }
    }

    const setToJsonValidation = dataImagesUpload.filter(fileImages => fileImages.imageBase64 !== null).map(fileImages => fileImages.imageBase64);

    const containsBase64 = (array: string[]) => {
      return array.some(item => item.startsWith('data:image/'));
    };

    const editData = `${JSON.stringify(dataForm)}${JSON.stringify(
      listProductSync
    )}${JSON.stringify(listProductSingle)}${JSON.stringify(setToJsonValidation)}`;

    if (formEdit) {
      if (formEdit === editData) {
        setDisableButton(true);
      } else {
        const isManagedByEthixInvalid = (dataForm) => {
          if (dataForm.managedByEthix === 'yes') {
            if (dataForm.managedByProduct === 'fefo') {
              return !dataForm.outerBarcode || !dataForm.barcode || !dataForm.conversionUnit || !dataForm.outboundExp || !dataForm.inboundExp;
            }
            if (dataForm.managedByProduct === 'fifo') {
              return !dataForm.outerBarcode || !dataForm.barcode || !dataForm.conversionUnit;
            }
          }
          return false;
        };
        
        const manageddByEthix = isManagedByEthixInvalid(dataForm);
        
        if (
          !dataForm.skuName || 
          !dataForm.skuCode ||
          !dataForm.widthProduct ||
          !dataForm.heightProduct ||
          !dataForm.lengthProduct ||
          !dataForm.categorySku ||
          !dataForm.skuDescription ||
          !dataForm.referencePrice ||
          !dataForm.weightProduct ||
          errorForm.firstImageValue ||
          manageddByEthix
        ) setDisableButton(true);
        else handleDisableVolume(total);
      }
    }
  };

  const handleCountSku = () => {
    let total: number = 0;

    listProductSingle.forEach((data) => {
      total += isNaN(data.quantity) ? 0 : data.quantity;
    });

    setTotalSku(total);
    handleValidation(total);
  };

  const handleBack = () => {
    if (
      checkNotEmptyValueInObject(dataForm) ||
      checkNotEmptyValueInObject(listProductSync) ||
      checkNotEmptyValueInObject(listProductSingle) ||
      checkNotEmptyValueInObject(dataImagesUpload)
    ) {
      if (edit) {
        const setToJsonValidation = dataImagesUpload.filter(fileImages => fileImages.imageBase64 !== null).map(fileImages => fileImages.imageBase64);

        const editData = `${JSON.stringify(dataForm)}${JSON.stringify(
          listProductSync
        )}${JSON.stringify(listProductSingle)}${JSON.stringify(setToJsonValidation)}`;
        if (formEdit) {
          if (formEdit === editData) {
            route.push('/master-sku');
          } else {
            setModalConfirm(true);
          }
        }
      } else {
        setModalConfirm(true);
      }
    } else {
      route.push('/master-sku');
    }
  };

  const handleDirectActivity = () => {
    const id = parseInt(lastPath(window.location.href));
    route.push({
      pathname: '/master-sku/activity-history',
      query: { id },
    });
  };

  const handleChangeName = (value: string) => {
    if (!value) setErrorForm({ ...errorForm, skuName: true });
    else setErrorForm({ ...errorForm, skuName: false });

    setDataForm({ ...dataForm, skuName: value });
  };

  const handleChangeCodeSku = (value: string) => {
    if (!value) setErrorForm({ ...errorForm, skuCode: true });
    else setErrorForm({ ...errorForm, skuCode: false });

    setDataForm({ ...dataForm, skuCode: value });
  };

  const handleChangeDescriptionSku = (value: string) => {
    if (!value) setErrorForm({ ...errorForm, skuDescription: true });
    else setErrorForm({ ...errorForm, skuDescription: false });

    setDataForm({ ...dataForm, skuDescription: value });
  };

  const handleChangeReferencePriceSku = (value: number) => {
    if (!value) setErrorForm({ ...errorForm, referencePrice: true });
    else setErrorForm({ ...errorForm, referencePrice: false });

    setDataForm({ ...dataForm, referencePrice: value });
  };

  const handleChangeBarcode = (value: string, keyDataForm: string) => {
    if (!value) setErrorForm({ ...errorForm, [keyDataForm]: true });
    else setErrorForm({ ...errorForm, [keyDataForm]: false });

    setDataForm({ ...dataForm, [keyDataForm]: checkSapace(value) });
  };

  const handleChangeExpiredBound = (value: string, keyDataForm: string) => {
    if (!value) setErrorForm({ ...errorForm, [keyDataForm]: true });
    else setErrorForm({ ...errorForm, [keyDataForm]: false });

    const parsedValue = parseInt(inputNumber(value, 6));
    setDataForm({ ...dataForm, [keyDataForm]: isNaN(parsedValue) ? '' : parsedValue });
  };

  const handleChangeInformationShipping = (value: number, keyDataForm: string) => {
    if (!value) setErrorForm({ ...errorForm, [keyDataForm]: true });
    else setErrorForm({ ...errorForm, [keyDataForm]: false });

    setDataForm({ ...dataForm, [keyDataForm]: value });
  };

  const getTaskPos = (id:number) => dataImagesUpload.findIndex(image => image.id === id);

  const handleDragEnd = (event: { active: any; over: any; }) => {
    const { active,over } = event;
    if(active.id === over.id) return;
    
    setDataImagesUpload((images) => {
      const activeIndex = getTaskPos(active.id);
      const overIndex = getTaskPos(over.id);
      
      if (images[activeIndex].imageBase64 === null || images[overIndex].imageBase64 === null) {
        return images;
      }
  
      return arrayMove(images, activeIndex, overIndex);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const removeAndShiftImages = (index: number) => {
    setDataImagesUpload((prevData) => {
      const newData = [...prevData];
      if (index < newData.length && (newData[index].imageBase64 !== null || newData[index].fileType !== null)) {
        for (let i = index; i < newData.length - 1; i++) {
          newData[i].imageBase64 = newData[i + 1].imageBase64;
          newData[i].fileType = newData[i + 1].fileType;
        }
        
        newData[newData.length - 1].imageBase64 = null;
        newData[newData.length - 1].fileType = null;
        
        const allValuesNull = newData.every(item => item.imageBase64 === null && item.fileType === null);
        if (index === 0 && allValuesNull) {
          setErrorForm({ ...errorForm, firstImageValue: true });
        } else setErrorForm({ ...errorForm, firstImageValue: false });
      }
      return newData;
    });
  };

  const filterDataByNullImageBase64 = (dataImagesUpload: any[]) => {
    const firstNullIndex = dataImagesUpload?.findIndex((item: { imageBase64: null; }) => item?.imageBase64 === null);
    const sliceLength = firstNullIndex === -1 ? dataImagesUpload?.length : firstNullIndex + 1;

    return dataImagesUpload?.slice(0, sliceLength);
  };

  useEffect(() => {
    if (listProductSingle) {
      handleCountSku();
    }
  }, [dataForm, listProductSync, listProductSingle, dataImagesUpload]);

  useEffect(() => {
    if(dataForm.managedByEthix === 'no') {
      setErrorForm({ ...errorForm, outerBarcode: false, barcode:false, conversionUnit: false, outboundExp: false, inboundExp: false});
      setDataForm({ ...dataForm, managedByProduct: 'fifo' });
    }
    if(dataForm.managedByProduct === 'fifo' && dataForm.managedByEthix === 'yes'){
      setErrorForm({ ...errorForm, outboundExp: false, inboundExp: false,conversionUnit: false});
    }
  }, [dataForm.managedByProduct, dataForm.managedByEthix]);

  return (
    <Create.Container>
      <Create.Breadcrumb>
        <Create.MainPage>{'MASTER SKU'}</Create.MainPage>
        <Create.MainPage>{'/'}</Create.MainPage>
        <Create.SubsPage>{title}</Create.SubsPage>
      </Create.Breadcrumb>

      <Create.ContainerWithLineBottom className="form-wrap">
          <p style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Informasi Dasar'}</p>
          <Row className={'mt-2'}>
             <Col lg={6} sm={12}>
              <Input
                id={'name_sku'}
                value={dataForm.skuName}
                label={'Nama SKU'}
                required
                invalid={
                  errorField === 'NAME_IS_EXIST' || errorForm?.skuName 
                }
                register={null}
                placeholder={'Masukan Nama SKU'}
                onChange={(value) => handleChangeName(checkSapace(value))}
                message={
                  errorField === 'NAME_IS_EXIST'
                    ? 'Nama SKU sudah pernah dipakai'
                    : errorForm?.skuName 
                    ? 'Harap mengisi Nama SKU'
                    : ''
                }
                maxLength={255}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
             </Col>

             <Col lg={6} sm={12}>
              <CascaderCustomInput 
                setValue={setDataForm} 
                dataForm={dataForm}
                edit={edit}
              />
            </Col>
          
            <Col lg={6} sm={12}>
              <Input
                id={'code_sku'}
                value={dataForm.skuCode}
                label={'Kode SKU'}
                required
                invalid={
                  errorField === 'SKU_IS_EXIST' || errorForm?.skuCode 
                }
                disabled={edit}
                register={null}
                placeholder={'Masukkan Kode SKU'}
                onChange={(value) => handleChangeCodeSku(checkSapace(value))}
                message={
                  errorField === 'SKU_IS_EXIST'
                    ? 'Kode SKU sudah pernah dipakai'
                    : errorForm?.skuCode 
                    ? 'Harap mengisi Kode SKU'
                    : ''
                }
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
                maxLength={50}
              />
            </Col>

            <Col lg={6} sm={12}>
              <Input
                id={'brand_sku'}
                value={dataForm.skuBrand}
                label={'Brand'}
                register={null}
                placeholder={'Masukan Nama Brand'}
                onChange={(value) => setDataForm({ ...dataForm, skuBrand: checkSapace(value) })}
                maxLength={100}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
            </Col>

            <Col lg={12} sm={12}>
              <Input
                id={'description_sku'}
                invalid={errorForm?.skuDescription}
                message={'Harap mengisi Deskripsi'}
                value={dataForm.skuDescription}
                label={'Deskripsi'}
                register={null}
                required
                onChange={(value) => handleChangeDescriptionSku(checkSapace(value))}
                type="textarea"
                placeholder={'Masukan Deskripsi'}
                maxLength={500}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
            </Col>
          </Row>
      </Create.ContainerWithLineBottom>

      <Create.ContainerWithLineBottom className="form-wrap">
        <p style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Informasi Produk'}</p>
        <Col lg={12} sm={12}>
          <Label style={{fontWeight: 'bold', color: colors.darkBlue}}>
              {'Unggah Foto Produk'}
              <span style={{color: colors.red}}>*</span>
          </Label>

          <p style={styles.TextDescriptionTitle}>
            Unggah maksimal 5 gambar produk.
            <br/>
            Ukuran masing-masing gambar maksimal 1mb.
          </p>
          <Row className={'mt-2 mb-3'} style={{gap:'1rem'}}>
            {/* <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <SortableContext items={dataImagesUpload} strategy={horizontalListSortingStrategy}> */}
                {filterDataByNullImageBase64(dataImagesUpload)?.map((imageUploaded: ImagesUploadState, index: number) => (
                    <DragAndDropUploadCard 
                      key={index}
                      id={imageUploaded.id}  
                      numberCard={index} 
                      setIndexImages={setIndexImages} 
                      setDataImagesUpload={setDataImagesUpload}
                      indexImages={indexImages} 
                      imageUploaded={imageUploaded}
                      removeAndShiftImages={removeAndShiftImages}
                      setModalError={setModalError}
                      setErrorForm={setErrorForm}
                      errorForm={errorForm}
                    />
                  ))}
               {/* </SortableContext>
            </DndContext> */}
          </Row>

          <Input
              id={'reference-price'}
              defaultValue={dataForm.referencePrice}
              label={'Harga Referensi'}
              invalid={errorForm?.referencePrice}
              register={null}
              placeholder={'Masukkan Harga Referensi'}
              onChange={(value) => handleChangeReferencePriceSku(parseFloat(value.replaceAll('.', '')))}
              required
              message={'Harap mengisi Harga Referensi'}
              maxLength={15}
              stickyLabel={'Rp'}
              onInput={(event) => {
                UseCurrencyInput(event, () => {}, 'reference-price', 12);
              }}
            />
        </Col>

        <Create.ContainerAdd>
          <Create.TitleCreate>
            {'Tambahkan Single SKU ke Bundling SKU'}{' '}
            <span style={styles.TextRequired}>*</span>
          </Create.TitleCreate>
          <Create.SubtitleCreate>
            {'Tambahkan beberapa Single SKU untuk membuat Bundling SKU'}
          </Create.SubtitleCreate>
          <ProductSingleSku
            list={listProductSingle}
            edit={edit}
            border={listProductSingle ? 'solid' : 'dashed'}
            onAddSingle={onAddSingle}
            setValueSingle={(index, value) => setValueSingle(index, value)}
            onDeleteSingle={(id) => onDeleteSingle(id)}
          />
        </Create.ContainerAdd>

        <Create.ContainerAdd>
          <Create.TextQuantity>
            {'Total Quantity: ' + totalSku}
          </Create.TextQuantity>
          {listProductSingle && totalSku < 2 && (
            <Create.TextMin>
              {'Total quantity Single SKU minimal 2'}
            </Create.TextMin>
          )}
        </Create.ContainerAdd>

        <Create.ContainerAdd>
          <Create.TitleCreate>{'Hubungan dengan Produk Toko'}</Create.TitleCreate>
          <Create.SubtitleCreate>
            {
              'Hubungkan Master SKU kamu dari Daftar Produk sehingga kamu dapat mengintegrasikan stok toko kamu'
            }
          </Create.SubtitleCreate>
          <ProductSku
            list={listProductSync}
            border={listProductSync ? 'solid' : 'dashed'}
            onAddProduct={onAddProduct}
            onDeleteProduct={(id) => onDeleteProduct(id)}
          />
        </Create.ContainerAdd>
      </Create.ContainerWithLineBottom>

      <Create.ContainerWithLineBottom className="form-wrap">
      <p style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Penyimpanan'}</p>
        <Row className={'mt-2'}>
          <Col lg={6} sm={12}>
              <InputSelect
                  id={'managedby-ethix'}
                  label={'Dikelola oleh ethix?'}
                  required
                  placeholder={'Type File'}
                   value={dataForm.managedByEthix ? dataForm.managedByEthix : 'no'}
                  onChange={(value) => {
                    if(!isFirstSelectEthix) {
                      setIsFirstSelectEthix(true);
                      setDataForm({ ...dataForm, barcode: '0',outerBarcode: '0',conversionUnit:'1', managedByEthix: value });
                    } else {
                      setDataForm({ ...dataForm, managedByEthix: value });
                    }
                  }}
                  options={getOptionManagedByEthix}
              />
            </Col>

            <Col lg={6} sm={12}>
            <InputSelect
                id={'managedby-produk'}
                label={'Tipe Pengelolaan Produk'}
                required
                disabled={disabledConditionStorage}
                placeholder={'Pilih Tipe Pengelolaan Produk'}
                value={dataForm.managedByProduct ? dataForm.managedByProduct : 'fifo'}
                onChange={(value) => setDataForm({ ...dataForm, managedByProduct: value })}
                options={getOptionManagedByProduct}
            />
          </Col>

          <Col lg={6} sm={12}>
            <Input
                id={'outbound-exp'}
                label={'Outbound Expired'}
                required
                type="number"
                disabled={disabledConditionStorage ||( dataForm.managedByProduct == 'fifo' ||dataForm.managedByProduct == '')}
                value={dataForm.outboundExp}
                onChange={(value) => handleChangeExpiredBound(value,'outboundExp')}
                stickyLabel={'Hari'}
                register={null}
                stickyPosition={'right'}
                invalid={errorForm?.outboundExp}
                message={'Harap mengisi Outbound Expired'}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
            />
          </Col>

          <Col lg={6} sm={12}>
            <Input
                  id={'inbound-exp'}
                  label={'Inbound Expired'}
                  required
                  type="number"
                  disabled={disabledConditionStorage ||( dataForm.managedByProduct == 'fifo' ||dataForm.managedByProduct == '')}
                  value={dataForm.inboundExp}
                  onChange={(value) => handleChangeExpiredBound(value,'inboundExp')}
                  stickyLabel={'Hari'}
                  register={null}
                  stickyPosition={'right'}
                  invalid={errorForm?.inboundExp}
                  message={'Harap mengisi Inbound Expired'}
                  onInput={(e) => {
                    clearEmojiInput(e);
                  }}
              />
          </Col>

          <Col lg={6} sm={12}>
            <Input
                id={'barcode'}
                label={'Barcode'}
                required
                disabled={disabledConditionStorage}
                value={dataForm.barcode}
                onChange={(value) => handleChangeBarcode(value, 'barcode')}
                register={null}
                invalid={errorForm?.barcode}
                message={'Harap mengisi Barcode'}
                maxLength={100}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
          </Col>

          <Col lg={6} sm={12}>
            <Input
                id={'outer-barcode'}
                label={'Outer Barcode'}
                required
                disabled={disabledConditionStorage}
                value={dataForm.outerBarcode}
                onChange={(value) => handleChangeBarcode(value, 'outerBarcode')}
                register={null}
                invalid={errorForm?.outerBarcode}
                message={'Harap mengisi Outer Barcode'}
                maxLength={100}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
          </Col>

          <Col lg={12} sm={12}>
              <Input
                id={'conversion-unit'}
                label={'Conversion Unit'}
                required
                disabled={disabledConditionStorage}
                value={dataForm.conversionUnit}
                onChange={(value) => handleChangeExpiredBound(value,'conversionUnit')}
                register={null}
                invalid={errorForm?.conversionUnit}
                message={'Harap mengisi Conversion Unit'}
                onInput={(e) => {
                  clearEmojiInput(e);
                }}
              />
          </Col>

          <Col lg={12} sm={12} style={styles.SpacingDividerCheckbox}>
            <FormGroup check>
              <InputFromReactStrap
                id={'advance-qc'}
                style={{fontSize:16}}
                type="checkbox"
                checked={dataForm.advanceQc}
                onChange={(value) =>  setDataForm({ ...dataForm, advanceQc: value.target.checked })}
              />
              <Label style={styles.LabelTextCheckbox} check>{'Advance QC'}</Label>
            </FormGroup>
            <FormGroup check>
              <InputFromReactStrap
                id={'production-batch'}
                type="checkbox"
                style={{fontSize:16}}
                checked={dataForm.productionBatch}
                onChange={(value) =>  setDataForm({ ...dataForm, productionBatch: value.target.checked })}
              />
              <Label style={styles.LabelTextCheckbox} check>{'Production Batch'}</Label>
            </FormGroup>
          </Col>
        </Row>
      </Create.ContainerWithLineBottom>

      <Create.ContainerWithLineBottom className="form-wrap" noBorder>
      <p style={{fontSize: 18 , fontWeight: '700', color: colors.darkBlue}}>{'Informasi Pengiriman'}</p>

        <Row className={'mt-3'}>
          <Col sm={12} lg={6}>
            <Input
              id={'product_weight'}
              value={dataForm.weightProduct || ''}
              label={'Berat Produk'}
              invalid={errorForm?.weightProduct}
              register={null}
              placeholder={'Masukkan Berat Produk'}
              onChange={(value) => handleChangeInformationShipping(parseInt(inputNumber(value, 6)),'weightProduct')}
              required
              message={'Harap mengisi Berat Produk'}
              stickyLabel={'gr'}
              stickyPosition={'right'}
            />
          </Col>

          <Col sm={12} lg={6}>
            <Input
              id={'product_length'}
              value={dataForm.lengthProduct || ''}
              label={'Panjang Produk'}
              invalid={errorForm?.lengthProduct}
              register={null}
              placeholder={'Masukkan Panjang Produk'}
              onChange={(value) => handleChangeInformationShipping(parseInt(inputNumber(value, 6)),'lengthProduct')}
              required
              message={'Harap mengisi Panjang Produk'}
              stickyLabel={'cm'}
              stickyPosition={'right'}
            />
          </Col>

          <Col sm={12} lg={6}>
            <Input
              id={'product_width'}
              value={dataForm.widthProduct || ''}
              label={'Lebar Produk'}
              invalid={errorForm?.widthProduct}
              register={null}
              placeholder={'Masukkan Lebar Produk'}
              onChange={(value) => handleChangeInformationShipping(parseInt(inputNumber(value, 6)),'widthProduct')}
              required
              message={'Harap mengisi Lebar Produk'}
              stickyLabel={'cm'}
              stickyPosition={'right'}
            />
          </Col>

          <Col sm={12} lg={6}>
            <Input
              id={'product_height'}
              value={dataForm.heightProduct || ''}
              label={'Tinggi Produk'}
              invalid={errorForm?.heightProduct}
              register={null}
              placeholder={'Masukkan Tinggi Produk'}
              onChange={(value) => handleChangeInformationShipping(parseInt(inputNumber(value, 6)),'heightProduct')}
              required
              message={'Harap mengisi Tinggi Produk'}
              stickyLabel={'cm'}
              stickyPosition={'right'}
            />
          </Col>
        </Row>
      </Create.ContainerWithLineBottom>

      {edit && (
        <Create.ContainerAdd>
          <Create.History onClick={handleDirectActivity}>
            {'Lihat Riwayat Aktivitas'}
          </Create.History>
        </Create.ContainerAdd>
      )}

      <Create.ContainerFooter edit={edit}>
        {edit && (
          <Create.ContainerTime>
            <Create.TitleTime>
              {'Waktu Dibuat: '}
              <span style={styles.ValueTime}>
                {convertTimestamp(dataForm.created)}
              </span>
            </Create.TitleTime>
            <Create.TitleTime>
              {'Terakhir Diperbarui: '}
              <span style={styles.ValueTime}>
                {convertTimestamp(dataForm.updated)}
              </span>
            </Create.TitleTime>
          </Create.ContainerTime>
        )}

        <Create.ContainerButton>
          <Button
            type={'button'}
            className={'justify-center'}
            style={styles.ButtonSecondary}
            onClick={() => handleBack()}
          >
            {'Kembali'}
          </Button>
          <Button
            type={'button'}
            className={`justify-center ${disableButton && 'btn-disabled'}`}
            style={styles.ButtonPrimary}
            color={'primary'}
            disabled={disableButton || loadingButton}
            onClick={onSave}
          >
            {loadingButton ? <Spinner size="sm" color="light" /> : 'Simpan'}
          </Button>
        </Create.ContainerButton>
      </Create.ContainerFooter>

      {modalConfirm && (
        <ModalConfirmPopup
          icon={gifConfirm}
          buttonConfirmation={true}
          handleClickYes={() => route.push('/master-sku')}
          handleClickCancelled={() => setModalConfirm(false)}
          modalContentStyle={styles.ModalContentStyle}
          modalBodyStyle={styles.ModalConfirm}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
        />
      )}

      {modalError &&
        <ModalConfirm
          icon={gifAnxiety}
          widthImage={350}
          heightImage={320}
          modalContentStyle={styles.ModalContentStyle}
          modalBodyStyle={styles.ModalConfirm}
          title={'Oops! Terjadi Kesalahan'}
          subtitle={'Ukuran gambar yang Anda unggah melebihi batas yang ditentukan. Silakan unggah gambar dengan ukuran yang lebih kecil dari 1 MB.'}
          toggle={false}
          hideCallback={() => setModalError(false)}
        />
      }
    </Create.Container>
  );
};

export default CreateBundleSku;
