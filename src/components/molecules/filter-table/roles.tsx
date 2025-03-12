/* eslint-disable no-unused-vars */
import { Button, Icon } from '@/components';
import Filter, { Styles } from './styles';
import { memo, useEffect, useState } from 'react';
import { FormGroup, Label, Modal, ModalBody } from 'reactstrap';
import { MultiSelect } from 'primereact/multiselect';
import { useSelector } from 'react-redux';
import { getListRole } from '@/services/role';
interface Props {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    dataFilter: any;
    setDataFilter: (value: any) => void;
};
const FilterTableRole = ({
    isOpen,
    setIsOpen,
    dataFilter,
    setDataFilter
}: Props) => {
    const { client_id } = useSelector((state: any) => state?.auth.user);
    const [role, setRole] = useState<any>([]);
    const [listRole, setListRole] = useState<any>([]);
    
    const fetchGetListRole = async () => {
        try {
            const response = await getListRole({
                client_id,
                page: 1,
                size: 11,
            });
            const transformedData = response?.data?.roles.filter(item => item.role_name !== 'SELLER_OWNER');
            setListRole(transformedData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSetData = () => {

        const datas = [
            {
                type: 'Roles',
                filter: role
            }
        ];

        setDataFilter(datas);
        setIsOpen(false);
    };

    const handleSetDefaultFilter = () => {
        if(dataFilter?.length > 0) {

            const filterRole = dataFilter.filter((value) => value.type === 'Roles')[0]?.filter || [];
            setRole(filterRole);
        } else {
            setRole([]); 
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
        fetchGetListRole();
    },[]);

    return (
        <div>
            {RenderFilter()}
            <Modal
                toggle={()=>  {
                    setIsOpen(false);
                    handleSetDefaultFilter();
                }}
                isOpen={isOpen}
                style={Styles.modal}
            >
                <ModalBody style={Styles.modalBody}>
                    <FormGroup>
                        <Label htmlFor="channel" style={{ fontWeight: 700 }}>
                            Roles
                        </Label>
                        <MultiSelect
                            id='role'
                            value={role}
                            style={{ fontSize: 12 }}
                            onChange={(event) => setRole(event.value)}
                            display={'chip'}
                            options={listRole}
                            optionValue={'role_id'}
                            optionLabel='role_name'
                            placeholder={'Pilih Roles'}
                            emptyMessage={'Data roles tidak ditemukan.'}
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

export default memo(FilterTableRole);