/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from 'react';
import SyncProduct, { styles } from './styles';
import { BlockTitle, Button, DropdownOption, Icon, PagginationFilter, PaginationComponent, ModalConfirmPopup } from '@/components';
import { Col, Input, Row } from 'reactstrap';
import { MappingProduct } from '@/components/organism';
import { MultiSelect } from 'primereact/multiselect';
import Image from 'next/image';
import getMarketplaceImage from '@/utils/marketplaceImage';
import { getProductsMasterSKU } from '@/services/produk';
import { useSelector } from 'react-redux';
import { PaginationProps } from '@/utils/type';
import { ProductListingProps } from '@/utils/type/product';
import { getStoreList } from '@/services/master';
import { SelectItem } from 'primereact/selectitem';
import colors from '@/utils/colors';
import { channelList } from './constants';
import { getOptionMasterSku } from '@/utils/getSelectOption';
import { checkSameData } from '@/utils/formater';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
interface Props {
    listSelected: ProductListingProps[] | null;
    onSaveProduct: (data: ProductListingProps[])=> void;
    onCancel: ()=> void;
}

const SyncProductStore = ({
    listSelected,
    onSaveProduct,
    onCancel
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);

    const [listProduct, setListProduct] = useState<ProductListingProps[] | null>(null);
    const [pagination, setPagination] = useState<PaginationProps>({
        page: 1,
        size: 10,
        totalRecord: 0
    });
    const [selectedProduct, setSelectedProduct] = useState<ProductListingProps[] | null>(listSelected);
    const [listChecked, setListChecked] = useState<Array<number>>([]);

    const [listStore, setListStore] = useState<SelectItem[]>([]);
    const [selectedChanel, setSelectedChanel] = useState<Array<number>>([]);
    const [selectedStore, setSelectedStore] = useState<Array<number>>([]);
    const [selectedSearchOption, setSelectedSearchOption] = useState<string>('name');
    const [search, setSearch] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);

    const getListProduct = async (paginations?: PaginationProps) => {
        setIsLoading(true);

        const payload = {
            client_id: client_id,
            size: paginations?.size ? paginations.size : pagination.size,
            page: paginations?.page ? paginations.page : pagination.page,
            channel: selectedChanel,
            store: selectedStore,
            search: {
                product_name: selectedSearchOption == 'name' ? search : '',
                sku: selectedSearchOption == 'sku' ? search : '',
            },
        };
        const response = await getProductsMasterSKU(payload);

        if(response) {
            setPagination((data) => ({...data, totalRecord: response.data.page_info.total_record}));
            setListProduct(response.data.product_listing);
        }

        setIsLoading(false);
    };

    const getListStore = async () => {
        const response = await getStoreList(client_id, 6);

        if(response && response.data) {
            let datas: SelectItem[] = [];

            response.data.stores.forEach((data) => {
                datas.push({
                    value: data.store_id,
                    label: data.store_name
                });
            });

            setListStore(datas);
        }
    };

    const setDataSelected = () => {
        let datas: Array<number> = [];
        if(listSelected && listSelected.length > 0) {
            listSelected.forEach((values) => {
                datas.push(values.child_product_listing_id);
            });
        }

        setListChecked(datas);
    };
   
    const handleSelectProduct = (data: ProductListingProps) => {
        if(selectedProduct) {
            const sameData =  selectedProduct.findIndex(item => item.child_product_listing_id === data.child_product_listing_id);
            if(sameData == -1){
                setListChecked((datas) => [...datas, data.child_product_listing_id]);
                setSelectedProduct(datas => [...datas, data]);
            } else handleDeleteSelected(data);
        } else {
            setSelectedProduct([data]);
            setListChecked([data.child_product_listing_id]);
        } 
    };

    const handleDeleteSelected = (list: ProductListingProps) => {
        let dataSelected = [...selectedProduct];
        let arrSelected = [...listChecked];

        const listDeleted = dataSelected.filter((data) => data.child_product_listing_id != list.child_product_listing_id);
        const listArrayDeleted = arrSelected.filter((data) => data != list.child_product_listing_id);

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

    const handleBack = () => {
        if(disableButton) onCancel(); 
        else setModalConfirm(true);
    };

    const handleSearchEnter = (e: React.KeyboardEvent) => {
        if(e.key === 'Enter') {
            setPagination((data) => ({ ...data, page: 1 }));
            getListProduct();
        }
    };

    const handleSearch = () => {
        setPagination((data) => ({ ...data, page: 1 }));
        getListProduct();
    };

    useEffect(() => {
        handleDisableButton();
    }, [selectedProduct]);

    useEffect(() => {
        setDataSelected();
    }, [listSelected]);

    useEffect(() => {
        handleSearch();
        
    },[selectedChanel, selectedStore]);

    useEffect(() => {
        getListStore();
    },[]);
    
    return(
        <SyncProduct.Container>
            {/* todo to components */}
            <SyncProduct.Breadcrumb>
                <SyncProduct.MainPage>{'MASTER SKU'}</SyncProduct.MainPage>
                <SyncProduct.MainPage>{'/'}</SyncProduct.MainPage>
                <SyncProduct.MainPage>{'TAMBAH BUNDLING SKU'}</SyncProduct.MainPage>
                <SyncProduct.MainPage>{'/'}</SyncProduct.MainPage>
                <SyncProduct.SubsPage>{'Hubungkan Produk Toko'}</SyncProduct.SubsPage>
            </SyncProduct.Breadcrumb>

            <BlockTitle fontSize={32}>{'Hubungkan Produk Toko'}</BlockTitle>
            
            <SyncProduct.SubTitle>{'Hubungkan Master SKU kamu dari Daftar Produk sehingga kamu dapat mengintegrasikan stok toko kamu'}</SyncProduct.SubTitle>
            <div className="form-wrap">
                <div className={'mt-4 d-flex g-8'}>
                    <div className={'col-lg-4 col-md-3 col-sm-12'}>
                        <MultiSelect
                            value={selectedChanel}
                            id={'channel'}
                            optionLabel="label"
                            color={colors.black}
                            placeholder={'Filter Channels'}
                            onChange={(e)=> setSelectedChanel(e.value.channel_id)}
                            options={channelList}
                            display={'chip'}
                            style={styles.filterChanel}
                            itemTemplate={(channelList) => (
                                <div className="d-flex align-items-center">
                                    <Image
                                        width={20}
                                        height={20}
                                        style={styles.image}
                                        src={getMarketplaceImage(channelList.label)}
                                        alt={'image-list'}
                                    />
                                    <span style={styles.textList}>{channelList.label}</span>
                                </div>
                            )}
                        />
                    </div>
                    <div style={{marginLeft: 8}} className={'col-lg-4 col-md-3 col-sm-12'}>
                        <MultiSelect
                            value={selectedStore}
                            id={'store'}
                            optionLabel="label"
                            color={colors.black}
                            placeholder={'Filter Toko'}
                            onChange={(e)=> setSelectedStore(e.value)}
                            options={listStore}
                            display={'chip'}
                            style={styles.filterChanel}
                            itemTemplate={(channelList) => (
                                <div className="p-multiselect-representative">
                                    <span style={styles.textList}>{channelList.label}</span>
                                </div>
                            )}
                        />
                    </div>
                    <div style={{marginLeft: 8}} className={'col-lg-4 col-md-3 d-flex col-sm-12'}>
                        <DropdownOption
                            className="filter-dropdown"
                            options={getOptionMasterSku}
                            optionLabel={'name'}
                            placeholder={'Nama Produk'}
                            value={selectedSearchOption}
                            onChange={(e) => setSelectedSearchOption(e.target.value)}
                        />
                        <div className="form-control-wrap">
                            <div onClick={()=> getListProduct()} className="form-icon form-icon-right cursor-pointer">
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
                    </div>
                </div>
            </div>

            <Row xs={2} className={'mt-4'}>
                <Col xs={12} lg={6}>
                    <MappingProduct
                        border={!listProduct || listProduct.length == 0 ? 'dashed' : 'solid'}
                        list={listProduct}
                        listSelected={listChecked}
                        sku={false}
                        loading={isLoading}
                        onClick={(data) => handleSelectProduct(data)}
                    />
                </Col>

                <Col xs={12} lg={6}>
                    <MappingProduct
                        list={selectedProduct}
                        border={!selectedProduct || selectedProduct.length === 0 ? 'dashed' : 'solid'}
                        listSelected={listChecked}
                        sku
                        onClick={(data) => handleDeleteSelected(data)}
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
                <Col xs={12} lg={6} style={styles.selectedCount}>
                    <SyncProduct.Selected>{`Terpilih: ${selectedProduct ? selectedProduct.length : 0}`}</SyncProduct.Selected>
                </Col>
            </Row>

            <SyncProduct.Button>
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
                    onClick={()=>onSaveProduct(selectedProduct ?? [])}
                >
                    {'Simpan'}
                </Button>
            </SyncProduct.Button>
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
        </SyncProduct.Container>
    );
};

export default memo(SyncProductStore);