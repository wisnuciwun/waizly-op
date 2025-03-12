/* eslint-disable react-hooks/exhaustive-deps */
// next & react import
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// layout
import InventoryTransferForm from '@/layout/inventory-transfer/form-inventory-transfer';

// third party
import { SelectItem, SelectItemOptionsType } from 'primereact/selectitem';

// redux & service
import { useSelector } from 'react-redux';
import {
  getLocationDropdown,
  getLocationDropdownWithStock,
} from '@/services/order';

// component
import { Head } from '@/components';

function FormTransfer() {
  // redux & utils
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const { client_id } = useSelector((state: any) => state.auth.user);

  // state
  const [listWarehouse, setListWarehouse] = useState<SelectItemOptionsType>([]);
  const [listWarehouseWithStock, setlistWarehouseWithStock] =
    useState<SelectItemOptionsType>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null,
  );

  // get list location werehouse
  const getListLocation = async () => {
    const response = await getLocationDropdown(client_id);
    const responseWithStock = await getLocationDropdownWithStock(client_id);

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

    if (responseWithStock && responseWithStock.data) {
      let datas: SelectItem[] = [];
      responseWithStock.data.forEach((data) => {
        datas.push({
          value: data.location_id.toString(),
          label: data.location_name,
        });
      });
      setlistWarehouseWithStock(datas);
    }
  };

  // handle choice werehouse origin and destination
  const filteredWarehouseOrigin = listWarehouseWithStock.filter(
    (warehouse) => warehouse.value !== selectedDestination,
  );

  const filteredWarehouseDestination = listWarehouse.filter(
    (warehouse) => warehouse.value !== selectedOrigin,
  );

  useEffect(() => {
    getListLocation();
  }, []);

  return (
    <>
      <Head title={`${actionParams === 'edit' ? 'Edit' : 'Tambah'} Transfer`} />
      <InventoryTransferForm
        alter={false}
        edit={actionParams === 'edit' ? true : false}
        listWarehouseOrigin={filteredWarehouseOrigin}
        listWarehouseDestination={filteredWarehouseDestination}
        setSelectedOrigin={setSelectedOrigin}
        setSelectedDestination={setSelectedDestination}
      />
    </>
  );
}

export default FormTransfer;
