// const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const role = {
  listRole: `${BASE_URL_V2}role`,
  createRole: `${BASE_URL_V2}role/create`,
  listRoleModule: `${BASE_URL_V2}role/module`,
  updateRole: (id) => `${BASE_URL_V2}role/${id}/update`,
  getDetailLocation: (roleId, clientId) =>
    `${BASE_URL_V2}role/${roleId}/${clientId}`,
  getActivityHistoryRole: (id, page, size) =>
    `${BASE_URL_V2}role/${id}/history?page=${page}&size=${size}`,
};
