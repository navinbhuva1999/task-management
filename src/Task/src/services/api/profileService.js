import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const profileService = {

  getProfile: async () => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.PROFILE.GET);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (id, data) => {
    try {
      if (!data.profile_image_id && data.profile_image_id !== 0) {
        data.profile_image_id = 0;
      }
      
      if (data.profile_image_id !== undefined && Object.keys(data).length === 1) {
        const response = await axiosClient.put(API_ENDPOINTS.PROFILE.UPDATE(id), {
          profile_image_id: data.profile_image_id
        });
        return response.data;
      }
      
      const response = await axiosClient.put(API_ENDPOINTS.PROFILE.UPDATE(id), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', file);
      
      const response = await axiosClient.post(API_ENDPOINTS.PROFILE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default profileService; 