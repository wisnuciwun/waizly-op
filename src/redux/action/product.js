
export const addMasterSingleSKU = (masterSingleSKU) => {
  return {
    type: 'ADD_MASTER_SINGLE_SKU',
    masterSingleSKU,
  };
};

export const setselectedItemsFiltered = (selectedItemsFiltered) => {
  return {
    type: 'SELECTED_RIGHT_TABLE',
    selectedItemsFiltered,
  };
};

export const setcheckboxOptionsFiltered = (checkboxOptionsFiltered) => {
  return {
    type: 'SELECTED_LEFT_TABLE',
    checkboxOptionsFiltered,
  };
};

export const setOrderCountSidebar = (countOrderSidebar) => {
  return {
    type: 'ORDER_COUNT_SIDEBAR',
    countOrderSidebar,
  };
};


export const setShopifyValue = (shopifyValue) => {
  return {
      type: 'SET_SHOPIFY_VALUE',
      shopifyValue
  };
};