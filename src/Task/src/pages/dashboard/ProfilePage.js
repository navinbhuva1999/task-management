import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiAlertCircle } from 'react-icons/fi';
import UserProfile from '../../components/profile/UserProfile';
import profileService from '../../services/api/profileService';

const ProfilePage = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: profileService.getProfile,
  });

  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
        <div className="bg-white rounded-[18px] shadow-sm overflow-hidden animate-fade-in border border-gray-light-D3 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FiAlertCircle className="text-red-500 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load profile</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Something went wrong. Please try again later.'}</p>
            <button 
              onClick={refetch} 
              className="px-4 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserProfile profile={profile} />
  );
};

export default ProfilePage; 