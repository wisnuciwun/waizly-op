import { API, axiosRequest } from '@/utils/api';

export const getStoreLocation = async (id) => {
  const response = await axiosRequest({
    url: API.locations.getListStore(id),
    method: 'GET',
  });

  return response?.data;
};

export const postLocationMapping = async (payload) => {
  const response = await axiosRequest({
    url: API.locations.getLocationMapping,
    method: 'POST',
    payload: payload,
  });

  return response?.data;
};

export const getListWerehouse = async (payload) => {
  const response = await axiosRequest({
    url: API.locations.listLocation,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const addWerehouse = async (payload) => {
  const response = await axiosRequest({
    url: API.locations.addLocation,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailWerehouse = async (id) => {
  const response = await axiosRequest({
    url: API.locations.getDetailLocation(id),
    method: 'GET',
  });

  return response?.data;
};

export const updateWerehouse = async (id, payload) => {
  const response = await axiosRequest({
    url: API.locations.updateLocation(id),
    method: 'PATCH',
    payload,
  });

  return response?.data;
};

export const getProvince = async () => {
  const response = await axiosRequest({
    url: API.locations.getListProvince,
    method: 'GET',
  });

  return response?.data;
};

export const getCities = async (id) => {
  const response = await axiosRequest({
    url: API.locations.getListCities(id),
    method: 'GET',
  });

  return response?.data;
};

export const getDistricts = async (id) => {
  const response = await axiosRequest({
    url: API.locations.getListDistricts(id),
    method: 'GET',
  });

  return response?.data;
};

export const getSubDistricts = async (id) => {
  const response = await axiosRequest({
    url: API.locations.getListSubDistricts(id),
    method: 'GET',
  });

  return response?.data;
};

export const getActivityHistoryLocation = async (id, page, size) => {
  const response = await axiosRequest({
    url: API.locations.getHistoryLocation(id, page, size),
    method: 'GET',
  });

  return response?.data;
};
 
export const getEthixWerehouseLocation = async () => {
  const response = await axiosRequest({
    url: API.locations.getEthixWerehouseLocation(),
    method: 'GET',
  });

  return response?.data;
};