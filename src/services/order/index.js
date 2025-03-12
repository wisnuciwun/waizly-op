import { API, axiosRequest } from '@/utils/api';
import { orderStatus } from '@/utils';

export const getCountOrderSidebar = async (client_id) => {
  const payload = { client_id: client_id };

  const response = await axiosRequest({
    url: API.order.countOrderSidebar,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const countStatusOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.countStatusOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const createOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.createOrder,
    method: 'POST',
    payload,
  });

  return response;
};

export const updateOrder = async (id, payload) => {
  const response = await axiosRequest({
    url: API.order.updateOrder(id),
    method: 'PATCH',
    payload,
  });

  return response?.data;
};

export const updateAllOrder = async (id, payload) => {
  const response = await axiosRequest({
    url: API.order.updateAllOrder(id),
    method: 'PATCH',
    payload,
  });

  return response?.data;
};

export const getLocation = async (value) => {
  const response = await axiosRequest({
    url: API.order.getLocation(value),
    method: 'GET',
  });

  return response?.data;
};

export const getListSkuOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.getListSku,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailOrder = async (id) => {
  const response = await axiosRequest({
    url: API.order.getOrderDetail(id),
    method: 'GET',
  });

  return response?.data;
};

export const getHistoryOrder = async (id) => {
  const response = await axiosRequest({
    url: API.order.getHistoryOrder(id),
    method: 'GET',
  });

  return response?.data;
};

export const getOrderList = async (payload) => {
  const response = await axiosRequest({
    url: `${API.order.orderList}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const postCancelOrder = async (payload, id, tabStatus) => {
  let response;
  if (tabStatus == orderStatus.MENUNGGU_KURIR) {
    response = await axiosRequest({
      url: `${API.order.cancelOrderWaitingCourier(id)}`,
      method: 'POST',
      payload,
    });
  } else {
    response = await axiosRequest({
      url: `${API.order.cancelOrder(id)}`,
      method: 'POST',
      payload,
    });
  }

  return response?.data;
};

export const postReturOrder = async (payload, id) => {
  const response = await axiosRequest({
    url: `${API.order.returOrder(id)}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const postCompleteOrder = async (id) => {
  const response = await axiosRequest({
    url: `${API.order.completedOrder(id)}`,
    method: 'POST',
  });

  return response?.data;
};

export const postShipOrder = async (payload, id) => {
  const response = await axiosRequest({
    url: `${API.order.shipOrder(id)}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const postProcessOrder = async (id) => {
  const response = await axiosRequest({
    url: `${API.order.processOrder(id)}`,
    method: 'POST',
  });

  return response?.data;
};

export const postBulkProcessOrder = async (payload) => {
  const response = await axiosRequest({
    url: `${API.order.bulkProcessOrder()}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDeliveryInfo = async (id) => {
  const response = await axiosRequest({
    url: `${API.order.deliveryInfo(id)}`,
    method: 'GET',
  });

  return response?.data;
};

export const postAcceptReturOrder = async (id) => {
  const response = await axiosRequest({
    url: `${API.order.acceptReturOrder(id)}`,
    method: 'POST',
  });

  return response?.data;
};

export const getLocationDropdown = async (id) => {
  const response = await axiosRequest({
    url: API.order.getLocationDropdown(id),
    method: 'GET',
  });

  return response?.data;
};

export const getLocationDropdownWithStock = async (id) => {
  const response = await axiosRequest({
    url: API.order.getLocationDropdownWithStock(id),
    method: 'GET',
  });

  return response?.data;
};

export const getAreaSearch = async (value) => {
  const response = await axiosRequest({
    url: API.order.getArea(),
    method: 'GET',
    params: {
      search_key: value,
    },
  });

  return response?.data;
};

export const getShippingRate = async (payload) => {
  const response = await axiosRequest({
    url: API.order.shippingOrder(),
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const postRejectCancel = async (id) => {
  const response = await axiosRequest({
    url: API.order.rejectCancel(id),
    method: 'POST',
  });

  return response?.data;
};

export const postAcceptCancel = async (id) => {
  const response = await axiosRequest({
    url: API.order.acceptCancel(id),
    method: 'POST',
  });

  return response?.data;
};

export const trackingHistory = async (id) => {
  const response = await axiosRequest({
    url: API.order.trackingHistory(id),
    method: 'GET',
  });

  return response?.data;
};

export const completeOrder = async (id, payload) => {
  const response = await axiosRequest({
    url: API.order.completeOrder(id),
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getShippingLabel = async (id) => {
  const response = await axiosRequest({
    url: API.order.getShippingLabel(id),
    method: 'GET',
  });

  return response?.data;
};

export const getUploadOrderHistory = async (payload) => {
  const response = await axiosRequest({
    url: API.order.getUploadHistoryOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const requestDownloadOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.requestDownload,
    method: 'POST',
    payload,
  });

  return response;
};

export const geDownloadOrderHistory = async (id) => {
  const response = await axiosRequest({
    url: API.order.getDetailUploadHistory(id),
    method: 'GET',
    responseType: 'arraybuffer',
  });

  return response?.data;
};

export const uploadFileOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.uploadFileOrder,
    method: 'POST',
    payload,
    type: 'file',
  });

  return response;
};

export const geUploadOrderHistory = async (id) => {
  const response = await axiosRequest({
    url: API.order.getDetailDownloaddHistory(id),
    method: 'GET',
    responseType: 'arraybuffer',
  });

  return response?.data;
};

export const geUploadOrderHistoryCsv = async (id) => {
  const response = await axiosRequest({
    url: API.order.getDetailDownloaddHistory(id),
    method: 'GET',
  });

  return response?.data;
};

export const getDownloadOrderHistory = async (payload) => {
  const response = await axiosRequest({
    url: API.order.getDownloadHistoryOrder,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const parseOrder = async (payload) => {
  const response = await axiosRequest({
    url: API.order.parseOrder,
    method: 'POST',
    payload,
  });

  return response;
};

export const getCourier = async () => {
  const response = await axiosRequest({
    url: API.order.getCourier,
    method: 'GET',
  });

  return response?.data;
};

export const bulkRate = async (payload) => {
  const response = await axiosRequest({
    url: API.order.bulkRate,
    method: 'POST',
    payload,
  });

  return response;
};

export const checkBulkRate = async (id) => {
  const response = await axiosRequest({
    url: API.order.checkBulkRate(id),
    method: 'GET',
  });

  return response;
};

export const checkIndividualRate = async (id) => {
  const response = await axiosRequest({
    url: API.order.checkIndividualRate(id),
    method: 'GET',
  });

  return response;
};

export const getCODPriceByCourier = async (id, courier) => {
  const response = await axiosRequest({
    url: API.order.getCodPercentageByLogistic(id),
    method: 'GET',
    params: {
      logistic_provider_name: courier,
    },
  });

  return response?.data;
};

export const getCODPriceALL = async (id) => {
  const response = await axiosRequest({
    url: API.order.getCodPercentageByLogistic(id),
    method: 'GET',
  });

  return response?.data;
};

export const postBulkCompleteOrder = async (payload) => {
  const response = await axiosRequest({
    url: `${API.order.bulkCompleteOrder()}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const calculateInsurance = async (payload) => {
  const response = await axiosRequest({
    url: `${API.order.calculateInsurance}`,
    method: 'POST',
    payload,
  });

  return response?.data;
};
