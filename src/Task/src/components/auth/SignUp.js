import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import { signUpSchema } from '../../utils/validationSchema';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedinIn } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRegister } from '../../hooks/api/useAuth';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: 'in', dial: '+91' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const navigate = useNavigate();

  const registerMutation = useRegister({
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Registration successful! Please verify your OTP.');
        navigate('/verify-otp', { state: { email: formik.values.email } });
      }
    }
  });

  const countries = [
    { code: 'in', name: 'India', dial: '+91' },
    { code: 'us', name: 'United States', dial: '+1' },
    { code: 'uk', name: 'United Kingdom', dial: '+44' },
    { code: 'ca', name: 'Canada', dial: '+1' }
  ];

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      agreeTerms: false
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        await registerMutation.mutateAsync({
          name: values.fullName,
          email: values.email.toLowerCase(),
          country_code: selectedCountry.dial,
          phone_no: values.phoneNumber,
          password: values.password,
          device: 'web'
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 opacity-10">
        <img src="/images/email_bg.svg" alt="" className="w-full h-full" />
      </div>
      <div className="absolute left-0 bottom-0 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 opacity-10">
        <img src="/images/project_bg.svg" alt="" className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-12">
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
              className="w-full md:w-1/2 lg:w-5/12 mb-8 md:mb-0"
              variants={fadeInUp}
            >
              <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-6 lg:mr-12 xl:mr-16">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-black-0 mb-1 md:mb-2"
                  variants={fadeInUp}
                >
                  Sign Up
                </motion.h2>
                <motion.p
                  className="text-gray-dark-200 mb-6 md:mb-8 font-medium text-sm"
                  variants={fadeInUp}
                >
                  Please use the same email address you used to register on{' '}
                  <Link to="https://pmi.org" target="_blank" className="text-indigo-800 font-semibold hover:text-indigo-700">pmi.org</Link> If you're not yet a member, register on
                  <Link to="https://pmi.org" target="_blank" className="text-indigo-800 font-semibold hover:text-indigo-700 underline"> pmi.org</Link> first, then sign up here with that email.
                </motion.p>

                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                  variants={fadeInUp}
                >
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-black-0 mb-1">
                      Name
                    </label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter name"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : null}
                      className="!rounded-full"
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label htmlFor="email" className="block text-sm font-semibold text-black-0 mb-1">
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
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-black-0 mb-1">
                      Phone number
                    </label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center justify-between px-2 md:px-3 py-2 border border-gray-300 rounded-l-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${selectedCountry.code}.png`}
                            alt={selectedCountry.dial}
                            className="h-3 w-5 md:h-4 md:w-6 mr-1"
                          />
                          <span className="text-xs md:text-sm mr-1">{selectedCountry.dial}</span>
                          <FiChevronDown className={`h-3 w-3 md:h-4 md:w-4 transition-transform ${showCountryDropdown ? 'transform rotate-180' : ''}`} />
                        </button>

                        {showCountryDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto">
                            {countries.map((country) => (
                              <div
                                key={country.code}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryDropdown(false);
                                }}
                                className="flex items-center px-2 md:px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <img
                                  src={`https://flagcdn.com/w20/${country.code}.png`}
                                  alt={country.name}
                                  className="h-3 w-5 md:h-4 md:w-6 mr-2"
                                />
                                <span className="text-xs md:text-sm">{country.dial}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        placeholder="00000 00000"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`flex-1 appearance-none block w-full px-3 md:px-4 py-2 border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                          } border-l-0 rounded-r-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                      />
                    </div>
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.phoneNumber}</p>
                    )}
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
                        autoComplete="new-password"
                        placeholder="Enter Password"
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

                  <motion.div className="flex items-start" variants={fadeInUp}>
                    <div className="flex items-center h-5">
                      <div className="relative flex items-center">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formik.values.agreeTerms}
                          onChange={formik.handleChange}
                          className="opacity-0 absolute h-4 w-4 md:h-5 md:w-5 cursor-pointer"
                        />
                        <div className={`border ${formik.values.agreeTerms ? 'bg-purple-light border-purple-light' : 'border-gray-300'} rounded h-4 w-4 md:h-5 md:w-5 flex flex-shrink-0 justify-center items-center mr-2 transition-colors duration-200`}>
                          <svg className={`fill-current w-2.5 h-2.5 md:w-3 md:h-3 text-white pointer-events-none ${formik.values.agreeTerms ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`} viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="ml-3">
                      <label htmlFor="agreeTerms" className="text-sm font-medium text-black-0 cursor-pointer">
                        I agree to the{' '}
                        <Link to="/terms" className="text-indigo-800 font-semibold hover:text-indigo-700">
                          Terms & condition
                        </Link>{' '}
                        &{' '}
                        <Link to="/privacy" className="text-red-1 font-semibold hover:text-orange-500">
                          Privacy policy
                        </Link>
                      </label>
                      {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                        <p className="mt-1 text-sm text-red-500">{formik.errors.agreeTerms}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      className="py-2.5 md:py-3 !rounded-full !font-bold transition-transform duration-200 hover:scale-[1.02]"
                      disabled={registerMutation.isPending || !formik.values.agreeTerms}
                    >
                      {registerMutation.isPending ? 'Signing up...' : 'Request OTP'}
                    </Button>
                  </motion.div>

                  <motion.div
                    className="relative my-4 md:my-6 flex items-center justify-center"
                    variants={fadeInUp}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative bg-white px-4">
                      <span className="text-sm text-gray-500">OR</span>
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2 md:space-y-3" variants={fadeInUp}>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-2 md:py-2.5 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FcGoogle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Sign in with google
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center px-4 py-2 md:py-2.5 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FaLinkedinIn className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-700" />
                      Sign in with linkedin
                    </button>
                  </motion.div>
                </motion.form>

                <motion.div
                  className="mt-4 md:mt-6 text-center"
                  variants={fadeInUp}
                >
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-bold text-indigo-800 hover:text-indigo-700 underline transition-colors duration-200">
                      Sign in
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

export default SignUp;