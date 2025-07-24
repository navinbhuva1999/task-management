import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import { contactSchema } from "../utils/validationSchema";
import { useSubmitContact } from "../hooks/api/useContact";

const ContactPage = () => {
  const submitContactMutation = useSubmitContact();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const initialValues = {
    applicant_name: "",
    applicant_contact: "",
    applicant_email: "",
    organization_name: "",
    total_trainee: "",
    training_subject: "",
    year: "",
    month: "",
    week: "",
    other_information: "",
    agreeTerms: false
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    values.applicant_email = values.applicant_email.toLowerCase()
    const { agreeTerms, ...payload } = values;
    submitContactMutation.mutate({ ...payload, total_trainee: String(payload.total_trainee) }, {
      onSuccess: () => {
        resetForm({ values: initialValues });
        setSubmitting(false);

      },
      onError: (error) => {
        setSubmitting(false);
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear + 1];

  return (
    <Layout>
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-4 text-black-0 text-center">
            Contact <span className="relative font-semibold">
              Us
              <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-0.8 left-0 w-full h-auto" />
            </span>
          </h1>
          <div className="text-center text-gray-dark-80 font-semibold leading-7 first-letter: max-w-[18rem] sm:max-w-2xl mx-auto mb-6 sm:mb-3 text-sm sm:text-base px-4">
            Empowering project leaders, driving career success.
          </div>

          <div className="flex items-center justify-center mt-4 text-xs sm:text-sm">
            <Link to="/" className="flex items-center text-black-0">
              <div className="p-1.5 sm:p-2 rounded-full bg-purple-gradient flex items-center justify-center mr-1.5 sm:mr-2">
                <i className='icon icon-home text-white text-base sm:text-xl' />
              </div>
              <span className="">Home</span>
            </Link>
            <i className="icon icon-greater text-black-0 text-xs mx-2 sm:mx-4 sm:inline"></i>
            <Link to="/contact" className="text-black-0 font-bold">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards - Hidden on mobile, shown on left on desktop */}
            <div className="hidden lg:block space-y-6 animate-fade-in">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="w-full bg-gray-light-F8 py-8 lg:py-11 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-phone text-white text-xl lg:text-30px' />
                  </div>
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-center text-black-0 mb-2">+1 (1) 123 456 7890</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Contact number</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="w-full bg-gray-light-F8 py-8 lg:py-11 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-calender text-white text-xl lg:text-30px' />
                  </div>
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-center text-black-0 mb-2">hi@educrat.com</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Email address</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="w-full bg-gray-light-F8 py-8 lg:py-11 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-Frame-2 text-white text-xl lg:text-30px' />
                  </div>
                </div>
                <div className="p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold text-center text-black-0 mb-2">328 queensberry street, north melbourne , australia.</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Location</p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 sm:p-6 animate-fade-in ">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Send Us A Message</h2>

              <Formik
                initialValues={initialValues}
                validationSchema={contactSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ isSubmitting, values, setFieldValue, errors, touched, resetForm }) => (
                  <Form className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="applicant_name" className="block text-sm font-semibold text-gray-700 mb-1">
                          Name of applicant<span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name="applicant_name"
                          id="applicant_name"
                          placeholder="Enter name of applicant"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.applicant_name && touched.applicant_name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <ErrorMessage name="applicant_name" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="applicant_contact" className="block text-sm font-semibold text-gray-700 mb-1">
                          Mobile no of applicant<span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name="applicant_contact"
                          id="applicant_contact"
                          placeholder="Enter mobile no of applicant"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.applicant_contact && touched.applicant_contact ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <ErrorMessage name="applicant_contact" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="applicant_email" className="block text-sm font-semibold text-gray-700 mb-1">
                          Email id of applicant<span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="email"
                          name="applicant_email"
                          id="applicant_email"
                          placeholder="Enter email id of applicant"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.applicant_email && touched.applicant_email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <ErrorMessage name="applicant_email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="organization_name" className="block text-sm font-semibold text-gray-700 mb-1">
                          Name of organization <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name="organization_name"
                          id="organization_name"
                          placeholder="Enter name of organization"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.organization_name && touched.organization_name ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <ErrorMessage name="organization_name" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="total_trainee" className="block text-sm font-semibold text-gray-700 mb-1">
                          Number of trainees <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="number"
                          name="total_trainee"
                          id="total_trainee"
                          placeholder="Enter number of trainees"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.total_trainee && touched.total_trainee ? "border-red-500" : "border-gray-300"
                            }`}
                          min={1}
                        />
                        <ErrorMessage name="total_trainee" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="training_subject" className="block text-sm font-semibold text-gray-700 mb-1">
                          Training subjects <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="training_subject"
                            id="training_subject"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light appearance-none text-sm sm:text-base ${errors.training_subject && touched.training_subject ? "border-red-500" : "border-gray-300"
                              }`}
                          >
                            <option value="" disabled>--Please choose an option--</option>
                            <option value="CAPM">CAPM</option>
                            <option value="PMP">PMP</option>
                            <option value="ACP">ACP</option>
                            <option value="PMI-CP">PMI-CP</option>
                            <option value="PMP Training(ATP Accredited)">PMP Training(ATP Accredited)</option>
                          </Field>
                          <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                            <i className="icon icon-bottom_arrow text-black-0 text-[8px]"></i>
                          </div>
                        </div>
                        <ErrorMessage name="training_subject" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-1">
                          Year <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="year"
                            id="year"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light appearance-none text-sm sm:text-base ${errors.year && touched.year ? "border-red-500" : "border-gray-300"
                              }`}
                          >
                            <option value="" disabled>Select year</option>
                            {yearOptions.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </Field>
                          <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                            <i className="icon icon-bottom_arrow text-black-0 text-[8px]"></i>
                          </div>
                        </div>
                        <ErrorMessage name="year" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="month" className="block text-sm font-semibold text-gray-700 mb-1">
                          Month <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="month"
                            id="month"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light appearance-none text-sm sm:text-base ${errors.month && touched.month ? "border-red-500" : "border-gray-300"
                              }`}
                          >
                            <option value="" disabled>Select month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                          </Field>
                          <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                            <i className="icon icon-bottom_arrow text-black-0 text-[8px]"></i>
                          </div>
                        </div>
                        <ErrorMessage name="month" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="week" className="block text-sm font-semibold text-gray-700 mb-1">
                          Week <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="week"
                            id="week"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl sm:rounded-full focus:outline-none focus:ring-2 focus:ring-purple-light appearance-none text-sm sm:text-base ${errors.week && touched.week ? "border-red-500" : "border-gray-300"
                              }`}
                          >
                            <option value="" disabled>Select week</option>
                            <option value="week 1">Week 1</option>
                            <option value="week 2">Week 2</option>
                            <option value="week 3">Week 3</option>
                            <option value="week 4">Week 4</option>
                          </Field>
                          <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                            <i className="icon icon-bottom_arrow text-black-0 text-[8px]"></i>
                          </div>
                        </div>
                        <ErrorMessage name="week" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="other_information" className="block text-sm font-semibold text-gray-700 mb-1">
                        Additional information <span className="text-gray-400 text-xs">(1000characters)</span> <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="other_information"
                        id="other_information"
                        rows="5"
                        placeholder="Enter here"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-light text-sm sm:text-base ${errors.other_information && touched.other_information ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      <ErrorMessage name="other_information" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="relative flex items-center">
                          <Field
                            type="checkbox"
                            name="agreeTerms"
                            id="agreeTerms"
                            className="opacity-0 absolute h-5 w-5 cursor-pointer"
                          />
                          <div className={`border ${values.agreeTerms ? 'bg-purple-light border-purple-light' : 'border-gray-300'} rounded h-5 w-5 flex flex-shrink-0 justify-center items-center mr-2`}>
                            <svg className={`fill-current w-3 h-3 text-white pointer-events-none ${values.agreeTerms ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 20 20">
                              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="ml-1 text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-gray-700 cursor-pointer">
                          By using this form, you agree with the storage and handling of your data by this website in accordance with our{" "}
                          <Link to="/privacy" className="text-purple-light hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-row gap-1 sm:gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || submitContactMutation.isPending || !values.agreeTerms}
                        className="w-full sm:w-auto px-2 sm:px-8 py-3 !rounded-full text-xs sm:text-base"
                      >
                        {isSubmitting || submitContactMutation.isPending ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          "Submit Enquiry"
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => resetForm({ values: initialValues })}
                        className="w-full sm:w-auto px-2 sm:px-8 py-3 !rounded-full bg-gray-500 hover:bg-gray-600 text-xs sm:text-base"
                      >
                        Reset Form
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Contact Info Cards - Shown on mobile after form */}
            <div className="lg:hidden space-y-4 sm:space-y-6 animate-fade-in">
              <div className="bg-white rounded-18px shadow-sm border border-gray-100">
                <div className="w-full bg-gray-light-F8 py-8 rounded-t-18px relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-phone text-white text-xl' />
                  </div>
                </div>
                <div className="p-4 border-b border-gray-light-D3 border-l border-r rounded-b-18px">
                  <h3 className="text-lg font-semibold text-center text-black-0 mb-2">+1 (1) 123 456 7890</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Contact number</p>
                </div>
              </div>

              <div className="bg-white rounded-18px shadow-sm border border-gray-100">
                <div className="w-full bg-gray-light-F8 py-8 rounded-t-18px relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-calender text-white text-xl' />
                  </div>
                </div>
                <div className="p-4 border-b border-gray-light-D3 border-l border-r rounded-b-18px">
                  <h3 className="text-lg font-semibold text-center text-black-0 mb-2">hi@educrat.com</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Email address</p>
                </div>
              </div>

              <div className="bg-white rounded-18px shadow-sm border border-gray-100">
                <div className="w-full bg-gray-light-F8 py-8 rounded-t-18px relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src="/images/email_bg.svg" alt="Background" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-gradient shadow-md shadow-orange-light flex items-center justify-center mx-auto">
                    <i className='icon icon-Frame-2 text-white text-xl' />
                  </div>
                </div>
                <div className="p-4 border-b border-gray-light-D3 border-l border-r rounded-b-18px">
                  <h3 className="text-lg font-semibold text-center text-black-0 mb-2">328 queensberry street, north melbourne , australia.</h3>
                  <p className="text-gray-dark-80 font-semibold text-center text-sm">Location</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;