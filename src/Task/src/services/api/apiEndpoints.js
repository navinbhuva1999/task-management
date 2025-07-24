const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    VERIFY_OTP: '/api/v1/auth/verify-otp',
    RESEND_OTP: '/api/v1/auth/resend-otp',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD_STEP1: '/api/v1/auth/reset-password/step1',
    RESET_PASSWORD_STEP2: '/api/v1/auth/reset-password/step2',
  },
  COURSES: {
    LIST: '/api/v1/courses',
    DETAIL: (id) => `/api/v1/courses/${id}`,
    MY_COURSES: '/api/v1/courses/my-courses',
    MY_COURSES_DETAIL: (id) => `/api/v1/courses/my-courses/${id}`,
  },
  PROFILE: {
    GET: '/api/v1/profile',
    UPDATE: (id) => `/api/v1/profile/${id}`,
    UPLOAD_IMAGE: '/api/v1/profile/upload-profile-image',
  },
  CART: {
    LIST: '/api/v1/cart',
    ADD: '/api/v1/cart/add',
    REMOVE: (id) => `/api/v1/cart/${id}`,
  },
  ADDONS: {
    LIST: '/api/v1/addons',
  },
  CHECKOUT: {
    APPLY_COUPON: '/api/v1/checkout/apply-coupon',
    CREATE_ORDER: '/api/v1/checkout/create-order',
    VERIFY_PAYMENT: '/api/v1/checkout/verify-payment',
    PAYMENT_STATUS: (orderId) => `/api/v1/checkout/payment-status/${orderId}`,
  },
  BLOGS: {
    LIST: '/api/v1/blogs/list',
    DETAIL: (id) => `/api/v1/blogs/details/${id}`,
    COMMENTS: '/api/v1/feedback/blog/create',
  },
  DASHBOARD: {
    OVERVIEW: '/api/v1/dashboard/overview',
  },
  CONTACT: {
    SUBMIT: '/api/v1/contact-us/create',
  },
  FEEDBACK: {
    CREATE: '/api/v1/feedback/tutor/create',
  },
  BATCH_CALENDAR: {
    PURCHASED_BATCHES: '/api/v1/batch-calendar/purchased-batches',
  }
};

export default API_ENDPOINTS; 