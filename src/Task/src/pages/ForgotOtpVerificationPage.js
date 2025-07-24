import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/layout/Layout';
import authService from '../services/api/authService';
import { toast } from 'react-toastify';
import Input from '../components/ui/Input';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Button from '../components/ui/Button';
import { useForgotPassword } from '../hooks/api/useAuth';

const ForgotOtpVerificationPage = () => {
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;
  const type = location.state?.type || 'forgot_password_otp';

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: (data, values) => {
      if (data.success) {
        setCountdown(30);
        setCanResend(false);
        formik.setFieldValue('otp', '');
      }
    }
  });

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required('OTP is required')
      .matches(/^\d+$/, 'OTP must contain only digits')
      .min(6, 'OTP must be at least 6 digits')
      .max(6, 'OTP must be at most 6 digits'),
  });


  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          type: type,
          otp: values.otp,
          email
        };
        const response = await authService.resetPasswordStep1(payload);
        if (response?.success && response?.data?.is_otp_verified) {
          toast.success(response.message || 'OTP resent successfully. Please check your email.');
          navigate('/reset-password', {
            state: {
              email,
              otp: values.otp,
              type
            }
          });
        } else {
          toast.error(response.message || 'OTP verification failed');
        }
        setCountdown(0);
      } catch (error) {
        toast.error(error.response?.data?.message || 'OTP verification failed');
      }
    }
  });

  const handleResendCode = async () => {
    if (canResend) {
      await forgotPasswordMutation.mutateAsync({
        email: email
      });
      
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    
    if (!/^\d*$/.test(value) || value.length > 6) return;
    
    formik.setFieldValue('otp', value);
  };


  return (
    <Layout>
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 lg:w-5/12 mb-10 md:mb-0">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold text-black-0 mb-2">OTP Verification</h2>
                  <p className="text-gray-dark-200 mb-8 font-semibold">
                    We've sent a one-time passcode to your email.<br />
                    Please enter the 6-digit code below to continue.
                  </p>

                  {email && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        OTP sent to: <span className="font-semibold">{email}</span>
                      </p>
                    </div>
                  )}

                  <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="otp" className="block text-base font-semibold text-black-0 mb-1">
                        Enter OTP
                      </label>
                      <Input
                        id="otp"
                        name="otp"
                        type={showPassword ? 'text' : 'password'}
                        inputMode="numeric"
                        placeholder="Enter 6-digit code"
                        value={formik.values.otp}
                        onChange={handleOtpChange}
                        onBlur={formik.handleBlur}
                        maxLength={6}
                        error={formik.touched.otp && formik.errors.otp ? formik.errors.otp : null}
                        className="!rounded-full text-lg"
                        icon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                          >
                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                          </button>
                        }
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={!formik.values.otp || formik.values.otp.length < 6 || formik.isSubmitting}
                        className="py-3 !rounded-full !font-bold"
                      >
                        {formik.isSubmitting ? 'Verifying...' : 'Verify'}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-center text-gray-dark-200">
                      Didn't receive the code? Check your spam folder or
                    </p>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={handleResendCode}
                      disabled={!canResend}
                      variant="outline"
                      fullWidth
                      className="!rounded-full !font-bold"
                    >
                      {canResend ? 'Resend code' : `Resend code (${countdown}s)`}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-6/12">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="/images/Group 1376156601.svg"
                    alt="Student with books"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotOtpVerificationPage;