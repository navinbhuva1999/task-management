import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { motion }  from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { signInSchema } from '../../utils/validationSchema';
import { useUser } from '../../context/UserContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      try {
        const response = await login({
          email: values.email.toLowerCase(),
          password: values.password,
          device: 'web'
        });
        
        if (response.success) {
          navigate(from, { replace: true });
        }
      } catch (error) {
        // Error handling is done in the context
      }
    }
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-white relative overflow-hidden sm:pb-4 md:pb-6 lg:pb-10">
      <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
        <img src="/images/email_bg.svg" alt="" className="w-full h-full" />
      </div>
      <div className="absolute left-0 bottom-0 w-64 h-64 opacity-10">
        <img src="/images/project_bg.svg" alt="" className="w-full h-full" />
      </div>
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="w-full md:w-1/2 lg:w-5/12 mb-10 md:mb-0"
              variants={fadeInUp}
            >
              <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-8 lg:mr-16">
                <motion.h2 
                  className="text-3xl font-bold text-black-0 mb-2"
                  variants={fadeInUp}
                >
                  Sign In
                </motion.h2>
                <motion.p 
                  className="text-gray-dark-200 mb-8 font-medium text-sm"
                  variants={fadeInUp}
                >
                  Welcome! please log in with your PMI account to continue
                </motion.p>

                <motion.form 
                  onSubmit={formik.handleSubmit} 
                  className="space-y-6"
                  variants={fadeInUp}
                >
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="email" className="block text-sm font-semibold text-black-0 mb-1">
                      Email ID
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your.email@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
                      className="!rounded-full"
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label htmlFor="password" className="block text-sm font-semibold text-black-0 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
                        className="!rounded-full"
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
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          id="rememberMe"
                          name="rememberMe"
                          type="checkbox"
                          checked={formik.values.rememberMe}
                          onChange={formik.handleChange}
                          className="opacity-0 absolute h-5 w-5 cursor-pointer"
                        />
                        <div className={`border ${formik.values.rememberMe ? 'bg-purple-light border-purple-light' : 'border-gray-300'} rounded h-5 w-5 flex flex-shrink-0 justify-center items-center mr-2 transition-colors duration-200`}>
                          <svg className={`fill-current w-3 h-3 text-white pointer-events-none ${formik.values.rememberMe ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                        <label htmlFor="rememberMe" className="ml-1 block text-sm font-medium text-black-0 cursor-pointer">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-red-1 hover:text-orange-500 transition-colors duration-200">
                        Forgot Password?
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      className="py-3 !rounded-full !font-bold transition-transform duration-200 hover:scale-[1.02]"
                      disabled={loginLoading}
                    >
                      {loginLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="relative my-6 flex items-center justify-center"
                    variants={fadeInUp}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative bg-white px-4">
                      <span className="text-sm text-gray-500">OR</span>
                    </div>
                  </motion.div>

                </motion.form>

                <motion.div 
                  className="mt-6 text-center"
                  variants={fadeInUp}
                >
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-indigo-800 hover:text-indigo-700 underline transition-colors duration-200">
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="w-full md:w-1/2 lg:w-6/12 hidden md:block"
              variants={fadeInUp}
            >
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/images/Group 1376156601.svg" 
                  alt="Student with books" 
                  className="w-full h-auto"
                />
              </div>  
            </motion.div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;