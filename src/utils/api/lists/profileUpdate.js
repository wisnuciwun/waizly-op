// const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const profileUpdate = {
    getDetailUser: (id) => `${BASE_URL_V2}client/${id}`,
    updateDetailProfile: (id) => `${BASE_URL_V2}client/${id}/change-info`
};
