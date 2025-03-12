import { API, axiosRequest } from '@/utils/api';

export const getShipping = async (payload) => {
  const response = await axiosRequest({
    url: API.shipping.listShipping,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDestination = async (destination) => {
  const response = await axiosRequest({
    url: API.shipping.getDestination(destination),
    method: 'GET',
  });

  return response?.data;
};
