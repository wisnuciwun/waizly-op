import { API, axiosRequest } from '@/utils/api';

export const getDetailUser = async (payload) => {
    const response = await axiosRequest({
        url: API.profileUpdate.getDetailUser(payload),
        method: 'GET',
    });

    return response?.data;
};

export const updateDetailProfile = async (payload, id) => {
    const response = await axiosRequest({
        url: API.profileUpdate.updateDetailProfile(id),
        method: 'PATCH',
        payload
    });

    return response?.data;
};

