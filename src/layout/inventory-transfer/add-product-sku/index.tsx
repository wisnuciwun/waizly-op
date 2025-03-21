/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from 'react';
import { DropdownOption, Icon, PaginationComponent, PagginationFilter, InfoWarning } from '@/components';
import Content from '@/layout/content/Content';
import { Input, FormGroup, Button, Row, Col, Badge } from 'reactstrap';
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import Nodata from '@/assets/images/illustration/no-data.svg';
import NodataSKU from '@/assets/images/illustration/illustration-no-data-sku.svg';
import { useSelector } from 'react-redux';
import { getStockListSku } from '@/services/inventory';
import { optionInventorySku } from '@/utils/getSelectOption';
import { LoadingMappingProduct } from '@/components/molecules';
import { checkSameData } from '@/utils/formater';
import { PaginationProps } from '@/utils/type';

type ProductSKUProps = {
  sku: string;
  name: string;
  // unit_price: string;
  quantity?: number | null;
  product_id?: number;
  stock_id?: number;
  available_quantity?: number;
  damages_quantity?:  number;
  client_id?: number;
  image_path?: any;
  product_type?: string;
};

function AddSKUInventory({
  product = [],
  setProduct = null,
  backButton = null,
  edit = false,
  show = false,
  werehouseOriginId,
  originId
}) {
  const { client_id } = useSelector((state: any) => state?.auth.user);
  const [listProduct, setListProduct] = useState<ProductSKUProps[] | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    size: 10,
    totalRecord: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState<
    ProductSKUProps[] | null
  >(null);
  const [listChecked, setListChecked] = useState<Array<number>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [selectedSearchOption, setSelectedSearchOption] =
    useState<string>('name');
  const [search, setSearch] = useState<string>('');
  const [totalSku, setTotalSku] = useState<number>(0);

  const getListProduct = async (paginations?: PaginationProps) => {
    setIsLoading(true);
    const payload = {
      client_id: client_id,
      origin_id: edit ? werehouseOriginId : originId,
      search :{
        sku_code: selectedSearchOption == 'sku' ? search : '',
        sku_name: selectedSearchOption == 'name' ? search : ''
      }, 
      page: paginations ? paginations.page : pagination.page,
      size: paginations ? paginations.size : pagination.size,
      type: 'SINGLE',
    };

    const response = await getStockListSku(payload);
    if (response) {
      setPagination((data) => ({
        ...data,
        totalRecord: response.data.page.total_record,
      }));
      let dataList: ProductSKUProps[] = [];

      response.data.products.forEach((data) => {
        dataList.push({
          product_id: data.product_id,
          stock_id: data.stock_id,
          sku: data.sku,
          name: data.name,
          available_quantity: data.available_quantity,
          damages_quantity: data.damages_quantity,
          client_id: data.client_id,
          image_path: data.image_path,
          product_type: data.product_type,
          // unit_price: data.price,
          quantity: null,
        });
      });
      setListProduct(dataList);
    }
    setIsLoading(false);
  };


  const handleSelectProduct = (data: ProductSKUProps) => {
    if (selectedProduct) {
      const sameData = selectedProduct.findIndex(
        (item) => item.product_id === data.product_id
      );
      if (sameData == -1) {
        setListChecked((datas) => [...datas, data.product_id]);
        setSelectedProduct((datas) => [...datas, data]);
      } else handleDeleteSelected(data);
    } else {
      setSelectedProduct([data]);
      setListChecked([data.product_id]);
    }
  };

  const handleDeleteSelected = (list: ProductSKUProps) => {
    let dataSelected = [...selectedProduct];
    let arrSelected = [...listChecked];

    const listDeleted = dataSelected.filter(
      (data) => data.product_id != list.product_id
    );
    const listArrayDeleted = arrSelected.filter(
      (data) => data != list.product_id
    );

    setSelectedProduct(listDeleted);
    setListChecked(listArrayDeleted);
  };

  const handlePageChange = async (pageNumber: number) => {
    setPagination({ ...pagination, page: pageNumber });
    getListProduct({ ...pagination, page: pageNumber });
  };

  const handleSetPageSize = (value: number) => {
    setPagination({ ...pagination, page: 1, size: value });
    getListProduct({ ...pagination, page: 1, size: value });
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
    if (listProduct && listProduct.length > 0) {
      listProduct.forEach((values) => {
        datas.push(values.product_id);
      });
    }

    setListChecked(datas);
  };

  const handleDisableButton = (total: number) => {
    if (listProduct && edit) {
      const disabled = checkSameData(listProduct, selectedProduct);
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
      if (selectedProduct && selectedProduct?.length > 0) {
        if (checkValueListNull(selectedProduct) || total < 2) {
          setDisableButton(true);
        } else setDisableButton(false);
      } else setDisableButton(true);
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPagination({ ...pagination, page: 1 });
      getListProduct({ ...pagination, page: 1 });
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'SINGLE':
        return { color: '#0372D9', backgroundColor: '#E1EFFA' };
      case 'BUNDLING':
        return { color: '#00A7E1', backgroundColor: '#D5FDFF' };
      default:
        break;
    }
  };

  const checkValueListNull = (value: ProductSKUProps[]) => {
    let isNull: boolean = false;

    value.forEach((data) => {
      if (isNaN(data.quantity) || data.quantity == 0 || data.quantity == null) {
        isNull = true;
      }
    });

    return isNull;
  };

  useEffect(() => {
    if (originId || werehouseOriginId) {
      getListProduct();
    }
  }, [originId, werehouseOriginId]);

  useEffect(() => {
    if (show) {
      setSelectedProduct(product);
      setDataSelected();
    }
  }, [show, product]);

  useEffect(() => {
    if (selectedProduct) {
      handleCountSku();
    }
  }, [selectedProduct]);

  return (
    <div hidden={!show}>
      <Content>
        <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
        <div className="wrapper-bg-light" style={{ width: 'auto' }}>
          <p className="text-primary" style={{ fontSize: 12 }}>
            INVENTORI&nbsp; / &nbsp;TRANSFER&nbsp; / &nbsp;{edit ? 'EDIT ' : 'TAMBAH '} 
            TRANSFER&nbsp; / &nbsp;
            <span className="text-header-sm-seconds">Pilih SKU Transfer</span>
          </p>
          <h3 style={{fontSize: 32}}>Pilih SKU Transfer</h3>
          <p style={{ color: '#4C4F54', fontSize: '12px', fontWeight: 400 }}>
            Pilih SKU dari Master SKU untuk melengkapi pembelianmu
          </p>
          <div className="form-wrap">
            <Row>
              <Col lg={5} md={3} sm={12} className="d-flex mt-1">
                <DropdownOption
                  className="filter-dropdown"
                  options={optionInventorySku}
                  optionLabel={'name'}
                  placeholder={'Nama Produk'}
                  style={{fontSize: 12}}
                  value={selectedSearchOption}
                  onChange={(e) => setSelectedSearchOption(e.target.value)}
                />
                <div className="form-control-wrap">
                  <div className="form-icon form-icon-right">
                    <Icon
                      name="search"
                      className="pt-1"
                      style={{ color: '#203864', backgroundColor: '#ffffff' }}
                    ></Icon>
                  </div>
                  <Input
                    type="text"
                    className="form-control filter-search shadow-none"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearchEnter}
                    style={{ width: 'auto' }}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row xs="2" className="mt-5">
              <Col xs="12" lg="6">
                <div
                  style={{
                    border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                    height: 500,
                    overflowY: 'auto',
                  }}
                >
                  {isLoading ? (
                    <LoadingMappingProduct />
                  ) : listProduct?.length > 0 ? (
                    listProduct?.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: 110,
                          }}
                        >
                          <div
                            style={{
                              width: '85%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div>
                              <Image
                                width={44}
                                height={44}
                                src={option?.image_path ? option?.image_path  : ilustrationCamera}
                                style={{ alignSelf: 'center' }}
                                alt="Image Product"
                              />
                            </div>
                            <div
                              style={{
                                marginLeft: 14,
                                width: '85%',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Badge
                                  className="badge-dim"
                                  color=""
                                  style={{
                                    fontWeight: 700,
                                    color: statusBadge(option.product_type)?.color,
                                    backgroundColor: statusBadge(option.product_type).backgroundColor,
                                    height: 20,
                                    padding: '0px 8px 0px 8px',
                                    border: 'none',
                                    fontSize: 12,
                                  }}
                                >
                                  {option.product_type}
                                </Badge>
                              </div>
                              <p className="text-header-bold text-truncate">
                                {option?.name}
                              </p>
                              <Row>
                                <Col
                                  md={12}
                                  className="text-header-text-sub-connect-product text-truncate"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Kode SKU: {option?.sku || '-'}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div style={{ alignSelf: 'center' }}>
                            <FormGroup
                              id={
                                selectedProduct
                                  ?.toString()
                                  .includes(option?.product_id?.toString())
                                  ? 'id'
                                  : !option.product_id
                                  ? 'TooltipCheck'
                                  : selectedProduct?.length == 20
                                  ? 'TooltipOver'
                                  : ''
                              }
                              style={{ margin: 0 }}
                              check
                              inline
                            >
                              <Input
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: option.sku
                                    ? ''
                                    : '#E9E9EA',
                                }}
                                type="checkbox"
                                checked={
                                  selectedProduct &&
                                  selectedProduct
                                    .map((v) => v.product_id)
                                    ?.toString()
                                    .includes(option?.product_id?.toString())
                                }
                                onClick={() => handleSelectProduct(option)}
                              />
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div
                        className="d-flex flex-column text-center gap-3"
                        style={{ marginTop: 170 }}
                      >
                        <Image
                          width={120}
                          height={80}
                          src={Nodata}
                          style={{ alignSelf: 'center' }}
                          alt="Image Product"
                        />
                        <p style={{ color: '#4C4F54', fontSize: 13 }}>
                          Data tidak ditemukan
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className={'dataTables_wrapper mt-4 mb-4'}>
                  <div className="d-flex justify-content-between align-items-center g-2">
                    <div className="text-start" style={{ paddingLeft: 0 }}>
                      {listProduct?.length > 0 && (
                        <PaginationComponent
                          itemPerPage={pagination.size}
                          totalItems={pagination?.totalRecord}
                          paginate={handlePageChange}
                          currentPage={pagination.page}
                        />
                      )}
                    </div>
                    {listProduct?.length > 0 ? (
                      <PagginationFilter
                        pageSize={pagination.size}
                        setPageSize={(value) => handleSetPageSize(value)}
                      />
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col xs="12" lg="6">
                <div
                  style={{
                    border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                    height: 500,
                    overflowY: 'auto',
                  }}
                >
                  {selectedProduct?.length > 0 ? (
                    selectedProduct.map((option, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                        }}
                      >
                        <div
                          style={{
                            padding: '16px 14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: 110,
                          }}
                        >
                          <div
                            style={{
                              width: '85%',
                              display: 'flex',
                              alignSelf: 'center',
                            }}
                          >
                            <div>
                              <Image
                                width={44}
                                height={44}
                                src={option?.image_path && option.image_path.length > 0 ? option?.image_path  : ilustrationCamera}
                                style={{ alignSelf: 'center' }}
                                alt="Image Product"
                              />
                            </div>
                            <div
                              style={{
                                marginLeft: 14,
                                width: '85%',
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{ fontSize: 12 }}
                              >
                                <Badge
                                  className="badge-dim"
                                  color=""
                                  style={{
                                    fontWeight: 700,
                                    color: statusBadge(option.product_type)?.color,
                                    backgroundColor: statusBadge(option.product_type)?.backgroundColor,
                                    height: 20,
                                    padding: '0px 8px 0px 8px',
                                    border: 'none',
                                    fontSize: 12,
                                  }}
                                >
                                  {option.product_type}
                                </Badge>
                              </div>
                              <p className="text-header-bold text-truncate">
                                {option?.name}
                              </p>
                              <Row>
                                <Col
                                  md={12}
                                  className="text-header-text-sub-connect-product text-truncate"
                                  style={{
                                    marginTop: '-12px',
                                    color: '#4C4F54',
                                  }}
                                >
                                  Kode SKU: {option?.sku || '-'}
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div
                            style={{
                              alignSelf: 'center',
                              width: '5%',
                              cursor: 'pointer',
                            }}
                          >
                            <div onClick={() => handleDeleteSelected(option)}>
                              <IconTrashOutlined />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div
                        className="d-flex flex-column text-center gap-3"
                        style={{ marginTop: 170 }}
                      >
                        <Image
                          width={120}
                          height={80}
                          src={NodataSKU}
                          style={{ alignSelf: 'center' }}
                          alt="Image Product"
                        />
                        <p style={{ color: '#4C4F54', fontSize: 13 }}>
                          {'Kamu belum menambahkan SKU Pembelian apa pun'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 dataTables_wrapper">
                  <div
                    style={{ height: 35 }}
                    className="d-flex align-items-center"
                  >
                    <p style={{ fontSize: 12 }}>
                      Terpilih : {selectedProduct?.length}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <div
              style={{
                gap: 16,
                display: 'flex',
                marginTop: 40,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <div className="d-flex">
                <Button
                  onClick={() => backButton()}
                  type="button"
                  className={'bg-white text-primary justify-center'}
                  style={{
                    height: 43,
                    width: 180,
                    fontSize: 14,
                    textAlign: 'center',
                    border: 'none',
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => {
                    setProduct(
                      selectedProduct.map((v) => {
                        return {
                          ...v,
                          // unit_price: parseInt(v.unit_price),
                        };
                      })
                    );
                    backButton();
                  }}
                  className={`justify-center ${
                    pagination.totalRecord > 0 ? 'btn-primary' : 'btn-disabled'
                  }`}
                  disabled={pagination.totalRecord > 0 ? false : true}
                  color="primary"
                  style={{ height: 43, width: 180, fontSize: 14 }}
                >
                  {'Simpan'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}

export default memo(AddSKUInventory);