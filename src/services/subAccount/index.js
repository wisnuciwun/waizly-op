import { API, axiosRequest } from '@/utils/api';

export const getListSubAccount = async (payload) => {
  const response = await axiosRequest({
    url: API.subAccount.getListSubAccount,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getActivityHistorySubAccount = async (id, page, size) => {
  const response = await axiosRequest({
    url: API.subAccount.getActivityHistorySubAccount(id, page, size),
    method: 'GET',
  });

  return response?.data;
};



export const getDataEditAccount = async (id) => {
    const response = await axiosRequest({
        url: API.subAccount.getDataEditAccount(id),
        method: 'GET',
    });

    return response?.data;
};

export const submitCreateSubAccount = async (payload) => {
    const response = await axiosRequest({
        url: API.subAccount.submitCreateSubAccount,
        method: 'POST',
        payload
    });

    return response?.data;
};

export const submitEditSubAccount = async (payload, id) => {
    const response = await axiosRequest({
        url: API.subAccount.submitEditSubAccount(id),
        method: 'PATCH',
        payload
    });

    return response?.data;
};