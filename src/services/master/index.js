import { API, axiosRequest } from '@/utils/api';

export const getStoreList = async (clientId, channelId) => {
  const response = await axiosRequest({
    url: `${API.master.storeList}/${clientId}/${channelId}/dropdown`,
    method: 'GET'
  });

  return response?.data;
};

export const getStoreListV2 = async (clientId, payload) => {
  const response = await axiosRequest({
    url: `${API.master.storeListV2}/${clientId}/dropdown?channel_id=${payload}`,
    method: 'GET'
  });

  return response?.data;
};

export const postProductsMasterSingleSKU = async (payload) => {
  const response = await axiosRequest({
    url: API.master.saveMasterSingleSKU,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const requestProductsMasterSKU = async (payload) => {
  const response = await axiosRequest({
    url: API.master.productListing,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getProductListing = async (params) => {
  const response = await axiosRequest({
    url: API.master.listingProduct,
    method: 'GET',
    params,
  });

  return response?.data;
};

export const syncProductListing = async (payload) => {
  const response = await axiosRequest({
    url: API.master.syncListingProduct,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const addProductListing = async (payload) => {
  const response = await axiosRequest({
    url: API.master.addProductListing,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getProducts = async (params) => {
  const response = await axiosRequest({
    url: API.master.products,
    method: 'GET',
    params,
  });

  return response?.data;
};

export const getMappingProduct = async (params) => {
  const response = await axiosRequest({
    url: API.master.mapingProduct,
    method: 'GET',
    params,
  });

  return response?.data;
};

export const getProductListingVariant = async (payload) => {
  const response = await axiosRequest({
    url: API.master.productListingVariant,
    method: 'POST',
    payload,
  });

  return response?.data;
};
export const createSingle = async (payload) => {
  const response = await axiosRequest({
    url: API.master.createSingleProduct,
    method: 'POST',
    payload,
  });

  return response;
};

export const createBundling = async (payload) => {
  const response = await axiosRequest({
    url: API.master.bundlingsCreate,
    method: 'POST',
    payload,
  });

  return response;
};

export const getBundlingDetail = async (id) => {
  const response = await axiosRequest({
    url: API.master.bundlingDetail(id),
    method: 'GET',
  });

  return response?.data;
};

export const changeInfoBundling = async (id, payload) => {
  const response = await axiosRequest({
    url: API.master.bundlingChangeInfo(id),
    method: 'POST',
    payload,
  });

  return response;
};

export const getCategory = async () => {
  const response = await axiosRequest({
    url: API.master.category,
    method: 'GET',
  });

  return response?.data;
};

// API Master SKU
export const getMasterSku = async (payload) => {
  const response = await axiosRequest({
    url: API.master.masterSku,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getCountMasterSku = async (payload) => {
  const response = await axiosRequest({
    url: API.master.countMasterSku,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailMasterSku = async (id) => {
  const response = await axiosRequest({
    url: API.master.getDetailsMasterSku(id),
    method: 'GET',
  });

  return response?.data;
};

export const updateMasterSku = async (id, payload) => {
  const response = await axiosRequest({
    url: API.master.updateMasterSku(id),
    method: 'POST',
    payload,
  });

  return response;
};

export const getDetailBundling = async (id) => {
  const response = await axiosRequest({
    url: API.master.bundlingDetail(id),
    method: 'GET',
  });

  return response?.data;
};

export const getActivityHistoryMasterSku = async (id, payload) => {
  const response = await axiosRequest({
    url: API.master.activityHistoryMasterSku(id),
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const exportDataMasterSku = async (payload) => {
  const response = await axiosRequest({
    url: API.master.exportDataMasterSku,
    method: 'POST',
    payload,
    exportData: true
  });

  return response;
};

export const downloadTemplate = async () => {
  const response = await axiosRequest({
    url: API.master.downloadTemplate,
    method: 'GET',
  });

  return response?.data;
};

export const importDataMasterSku = async (payload) => {
  const response = await axiosRequest({
    url: API.master.importDataMasterSku,
    method: 'POST',
    payload,
  });

  return response;
};

export const checkProgressFile = async (id, client_id) => {
  const response = await axiosRequest({
    url: API.master.checkProgressFile(id, client_id),
    method: 'GET',
  });

  return response?.data?.data;
};


