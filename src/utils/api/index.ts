import {store} from '@/redux/store';
import {auth} from './lists/auth';
import {master} from './lists/master';
import {storeIntegration} from './lists/storeIntegration';
import {produkListing} from './lists/produk';
import {locations} from './lists/locations';
import {profileUpdate} from './lists/profileUpdate';
import {order} from './lists/order';
import {role} from './lists/role';
import {dashboardList as dashboard} from './lists/dashboard';
import {subAccount} from './lists/subAccount';
import {shipping} from './lists/shipping';
import { changelog } from './lists/change-log';
import axios, { ResponseType } from 'axios';
// import {snackBar} from '../snackbar';
// import {getMessageError} from './listError';
// import {UseDelay} from '../formater';
import {setToken} from '@/redux/action/auth';
import {inventory} from './lists/inventory';

export const API = {
  auth,
  master,
  storeIntegration,
  produkListing,
  order,
  locations,
  profileUpdate,
  role,
  shipping,
  subAccount,
  dashboard,
  changelog,
  inventory
};

interface PropsRequest {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  payload?: any;
  params?: any;
  exportData?: boolean;
  responseType?: ResponseType;
  type?: 'file' | 'data';
}

export const axiosRequest = async ({
  url, 
  method, 
  payload, 
  params, 
  exportData = false, 
  responseType, 
  type = 'data'
}: PropsRequest) => {
  const stores = store.getState();
  const token = stores.auth?.token;

  try {
    if (exportData) {
      const response = await axios({
        method: method,
        url: url,
        data: payload,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token || null}`,
        },
      });
      return response;
    } if(type === 'file') {
      const response = await axios({
        method: method,
        url: url,
        data: payload,
        params,
        headers: {
          Authorization: `Bearer ${token || null}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      return response;
    } else if(responseType) {
      const response = await axios({
        method: method,
        url: url,
        data: payload,
        params,
        responseType: responseType,
        headers: {
          Authorization: `Bearer ${token || null}`,
        },
      });
      return response;
    } else {
      const response = await axios({
        method: method,
        url: url,
        data: payload,
        params,
        headers: {
          Authorization: `Bearer ${token || null}`,
        },
      });
      return response;
    }
  } catch (error: any) {
    const errorData = error?.response?.data;
    if (errorData?.errors?.type === 'jwt_exception') {
      store.dispatch(setToken(''));
      window.location.replace('/login');
      return false;
    }

    if ([500].includes(errorData?.status)) {
      // snackBar("error", getMessageError(errorData?.errors?.type));
    }
    if (error.config?.url.includes('master') || error.config?.url.includes('order')){
      if([404, 400, 500].includes(errorData?.status)) 
        return errorData;
      else 
        return errorData?.error;
    } 
    else throw error;
  }
};
