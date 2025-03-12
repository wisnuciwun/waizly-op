/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {getMasterSku} from '@/services/master';
import {PaginationProps} from '@/utils/type';
import {ProductSingelProps} from '@/utils/type/product';
import React, {memo, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AddProduct, {styles} from './styles';
import {BlockTitle, DropdownOption, Icon, PaginationComponent, PagginationFilter, Button, ModalConfirmPopup} from '@/components';
import {Col, Input, Row} from 'reactstrap';
import {getOptionAddBundlingSku} from '@/utils/getSelectOption';
import {MappingSingelProduct} from '@/components/organism';
import colors from '@/utils/colors';
import {checkSameData, checkValueListNull} from '@/utils/formater';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';

interface Props {
  listSelected: ProductSingelProps[] | null;
  edit?: boolean;
  onSaveProduct: (data: ProductSingelProps[]) => void;
  onCancel: () => void;
}

const AddSingleProduct = ({listSelected, edit, onSaveProduct, onCancel}: Props) => {
  const {client_id} = useSelector((state: any) => state?.auth.user);
  const [listProduct, setListProduct] = useState<ProductSingelProps[] | null>(null);
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    size: 10,
    totalRecord: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState<ProductSingelProps[] | null>(null);
  const [listChecked, setListChecked] = useState<Array<number>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [selectedSearchOption, setSelectedSearchOption] = useState<string>('name');
  const [search, setSearch] = useState<string>('');
  const [totalSku, setTotalSku] = useState<number>(0);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);

  const getListProduct = async (paginations?: PaginationProps) => {
    setIsLoading(true);

    const payload = {
      client_id: client_id,
      type: 'SINGLE',
      name: selectedSearchOption == 'name' ? search : '',
      sku: selectedSearchOption == 'sku' ? search : '',
      sort_by: null,
      sort_type: null,
      page: paginations ? paginations.page : pagination.page,
      size: paginations ? paginations.size : pagination.size,
    };

    const response = await getMasterSku(payload);
    if (response) {
      setPagination((data) => ({...data, totalRecord: response.data.page_info.total_record}));
      let dataList: ProductSingelProps[] = [];

      response.data.products.forEach((data) => {
        dataList.push({
          id: data.id,
          sku: data.sku,
          name: data.name,
          price: data.price,
          product_type: data.product_type,
          created_at: data.created_at,
          quantity: null,
        });
      });
      setListProduct(dataList);
    }

    setIsLoading(false);
  };

  const handleSelectProduct = (data: ProductSingelProps) => {
    if (selectedProduct) {
      const sameData = selectedProduct.findIndex((item) => item.id === data.id);
      if (sameData == -1) {
        setListChecked((datas) => [...datas, data.id]);
        setSelectedProduct((datas) => [...datas, data]);
      } else handleDeleteSelected(data);
    } else {
      setSelectedProduct([data]);
      setListChecked([data.id]);
    }
  };

  const handleDeleteSelected = (list: ProductSingelProps) => {
    let dataSelected = [...selectedProduct];
    let arrSelected = [...listChecked];

    const listDeleted = dataSelected.filter((data) => data.id != list.id);
    const listArrayDeleted = arrSelected.filter((data) => data != list.id);

    setSelectedProduct(listDeleted);
    setListChecked(listArrayDeleted);
  };

  const handlePageChange = async (pageNumber: number) => {
    setPagination({...pagination, page: pageNumber});
    getListProduct({...pagination, page: pageNumber});
  };

  const handleSetPageSize = (value: number) => {
    setPagination({...pagination, page: 1, size: value});
    getListProduct({...pagination, page: 1, size: value});
  };

  const handleSetValue = (index: number, value: string) => {
    if (selectedProduct) {
      let dataValue = [...selectedProduct];
      dataValue[index].quantity = parseInt(value);
      setSelectedProduct(dataValue);
    }
  };

  const handleCountSku = () => {
    let total: number = 0;

    selectedProduct.forEach((data) => {
      total += isNaN(data.quantity) ? 0 : data.quantity;
    });

    setTotalSku(total);
    handleDisableButton(total);
  };

  const setDataSelected = () => {
    let datas: Array<number> = [];
    if (listSelected && listSelected.length > 0) {
      listSelected.forEach((values) => {
        datas.push(values.id);
      });
    }

    setListChecked(datas);
  };

  const handleDisableButton = (total: number) => {
    if (listSelected && edit) {
      const disabled = checkSameData(listSelected, selectedProduct);
      if (!disabled) {
        if (checkValueListNull(selectedProduct) || total < 2) {
          setDisableButton(true);
        } else {
          setDisableButton(false);
        }
      } else {
        setDisableButton(disabled);
      }
    } else {
      if (selectedProduct && selectedProduct.length > 0) {
        if (checkValueListNull(selectedProduct) || total < 2) {
          setDisableButton(true);
        } else setDisableButton(false);
      } else setDisableButton(true);
    }
  };

  const handleBack = () => {
    if (disableButton) onCancel();
    else setModalConfirm(true);
  };

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPagination({...pagination, page: 1});
      getListProduct({...pagination, page: 1});
    }
  };

  useEffect(() => {
    getListProduct();
  }, []);

  useEffect(() => {
    setSelectedProduct(listSelected);
    setDataSelected();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      handleCountSku();
    }
  }, [selectedProduct]);

  return (
    <AddProduct.Container>
      {/* todo to components */}
      <AddProduct.Breadcrumb>
        <AddProduct.MainPage>{'MASTER SKU'}</AddProduct.MainPage>
        <AddProduct.MainPage>{'/'}</AddProduct.MainPage>
        <AddProduct.MainPage>{'TAMBAH BUNDLING SKU'}</AddProduct.MainPage>
        <AddProduct.MainPage>{'/'}</AddProduct.MainPage>
        <AddProduct.SubsPage>{'Tambahkan Single SKU ke Bundling SKU'}</AddProduct.SubsPage>
      </AddProduct.Breadcrumb>
      <BlockTitle fontSize={32}>{'Tambahkan Single SKU ke Bundling SKU'}</BlockTitle>
      <AddProduct.SubTitle>{'Pilih Single SKU untuk digabungkan menjadi Bundling SKU'}</AddProduct.SubTitle>

      <Row className={'mt-4'}>
        <Col lg={4} md={3} sm={12} className="d-flex">
          <DropdownOption className="filter-dropdown" options={getOptionAddBundlingSku} optionLabel={'name'} placeholder={'Nama Produk'} value={selectedSearchOption} onChange={(event) => setSelectedSearchOption(event.target.value)} />
          <div className="form-control-wrap">
            <div onClick={() => getListProduct()} className="form-icon form-icon-right cursor-pointer">
              <Icon name="search" className="pt-1" style={styles.IconSearch} />
            </div>
            <Input type={'text'} className={'form-control filter-search shadow-none'} placeholder={'Search'} value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={handleSearchEnter} style={styles.InputSearch} />
          </div>
        </Col>
      </Row>
      <Row xs={2} className={'mt-4'}>
        <Col xs={12} lg={6}>
          <MappingSingelProduct border={!listProduct || listProduct.length == 0 ? 'dashed' : 'solid'} list={listProduct} listSelected={listChecked} sku={false} loading={isLoading} onClick={(data) => handleSelectProduct(data)} setTotal={(id, value) => {}} />
        </Col>

        <Col xs={12} lg={6}>
          <MappingSingelProduct list={selectedProduct} border={!selectedProduct || selectedProduct.length === 0 ? 'dashed' : 'solid'} listSelected={listChecked} sku onClick={(data) => handleDeleteSelected(data)} setTotal={(id, value) => handleSetValue(id, value)} />
        </Col>
      </Row>

      <Row xs={2} className={'mt-4'}>
        <Col xs={12} lg={6}>
          {listProduct && listProduct.length > 0 && (
            <div className="d-flex justify-content-between align-items-center g-2">
              <div className="text-start">
                <PaginationComponent itemPerPage={pagination.size} totalItems={pagination.totalRecord} paginate={handlePageChange} currentPage={pagination.page} />
              </div>
              <PagginationFilter pageSize={pagination.size} setPageSize={(value: number) => handleSetPageSize(value)} />
            </div>
          )}
        </Col>

        <Col xs={12} lg={6}>
          <AddProduct.InfoSelected>
            <AddProduct.Selected>{`Terpilih: ${selectedProduct ? selectedProduct.length : 0}`}</AddProduct.Selected>
            <AddProduct.ContainerQuantity>
              <AddProduct.TextQuantity color={colors.black}>{'Total Quantity: ' + totalSku}</AddProduct.TextQuantity>
              {selectedProduct && totalSku < 2 && <AddProduct.TextQuantity color={colors.red}>{'Total quantity Single SKU minimal 2'}</AddProduct.TextQuantity>}
            </AddProduct.ContainerQuantity>
          </AddProduct.InfoSelected>
        </Col>
      </Row>

      <AddProduct.Button>
        <Button type={'button'} className={'justify-center'} style={styles.ButtonSecondary} onClick={handleBack}>
          {'Batal'}
        </Button>
        <Button type={'button'} className={`justify-center ${disableButton && 'btn-disabled'}`} style={styles.ButtonPrimary} color={'primary'} disabled={disableButton} onClick={() => onSaveProduct(selectedProduct ?? [])}>
          {'Simpan'}
        </Button>
      </AddProduct.Button>

      {modalConfirm && (
        <ModalConfirmPopup
          icon={gifConfirm}
          buttonConfirmation={true}
          handleClickYes={onCancel}
          handleClickCancelled={() => setModalConfirm(false)}
          modalContentStyle={styles.ModalContentStyle}
          modalBodyStyle={styles.ModalConfirm}
          title={'Apakah Kamu Yakin?'}
          subtitle={'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'}
        />
      )}
    </AddProduct.Container>
  );
};

export default memo(AddSingleProduct);
