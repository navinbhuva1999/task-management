import axiosClient from './axiosClient';
import API_ENDPOINTS from './apiEndpoints';

const contactService = {
  submit: async (data) => {
    const response = await axiosClient.post(API_ENDPOINTS.CONTACT.SUBMIT, data);
    return response.data;
  }
};

export default contactService;
