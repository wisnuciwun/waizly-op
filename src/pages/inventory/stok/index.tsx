/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Block, BlockBetween, BlockContent, BlockHead, BlockHeadContent, BlockTitle, DropdownOption, Head, Icon, InfoWarning, PagginationFilter, PaginationComponent, TagFilter } from '@/components';
import Content from '@/layout/content/Content';
import { getOptionMasterSku } from '@/utils/getSelectOption';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Col,Input } from 'reactstrap';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import Image from 'next/image';
import { PaginationProps } from '@/utils/type';
import { useSelector } from 'react-redux';
import { getListStock } from '@/services/inventory';
import { Skeleton } from 'primereact/skeleton';

import Nodata from '@/assets/images/illustration/no-data.svg';
import styled from 'styled-components';
import colors from '@/utils/colors';
import TooltipComponent from '@/components/template/tooltip';
import { FilterTableInventory } from '@/components/molecules/filter-table';

const Stock = () => {
    const route = useRouter();
    const { client_id } = useSelector((state: any) => state.auth.user);
    const [selectedSearchOption, setSelectedSearchOption] = useState<string>('name');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [listStock, setListStock] = useState<any>([]);
    const [courier, setCourier] = useState<any>(null);
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
    const [dataFilter, setDataFilter] = useState<any>(null);

    const [sort, setSort] = useState<string>('asc');
    const [pagination, setPagination] = useState<PaginationProps>({
        page: 1,
        size: 10,
        totalRecord: 0
    });

    const handleSearchEnter = (e: any) => {
        if (e.key === 'Enter') {
            handleGetListStock();
        }
    };

    const updateCourierInPayload = (selectedCourier) => {
        const courierArray = Array.isArray(selectedCourier) ? selectedCourier : [];
        const selectedCouriers = courierArray.filter(
          (value) => value.type === 'courier'
        );
        const courierIds =
          selectedCouriers.length == 0
            ? null
            : selectedCouriers.map((val) => val.id);
    
        setCourier(courierIds);
        handlePageChange(1);
    };

    const handlePageChange = (pageNumber: number) => {
        setPagination({...pagination, page: pageNumber });
        handleGetListStock({...pagination, page: pageNumber});
    };

    const handleSetPageSize = (value: number) => {
        setPagination({...pagination, size: value, page: 1});
        handleGetListStock({...pagination, size: value, page: 1});
    };

    const handleGetListStock = async(data?: PaginationProps) => {
        setLoading(true);
        const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];
        const payload = {
            client_id: client_id,
            location_id: filterLocation,
            logistic_carrier_id: courier,
            search: {
                sku_code: selectedSearchOption === 'sku' ? search : null ,
                sku_name: selectedSearchOption === 'name' ? search : null,
            },
            page: data ? data.page : pagination.page,
            size: data ? data.size : pagination.size,
            order_by: sort
        };
        const response = await getListStock(payload);

        if(response?.data) {
            setListStock(response.data.stocks);
            setPagination((datas) => ({
                ...datas, 
                page: data ? data.page : datas.page,
                size: data ? data.size : datas.size,
                totalRecord: response.data.page.total_record
            }));
        }

        setLoading(false);
    };

    const handleDeleteFilter = (idx: number) => {
        const dataFilters = dataFilter.filter((_,index) => index !== idx);

        setDataFilter(dataFilters);
    };

    useEffect(() => {
        handleGetListStock();
    },[sort]);

    useEffect(() => {
        if(dataFilter) {
            handleGetListStock({...pagination, page: 1, size: 10});
        }
    },[dataFilter]);

    return(
        <>
            <Head title="Stok" />
            <Content>
                <InfoWarning strongWord={'Versi Beta!'} desc={'Fitur ini masih dalam tahap pengembangan. Kami menghargai masukanmu sementara kami bekerja untuk memperbaikinya. Terima kasih atas pengertianya!'}/>
                <BlockHead size="sm">
                    <BlockHeadContent>
                        <BlockBetween> 
                            <BlockTitle fontSize={24}>{'Stok'}</BlockTitle>
                            <div className="nk-block-tools">
                                {/* <Button
                                    style={{ height: 43, fontSize: 14, color: "#203864" }}
                                    onClick={() => {}}
                                >
                                    <Icon
                                        name="reload"
                                        style={{
                                            marginRight: "8px",
                                            color: "#203864",
                                            fontSize: 20,
                                        }}
                                    />
                                    <div style={{ paddingLeft: 3 }}>Sinkron Stok</div>

                                </Button> */}
                            </div>
                        </BlockBetween>
                    </BlockHeadContent> 
                    
                    <Block size="lg">
                        <div className={ 'nk-block-tools g-3 d-flex align-items-center mt-2 justify-content-end'}>
                            <div className={'d-flex align-items-center'}>
                                <div className="form-wrap">
                                    <DropdownOption
                                        className="filter-dropdown"
                                        options={getOptionMasterSku}
                                        optionLabel={'name'}
                                        placeholder={'Pilih'}
                                        style={{fontSize: 12}}
                                        value={selectedSearchOption}
                                        onChange={(e) =>
                                            setSelectedSearchOption(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="form-control-wrap">
                                    <div className="form-icon form-icon-right">
                                        <Icon
                                            name="search"
                                            className="pt-1"
                                            style={{ color: '#203864', backgroundColor: '#ffffff' }}
                                        />
                                    </div>
                                    <Input
                                        type="text"
                                        className="form-control filter-search shadow-none"
                                        placeholder="Search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={handleSearchEnter}
                                    />
                                </div>
                                <div style={{ marginRight: 16 }}>
                                    <FilterTableInventory 
                                        isOpen={isOpenFilter} 
                                        setIsOpen={(value) => setIsOpenFilter(value)} 
                                        dataFilter={dataFilter}
                                        setDataFilter={(data) => setDataFilter(data)}
                                    />
                                    {/* <FilterTableStore
                                        hideChannel = {false}
                                        hideWarehouse = {false}
                                        hidePayment = {false}
                                        hideCourier = {false}
                                        updatePaymentMethodInPayload={()=> {}}
                                        updateChannelInPayload={updateChannelInPayload}
                                        updateLocationInPayload={updateLocationInPayload}
                                        updateCourierInPayload={updateCourierInPayload}
                                        resetPayload={handleResetFilter}
                                    /> */}
                                     {/* <FilterOverlayWarehouseList 
                                        checkedItems={location}
                                        setCheckedItems={setLocation}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </Block>
                </BlockHead>
                <BlockHead>
                    {dataFilter && dataFilter.length > 0 ? (
                        <TagFilter
                            data={dataFilter}
                            onDelete={(index) => handleDeleteFilter(index)}
                            onReset={() => setDataFilter([])}
                        
                        />
                    ): null}
                    
                </BlockHead>  
                <BlockContent>
                    <Block size="lg">
                        <div style={{ maxWidth: '100%' }}>
                            <div className="p-0 border-0 overflow-x-auto" style={{ fontSize: '13px' }}>
                                <table className="master-sku-nk-tb-list is-separate">
                                    <thead>
                                        <tr className="nk-tb-col-check" style={{ whiteSpace: 'nowrap' }}>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 400, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex justify-content-between align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        Master SKU
                                                    </span>
                                                    <div onClick={()=> setSort(prev => prev === 'asc' ? 'desc' : 'asc')}>
                                                        <Icon name="swap-v" style={{ cursor: 'pointer' }} />
                                                    </div>
                                                    
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 215, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        Gudang
                                                    </span>
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 100, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        Total Stok
                                                    </span>
                                                    <TooltipComponent icon="help-fill" iconClass="card-hint" direction="bottom" id={'Tooltip-' + 'total-stock'} text={'Stok tersedia di Gudang'} style={styles.TooltipCanvasField} />
                                                    {/* <Icon name="info-fill" style={{ cursor: "pointer" }} /> */}
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 100, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        {'Stok Normal'}
                                                    </span>
                                                    <TooltipComponent icon="help-fill" iconClass="card-hint" direction="bottom" id={'Tooltip-' + 'total-stock'} text={'Stok barang normal yang dapat dijual'} style={styles.TooltipCanvasField} />
                                                    {/* <Icon name="info-fill" style={{ cursor: "pointer" }} /> */}
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 100, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        {'Stok Rusak'}
                                                    </span>
                                                    <TooltipComponent icon="help-fill" iconClass="card-hint" direction="bottom" id={'Tooltip-' + 'total-stock'} text={'Stok barang rusak yang tidak dapat dijual'} style={styles.TooltipCanvasField} />
                                                    {/* <Icon name="info-fill" style={{ cursor: "pointer" }} /> */}
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 100, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        Dialokasikan
                                                    </span>
                                                    <TooltipComponent icon="help-fill" iconClass="card-hint" direction="bottom" id={'Tooltip-' + 'dialokasikan'} text={'Stok yang dialokasikan untuk outbound'} style={styles.TooltipCanvasField} />
                                                </div>
                                            </th>
                                            <th className="master-sku-nk-tb-col" style={{ minWidth: 100, marginTop: 8, marginBottom: 8}}>
                                                <div className={'d-flex align-items-center'}>
                                                    <span style={{ fontWeight: 'normal', color: '#4C4F54', fontSize: 12 }}>
                                                        Tersedia
                                                    </span>
                                                    <TooltipComponent icon="help-fill" iconClass="card-hint" direction="bottom" id={'Tooltip-' + 'tersedia'} text={'Stok tersedia yang dapat dijual'} style={styles.TooltipCanvasField} />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        style={{
                                            fontSize: 12,
                                            color: '#4C4F54',
                                            whiteSpace: 'nowrap',
                                        }}>
                                        {loading ? (
                                            <>
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <tr
                                                        key={i}
                                                        style={{
                                                            backgroundColor: '#fff',
                                                            paddingTop: '0.75rem',
                                                            paddingBottom: '0.75rem',
                                                        }}
                                                    >
                                                        <td className="tb-col nk-tb-col" style={{ width: 400 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                            <div className="master-sku-product-table-card mt-2 mb-2">
                                                                <Skeleton
                                                                    width={'168px'}
                                                                    height={'32px'}
                                                                    shape={'rectangle'}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ): listStock && listStock.length > 0 ? (
                                            <>
                                                {listStock?.map((data: any, index: any) => (
                                                     <tr
                                                        key={index}
                                                        style={{
                                                            backgroundColor: '#fff',
                                                            paddingTop: '0.75rem',
                                                            paddingBottom: '0.75rem',
                                                        }}
                                                    >
                                                        <td className="tb-col nk-tb-col-v2" style={{ width: 400 }}>
                                                             <div style={{ width: 400 }} className="master-sku-product-table-card mt-2 mb-2">
                                                                 <Image
                                                                    src={data?.product_image ? data.product_image : ilustrationCamera}
                                                                    width={44}
                                                                    height={44}
                                                                    alt="product-sku"
                                                                 />
                                                                 <div style={{ width: 300 }} className="master-sku-product-table-info text-truncate">
                                                                     <span
                                                                        style={{ cursor: 'pointer', width: 300, fontSize: 14 }}
                                                                        onClick={() => route.push(`/inventory/detail-stock/${data.product_id}`)}
                                                                     >
                                                                        {data?.product_name || '-'}
                                                                     </span>
                                                                     <br />
                                                                     <span style={{ fontWeight: 'normal', fontSize: 12, minWidth: 300 }}>
                                                                        {'Kode SKU: ' + data?.product_sku || '-'}
                                                                     </span>
                                                                 </div>
                                                             </div>   
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 215 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 215,
                                                                     
                                                                 }}
                                                             >
                                                                {data.locations && data.locations.map((value: any, index: any) => (
                                                                    <div className=" text-truncate" key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 100 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 100 
                                                                 }}
                                                             >
                                                                {data.total_stok && data.total_stok.map((value: any, index: any) => (
                                                                    <div key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 100 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 100 
                                                                 }}
                                                             >
                                                                {data.tersedia_normal && data.tersedia_normal.map((value: any, index: any) => (
                                                                    <div key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 100 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 100 
                                                                 }}
                                                             >
                                                                {data.tersedia_rusak && data.tersedia_rusak.map((value: any, index: any) => (
                                                                    <div key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 100 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 100 
                                                                 }}
                                                             >
                                                                {data.dialokasikan && data.dialokasikan.map((value: any, index: any) => (
                                                                    <div key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                        {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                         </td>
                                                         <td className="tb-col nk-tb-col" style={{ width: 100 }}>
                                                             <div
                                                                 style={{
                                                                     display: 'column',
                                                                     fontWeight: 'normal',
                                                                     color: '#4C4F54',
                                                                     width: 100 
                                                                 }}
                                                             >
                                                                {data.tersedia && data.tersedia.map((value: any, index: any) => (
                                                                    <div key={index} style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                                     {value}
                                                                    </div>
                                                                ))}
                                                             </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : null}
                                       
                                        
                                    </tbody>
                                </table>
                                {listStock && listStock.length == 0 && (
                                    <>
                                        <Styles.ContainerNoData>
                                            <Image
                                                src={Nodata}
                                                width={200}
                                                height={200}
                                                alt="waizly-logo"
                                            />
                                            <div className="text-silent">
                                                Belum Terdapat Data.
                                            </div>
                                        </Styles.ContainerNoData>
                                    </>
                                )}
                                
                            </div>
                            {listStock && listStock.length > 0 ? (
                                <div className="master-sku-product-table-card mt-2 mb-2 bg-white">
                                    <Col xs={12} lg={12}>
                                        <div className="d-flex justify-content-between align-items-center g-2 m-2 mt-2">
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
                                    </Col>
                                </div>
                            ): null}
                            
                        </div>
                    </Block>
                </BlockContent>
            </Content>
        </>
    );
};

const styles = {
    TooltipCanvasField: {
        width: '12rem',
        borderRadius: 8,
        textAlign: 'start',
        cursor: 'pointer'
    }
};

const Styles = {
    ContainerFilter: styled.div`
        display: flex;
        margin-left: 16px;
        flex-direction: row;
        gap: 4px;
        justify-content: center;
        cursor: pointer;
        margin-left: -2px;
    `,
    Text: styled.text`
        font-size: 14px;
        font-weight: 700;
        color: #203864;
    `,
    ContainerList: styled.div<{active: boolean}>`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        padding: 8px;
        margin-top: 4px;
        padding-left: 24px;
        cursor: pointer;
        background-color: ${props=> props.active ? '#E7EAEE': 'tranparent'};
        &:hover {
            background-color: #E7EAEE;
        }
        
    `,
    CheckContainer: styled.div<{active: boolean}>`
        display: flex;
        justify-content: center;
        border: 2px solid ${colors.darkBlue};
        background-color: ${props=> props.active ? colors.darkBlue : 'tranparent'};
        min-height: 16px;
        min-width: 16px;
        border-radius: 16px;
    `,
    TextList: styled.p`
        font-size: 12px;
        color: #4C4F54;
    `,
    ContainerNoData: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `
};

export default Stock;