const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL_V2 = process.env.REACT_APP_API_BASE_URL_V2;

export const auth = {
  register: `${BASE_URL_V2}auth/register`,
  login: `${BASE_URL_V2}auth/login`,
  completeProfile: `${BASE_URL_V2}auth/complete-profile`,
  verifyAccount: `${BASE_URL_V2}auth/verify-account`,
  resendOtp: `${BASE_URL_V2}auth/resend-otp`,
  forgotPassword: `${BASE_URL_V2}auth/forgot-password`,
  reNewPassword: `${BASE_URL_V2}auth/renew-password`,
  logout: `${BASE_URL}auth/logout`,
  user: `${BASE_URL_V2}auth/user`,
  validateForgotPassword: `${BASE_URL_V2}auth/validate-link-password`,
  accessPermissions: `${BASE_URL_V2}auth/menu`
};
