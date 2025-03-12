import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth';
import registerReducer from './register';
import productReducer from './product';

export const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  product: productReducer
});
