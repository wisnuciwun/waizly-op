import { API, axiosRequest } from '@/utils/api';

export const getWarehouse = async (id, type) => {
  const response = await axiosRequest({
    url: API.locations.getListWarehouse(id, type),
    method: 'GET',
  });

  return response?.data;
};

export const getStore = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.getStoreList,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getChannel = async () => {
  const response = await axiosRequest({
    url: API.storeIntegration.getChannel,
    method: 'GET',
  });

  return response?.data;
};

export const getCourier = async (client_id) => {
  const response = await axiosRequest({
    url: API.storeIntegration.getCourier(client_id),
    method: 'GET',
  });

  return response?.data;
};

export const getLocation = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.getLocation,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const createStore = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.createStore,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getStoreId = async (id) => {
  const response = await axiosRequest({
    url: API.storeIntegration.getStoreId(id),
    method: 'GET',
  });

  return response?.data;
};

export const editStore = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.editStore,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getHistoryStore = async (id, params) => {
  const { page, size } = params;
  const response = await axiosRequest({
    url: `${API.storeIntegration.getHistoryStore(
      id,
    )}?page=${page}&size=${size}`,
    method: 'GET',
  });

  return response?.data;
};

export const postStoreId = async (id) => {
  const response = await axiosRequest({
    url: API.storeIntegration.postStoreId(id),
    method: 'POST',
  });

  return response?.data;
};

export const CreateSyncStore = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.syncStore,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const CreateSyncOrderStore = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.syncOrderStore,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getSyncOrderToggle = async (id) => {
  const response = await axiosRequest({
    url: API.storeIntegration.syncOrderToggle(id),
    method: 'GET',
  });

  return response?.data;
};

export const getChannelPenjualan = async () => {
  const response = await axiosRequest({
    url: API.storeIntegration.channelPenjualan,
    method: 'GET',
  });

  return response?.data;
};

export const authStoreTokopedia = async (id, location, user_id) => {
  const response = await axiosRequest({
    url: API.storeIntegration.storeAuthTokopedia(id, location, user_id),
    method: 'GET',
  });

  return response?.data;
};

export const getStoreByName = async (payload) => {
  const response = await axiosRequest({
    url: API.storeIntegration.storeByName,
    method: 'POST',
    payload,
  });

  return response?.data;
};
