/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { PaginationProps } from '@/utils/type';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductSku, { styles } from './styles';
import { BlockTitle, Button, DropdownOption, Icon, ModalConfirmPopup, PagginationFilter, PaginationComponent } from '@/components';
import { Col, Input, Row } from 'reactstrap';
import { getOptionMasterSku } from '@/utils/getSelectOption';
import { ProductSingelProps } from '@/utils/type/product';
import MappingProductSku from '@/components/organism/mapping-product-sku';
import { getMasterSku } from '@/services/master';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import { checkSameData } from '@/utils/formater';
interface Props {
    listSelected: ProductSingelProps[] | null;
    edit?: boolean;
    onSaveProduct: (data: ProductSingelProps[])=> void;
    onCancel: ()=> void;
}

const AddProductSku = ({
    listSelected,
    edit,
    onSaveProduct,
    onCancel
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [listProduct, setListProduct] = useState<ProductSingelProps[] | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductSingelProps[] | null>(listSelected);
    const [pagination, setPagination] = useState<PaginationProps>({
        page: 1,
        size: 10,
        totalRecord: 0
    });
    const [selectedSearchOption, setSelectedSearchOption] = useState<string>('name');
    const [listChecked, setListChecked] = useState<Array<number>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);

    const [search, setSearch] = useState<string>('');
    const getListProduct = async (paginations?: PaginationProps) => {
        setIsLoading(true);

        const payload = {
            client_id: client_id,
            type: 'ALL',
            name: selectedSearchOption == 'name' ? search : '',
            sku: selectedSearchOption == 'sku' ? search : '',
            sort_by: null,
            sort_type: null,
            page: paginations ? paginations.page : pagination.page ,
            size: paginations ? paginations.size : pagination.size
        };

        const response = await getMasterSku(payload);
        if(response) {
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
                    weight: parseFloat(data.weight)
                });
            });
            setListProduct(dataList);
        }

        setIsLoading(false);
    };
    

    const handleSearchEnter = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            setPagination({...pagination, page: 1});
            getListProduct({...pagination, page: 1});
        }
    };

    const handleSelectProduct = (data: ProductSingelProps) => {
        if(selectedProduct) {
            const sameData =  selectedProduct.findIndex(item => item.id === data.id);
            if(sameData == -1){
                setListChecked((datas) => [...datas, data.id]);
                setSelectedProduct(datas => [...datas, data]);
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

    const handlePageChange = (pageNumber: number) => {
        setPagination({...pagination, page: pageNumber });
        getListProduct({...pagination, page: pageNumber});
    };

    const handleSetPageSize = (value: number) => {
        setPagination({...pagination, size: value, page: 1});
        getListProduct({...pagination, size: value, page: 1});
    };
    const handleBack = () => {
        if(disableButton) onCancel();
        else setModalConfirm(true);
    };

    const handleDisableButton = () => {
        if(listSelected) {
            const disabled = checkSameData(listSelected, selectedProduct);
            setDisableButton(disabled);
        } else {
            if(selectedProduct && selectedProduct.length > 0) {
                setDisableButton(false);
            }else setDisableButton(true);
        }
    };

    const setDataSelected = () => {
        let datas: Array<number> = [];
        if(listSelected && listSelected.length > 0) {
            listSelected.forEach((values) => {
                datas.push(values.id);
            });
        }

        setListChecked(datas);
    };

    useEffect(() => {
        getListProduct();
    },[]);

    useEffect(() => {
        handleDisableButton();
    }, [selectedProduct]);

    useEffect(() => {
        setDataSelected();
    }, [listSelected]);

    return (
        <ProductSku.Container>
            <ProductSku.Breadcrumb>
                <ProductSku.MainPage>{'PESANAN'}</ProductSku.MainPage>
                <ProductSku.MainPage>{'/'}</ProductSku.MainPage>
                <ProductSku.MainPage>{'TAMBAH PESANAN'}</ProductSku.MainPage>
                <ProductSku.MainPage>{'/'}</ProductSku.MainPage>
                <ProductSku.SubsPage>{'Pilih SKU Pesanan'}</ProductSku.SubsPage>
            </ProductSku.Breadcrumb>
            <BlockTitle fontSize={32}>{'Pilih SKU Pesanan'}</BlockTitle>
            <ProductSku.SubTitle>{'Pilih SKU dari Master SKU untuk melengkapi Pesananmu'}</ProductSku.SubTitle>
            
            <Row className={'mt-4'}>
                <Col lg={4} md={3} sm={12} className="d-flex">
                    <DropdownOption
                        className="filter-dropdown"
                        options={getOptionMasterSku}
                        optionLabel={'name'}
                        placeholder={'Nama Produk'}
                        value={selectedSearchOption}
                        onChange={(e) => setSelectedSearchOption(e.target.value)}
                    />
                    <div className="form-control-wrap">
                        <div onClick={()=> {}} className="form-icon form-icon-right cursor-pointer">
                            <Icon
                                name="search"
                                className="pt-1"
                                style={styles.IconSearch}
                            />
                        </div>
                        <Input
                            type="text"
                            className="form-control filter-search shadow-none"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchEnter}
                            style={styles.InputSearch}
                        />
                    </div>
                </Col>
            </Row>
            <Row xs={2} className={'mt-4'}>
                <Col xs={12} lg={6}>
                    <MappingProductSku
                        border={!listProduct || listProduct.length == 0 ? 'dashed' : 'solid'}
                        list={listProduct}
                        listSelected={listChecked}
                        withDelete={false}
                        loading={isLoading}
                        onClick={(data) => handleSelectProduct(data)}
                    />
                </Col>

                <Col xs={12} lg={6}>
                    <MappingProductSku
                        border={!selectedProduct || selectedProduct.length == 0 ? 'dashed' : 'solid'}
                        list={selectedProduct}
                        listSelected={listChecked}
                        withDelete
                        loading={false}
                        onClick={(data) => handleSelectProduct(data)}
                    />
                </Col>
            </Row>

            <Row xs={2} className={'mt-4'}>
                <Col xs={12} lg={6}>
                    {listProduct && listProduct.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center g-2">
                            <div className="text-start">
                                <PaginationComponent
                                    itemPerPage={pagination.size}
                                    totalItems={pagination.totalRecord}
                                    paginate={handlePageChange}
                                    currentPage={pagination.page}
                                />
                            </div>
                            <PagginationFilter
                                pageSize={pagination.size}
                                setPageSize={(value: number) => handleSetPageSize(value)}
                            />
                        </div>
                    )}
                </Col>
                <Col xs={12} lg={6}>
                    <ProductSku.InfoSelected>
                        <ProductSku.Selected>{`Terpilih: ${selectedProduct ? selectedProduct.length : 0}`}</ProductSku.Selected>
                    </ProductSku.InfoSelected>
                </Col>
            </Row>

            <ProductSku.Button>
                <Button
                    type={'button'}
                    className={'justify-center'}
                    style={styles.ButtonSecondary}
                    onClick={handleBack}
                >
                    {'Batal'}
                </Button>
                <Button
                    type={'button'}
                    className={`justify-center ${disableButton && 'btn-disabled'}`}
                    style={styles.ButtonPrimary}
                    color={'primary'}
                    disabled={disableButton}
                    onClick={()=> {
                        onSaveProduct(selectedProduct ?? []);
                    } }
                >
                    {'Simpan'}
                </Button>
            </ProductSku.Button>
            {modalConfirm && (
                <ModalConfirmPopup
                    icon={gifConfirm}
                    buttonConfirmation={true}
                    handleClickYes={onCancel}
                    handleClickCancelled={()=> setModalConfirm(false)}
                    modalContentStyle={styles.ModalContentStyle}
                    modalBodyStyle={styles.ModalConfirm}
                    title={'Apakah Kamu Yakin?'}
                    subtitle={'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'}
                />
            )}
        </ProductSku.Container>
    );

};

export default memo(AddProductSku);