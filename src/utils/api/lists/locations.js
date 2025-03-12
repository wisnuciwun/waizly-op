// const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const locations = {
  getListWarehouse: (id, type) =>
    `${BASE_URL_V2}location/${id}/dropdown?location_type=${type}`,
  listLocation: `${BASE_URL_V2}location/search`,
  addLocation: `${BASE_URL_V2}location`,
  getDetailLocation: (id) => `${BASE_URL_V2}location/${id}`,
  getListProvince: `${BASE_URL_V2}location/provinces?country_id=1`,
  getListCities: (id) => `${BASE_URL_V2}location/cities?province_id=${id}`,
  getListDistricts: (id) => `${BASE_URL_V2}location/districts?city_id=${id}`,
  getListSubDistricts: (id) =>
    `${BASE_URL_V2}location/sub-districts?district_id=${id}`,
  updateLocation: (id) => `${BASE_URL_V2}location/${id}/change-info`,
  getHistoryLocation: (id, page, size) =>
    `${BASE_URL_V2}location/${id}/history?page=${page}&size=${size}`,
  getListStore: (id) => `${BASE_URL_V2}location/${id}/location-store`,
  getLocationMapping: `${BASE_URL_V2}location/mapping `,
  getEthixWerehouseLocation: () => `${BASE_URL_V2}location/ethix-location `,
};
