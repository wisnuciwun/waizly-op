import InventoryPurchaseForm from '@/layout/inventory/purchase-form';
import React from 'react';

function EditPurchasement() {
  return (
    <>
      <InventoryPurchaseForm alter={false} edit={true} />;
    </>
  );
}

export default EditPurchasement;
