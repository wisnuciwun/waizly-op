/* eslint-disable no-unused-vars */
import { Button, DropdownOption, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import { getStore } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';
import { listSyncMasterSKU } from './constant';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
    channel: number;
};
const FilterTableStoreProduct = ({
    isOpen,
    setIsOpen,
    dataFilter,
    setDataFilter,
    channel
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [syncProduct, setSyncProduct] = useState<any>(null);
    const [store, setStore] = useState<any>([]);
    const [dataStore, setDataStore] = useState([]);

    const handleSetData = () => {

        const datas = [
            {
                type: 'Hubungan Master SKU',
                filter: syncProduct
            },
            {
                type: 'Toko',
                filter: store
            }
        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const fetchDataStore = async () => {
        try {
          const response = await getStore({
            client_id: client_id,
            channel: [channel],
            location: [],
            status: [],
            order_api: null,
            search: {
              store_name_op: null,
              store_name_channel: null,
            },
            page: 1,
            size: 1000,
          });
    
          if (response.status === 200) {
            setDataStore(response?.data?.store_list);
            console.log('hahha', response?.data?.store_list);
          } else {
            console.error('Error in response:', response.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {

            const filterSyncSKU = dataFilter.filter((value) => value.type === 'Hubungan Master SKU')[0]?.filter;
            const filterStore = dataFilter.filter((value) => value.type === 'Toko')[0]?.filter || [];
            setSyncProduct(filterSyncSKU === undefined ? null : filterSyncSKU);
            setStore(filterStore);
        } else {
            setSyncProduct(null);
            setStore([]);
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
        fetchDataStore();
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
                            Hubungan Master SKU
                        </Label>
                        {/* <MultiSelect
                            id='sync-store'
                            value={syncProduct}
                            onChange={(event) => setSyncProduct(event.value)}
                            style={{ fontSize: 12 }}
                            display={'chip'}
                            options={listSyncMasterSKU}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Pilih Hubungan Master SKU'}
                            emptyMessage={'Data Hubungan Master SKU tidak ditemukan.'}
                        /> */}

                        <DropdownOption
                            style={{ fontSize: 12 }}
                            options={listSyncMasterSKU}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Hubungan Master SKU'}
                            value={syncProduct}
                            onChange={(e) => {
                                setSyncProduct(e.target.value);
                            } }
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                           Toko
                        </Label>
                        <MultiSelect
                            id='toko'
                            value={store}
                            onChange={(event) => setStore(event.value)}
                            style={{ fontSize: 12 }}
                            display={'chip'}
                            options={dataStore}
                            optionValue={'id'}
                            optionLabel='store_name_op'
                            placeholder={'Pilih Store'}
                            emptyMessage={'Data Store tidak ditemukan.'}
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

export default memo(FilterTableStoreProduct);