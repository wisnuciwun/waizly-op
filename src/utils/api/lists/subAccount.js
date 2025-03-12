// const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const subAccount = {
    getListSubAccount: `${BASE_URL_V2}sub-account `,
    getDataEditAccount: (id) => `${BASE_URL_V2}sub-account/${id}`,
    getActivityHistorySubAccount: (id, page, size) =>
        `${BASE_URL_V2}sub-account/${id}/history?page=${page}&size=${size}`,
    submitCreateSubAccount: `${BASE_URL_V2}sub-account/create`,
    submitEditSubAccount: (id) => `${BASE_URL_V2}sub-account/${id}/update`
};
