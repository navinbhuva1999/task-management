import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import { otpVerificationSchema } from '../../utils/validationSchema';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useResendOtp, useVerifyOtp } from '../../hooks/api/useAuth';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const email = location.state?.email || '';

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'OTP verified successfully');
        navigate('/signin');
      }
    }
  });

  const resendOtpMutation = useResendOtp({
    onSuccess: (data) => {
      if (data.success) {
        setCountdown(30);
        setCanResend(false);
        formik.setFieldValue('otp', '');
      }
    }
  });


  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!email) {
      toast.error('Email not provided. Please go back to sign up.');
      navigate('/signup');
    }
  }, [email, navigate]);

  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: otpVerificationSchema,
    onSubmit: async (values) => {
      await verifyOtpMutation.mutateAsync({
        type: 'registration_otp',
        otp: values.otp,
        email
      });
    }
  });

  const handleResendCode = async () => {
    if (canResend) {
      await resendOtpMutation.mutateAsync({
        email: email,
        type: 'registration_otp'
      });
    }
    // if (canResend) {
    //   toast.info('Resending OTP code...');
    //   setCountdown(30);
    //   setCanResend(false);

    //   formik.setFieldValue('otp', '');
    // }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;

    if (!/^\d*$/.test(value) || value.length > 6) return;

    formik.setFieldValue('otp', value);
  };

  return (
    <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 lg:w-5/12 mb-8 md:mb-0">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-black-0 mb-1 md:mb-2">OTP Verification</h2>
                <p className="text-gray-dark-200 mb-6 md:mb-8 font-semibold text-sm">
                  We've sent a one-time passcode to your email.<br />
                  Please enter the 6-digit code below to continue.
                </p>

                {email && (
                  <div className="mb-3 md:mb-4 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600">
                      OTP sent to: <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="otp" className="block text-sm md:text-base font-semibold text-black-0 mb-1">
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
                      className="!rounded-full text-base md:text-lg"
                      icon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? <IoEyeOffOutline size={18} className="md:w-5 md:h-5" /> : <IoEyeOutline size={18} className="md:w-5 md:h-5" />}
                        </button>
                      }
                    />
                  </div>

                  <div className="pt-1 md:pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={!formik.values.otp || formik.values.otp.length < 6 || verifyOtpMutation.isPending}
                      className="py-2.5 md:py-3 !rounded-full !font-bold"
                    >
                      {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 md:mt-6">
                  <p className="text-xs md:text-sm font-semibold text-center text-gray-dark-200">
                    Didn't receive the code? Check your spam folder or
                  </p>
                </div>

                <div className="mt-3 md:mt-4">
                  <Button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    variant="outline"
                    fullWidth
                    className="!rounded-full !font-bold py-2.5 md:py-3"
                  >
                    {canResend ? 'Resend code' : `Resend code (${countdown}s)`}
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 lg:w-6/12 hidden md:block">
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
  );
}

export default OtpVerification;