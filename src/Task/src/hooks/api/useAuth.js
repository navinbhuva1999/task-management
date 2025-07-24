import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import authService from '../../services/api/authService';


export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        localStorage.setItem('user_data', JSON.stringify(data.data.user));
        
        toast.success(data.message || 'Login successful', {
          toastId: 'login-success'
        });
        
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Login failed', {
        toastId: 'login-error'
      });
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};


export const useRegister = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      } else {
        toast.error(data.message || 'Registration failed', {
          toastId: 'register-error'
        });
      }
    },
    onError: (error, variables, context) => {
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};


export const useVerifyOtp = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.verifyOtp(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      } else {
        toast.error(data.message || 'OTP verification failed', {
          toastId: 'otp-error'
        });
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'OTP verification failed', {
        toastId: 'otp-error'
      });
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};


export const useResendOtp = (options = {}) => { 
  return useMutation({
    mutationFn: (data) => authService.resendOtp(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        toast.success(data.message || 'OTP sent successfully', {
          toastId: 'otp-success'
        });
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      } else {
        toast.error(data.message || 'Failed to send OTP', {
          toastId: 'otp-error'
        });
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Failed to send OTP', {
        toastId: 'otp-error'
      });
    },
  });
};


export const useForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
    onSuccess: (data, variables, context) => {
      if (data.success) {
        toast.success(data.message || 'Reset password link sent to your email', {
          toastId: 'forgot-password-success'
        });
        if (options.onSuccess) {
          options.onSuccess(data, variables, context);
        }
      } else {
        toast.error(data.message || 'Failed to send reset password link', {
          toastId: 'forgot-password-error'
        });
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || 'Failed to send reset password link', {
        toastId: 'forgot-password-error'
      });
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};


export const useLogout = () => {
  return () => {
    toast.success('Logged out successfully', {
      toastId: 'logout-success'
    });
    authService.logout();
  };
}; 

