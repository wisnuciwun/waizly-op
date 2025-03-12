import { API, axiosRequest } from '@/utils/api';
// import { PropsProductSKU } from './type';

export const getViewProduct = async (payload) => {
  const response = await axiosRequest({
    url: API.produkListing.getShopify,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailProduk = async (id) => {
  const response = await axiosRequest({
    url: API.produkListing.getProdukDetail(id),
    method: 'GET',
  });

  return response?.data;
};

export const getProductsMasterSKU = async (payload) => {
  const response = await axiosRequest({
    url: API.master.productListing,
    method: 'POST',
    payload
  });

  return response?.data;
};