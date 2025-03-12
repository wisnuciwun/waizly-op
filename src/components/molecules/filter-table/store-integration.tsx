/* eslint-disable no-unused-vars */
import { Button, DropdownOption, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import Image from 'next/image';
import getMarketplaceImage from '@/utils/marketplaceImage';
import { getChannel, getWarehouse } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';
import { listMappingStatus, listOrderStatus } from './constant';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
};
const FilterTableStoreIntegration = ({
    isOpen,
    setIsOpen,
    dataFilter,
    setDataFilter
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    
    const [channel, setChannel] = useState<any>([]);
    const [location, setLocation] = useState<any>([]);
    const [listChannels, setListChannels] = useState<any>([]);
    const [listLocation, setListLocation] = useState<any>([]);
    const [mappingStatus, setMappingStatus] = useState<any>([]);
    const [statusOrder, setStatusOrder] = useState<any>(null);
    
    const fetchChannelData = async () => {
        try {
          const response = await getChannel();
          if (response.status === 200) {
            setListChannels(response.data.channel);
          } else {
            console.error('Error fetching channel data:', response.message);
          }
        } catch (error) {
          console.error('Error fetching channel data:', error.message);
        }
    };

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

    const handleSetData = () => {
        console.log('losg', statusOrder);
        const datas = [
            {
                type: 'Channel',
                filter: channel
            },
            {
                type: 'Gudang',
                filter: location
            },
            {
                type: 'Mapping Status',
                filter: mappingStatus
            },
            {
                type: 'Integrasi Pesanan',
                filter: statusOrder
            },
        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {
            const filterChannel = dataFilter.filter((value) => value.type === 'Channel')[0]?.filter || [];
            const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
            const filterMappingOrder = dataFilter.filter((value) => value.type === 'Mapping Status')[0]?.filter || [];
            const filterIntegrationOrder = dataFilter.filter((value) => value.type === 'Integrasi Pesanan')[0]?.filter;

            setChannel(filterChannel);
            setLocation(filterLocation);
            setMappingStatus(filterMappingOrder);
            setStatusOrder(filterIntegrationOrder === undefined ? null : filterIntegrationOrder); 
        } else {
            setChannel([]);
            setLocation([]);
            setMappingStatus([]);
            setStatusOrder(null); 
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
        fetchChannelData();
        fetchLocationData();
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
                            Channel
                        </Label>
                        <MultiSelect
                            id='channel'
                            value={channel}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setChannel(event.value)}
                            display={'chip'}
                            options={listChannels}
                            optionValue={'channel_id'}
                            optionLabel='channel_name'
                            placeholder={'Pilih Channel'}
                            emptyMessage={'Data channel tidak ditemukan.'}
                            itemTemplate={(option) => (
                                <>
                                  <div className="d-flex align-items-center">
                                    <Image
                                      width={16}
                                      height={16}
                                      src={getMarketplaceImage(option?.channel_name.toLowerCase())}
                                      alt={'image-list-store'}
                                    />
                                    <span style={Styles.textList}>{option?.channel_name}</span>
                                  </div>
                                </>
                            )}
                        />

                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Gudang
                        </Label>
                        <MultiSelect
                            id='channel'
                            value={location}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setLocation(event.value)}
                            display={'chip'}
                            options={listLocation}
                            optionValue={'location_id'}
                            optionLabel='location_name'
                            placeholder={'Pilih Gudang'}
                            emptyMessage={'Data gudang tidak ditemukan.'}
                        />

                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Mapping Status
                        </Label>
                        <MultiSelect
                            id='channel'
                            value={mappingStatus}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setMappingStatus(event.value)}
                            display={'chip'}
                            options={listMappingStatus}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Pilih Mapping Status'}
                            emptyMessage={'Data mapping status tidak ditemukan.'}
                        />

                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Integrasi Pesanan
                        </Label>
                        <DropdownOption
                            style={{ fontSize: 12 }}
                            options={listOrderStatus}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Hubungan Integrasi Pesanan'}
                            value={statusOrder}
                            onChange={(e) => {
                                setStatusOrder(e.target.value);
                            } }
                        />
                        {/* <MultiSelect
                            id='channel'
                            value={statusOrder}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setStatusOrder(event.value)}
                            display={'chip'}
                            options={listOrderStatus}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Pilih Integrasi Pesanan'}
                            emptyMessage={'Data Integrasi Pesanan tidak ditemukan.'}
                        /> */}

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

export default memo(FilterTableStoreIntegration);