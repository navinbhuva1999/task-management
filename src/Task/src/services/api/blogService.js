import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const blogService = {
  getBlogs: async (params = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.BLOGS.LIST, { params });
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await axiosClient.get(API_ENDPOINTS.BLOGS.DETAIL(id));
    return response.data;
  },

  createComment: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.BLOGS.COMMENTS, data);
    return response.data;
  }
};

export default blogService; 