import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const cartService = {

  getCartItems: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.CART.LIST);
    return response.data;
  },

  
  addBatchToCart: async (batch_id) => {
    const response = await axiosClient.post(API_ENDPOINTS.CART.ADD, { batch_id });
    return response.data;
  },

  
  addAddonToCart: async (addon_id) => {
    const response = await axiosClient.post(API_ENDPOINTS.CART.ADD, { addon_id });
    return response.data;
  },

  
  removeCartItem: async (id) => {
    const response = await axiosClient.delete(API_ENDPOINTS.CART.REMOVE(id));
    return response.data;
  },

  
  getAddons: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.ADDONS.LIST);
    return response.data;
  },

  applyCoupon: async (code) => {
    const response = await axiosClient.post(API_ENDPOINTS.CHECKOUT.APPLY_COUPON, { code });
    return response.data;
  },

  createOrder: async (coupon_code = null) => {
    const payload = coupon_code ? { coupon_code } : {};
    const response = await axiosClient.post(API_ENDPOINTS.CHECKOUT.CREATE_ORDER, payload);
    return response.data;
  },
  
  verifyPayment: async (paymentData) => {
    const response = await axiosClient.post(API_ENDPOINTS.CHECKOUT.VERIFY_PAYMENT, paymentData);
    return response.data;
  },
  
  getPaymentStatus: async (orderId) => {
    const response = await axiosClient.get(API_ENDPOINTS.CHECKOUT.PAYMENT_STATUS(orderId));
    return response.data;
  }
};

export default cartService; 