import { API, axiosRequest } from '@/utils/api';

export const getListRole = async (payload) => {
  const response = await axiosRequest({
    url: API.role.listRole,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getDetailRole = async (roleId, clientId) => {
  const response = await axiosRequest({
    url: API.role.getDetailLocation(roleId, clientId),
    method: 'GET',
  });

  return response?.data;
};

export const createRole = async (payload) => {
  const response = await axiosRequest({
    url: API.role.createRole,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const updateRole = async (id, payload) => {
  const response = await axiosRequest({
    url: API.role.updateRole(id),
    method: 'PATCH',
    payload,
  });

  return response?.data;
};

export const listModuleRole = async (payload) => {
  const response = await axiosRequest({
    url: API.role.listRoleModule,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getActivityHistoryRole = async (id, page, size) => {
  const response = await axiosRequest({
    url: API.role.getActivityHistoryRole(id, page, size),
    method: 'GET',
  });

  return response?.data;
};
