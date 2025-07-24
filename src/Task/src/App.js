import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';

import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import LearningCartPage from './pages/dashboard/LearningCartPage';
import LearningCartDetailPage from './pages/dashboard/LearningCartDetailPage';
import DashboardCourseDetailPage from './pages/dashboard/CourseDetailPage';
import BatchCalendarPage from './pages/dashboard/BatchCalendarPage';
import DashboardCoursesPage from './pages/dashboard/CoursesPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import HomePage from './pages/HomePage';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

import './assets/fonts/icons/style.css';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotOtpVerificationPage from './pages/ForgotOtpVerificationPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Auth Routes */}
            <Route path="/signin" element={
              <PublicRoute restricted={true}>
                <SignInPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute restricted={true}>
                <SignUpPage />
              </PublicRoute>
            } />
            <Route path="/verify-otp" element={
              <PublicRoute restricted={true}>
                <OtpVerificationPage />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute restricted={true}>
                <ForgotPasswordPage />
              </PublicRoute>
            } />
            <Route path="/otp-verification" element={
              <PublicRoute restricted={true}>
                <ForgotOtpVerificationPage />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute restricted={true}>
                <ResetPasswordPage />
              </PublicRoute>
            } />

            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/:slug" element={<CourseDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id/:slug" element={<BlogDetailPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cart" element={<LearningCartPage />} />
              <Route path="cart/details/:id" element={<LearningCartDetailPage />} />
              <Route path="cart/details/:id/:slug" element={<LearningCartDetailPage />} />
              <Route path="course/:id" element={<DashboardCourseDetailPage />} />
              <Route path="course/:id/:slug" element={<DashboardCourseDetailPage />} />
              <Route path="courses" element={<DashboardCoursesPage />} />
              <Route path="calendar" element={<BatchCalendarPage />} />
              <Route path="leaderboard" element={<div>Leaderboard Page</div>} />
              <Route path="certificates" element={<div>Certificates Page</div>} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={1}
          newestOnTop={true}
          closeOnClick
          pauseOnHover={false}
          draggable
        />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
