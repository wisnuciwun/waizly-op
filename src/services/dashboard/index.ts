import { API, axiosRequest } from '@/utils/api';
import { PayloadInterfaceGetAction } from './type';
import { payloadFilterDashboard } from '@/utils/type/dashboard';

export const getActionDataDashboard = async (
  payload: PayloadInterfaceGetAction
) => {
  const response = await axiosRequest({
    url: API.dashboard.getActionCount,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataStatusShipping = async (
  payload: payloadFilterDashboard
) => {
  const response = await axiosRequest({
    url: API.dashboard.getStatusShipping,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataSummaryOrder = async (payload: payloadFilterDashboard) => {
  const response = await axiosRequest({
    url: API.dashboard.getSummaryOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataChart = async (payload: payloadFilterDashboard) => {
  const response = await axiosRequest({
    url: API.dashboard.getChart,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataStore = async (client_id, channel_id) => {
  const response = await axiosRequest({
    url: API.dashboard.getStore(client_id, channel_id),
    method: 'GET',
  });

  return response?.data;
};
