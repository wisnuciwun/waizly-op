/* eslint-disable no-unused-vars */
import { Button, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, use, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import { getWarehouse } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';
import { getDataUserFilterList } from '@/services/inventory';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
};
const FilterTableInventoryTransfer = ({
    isOpen,
    setIsOpen,
    dataFilter,
    setDataFilter
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [location, setLocation] = useState<any>([]);
    const [userCreate, setUserCreate] = useState<any>([]);
    const [userApprove, setUserApprove] = useState<any>([]);
    const [listLocation, setListLocation] = useState<any>([]);
    const [listUserCreate, setListUserCreate] = useState<any>([]);
    const [listUserApprove, setListUserApprove] = useState<any>([]);


    const fetchLocationData = async () => {
        try {
          const response = await getWarehouse(client_id, 'ALL');
    
          if (response.status === 200) {
            const location = response.data;
            setListLocation(location);
          } else {
            console.error('Error in response:', response.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await getDataUserFilterList();
            setListUserCreate(response.data.created_by);
            setListUserApprove(response.data.approved_by);
        } catch (error) {
          // console.error("Error fetching data:", error.message);
        }
      };

    const handleSetData = () => {

        const datas = [
            {
                type: 'Gudang',
                filter: location
            },
            {
                type: 'Dibuat Oleh',
                filter: userCreate
            },
            {
                type: 'Disetujui Oleh',
                filter: userApprove
            }
        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {

            const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
            const filterUserCreate = dataFilter.filter((value) => value.type === 'Dibuat Oleh')[0]?.filter || [];
            const filterUserApprove = dataFilter.filter((value) => value.type === 'Disetujui Oleh')[0]?.filter || [];
            setLocation(filterLocation);
            setUserCreate(filterUserCreate);
            setUserApprove(filterUserApprove);
        } else {
            setLocation([]); 
            setUserCreate([]);
            setUserApprove([]);
        }
    };


    useEffect(() => {
        handleSetDefaultFilter();
    }, [dataFilter]);


    const RenderFilter = () => {

        return (
            <Filter.Container onClick={() => setIsOpen(true)}>
                <Icon style={Styles.icon} name="filter"/>
                <Filter.Text>{'Filter'}</Filter.Text>
            </Filter.Container>
        );
    };

    useEffect(() => {
        fetchLocationData();
        fetchUserData();
    },[]);

    return (
        <div>
            {RenderFilter()}
            <Modal
                toggle={()=> {
                    handleSetDefaultFilter();
                    setIsOpen(false);
                }}
                isOpen={isOpen}
                style={Styles.modal}
            >
                <ModalBody style={Styles.modalBody}>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Gudang
                        </Label>
                        <MultiSelect
                            id='channel'
                            value={location}
                            onChange={(event) => setLocation(event.value)}
                            display={'chip'}
                            style={{ fontSize: 12 }}
                            options={listLocation}
                            optionValue={'location_id'}
                            optionLabel='location_name'
                            placeholder={'Pilih Gudang'}
                            emptyMessage={'Data gudang tidak ditemukan.'}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Dibuat Oleh
                        </Label>
                        <MultiSelect
                            id='user-create'
                            value={userCreate}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setUserCreate(event.value)}
                            display={'chip'}
                            options={listUserCreate}
                            optionValue={'user_id'}
                            optionLabel='user_name'
                            placeholder={'Pilih Dibuat Oleh'}
                            emptyMessage={'Data Dibuat tidak ditemukan.'}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Disetujui Oleh
                        </Label>
                        <MultiSelect
                            id='user-approve'
                            value={userApprove}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setUserApprove(event.value)}
                            display={'chip'}
                            options={listUserApprove}
                            optionValue={'user_id'}
                            optionLabel='user_name'
                            placeholder={'Pilih Disetujui Oleh'}
                            emptyMessage={'Data Dubuat tidak ditemukan.'}
                        />

                    </FormGroup>
                    <div className="flex justify-center" style={{ marginTop: 24 }}>
                        <Button
                            type="button"
                            style={{ width: 168, fontSize: 14, color: '#203864' }}
                            className={'justify-center'}
                            onClick={() => {
                                handleSetDefaultFilter();
                                setIsOpen(false);
                            }}
                        >
                            Kembali
                        </Button>

                        <Button
                            className={'btn center shadow-none btn-primary'}
                            style={{ width: 140, fontSize: 14 }}
                            onClick={handleSetData}
                        >
                            Konfirmasi
                            
                        </Button>

                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default memo(FilterTableInventoryTransfer);