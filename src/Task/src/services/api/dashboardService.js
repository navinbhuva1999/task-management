import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const dashboardService = {
  getDashboardOverview: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data;
  }
};

export default dashboardService; 