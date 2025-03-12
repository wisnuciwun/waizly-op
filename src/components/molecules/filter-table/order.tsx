/* eslint-disable no-unused-vars */
import { Button, DropdownOption, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import Image from 'next/image';
import getMarketplaceImage from '@/utils/marketplaceImage';
import { getChannel, getCourier, getWarehouse } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';
import { listMappingStatus, listMetodePembayaran, listOrderStatus } from './constant';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
};
const FilterTableOrder = ({
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
    const [listCourier, setListCourier] = useState<any>([]);
    const [mappingStatus, setMappingStatus] = useState<any>([]);
    const [metodePembayaran, setMetodePembayaran] = useState<any>(null);
    const [courier, setCourier] = useState<any>([]);
    
    const fetchChannelData = async () => {
        try {
          const response = await getChannel();
          if (response.status === 200) {
            const filteredChannels = response.data.channel.filter((channel) =>
                [1, 2, 3, 4, 6, 11, 14].includes(channel.channel_id),
              );
            setListChannels(filteredChannels);
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

    const fetchDeliveryCourier = async () => {
        try {
          const response = await getCourier(client_id);
          if (response.status === 200) {
            const courier = response?.data;
            setListCourier(courier);
          }
        } catch (error) {
          // console.error("Error fetching data:", error?.message);
        }
    };

    const handleSetData = () => {
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
                type: 'Metode Pembayaran',
                filter: metodePembayaran
            },
            {
                type: 'Courier',
                filter: courier
            },

        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {
            const filterChannel = dataFilter.filter((value) => value.type === 'Channel')[0]?.filter || [];
            const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
            const filterCourier = dataFilter.filter((value) => value.type === 'Courier')[0]?.filter || [];
            const filterMetode = dataFilter.filter((value) => value.type === 'Metode Pembayaran')[0]?.filter || [];
            
            setChannel(filterChannel);
            setLocation(filterLocation);
            setCourier(filterCourier);
            setMetodePembayaran(filterMetode); 
        } else {
            setChannel([]);
            setLocation([]);
            setCourier([]);
            setMetodePembayaran([]); 
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
        fetchDeliveryCourier();
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
                            Metode Pembayaran
                        </Label>
                       
                        <MultiSelect
                            id='payment'
                            value={metodePembayaran}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setMetodePembayaran(event.value)}
                            display={'chip'}
                            options={listMetodePembayaran}
                            optionValue={'value'}
                            optionLabel='label'
                            placeholder={'Pilih Metode Pembayaran'}
                            // emptyMessage={'Data Integrasi Pesanan tidak ditemukan.'}
                        />

                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Courier
                        </Label>
                        <MultiSelect
                            id='courier'
                            value={courier}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setCourier(event.value)}
                            display={'chip'}
                            options={listCourier}
                            optionValue={'logistic_carrier_id'}
                            optionLabel='logistic_carrier'
                            placeholder={'Pilih Courier'}
                            emptyMessage={'Data Courier tidak ditemukan.'}
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

export default memo(FilterTableOrder);