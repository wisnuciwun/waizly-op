/* eslint-disable react-hooks/exhaustive-deps */
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Button, Icon } from '@/components/atoms';
import Create, {styles} from './styles';
import { useSelector } from 'react-redux';
import { getWarehouse } from '@/services/storeIntegration';
import { getDataUserFilterList } from '@/services/inventory';

interface ListWarehouseProps {
    location_id: number;
    location_code: string;
    location_name: string;
    sub_district_id: number;
    location_type_id: number;
    location_type_name: string;
}
interface ListUserReciveProps {
    user_id: number;
    user_name: string;
}
interface ListUserApproveProps {
    user_id: number;
    user_name: string;
}
interface FilterOverlayProps {
    checkedItems: number[];
    checkedItemsApprove?: number[];
    checkedItemsRecive?: number[];
    setCheckedItems: React.Dispatch<React.SetStateAction<number[]>>;
    setCheckedItemsApprove?: React.Dispatch<React.SetStateAction<number[]>>;
    setCheckedItemsRecive?: React.Dispatch<React.SetStateAction<number[]>>;
    isMore?: boolean;
}

const FilterOverlayWarehouseList = ({
    checkedItems,
    setCheckedItems,
    checkedItemsApprove,
    checkedItemsRecive,
    setCheckedItemsApprove,
    setCheckedItemsRecive,
    isMore = false,
} :FilterOverlayProps) => {
  const op = useRef(null);
  const { client_id } = useSelector((state:any) => state.auth.user);

  const [listWarehouse, setListWarehouse] = useState<ListWarehouseProps[]>([]);
  const [listUserRecive, setListUserRecive] = useState<ListUserReciveProps[]>([]);
  const [listUserApprove, setListUserApprove] = useState<ListUserApproveProps[]>([]);


  const handleCheckboxChange = (event: CheckboxChangeEvent) => {
    const id = parseInt(event.target.name);
    setCheckedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleCheckboxChangeUserApprove = (event: CheckboxChangeEvent) => {
    const id = parseInt(event.target.name);
    setCheckedItemsApprove(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleCheckboxChangeUserRecive = (event: CheckboxChangeEvent) => {
    const id = parseInt(event.target.name);
    setCheckedItemsRecive(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleReset = () => {
    setCheckedItems([]);
    setCheckedItemsApprove && setCheckedItemsApprove([]);
    setCheckedItemsRecive &&  setCheckedItemsRecive([]);
  };

  const fetchWarehouseData = async () => {
    try {
        const response = await getWarehouse(client_id, 'ALL');
        const location = response.data;
        setListWarehouse(location);
    } catch (error) {
    //   console.error("Error fetching data:", error.message);
    }
  };

  const fetchUserData = async () => {
    try {
        const response = await getDataUserFilterList();
        setListUserRecive(response.data.created_by);
        setListUserApprove(response.data.approved_by);
    } catch (error) {
      // console.error("Error fetching data:", error.message);
    }
  };
  
  useEffect(() => {
    fetchWarehouseData();
    fetchUserData();
  },[]);

  return (
    <div>
        <Create.ContainerFilter onClick={(e) => op.current.toggle(e)}>
            <Icon style={{fontSize:20, color: '#203864'}} name="filter" />
            <Create.Text>{'Filter'}</Create.Text>
        </Create.ContainerFilter>
        <OverlayPanel ref={op} style={styles.overlay}>
            <div style={styles.header}>GUDANG</div>
            <div style={styles.listGroup as CSSProperties}>
                {listWarehouse.map((item) => (
                    <div
                        key={item.location_id}
                        style={{
                        ...styles.listItem,
                        backgroundColor: checkedItems.includes(item.location_id) ? '#E7EAEE' : 'white',
                        }}
                    >
                    <Checkbox
                        inputId={item.location_id.toString()}
                        name={item.location_id.toString()}
                        checked={checkedItems.includes(item.location_id)}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor={item.location_id.toString()} style={styles.label}>{item.location_name}</label>
                    </div>
                ))}
                 {isMore && (
              <>
              <div style={styles.header}>DIBUAT OLEH</div>
                <div>
                    {listUserRecive.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                            ...styles.listItem,
                            backgroundColor: checkedItemsRecive.includes(item?.user_id) ? '#E7EAEE' : 'white',
                            }}
                        >
                        <Checkbox
                            inputId={item?.user_id.toString()}
                            name={item?.user_id.toString()}
                            checked={checkedItemsRecive.includes(item?.user_id)}
                            onChange={handleCheckboxChangeUserRecive}
                        />
                        <label htmlFor={item?.user_id.toString()} style={styles.label}>{item?.user_name}</label>
                        </div>
                    ))}
                </div>
                <div style={styles.header}>DISETUJUI OLEH</div>
                <div>
                    {listUserApprove.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                            ...styles.listItem,
                            backgroundColor: checkedItemsApprove.includes(item.user_id) ? '#E7EAEE' : 'white',
                            }}
                        >
                        <Checkbox
                            inputId={item.user_id.toString()}
                            name={item.user_id.toString()}
                            checked={checkedItemsApprove.includes(item.user_id)}
                            onChange={handleCheckboxChangeUserApprove}
                        />
                        <label htmlFor={item.user_id.toString()} style={styles.label}>{item?.user_name}</label>
                        </div>
                    ))}
                </div>
              </>
            )}
            </div>
            <div style={styles.buttonContainer}>
                <Button
                    color="primary"
                    onClick={handleReset}
                    style={styles.resetButton}
                >
                    Reset
                </Button>
            </div>
        </OverlayPanel>
    </div>
  );
};

export default FilterOverlayWarehouseList;
