import InventoryPurchaseForm from '@/layout/inventory/purchase-form';
import React from 'react';

function CreatePurchasement() {
  return (
    <>
      <InventoryPurchaseForm alter={false} edit={false} />;
    </>
  );
}

export default CreatePurchasement;
