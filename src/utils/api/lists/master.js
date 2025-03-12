const BASE_URL = process.env.REACT_APP_API_BASE_URL + 'master';
const BASE_URL_V1 = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const master = {
  storeList: `${BASE_URL_V1}store`,
  storeListV2: `${BASE_URL_V2}store`,
  saveMasterSingleSKU: `${BASE_URL_V2}product-listing/add`,
  productListing: `${BASE_URL_V2}product-listing/list-product`,
  listingProduct: `${BASE_URL}/product-listings`,
  addProductListing: `${BASE_URL}/product-listings/add`,
  syncListingProduct: `${BASE_URL}/product-listings/sync`,
  bundling: `${BASE_URL}/bundlings`,
  bundlingDetail: (id) => `${BASE_URL_V2}master/bundlings/${id}`,
  bundlingChangeInfo: (id) => `${BASE_URL_V2}master/bundlings/${id}/change-info`,
  products: `${BASE_URL}/products`,
  mapingProduct: `${BASE_URL}/products/mapping/product`,
  productListingVariant: `${BASE_URL}/product-listings/variant`,
  bundlingsCreate: `${BASE_URL_V2}master/bundlings/create`,
  category: `${BASE_URL}/category`,
  createSingleProduct: `${BASE_URL_V2}master/products`,
  masterSku: `${BASE_URL_V2}master/products/search`,
  countMasterSku: `${BASE_URL_V2}master/products/count`,
  getDetailsMasterSku: (id) => `${BASE_URL_V2}master/products/${id}`,
  updateMasterSku: (id) => `${BASE_URL_V2}master/products/${id}/change-info`,
  activityHistoryMasterSku: (id) =>
    `${BASE_URL_V2}master/products/${id}/history`,
  exportDataMasterSku: `${BASE_URL_V2}master/products/export`,
  importDataMasterSku: `${BASE_URL_V2}master/products/import`,
  downloadTemplate: `${BASE_URL_V2}master/products/download-template-import`,
  checkProgressFile: (id, client_id) => `${BASE_URL_V2}master/products/import-progress?id=${id}&client_id=${client_id}`
};

