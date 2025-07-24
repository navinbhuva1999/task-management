import API_ENDPOINTS from './apiEndpoints';
import axiosClient from './axiosClient';

const batchCalendarService = {
  getPurchasedBatches: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axiosClient.get(`${API_ENDPOINTS.BATCH_CALENDAR.PURCHASED_BATCHES}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default batchCalendarService;
