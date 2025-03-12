/* eslint-disable react-hooks/exhaustive-deps */
//react and next
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

//components
import {
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    DropdownOption,
    Head,
    Icon,
    PaginationComponent,
    SkeletonLoading,
    TagFilter
} from '@/components';
import {
    DataTableRow,
    DataTableItem,
} from '@/components/molecules/table/table-master-sku';
import { headerTableSubAccount } from '@/components/molecules/table/TableData';

//layout
import Content from '@/layout/content/Content';

//utils
import { getOptionSubAccount } from '@/utils/getSelectOption';
import { formatDate } from '@/utils';
import { UseDelay } from '@/utils/formater';
import { usePermissions } from '@/utils/usePermissions';

//third party
import { Badge, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';
import { useSelector } from 'react-redux';

//assets
import Nodata from '@/assets/images/illustration/no-data.svg';

//classnames
import classNames from 'classnames';
import { FilterTableRole } from '@/components/molecules/filter-table';

//services
import { getListSubAccount } from '@/services/subAccount';
import { getListRole } from '@/services/role';

function SubAccount({ }) {
    const permissions = usePermissions();

    const route = useRouter();
    const { client_id } = useSelector((state) => state.auth.user);

    const [dataSubAccount, setSubAccount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSearchOption, setSelectedSearchOption] = useState('full_name');
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [totalRecord, setTotalRecord] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
    const [filterDropdown, setFilterDropDown] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [dataFilter, setDataFilter] = useState([]);
    const tableClass = classNames({
        table: true,
        'table-bordered': false,
        'table-borderless': true,
        'table-striped': true,
        'table-hover': true,
    });


    const handleClickAddSubAccount = (id = null, type = 'add') => {
        if (type === 'add' && id !== null) {
            route.push({
                pathname: '/pengaturan/sub-account/form-sub-account',
                query: { action: type }
            });
        } else {
            route.push({
                pathname: '/pengaturan/sub-account/form-sub-account',
                query: { action: type, id },
            });
        }
    };

    const handleDeleteFilter = (idx) => {
        const dataFilters = dataFilter.filter((_,index) => index !== idx);
    
        setDataFilter(dataFilters);
      };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setSelectedPageSize(newSize);
        setPaginationModel((prev) => ({ ...prev, size: newSize, page: 1 }));
        fetchDataListSubAccount({page: 1, size: newSize});
        setCurrentPage(1);
    };

    const handleCheckboxChange = (id) => {
        if (selectedCheckboxes.includes(id)) {
            return (
                setSelectedCheckboxes(
                    selectedCheckboxes.filter((item) => item !== id)
                )
            );
        }
        return (
            setSelectedCheckboxes([...selectedCheckboxes, id])
        );
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handlePageChange = (pageNumber) => {
        paginate(pageNumber);
        fetchDataListSubAccount({page: pageNumber,size:  selectedPageSize});
        setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
    };

    const fetchGetListRole = async () => {
        try {
            setLoading(true);
            const response = await getListRole({
                client_id,
                page: 1,
                size: 11,
            });
            const transformedData = response?.data?.roles.filter(item => item.role_name !== 'SELLER_OWNER');
            setFilterDropDown(transformedData);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDataListSubAccount = async (data) => {
        const filterRole = dataFilter.filter((value) => value.type === 'Roles')[0]?.filter || [];
        try {
            setLoading(true);
            const requestBodyData = {
                role_id: filterRole,
                client_id: client_id,
                search: {
                    full_name: selectedSearchOption === 'full_name' ? search : '',
                    email: selectedSearchOption === 'email' ? search : '',
                },
                page: data ? data.page : paginationModel.page,
                size: data ? data.size : paginationModel.size,
            };
            const response = await getListSubAccount(requestBodyData);
            if (response?.status === 200) {
                setSubAccount(response?.data?.sub_accounts);
                setTotalRecord(response?.data?.page_info?.total_record);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                route.push('/login');
            }
        } finally {
            await UseDelay(500);
            setLoading(false);
        }
    };

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            fetchDataListSubAccount();
        }
    };

    // useEffect(() => {
    //     fetchGetListRole();
    // }, []);

    // useEffect(() => {
    //     fetchDataListSubAccount();
    // }, [selectedCheckboxes]);

    useEffect(() => {
        if(dataFilter.length > 0) {
            fetchDataListSubAccount({page: 1, size: 10 });
            setCurrentPage(1);
        } else {
            fetchDataListSubAccount();
        }
    },[dataFilter, selectedCheckboxes]);

    return (
        <>
            <Head title="Pengguna" />
            <Content>
                <BlockHead size="sm">
                    <BlockHeadContent>
                        <BlockBetween>
                            <BlockTitle>Pengguna</BlockTitle>
                            <Button
                                color="primary"
                                style={{ height: 43, fontSize: 14 }}
                                onClick={() => handleClickAddSubAccount(null, 'add')}
                                className={!permissions.includes('Tambah Sub Account') && 'btn-disabled'}
                                disabled={!permissions.includes('Tambah Sub Account')}
                            >
                                Tambah Pengguna
                            </Button>
                        </BlockBetween>
                    </BlockHeadContent>

                    <div className="d-flex justify-content-lg-end mt-1">
                        <div className="mt-2">
                            {loading ? (
                                <>
                                    <SkeletonLoading width={'450px'} height={'40px'} />
                                </>
                            ) : (
                                <div className="d-flex align-center">
                                    <div className="form-wrap">
                                        <DropdownOption
                                            className="filter-dropdown"
                                            options={getOptionSubAccount}
                                            optionLabel={'name'}
                                            placeholder={'Pilih'}
                                            value={selectedSearchOption}
                                            onChange={(e) => setSelectedSearchOption(e.target.value)}
                                        />
                                    </div>
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
                                        />
                                    </div>
                                    <FilterTableRole
                                        isOpen={isOpenFilter} 
                                        setIsOpen={(value) => setIsOpenFilter(value)} 
                                        dataFilter={dataFilter}
                                        setDataFilter={(data) => setDataFilter(data)}
                                    />
                                    {/* <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="a"
                                            className="btn"
                                        >
                                            <Button style={{ color: '#203864', fontSize: 14 }}>
                                                <Icon name="filter"></Icon> Filter
                                            </Button>
                                        </DropdownToggle>
                                        <DropdownMenu
                                            end
                                            className="filter-wg dropdown-menu"
                                            style={{ overflow: 'visible', width: 278 }}
                                        >
                                            <div className="dropdown-body dropdown-body-rg padding-wrapper" style={{ height: 230, overflow: 'auto' }}>
                                                <div>
                                                    <span className="sub-title dropdown-title headercheckboxtitle">ROLES</span>
                                                </div>
                                                {filterDropdown.map((filter, index) =>
                                                    <div key={index} className="d-flex padding-child listcheckbox" >
                                                        <Input
                                                            type="checkbox"
                                                            value={selectedCheckboxes.includes(filter?.role_id)}
                                                            checked={selectedCheckboxes.includes(filter?.role_id)}
                                                            onChange={() => handleCheckboxChange(filter?.role_id)}
                                                        />
                                                        <span className="text-truncate" style={{ maxWidth: 200, minWidth: 200 }}>
                                                            {filter?.role_name && filter?.role_name?.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </DropdownMenu>
                                    </UncontrolledDropdown> */}
                                </div>
                            )}
                        </div>
                    </div>
                </BlockHead>
                <div className='mb-4'>
                    {dataFilter && dataFilter.length > 0 ? (
                        <TagFilter
                            data={dataFilter}
                            onDelete={(index) => handleDeleteFilter(index)}
                            onReset={() => setDataFilter([])}
                        
                        />
                    ): null}
                </div>
                <div style={{ backgroundColor: 'white' }}>
                    <div className="table-responsive">
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    {headerTableSubAccount.header.map((item, idx) => {
                                        return (
                                            <th
                                                key={idx}
                                                className="fw-normal"
                                                style={{
                                                    fontSize: 13,
                                                    color: '#4C4F54',
                                                    paddingTop: 15,
                                                    paddingBottom: 15,
                                                }}
                                            >
                                                {item}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <>
                                        {[...Array(7)].map((_, index) => (
                                            <DataTableItem key={index}>
                                                {[...Array(7)].map((_, index) => (
                                                    <DataTableRow size="md" className="p-0" key={index}>
                                                        <SkeletonLoading
                                                            width={'100%'}
                                                            height={'100px'}
                                                            className="rounded-0"
                                                        />
                                                    </DataTableRow>
                                                ))}
                                            </DataTableItem>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {dataSubAccount.sort((a,b) => a.role_id - b.role_id).map((item, index) => (
                                            <tr style={{ fontSize: 13 }} key={index}>
                                                <td
                                                    style={{ minWidth: 300, maxWidth: 300, paddingTop: 40 }}
                                                >
                                                    <p className="text-truncate" style={{ color: '#4C4F54' }}>

                                                        {item?.full_name ?? '-'}
                                                    </p>
                                                    <Badge 
                                                        hidden={!(item.role_name == 'SELLER_OWNER')}
                                                        color=""
                                                        style={{
                                                            backgroundColor: '#E1EFFA',
                                                            color: '#0372D9',
                                                            border: 'none',
                                                            marginTop: -25,
                                                            fontSize: 12,
                                                            fontWeight: 700}}
                                                        >
                                                            AKUN UTAMA
                                                    </Badge>
                                                </td>
                                                <td
                                                    style={{ minWidth: 250, maxWidth: 250, paddingTop: 40 }}
                                                >
                                                    <p className="text-truncate" style={{ color: '#4C4F54' }}>
                                                        {item?.role_name
                                                            ? item.role_name.replace('_', ' ')
                                                            : '-'}
                                                    </p>
                                                </td>
                                                <td
                                                    style={{ minWidth: 230, maxWidth: 230, paddingTop: 40 }}
                                                >
                                                    <p className="text-truncate" style={{ color: '#4C4F54' }}>
                                                        {item?.email ?? '-'}
                                                    </p>
                                                </td>
                                                <td
                                                    className="d-flex flex-column"
                                                    style={{ minWidth: 200, color: '#4C4F54' }}
                                                >
                                                    <div>
                                                        <span className="fw-bold">Waktu Dibuat</span>
                                                        <p>{formatDate(item?.created_at) ?? '-'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="fw-bold">Waktu Diperbarui</span>
                                                        <p>{formatDate(item?.updated_at) ?? '-'}</p>
                                                    </div>
                                                </td>
                                                <td style={{ paddingTop: 28 }}>
                                                    {item?.role_name !== 'SELLER_OWNER' &&
                                                        <div>
                                                            <Button
                                                                size="lg"
                                                                onClick={() => handleClickAddSubAccount(item?.user_id, 'edit')}
                                                                style={{ marginLeft: -23 }}
                                                                disabled={!permissions.includes('Lihat Detail & Edit Sub Account')}
                                                            >
                                                                <Icon name="edit" />
                                                            </Button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </>

                                )}
                            </tbody>
                        </table>
                    </div>
                    <div
                        className={'dataTables_wrapper'}
                        style={{
                            backgroundColor: 'white',
                            padding: '15px 20px 15px 20px',
                            borderTop: dataSubAccount.length > 0 ? '1.5px solid #eceef4' : 'none',
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center g-2">
                            <div className="text-start">
                                {dataSubAccount.length > 0 && (
                                    <PaginationComponent
                                        itemPerPage={selectedPageSize}
                                        totalItems={totalRecord}
                                        paginate={handlePageChange}
                                        currentPage={currentPage}
                                    />
                                )}
                            </div>
                            <div className="text-center w-100">
                                {dataSubAccount.length > 0 ? (
                                    <div className="datatable-filter text-end">
                                        <div
                                            className="dataTables_length"
                                            id="DataTables_Table_0_length"
                                        >
                                            <label>
                                                <span className="d-none d-sm-inline-block">
                                                    Data Per Halaman
                                                </span>
                                                <div className="form-control-select">
                                                    <select
                                                        name="DataTables_Table_0_length"
                                                        className="custom-select custom-select-sm form-control form-control-sm"
                                                        value={selectedPageSize}
                                                        onChange={(e) => handlePageSizeChange(e)}
                                                    >
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="40">40</option>
                                                        <option value="50">50</option>
                                                    </select>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-silent">
                                        <Image
                                            src={Nodata}
                                            width={'auto'}
                                            height={'auto'}
                                            alt="waizly-logo"
                                        />
                                        <div className="text-silent">Belum Terdapat Data.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </>
    );
}

export default SubAccount;