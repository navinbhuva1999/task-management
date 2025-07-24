import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import contactService from '../../services/api/contactService';

export const useSubmitContact = (options = {}) => {
  return useMutation({
    mutationFn: (data) => contactService.submit(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        toast.success(data.message || 'Your inquiry has been submitted successfully!', {
          toastId: 'contact-success'
        });
        
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      } else {
        toast.error(data.message || 'Failed to submit inquiry', {
          toastId: 'contact-error'
        });
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please try again.', {
        toastId: 'contact-error'
      });
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};
