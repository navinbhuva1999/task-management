import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const authService = {
  
  login: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },


  register: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },


  verifyOtp: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
  },

  resendOtp: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
    return response.data;
  },


  forgotPassword: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },


  resetPasswordStep1: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD_STEP1, data);
    return response.data;
  },

  resetPasswordStep2: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD_STEP2, data);
    return response.data;
  },


  logout: (redirect = true) => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    if (redirect) {
      setTimeout(() => {
        window.location.href = '/signin';
      }, 300);
    }
  }
};

export default authService; 