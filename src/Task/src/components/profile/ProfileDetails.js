import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../../services/api/profileService';
import { format, subYears, parse, isValid } from 'date-fns';
import DatePickerField from './DatePickerField';
import moment from 'moment';

const ProfileDetails = ({ user, userId }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const thirteenYearsAgo = subYears(new Date(), 13);

  const validationSchema = Yup.object({
    summary: Yup.string().required('Summary is required'),
    dob: Yup.date()
      .required('Date of birth is required')
      .max(thirteenYearsAgo, 'You must be at least 13 years old'),
    pmiId: Yup.string().required('PMI ID is required'),
    linkedin: Yup.string().url('Must be a valid URL').nullable(),
    instagram: Yup.string().url('Must be a valid URL').nullable(),
    twitter: Yup.string().url('Must be a valid URL').nullable()
  });

  const formatDateForApi = (date) => {
    if (!date) return null;
    try {
      return format(new Date(date), 'dd-MM-yyyy');
    } catch (error) {
      return null;
    }
  };

  const parseDateFromApi = (dateString) => {
    if (!dateString) return null;
    
    try {
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      }
      
      const date = new Date(dateString);
      return !isNaN(date) ? date : null;
    } catch (e) {
      return null;
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileService.updateProfile(userId, data),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsEditMode(false);
      setIsLoading(false);
      toast.success('Profile details updated successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4E17A8',
          color: '#fff',
        },
        icon: '✅',
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || 'Failed to update profile details', {
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

  const getCurrentProfileData = () => {
    const currentProfile = queryClient.getQueryData(['userProfile'])?.data;
    return currentProfile;
  };

  const removeEmptyValues = (obj) => {
    const result = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
      }
    });
    
    return result;
  };

  const createCleanPayload = (currentProfile, profileDetails) => {
    try {
      if (!currentProfile) {
        throw new Error('Current profile data is missing');
      }

      const payload = {
        name: currentProfile?.name || '',
      };
      
      if (currentProfile.profile_image && currentProfile.profile_image.id) {
        payload.profile_image_id = currentProfile.profile_image.id;
      } else {
        payload.profile_image_id = 0;
      }
      
      payload.user_info = {};
      
      payload.user_info.profile_details = {};
      
      if (profileDetails?.pmi_id) {
        payload.user_info.profile_details.pmi_id = profileDetails.pmi_id;
      }
      if (profileDetails?.summary) {
        payload.user_info.profile_details.summary = profileDetails.summary;
      }
      if (profileDetails?.date_of_birth) {
        payload.user_info.profile_details.date_of_birth = profileDetails.date_of_birth;
      }
      if (profileDetails?.linkedin) {
        payload.user_info.profile_details.linkedin = profileDetails.linkedin;
      }
      if (profileDetails?.instagram) {
        payload.user_info.profile_details.instagram = profileDetails.instagram;
      }
      if (profileDetails?.twitter) {
        payload.user_info.profile_details.twitter = profileDetails.twitter;
      }
      
      if (currentProfile?.user_info?.current_employer) {
        payload.user_info.current_employer = {};
        
        if(currentProfile.user_info.current_employer?.company_name){
          payload.user_info.current_employer.company_name = currentProfile.user_info.current_employer.company_name;
        }
        if(currentProfile.user_info.current_employer?.start_date){
          payload.user_info.current_employer.start_date = moment(currentProfile.user_info.current_employer.start_date).format('DD-MM-YYYY');
        }
      }
      
      if (currentProfile?.user_info?.education_details) {
        payload.user_info.education_details = {};
        
        if(currentProfile.user_info.education_details?.school){
          payload.user_info.education_details.school = currentProfile.user_info.education_details.school;
        }
        if(currentProfile.user_info.education_details?.degree){
          payload.user_info.education_details.degree = currentProfile.user_info.education_details.degree;
        }
        if(currentProfile.user_info.education_details?.field_of_study){
          payload.user_info.education_details.field_of_study = currentProfile.user_info.education_details.field_of_study;
        }
        if(currentProfile.user_info.education_details?.grade){
          payload.user_info.education_details.grade = currentProfile.user_info.education_details.grade;
        }
        if(currentProfile.user_info.education_details?.start_date){
          payload.user_info.education_details.start_date = moment(currentProfile.user_info.education_details.start_date).format('DD-MM-YYYY');
        }
        if(currentProfile.user_info.education_details?.end_date){
          payload.user_info.education_details.end_date = moment(currentProfile.user_info.education_details.end_date).format('DD-MM-YYYY');
        }
        if(currentProfile.user_info.education_details?.description){
          payload.user_info.education_details.description = currentProfile.user_info.education_details.description;
        }
      }
      
      return payload;
    } catch (error) {
      toast.error('Error preparing profile data. Please try again.');
      return null;
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const formattedDob = formatDateForApi(values.dob);
      
      const currentProfile = getCurrentProfileData();
      
      if (!currentProfile) {
        throw new Error('Could not retrieve current profile data');
      }
      
      const profileDetails = removeEmptyValues({
        pmi_id: values.pmiId,
        summary: values.summary,
        date_of_birth: formattedDob,
        linkedin: values.linkedin || null,
        instagram: values.instagram || null,
        twitter: values.twitter || null
      });
      
      const profileData = createCleanPayload(currentProfile, profileDetails);
      
      if (profileData) {
        updateProfileMutation.mutate(profileData);
      } else {
        setIsLoading(false);
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('An error occurred while saving your profile. Please try again.');
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const InputField = ({ label, value, isFullWidth = false }) => (
    <div className={`sm:mb-6 mb-3 ${isFullWidth ? 'col-span-2' : ''}`}>
      <label className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">{label}</label>
      <div className="bg-[#F6F6F6] text-sm rounded-full px-4 py-3 text-black-0">
        {value || 'Not provided'}
      </div>
    </div>
  );

  const FormField = ({ label, name, type = "text", isFullWidth = false }) => (
    <div className={`sm:mb-6 mb-3 ${isFullWidth ? 'col-span-2' : ''}`}>
      <label htmlFor={name} className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">{label}</label>
      <div className="relative">
        <Field
          type={type}
          name={name}
          id={name}
          className="w-full bg-[#F6F6F6] !rounded-full px-4 py-3 text-black-0 focus:ring-2 focus:ring-orange-light focus:outline-none transition-all"
        />
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not provided';
    
    try {
      const parsedDate = parseDateFromApi(dateString);
      if (parsedDate) {
        return format(parsedDate, 'dd-MM-yyyy');
      }
      return 'Invalid date';
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="sm:p-6 p-3">
      <div className="flex justify-between items-center mb-3 sm:mb-5">
        <div className="flex items-center">
            <i className='icon icon-user text-gradient-orange text-xl sm:text-2xl' />
            <div className='h-4 w-px bg-gray-300 mx-2 sm:mx-3'></div>
          <h3 className="sm:text-lg text-base font-semibold">Profile Details</h3>
        </div>
        {!isEditMode && (
          <button 
            onClick={() => setIsEditMode(true)}
            className="text-orange-500 hover:text-orange-600 transition-colors p-2"
            disabled={isLoading}
          >
            <i className='icon icon-edit text-gradient-orange text-xl' />
          </button>
        )}
      </div>
      <div className='sm:border-b border-gray-ligh-300 w-full mb-3 sm:mb-5' />
      {isEditMode ? (
        <Formik
          initialValues={{
            summary: user.summary || '',
            dob: parseDateFromApi(user.dob) || null,
            pmiId: user.pmiId || '',
            linkedin: user.linkedin || '',
            instagram: user.instagram || '',
            twitter: user.twitter || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form className="animate-fade-in" onSubmit={handleSubmit}>
              <div className="mb-3 sm:mb-8">
                <label htmlFor="summary" className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">
                  Summary
                </label>
                <Field
                  as="textarea"
                  name="summary"
                  id="summary"
                  rows="4"
                  className="w-full bg-[#F6F6F6] rounded-18px p-4 text-gray-800 focus:ring-2 focus:ring-orange-light focus:outline-none transition-all"
                />
                <ErrorMessage name="summary" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <DatePickerField
                  label="Date of birth"
                  name="dob"
                  id="dob"
                  maxDate={thirteenYearsAgo}
                  placeholderText="Select date of birth"
                />
                <FormField label="PMI ID" name="pmiId" />
                <FormField label="LinkedIn" name="linkedin" />
                <FormField label="Instagram" name="instagram" />
                <FormField label="Twitter" name="twitter" />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting || isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="px-6 py-2 bg-purple-gradient text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="animate-fade-in">
          <div className="sm:mb-8 mb-3">
            <h4 className="text-black-0 font-semibold text-sm mb-1 sm:mb-2">Summary</h4>
            <div className="bg-[#F6F6F6] text-sm rounded-18px p-4 text-black-0">
              {user.summary || 'No summary provided'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InputField label="Date of birth" value={formatDateForDisplay(user.dob)} />
            <InputField label="PMI ID" value={user.pmiId} />
            <InputField label="LinkedIn" value={user.linkedin} />
            <InputField label="Instagram" value={user.instagram} />
            <InputField label="Twitter" value={user.twitter} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails; 