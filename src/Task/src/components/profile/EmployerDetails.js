import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../../services/api/profileService';
import { format, parse, isValid } from 'date-fns';
import DatePickerField from './DatePickerField';
import moment from 'moment/moment';

const EmployerDetails = ({ employer, userId }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    company: Yup.string().required('Company name is required'),
    startDate: Yup.date().required('Start date is required')
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

  const removeEmptyValues = (obj) => {
    const result = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = value;
      }
    });
    
    return result;
  };

  const createCleanPayload = (currentProfile, newData) => {
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
      
      if (currentProfile?.user_info?.profile_details) {
        payload.user_info.profile_details = {};
        
        if(currentProfile.user_info.profile_details?.pmi_id){
          payload.user_info.profile_details.pmi_id = currentProfile.user_info.profile_details.pmi_id;
        }
        if(currentProfile.user_info.profile_details?.summary){
          payload.user_info.profile_details.summary = currentProfile.user_info.profile_details.summary;
        }
        if(currentProfile.user_info.profile_details?.date_of_birth){
          payload.user_info.profile_details.date_of_birth = moment(currentProfile.user_info.profile_details.date_of_birth).format('DD-MM-YYYY');
        }
        if(currentProfile.user_info.profile_details?.linkedin){
          payload.user_info.profile_details.linkedin = currentProfile.user_info.profile_details.linkedin;
        }
        if(currentProfile.user_info.profile_details?.instagram){
          payload.user_info.profile_details.instagram = currentProfile.user_info.profile_details.instagram;
        }
        if(currentProfile.user_info.profile_details?.twitter){
          payload.user_info.profile_details.twitter = currentProfile.user_info.profile_details.twitter;
        }
      }
      
      if (Object.keys(newData).length > 0) {
        payload.user_info.current_employer = newData;
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
      toast.error('Error preparing employer data. Please try again.');
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
      toast.success('Employer details updated successfully!', {
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
      toast.error(error.message || 'Failed to update employer details', {
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

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const formattedStartDate = formatDateForApi(values.startDate);
      
      const currentProfile = getCurrentProfileData();
      
      if (!currentProfile) {
        throw new Error('Could not retrieve current profile data');
      }
      
      const employerDetails = removeEmptyValues({
        company_name: values.company,
        start_date: formattedStartDate
      });
      
      const profileData = createCleanPayload(currentProfile, employerDetails);
      
      if (profileData) {
        updateProfileMutation.mutate(profileData);
      } else {
        setIsLoading(false);
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('An error occurred while saving your employer details. Please try again.');
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const InputField = ({ label, value }) => (
    <div className="sm:mb-6 mb-3">
      <label className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">{label}</label>
      <div className="bg-[#F6F6F6] text-sm rounded-full px-4 py-3 text-black-0">
        {value || 'Not provided'}
      </div>
    </div>
  );

  const FormField = ({ label, name, type = "text" }) => (
    <div className="sm:mb-6 mb-3">
      <label htmlFor={name} className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">{label}</label>
      <div className="relative">
        <Field
          type={type}
          name={name}
          id={name}
          className="w-full bg-[#F6F6F6] !rounded-full text-sm px-4 py-3 text-gray-800 focus:ring-2 focus:ring-orange-light focus:outline-none transition-all"
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
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <i className='icon icon-current_employee text-gradient-orange text-xl sm:text-2xl' />
          <div className='h-4 w-px bg-gray-300 mx-2 sm:mx-3'></div>
          <h3 className="sm:text-lg text-base font-semibold">Current Employer</h3>
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
            company: employer.company || '',
            startDate: parseDateFromApi(employer.startDate) || null
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form className="animate-fade-in" onSubmit={handleSubmit}>
              <FormField label="Company name" name="company" />
              <DatePickerField
                label="Start date"
                name="startDate"
                id="startDate"
                placeholderText="Select start date (DD-MM-YYYY)"
                className="z-50"
                popperClassName="z-[1000]"
              />

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
          <InputField label="Company name" value={employer.company} />
          <InputField label="Start date" value={formatDateForDisplay(employer.startDate)} />
        </div>
      )}
    </div>
  );
};

export default EmployerDetails; 