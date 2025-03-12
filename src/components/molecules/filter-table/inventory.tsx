/* eslint-disable no-unused-vars */
import { Button, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import { getWarehouse } from '@/services/storeIntegration';
import { useSelector } from 'react-redux';

interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
};
const FilterTableInventory = ({
    isOpen,
    setIsOpen,
    dataFilter,
    setDataFilter
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [location, setLocation] = useState<any>([]);
    const [listLocation, setListLocation] = useState<any>([]);
    

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

        const datas = [
            {
                type: 'Gudang',
                filter: location
            }
        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {

            const filterLocation = dataFilter.filter((value) => value.type === 'Gudang')[0]?.filter || [];
            setLocation(filterLocation);
        } else {
            setLocation([]); 
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
                    <div className="flex justify-center" style={{ marginTop: 24 }}>
                        <Button
                            type="button"
                            style={{ width: 168, fontSize: 14, color: '#203864' }}
                            className={'justify-center'}
                            onClick={() => setIsOpen(false)}
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

export default memo(FilterTableInventory);