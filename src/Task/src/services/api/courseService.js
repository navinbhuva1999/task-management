import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const courseService = {

  getCourses: async (params = { page: 1, limit: 20 }) => {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.LIST, { params });
    return response.data;
  },

  getMyCourses: async (params = { page: 1, limit: 20 }) => {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.MY_COURSES, { params });
    return response.data;
  },

  getMyCourseDetail: async (id) => {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.MY_COURSES_DETAIL(id));
    return response.data;
  },

  
  getCourseById: async (id) => {
    const response = await axiosClient.get(API_ENDPOINTS.COURSES.DETAIL(id));
    return response.data;
  },

  
  addBatchToCart: async (batch_id) => {
    const response = await axiosClient.post(API_ENDPOINTS.CART.ADD, { batch_id });
    return response.data;
  },

  createFeedback: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.FEEDBACK.CREATE, data);
    return response.data;
  }
};

export default courseService; 