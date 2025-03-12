import { API, axiosRequest } from '@/utils/api';
import { PayloadInboundDataProps, PayloadInterfaceGetAction, PayloadInterfaceGetActionAdjustment } from './type';

export const getDataListInbound = async (
  payload: PayloadInterfaceGetAction
) => {
  const response = await axiosRequest({
    url: API.inventory.inboundList,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataDetailInbound = async (
  id: string | string[]
) => {
  const response = await axiosRequest({
    url: API.inventory.getDetailInbound(id),
    method: 'GET',
  });

  return response?.data;
};

export const confirmationInbound = async (
  payload: PayloadInboundDataProps
) => {
  const response = await axiosRequest({
    url: API.inventory.confirmationInbound,
    method: 'POST',
    payload
  });

  return response?.data;
};

export const exportInbound = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.exportInbound,
    method: 'POST',
    payload,
    responseType: 'arraybuffer',
  });

  return response?.data;
};

export const postCreateOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.createOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const postPurchaseOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.listOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const exportPurchaseOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.exportPurchaseOrder,
    method: 'POST',
    payload,
    responseType: 'arraybuffer',
  });

  return response?.data;
};

export const getInventoryList = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.listOrder,
    method: 'POST',
    payload
  });

  return response?.data;
};

export const patchPurchaseOrder = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.editOrder(id),
    method: 'PATCH',
    payload
  });

  return response?.data;
};

export const getOrderDetail = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.orderDetail(id),
    method: 'GET'
  });

  return response?.data;
};

export const cancelOrder = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.cancelOrder(id),
    method: 'PATCH',
    payload
  });

  return response?.data;
};

export const approveOrder = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.approveOrder(id),
    method: 'PATCH'
  });

  return response?.data;
};

export const getListStock = async (payload: PayloadInterfaceGetAction) => {

  const response = await axiosRequest({
    url: API.inventory.listStock,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailStock = async (id: number, client_id: string) => {

  const response = await axiosRequest({
    url: API.inventory.detailStock,
    params:{
      product_id: id,
      client_id
    },
    method: 'GET'
  });

  return response?.data;
};

export const getHistoryStock = async (payload: any) => {

  const response = await axiosRequest({
    url: API.inventory.historyStock,
    method: 'POST',
    payload
  });

  return response?.data;
};

export const getDataListOutbound = async (
  payload: PayloadInterfaceGetAction
) => {
  const response = await axiosRequest({
    url: API.inventory.outboundList,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataDetailOutbound = async (
  id: string | string[]
) => {
  const response = await axiosRequest({
    url: API.inventory.getDetailOutbound(id),
    method: 'GET',
  });

  return response?.data;
};

export const getDataListTransfer = async (
  payload: PayloadInterfaceGetAction
) => {
  const response = await axiosRequest({
    url: API.inventory.transferList,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const exportTranfer = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.exportTranfer,
    method: 'POST',
    payload,
    responseType: 'arraybuffer',
  });

  return response?.data;
};

export const postCreateTrasnfer = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.createTransfer,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const patchTrasnfer = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.editTransfer(id),
    method: 'PATCH',
    payload
  });

  return response?.data;
};

export const getTransferDetail = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.transferDetail(id),
    method: 'GET'
  });

  return response?.data;
};

export const approveTransfer = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.approveTransfer(id),
    method: 'GET'
  });

  return response?.data;
};

export const cancelTransfer = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.cancelTransfer(id),
    method: 'POST',
    payload
  });

  return response?.data;
};

export const getDataUserFilterList = async () => {
  const response = await axiosRequest({
    url: API.inventory.getFilterListTransfer,
    method: 'GET'
  });

  return response?.data;
};

export const getStockListSku = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.stockListSku,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDataListAdjustment = async (
  payload: PayloadInterfaceGetActionAdjustment
) => {
  const response = await axiosRequest({
    url: API.inventory.adjustmentList,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getAdjustmentDetail = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.adjustmentDetail(id),
    method: 'GET'
  });

  return response?.data;
};


export const postCreateAdjustment = async (payload) => {
  const response = await axiosRequest({
    url: API.inventory.createAdjustment,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const patchAdjustment = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.editAdjustment(id),
    method: 'PATCH',
    payload
  });

  return response?.data;
};

export const approveAdjustment = async (id) => {
  const response = await axiosRequest({
    url: API.inventory.approveAdjustment(id),
    method: 'PATCH'
  });

  return response?.data;
};

export const cancelAdjustment = async (id, payload) => {
  const response = await axiosRequest({
    url: API.inventory.cancelAdjustment(id),
    method: 'PATCH',
    payload
  });

  return response?.data;
};