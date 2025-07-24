import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { resetPasswordSchema } from '../utils/validationSchema';
import authService from '../services/api/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Layout from '../components/layout/Layout';

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const otp = location.state?.otp;
  const type = location.state?.type || 'forgot_password_otp';

  const formik = useFormik({
    initialValues: {
      new_password: '',
      confirm_password: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          email,
          otp,
          type,
          new_password: values.new_password,
          confirm_password: values.confirm_password
        };
        await authService.resetPasswordStep2(payload);
        toast.success('Password reset successfully');
        navigate('/signin');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Reset password failed');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <Layout>
      <div className="bg-white relative overflow-hidden sm:pb-4 md:pb-6 lg:pb-8 xl:pb-10">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {/* Left Section - Form */}
              <div className="w-full md:w-1/2 lg:w-5/12 mb-8 md:mb-0">
                <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-6 lg:mr-12 xl:mr-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-black-0 mb-1 md:mb-2">
                    Reset Password
                  </h2>
                  <p className="text-gray-dark-200 mb-6 md:mb-8 font-semibold text-sm">
                    Please enter your new password below.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-black-0 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="new_password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Enter Password"
                          value={formik.values.new_password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.new_password && formik.errors.new_password
                              ? formik.errors.new_password
                              : null
                          }
                          className="!rounded-full"
                          icon={
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                              {showPassword ? (
                                <IoEyeOffOutline size={20} />
                              ) : (
                                <IoEyeOutline size={20} />
                              )}
                            </button>
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirm_password"
                        className="block text-sm font-semibold text-black-0 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          name="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm Password"
                          value={formik.values.confirm_password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.confirm_password &&
                              formik.errors.confirm_password
                              ? formik.errors.confirm_password
                              : null
                          }
                          className="!rounded-full"
                          icon={
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                              {showConfirmPassword ? (
                                <IoEyeOffOutline size={20} />
                              ) : (
                                <IoEyeOutline size={20} />
                              )}
                            </button>
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        className="py-2.5 md:py-3 !rounded-full !font-bold transition-transform duration-200 hover:scale-[1.02]"
                        disabled={
                          formik.isSubmitting ||
                          !formik.values.new_password ||
                          !formik.values.confirm_password
                        }
                      >
                        {formik.isSubmitting
                          ? "Resetting password..."
                          : "Reset Password"}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-4 md:mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/signin"
                        className="font-bold text-indigo-800 hover:text-indigo-700 underline transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                    </p>
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

    </Layout>
  );
};

export default ResetPasswordPage;