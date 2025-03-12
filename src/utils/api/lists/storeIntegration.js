const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const storeIntegration = {
  getStoreList: `${BASE_URL_V2}store/search`,
  getChannel: `${BASE_URL}channel/common`,
  getLocation: `${BASE_URL}location/search`,
  getCourier: (client_id) => `${BASE_URL_V2}couriers?client_id=${client_id}`,
  createStore: `${BASE_URL_V2}store`,
  getStoreId: (id) => `${BASE_URL_V2}store/${id}`,
  editStore: `${BASE_URL_V2}store/change-info`,
  getHistoryStore: (id) => `${BASE_URL_V2}store/${id}/history`,
  postStoreId: (id) => `${BASE_URL_V2}store/${id}`,
  syncStore: `${BASE_URL_V2}product-listing/sync`,
  syncOrderStore: `${BASE_URL_V2}order/sync-order`,
  syncOrderToggle: (id) => `${BASE_URL_V2}store/${id}/order-toggle`,
  channelPenjualan: `${BASE_URL_V2}channel/common?exclude_integrated_channel=true`,
  storeAuthTokopedia: (id, location, user_id) =>
    `${BASE_URL_V2}store/TOKOPEDIA/connect?location_id=${location}&store_id=${id}&user_id=${user_id}`,
  storeByName: `${BASE_URL_V2}store/by-name `,
};
