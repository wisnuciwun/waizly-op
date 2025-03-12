const BASE_URL_SIT_MEDIO = process.env.REACT_APP_API_BASE_URL_SIT_MEDIO;
export const dashboardList = {
  getActionCount: `${BASE_URL_SIT_MEDIO}perlu-tindakan`,
  getStatusShipping: `${BASE_URL_SIT_MEDIO}status-pengiriman`,
  getSummaryOrder: `${BASE_URL_SIT_MEDIO}ringkasan-pesanan`,
  getChart: `${BASE_URL_SIT_MEDIO}grafik-data`,
  getStore: (client_id, channel_id) =>
    `${BASE_URL_SIT_MEDIO}${client_id}/store-data?channel_id=${channel_id}`,
};
