const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const changelog = {
    getChangeLogs: `${BASE_URL_V2}changelogs`,
    getChangeLogsId: (id) => `${BASE_URL_V2}changelogs/${id}`,
};