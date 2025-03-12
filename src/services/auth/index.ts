import { API, axiosRequest } from '@/utils/api';
import {
  AuthPayload,
  SingleEmailPayload,
  OtpPayload,
  RegisterPayload,
  RenewPasswordPayload,
  VerifyPasswordPayload,
} from '@/utils/type/onboarding';

export const registerAccount = async (payload: RegisterPayload) => {
  const response = await axiosRequest({
    url: API.auth.register,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const login = async (payload: AuthPayload) => {
  const response = await axiosRequest({
    url: API.auth.login,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const verifyAccount = async (payload: OtpPayload) => {
  const response = await axiosRequest({
    url: API.auth.verifyAccount,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const resendOtp = async (payload: SingleEmailPayload) => {
  const response = await axiosRequest({
    url: API.auth.resendOtp,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const forgotPassword = async (payload: SingleEmailPayload) => {
  const response = await axiosRequest({
    url: API.auth.forgotPassword,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const reNewPassword = async (payload: RenewPasswordPayload) => {
  const response = await axiosRequest({
    url: API.auth.reNewPassword,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const logout = async () => {
  const response = await axiosRequest({
    url: API.auth.logout,
    method: 'POST',
  });

  return response?.data;
};

export const completeProfile = async (payload) => {
  const response = await axiosRequest({
    url: API.auth.completeProfile,
    method: 'POST',
    payload,
  });

  return response?.data;
};

export const getUser = async () => {
  const response = await axiosRequest({
    url: API.auth.user,
    method: 'GET',
  });

  return response?.data;
};

export const validateForgotPassword = async (
  payload: VerifyPasswordPayload
) => {
  const response = await axiosRequest({
    url: API.auth.validateForgotPassword,
    method: 'POST',
    payload
  });

  return response?.data;
};


export const accessPermissions = async () => {
  const response = await axiosRequest({
    url: API.auth.accessPermissions,
    method: 'GET',
  });

  return response?.data;
};
