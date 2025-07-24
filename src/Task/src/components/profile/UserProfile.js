import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileDetails from './ProfileDetails';
import EmployerDetails from './EmployerDetails';
import EducationDetails from './EducationDetails';
import profileService from '../../services/api/profileService';
import { useUser } from '../../context/UserContext';

const UserProfile = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [animateIn, setAnimateIn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { updateProfileImage } = useUser();

  const userData = {
    id: profile?.id,
    name: profile?.name || 'User',
    email: profile?.email || '',
    pmiId: profile?.user_info?.profile_details?.pmi_id || '',
    avatar: profile?.profile_image?.url || null,
    profile_image_id: profile?.profile_image?.id || null,
    summary: profile?.user_info?.profile_details?.summary || '',
    dob: profile?.user_info?.profile_details?.date_of_birth || '',
    linkedin: profile?.user_info?.profile_details?.linkedin || '',
    instagram: profile?.user_info?.profile_details?.instagram || '',
    twitter: profile?.user_info?.profile_details?.twitter || '',
    employer: {
      company: profile?.user_info?.current_employer?.company_name || '',
      startDate: profile?.user_info?.current_employer?.start_date || ''
    },
    education: {
      school: profile?.user_info?.education_details?.school || '',
      degree: profile?.user_info?.education_details?.degree || '',
      field: profile?.user_info?.education_details?.field_of_study || '',
      grade: profile?.user_info?.education_details?.grade || '',
      startDate: profile?.user_info?.education_details?.start_date || '',
      endDate: profile?.user_info?.education_details?.end_date || '',
      description: profile?.user_info?.education_details?.description || ''
    }
  };

  const uploadProfileImageMutation = useMutation({
    mutationFn: profileService.uploadProfileImage,
    onMutate: () => {
      setIsUploading(true);
    },
    onSuccess: (data) => {
      const assetId = data?.data?.asset_id;

      if (assetId) {
        updateProfileWithImageMutation.mutate({
          profile_image_id: assetId
        });
      } else {
        setIsUploading(false);
        toast.error('Failed to process uploaded image', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#ff4d4f',
            color: '#fff',
          },
          icon: '❌',
        });
      }
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(error.message || 'Failed to upload profile picture', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ff4d4f',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  });

  const updateProfileWithImageMutation = useMutation({
    mutationFn: (data) => profileService.updateProfile(profile?.id, data),
    onSuccess: (response) => {
      setIsUploading(false);
      toast.success('Profile picture updated successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4E17A8',
          color: '#fff',
        },
        icon: '✅',
      });

      const profileImageData = response?.data?.profile_image || null;

      if (profileImageData) {
        updateProfileImage(profileImageData);
      }

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(error.message || 'Failed to update profile with new image', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ff4d4f',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  });

  useEffect(() => {
    setAnimateIn(true);

    const resetAnimation = () => {
      setAnimateIn(false);
      setTimeout(() => setAnimateIn(true), 50);
    };

    resetAnimation();
  }, [activeTab]);

  const handleProfilePictureClick = () => {
    if (isUploading) return;
    fileInputRef.current.click();
  };

  const validateImageFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPG and PNG files are allowed'
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { isValid: true };
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const validation = validateImageFile(file);

      if (!validation.isValid) {
        toast.error(validation.error, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#ff4d4f',
            color: '#fff',
          },
          icon: '❌',
        });
        return;
      }

      uploadProfileImageMutation.mutate(file);
    } catch (error) {
      toast.error('Error processing image. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#ff4d4f',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileDetails user={userData} userId={profile?.id} />;
      case 'employer':
        return <EmployerDetails employer={userData.employer} userId={profile?.id} />;
      case 'education':
        return <EducationDetails education={userData.education} userId={profile?.id} />;
      default:
        return <ProfileDetails user={userData} userId={profile?.id} />;
    }
  };

  return (
    <div className="flex-1 py-4 overflow-auto space-y-6 bg-gray-light-300">
      <div className="sm:bg-white rounded-[18px] sm:shadow-sm overflow-hidden animate-fade-in sm:border border-gray-light-D3">
        <Toaster />
        <div className=" rounded-lg shadow-sm overflow-hidden animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 sm:px-6 py-3 border-b border-gray-100 ">
            <div className={`flex items-center text-sm transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <Link to="/dashboard" className="flex items-center text-black-0 transition-colors">
                <i className='icon icon-home text-gradient-purple text-xl' />
              </Link>
              <i className="mx-2 sm:mx-4 icon icon-greater text-gray-400 text-xs" />
              <span className="text-black-0 bg-orange-gradient-light text-12px px-2 sm:px-3 py-1.5 rounded-full font-bold">Profile</span>
            </div>
            <div className="flex items-center bg-white justify-between sm:justify-center border border-gray-light-D3 w-full mt-5 sm:mt-0 sm:w-auto rounded-full p-1.5 sm:p-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className='flex items-center'>
                {userData?.avatar ? (
                  <div className="sm:h-8 sm:w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                    <img
                      src={userData?.avatar}
                      alt={userData?.name || "User profile"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-orange-gradient flex items-center justify-center mr-2">
                    <i className='icon icon-user text-white text-sm' />
                  </div>
                )}
                <div className="mr-2 mb-1 text-right block">
                  <span className="text-sm font-medium text-gray-dark-200">{userData?.name || "User"}</span>
                </div>
              </div>
              <div className='flex items-center mr-2'>
                <div className="h-4 w-px bg-gray-light-400 mx-1 hidden sm:block"></div>
                <button className="ml-2 text-black-0 ">
                  <i className='icon icon-greater text-black-0 text-sm' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full -mt-4 -ml-0 px-6 sm:px-0 sm:-ml-4">
          <div
            className="h-[150px] sm:h-[200px] w-full !rounded-18px"
            style={{
              backgroundImage: 'url(/images/profile_bg.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
              borderRadius: "15px !important"
            }}
          ></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 px-3 sm:px-8 py-4 -mt-20 sm:-mt-14 ml-0 sm:ml-4">
            <div className={`lg:col-span-1 transition-all duration-500 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="bg-white rounded-[18px] h-full shadow-sm border border-gray-light-D3">
                <div className="flex flex-col items-center pt-6 sm:pt-8 pb-4 relative">
                  <div
                    className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden shadow-md mb-4 transition-transform hover:scale-105 duration-300 relative group ${isUploading ? 'opacity-70' : ''}`}
                    onClick={handleProfilePictureClick}
                  >
                    {userData.avatar ? (
                      <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <i className='icon icon-user text-gradient-orange text-4xl' />
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity cursor-pointer`}>
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <div className="bg-purple-gradient rounded-full p-2">
                          <i className='icon icon-camera text-white text-xl mx-0.5 ' />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      disabled={isUploading}
                    />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{userData.name}</h2>
                  {userData.pmiId && (
                    <div className="mt-3 sm:mt-4 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-gradient-light border border-[#FFC1A1] rounded-full text-xs sm:text-sm text-black-0 font-bold">
                      PMI ID : {userData.pmiId}
                    </div>
                  )}
                </div>

                <div className="px-3 sm:px-5 flex flex-col gap-3 pb-4">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center rounded-18px text-black-0 font-semibold w-full px-4 sm:px-6 py-2 sm:py-3 text-left transition-colors ${activeTab === 'profile'
                      ? ' bg-orange-gradient-light border border-[#FFC1A1]'
                      : ' hover:bg-orange-gradient-light bg-white border border-gray-light-D5 border-opacity-40 hover:border hover:border-[#FFC1A1]'
                      }`}
                  >
                    <i className='icon icon-user text-gradient-orange text-base sm:text-lg' />
                    <div className="h-4 w-px bg-gray-300 mx-2 sm:mx-3"></div>
                    <span className="font-medium text-sm sm:text-base text-black-0">Profile details</span>
                    <i className="ml-auto icon icon-greater text-black-0 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('employer')}
                    className={`flex items-center rounded-18px text-black-0 font-semibold w-full px-4 sm:px-6 py-2 sm:py-3 text-left transition-colors ${activeTab === 'employer'
                      ? ' bg-orange-gradient-light border border-[#FFC1A1]'
                      : ' hover:bg-orange-gradient-light bg-white border border-gray-light-D5 border-opacity-40 hover:border hover:border-[#FFC1A1]'
                      }`}
                  >
                    <i className='icon icon-current_employee text-gradient-orange text-base sm:text-lg' />
                    <div className="h-4 w-px bg-gray-300 mx-2 sm:mx-3"></div>
                    <span className="font-medium text-sm sm:text-base text-black-0">Current employer</span>
                    <i className="ml-auto icon icon-greater text-black-0 text-xs" />
                  </button>

                  <button
                    onClick={() => setActiveTab('education')}
                    className={`flex items-center rounded-18px text-black-0 font-semibold w-full px-4 sm:px-6 py-2 sm:py-3 text-left transition-colors ${activeTab === 'education'
                      ? ' bg-orange-gradient-light border border-[#FFC1A1]'
                      : ' hover:bg-orange-gradient-light bg-white border border-gray-light-D5 border-opacity-40 hover:border hover:border-[#FFC1A1]'
                      }`}
                  >
                    <i className='icon icon-lesson text-gradient-orange text-base sm:text-lg' />
                    <div className="h-4 w-px bg-gray-300 mx-2 sm:mx-3"></div>
                    <span className="font-medium text-sm sm:text-base text-black-0">Education details</span>
                    <i className="ml-auto icon icon-greater text-black-0 text-xs" />
                  </button>
                </div>
              </div>
            </div>
            <div className={`lg:col-span-3 transition-all duration-500 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white rounded-[18px] h-full min-h-[500px] sm:min-h-[650px] shadow-sm border border-gray-light-D3">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 