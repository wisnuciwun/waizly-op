import { API, axiosRequest } from '@/utils/api';

export const getChangeLog = async () => {
    const response = await axiosRequest({
      url: API.changelog.getChangeLogs,
      method: 'GET',
    });
  
    return response?.data;
  };

export const getChangeLogId = async (id) => {
    const response = await axiosRequest({
      url: API.changelog.getChangeLogsId(id),
      method: 'GET',
    });
  
    return response?.data;
  };