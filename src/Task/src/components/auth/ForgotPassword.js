import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { forgotPasswordSchema } from '../../utils/validationSchema';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useForgotPassword } from '../../hooks/api/useAuth';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: (data, values) => {
      if (data.success) {
        navigate('/otp-verification', {
          state: {
            email: values.email,
            type: 'forgot_password_otp'
          }
        });
      }
    }
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      await forgotPasswordMutation.mutateAsync({
        email: values.email.toLowerCase()
      });
    }
  });

  return (
    <div className="bg-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 lg:w-5/12 mb-8 md:mb-0">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-black-0 mb-1 md:mb-2">Forgot Password</h2>
                <p className="text-gray-dark-200 mb-6 md:mb-8 font-semibold">
                  Please enter your email to reset your password.
                </p>

                <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm md:text-base font-semibold text-black-0 mb-1">
                      Email ID
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email id"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                      className="!rounded-full"
                    />
                  </div>

                  <div className="flex space-x-3 md:space-x-4 w-full">
                    <Link to="/signin" className='w-full'>
                      <Button
                        type="button"
                        variant="outline"
                        className="py-2.5 md:py-3 !rounded-full !font-bold w-full"
                      >
                        Back
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      variant="primary"
                      className="py-2.5 md:py-3 !rounded-full !font-bold w-full"
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </form>
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
};

export default ForgotPassword; 