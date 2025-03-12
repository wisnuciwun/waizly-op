const defaultState = {
  masterSingleSKU: [],
  selectedItemsFiltered: [],
  checkboxOptionsFiltered: [],
  countOrderSidebar: [],
  shopifyValue: {}
};

export default function productReducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_MASTER_SINGLE_SKU':
      return {
        ...state,
        masterSingleSKU: action.masterSingleSKU,
      };
    case 'SELECTED_RIGHT_TABLE':
      return {
        ...state,
        selectedItemsFiltered: action.selectedItemsFiltered,
      };
    case 'SELECTED_LEFT_TABLE':
      return {
        ...state,
        checkboxOptionsFiltered: action.checkboxOptionsFiltered,
      };
    case 'ORDER_COUNT_SIDEBAR':
      return {
        ...state,
        countOrderSidebar: action.countOrderSidebar,
      };
    case 'SET_SHOPIFY_VALUE':
      return {
          ...state,
          shopifyValue: action.shopifyValue
      };
    default:
      return state;
  }
}
