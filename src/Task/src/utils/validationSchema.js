import * as Yup from 'yup';

// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const signInSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: Yup.boolean()
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required('Email is required field')
    .matches(emailRegex, 'Please enter a valid email address')
});

export const signUpSchema = Yup.object({
  fullName: Yup.string().required('Name is required'),
  email: Yup.string()
    .required('Email ID is required')
    .matches(emailRegex, 'Please enter a valid email address'),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions')
});

export const otpVerificationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
    .required('Please enter the verification code')
});

export const contactSchema = Yup.object({
  applicant_name: Yup.string()
    .required('Name of applicant is required'),
  applicant_contact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  applicant_email: Yup.string()
    .matches(emailRegex, 'Please enter a valid email address')
    .required('Email is required'),
  organization_name: Yup.string().required('Organization name is required'),
  total_trainee: Yup.string()
    .matches(/^[0-9]+$/, 'Number of trainees must be a number')
    .required('Number of trainees is required'),
  training_subject: Yup.string().required('Training subject is required'),
  year: Yup.string().required('Year is required'),
  month: Yup.string().required('Month is required'),
  week: Yup.string().required('Week is required'),
  other_information: Yup.string().required('Other information is required'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions')
}); 

export const commentSchema = Yup.object({
  name: Yup.string()
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment should not exceed 1000 characters')
}); 

export const feedbackSchema = Yup.object({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment should not exceed 500 characters')
});

export const resetPasswordSchema = Yup.object({
  new_password: Yup.string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('new_password')], 'Passwords do not match')
});