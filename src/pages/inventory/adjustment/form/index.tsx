/* eslint-disable react-hooks/exhaustive-deps */
// next & react import
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// layout
import InventoryAdjustmentForm from '@/layout/inventory/inventory-adjustment/form-inventory-adjustment';

// third party
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';

// redux & service
import { useSelector } from 'react-redux';
import { getLocationDropdown } from '@/services/order';

// component
import { Head } from '@/components';

function FormAdjustment() {
  // redux & utils
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const { client_id } = useSelector((state: any) => state.auth.user);

  // state
  const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);

  // get list location werehouse 
  const getListLocation = async () => {
    const response = await getLocationDropdown(client_id);
    if (response && response.data) {
      let datas: SelectItem[] = [];
      response.data.forEach((data) => {
        datas.push({
          value: data.location_id.toString(),
          label: data.location_name,
        });
      });
      setListWarehouse(datas);
    }
  };


  useEffect(() => {
    getListLocation();
  }, []); 


  return (
    <>
      
      <Head title={`${actionParams === 'edit' ? 'Edit' : 'Tambah'} Adjustment`} />
      <InventoryAdjustmentForm 
        alter={false} 
        edit={actionParams === 'edit' ? true : false} 
        listWarehouseOrigin={listWarehouse}
      />
    </>
  ); 
}

export default FormAdjustment;
