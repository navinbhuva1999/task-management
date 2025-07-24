import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../../services/api/profileService';
import { format, parse, isValid } from 'date-fns';
import DatePickerField from './DatePickerField';
import moment from 'moment';

const EducationDetails = ({ education, userId }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    school: Yup.string().required('School/University is required'),
    degree: Yup.string().required('Degree is required'),
    field: Yup.string().required('Field of study is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .test(
        'is-after-start-date',
        'End date must be after start date',
        function(endDate) {
          const { startDate } = this.parent;
          if (!startDate || !endDate) return true; // Skip validation if either date is not provided
          return new Date(endDate) >= new Date(startDate);
        }
      )
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

  const createCleanPayload = (currentProfile, educationDetails) => {
    try {
      if (!currentProfile) {
        throw new Error('Current profile data is missing');
      }

      const payload = {
        name: currentProfile?.name || '',
      };
      
      payload.profile_image_id = 0;
      if (currentProfile.profile_image && currentProfile.profile_image.id) {
        payload.profile_image_id = currentProfile.profile_image.id;
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
      
      if (currentProfile?.user_info?.current_employer) {
        payload.user_info.current_employer = {};
        
        if(currentProfile.user_info.current_employer?.company_name){
          payload.user_info.current_employer.company_name = currentProfile.user_info.current_employer.company_name;
        }
        if(currentProfile.user_info.current_employer?.start_date){
          payload.user_info.current_employer.start_date = moment(currentProfile.user_info.current_employer.start_date).format('DD-MM-YYYY');
        }
      }
        
      if (Object.keys(educationDetails).length > 0) {
        payload.user_info.education_details = educationDetails;
      }
      
      return payload;
    } catch (error) {
      toast.error('Error preparing education data. Please try again.');
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
      toast.success('Education details updated successfully!', {
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
      toast.error(error.message || 'Failed to update education details', {
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
      const formattedEndDate = formatDateForApi(values.endDate);
      
      const currentProfile = getCurrentProfileData();
      
      if (!currentProfile) {
        throw new Error('Could not retrieve current profile data');
      }
      
      const educationDetails = removeEmptyValues({
        school: values.school,
        degree: values.degree,
        field_of_study: values.field,
        grade: values.grade || null,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        description: values.description || null
      });
      
      const profileData = createCleanPayload(currentProfile, educationDetails);
      
      if (profileData) {
        updateProfileMutation.mutate(profileData);
      } else {
        setIsLoading(false);
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('An error occurred while saving your education details. Please try again.');
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

  const FormField = ({ label, name, type = "text", isFullWidth = false, as }) => (
    <div className={`sm:mb-6 mb-3 ${isFullWidth ? 'col-span-2' : ''}`}>
      <label htmlFor={name} className="block text-sm font-semibold text-black-0 mb-1 sm:mb-2">{label}</label>
      <Field
        type={type}
        name={name}
        id={name}
        as={as}
        rows={as === 'textarea' ? 4 : undefined}
        className={`w-full bg-[#F6F6F6] ${as === 'textarea' ? 'rounded-18px p-4' : 'rounded-full px-4 py-3'} text-black-0 focus:ring-2 focus:ring-orange-light focus:outline-none transition-all`}
      />
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
          <i className='icon icon-lesson text-gradient-orange text-xl sm:text-2xl' />
          <div className='h-4 w-px bg-gray-300 mx-2 sm:mx-3'></div>
          <h3 className="sm:text-lg text-base font-semibold">Education Details</h3>
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
            school: education.school || '',
            degree: education.degree || '',
            field: education.field || '',
            grade: education.grade || '',
            startDate: parseDateFromApi(education.startDate) || null,
            endDate: parseDateFromApi(education.endDate) || null,
            description: education.description || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleSubmit, values }) => (
            <Form className="animate-fade-in" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <FormField label="School/University" name="school" />
                <FormField label="Degree" name="degree" />
                <FormField label="Field of study" name="field" />
                <FormField label="Grade" name="grade" />
                <DatePickerField
                  label="Start date"
                  name="startDate"
                  id="startDate"
                  placeholderText="Select start date"
                  className="z-50"
                  popperClassName="z-[1000]"
                />
                <DatePickerField
                  label="End date"
                  name="endDate"
                  id="endDate"
                  placeholderText="Select end date"
                  className="z-40"
                  popperClassName="z-[900]"
                  minDate={values.startDate}
                />
              </div>
              <FormField label="Description" name="description" isFullWidth as="textarea" />

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="School/University" value={education.school} />
            <InputField label="Degree" value={education.degree} />
            <InputField label="Field of study" value={education.field} />
            <InputField label="Grade" value={education.grade} />
            <InputField label="Start date" value={formatDateForDisplay(education.startDate)} />
            <InputField label="End date" value={formatDateForDisplay(education.endDate)} />
          </div>
          <div className="mt-6">
            <h4 className="text-black-0 font-semibold text-sm mb-1 sm:mb-2">Description</h4>
            <div className="bg-[#F6F6F6] text-sm rounded-18px p-4 text-black-0">
              {education.description || 'No description provided'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationDetails; 