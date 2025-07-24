import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <footer className="bg-[#F8F8F8] overflow-hidden">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-12 md:pt-14 lg:pt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div 
            className="bg-white rounded-2xl shadow-sm border border-gray-light-D3 p-4 sm:p-6 md:px-8 md:pt-8 md:pb-4 lg:px-10 lg:pt-10 lg:pb-4 xl:pt-14 xl:px-14 xl:pb-4"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-7 lg:gap-8 xl:gap-10">
              {/* Logo and Description - Hidden on mobile, visible on md+ */}
              <motion.div 
                className="col-span-1 md:col-span-5 lg:col-span-5 hidden md:block"
                variants={fadeInUp}
              >
                <Link to="/" className="flex items-center">
                  <img
                    src="/images/main_logo.svg"
                    alt="PM Mentors Logo"
                    className="h-8 md:h-9 lg:h-10 xl:h-12 w-auto"
                  />
                </Link>
                <p className="mt-3 md:mt-4 lg:mt-5 text-xs md:text-sm lg:text-sm text-gray-dark-200 leading-relaxed font-medium max-w-md">
                  At PM Mentors, we believe that great projects are driven by great leaders.
                  Our mission is to equip professionals with the skills, knowledge, and confidence
                  to excel in project management, no matter the industry or scale.
                </p>
              </motion.div>
              
              {/* Pages Section */}
              <motion.div 
                className="col-span-1 md:col-span-2 lg:col-span-2"
                variants={fadeInUp}
              >
                <h3 className="text-sm md:text-base lg:text-base font-bold text-black-0 mb-3 md:mb-4 lg:mb-5">
                  Pages
                </h3>
                <ul className="space-y-2 md:space-y-2 lg:space-y-3 font-medium">
                  <motion.li variants={fadeInUp}>
                    <Link to="/" className="text-xs md:text-sm lg:text-sm text-black-0 font-medium hover:text-orange-500 transition-colors duration-200">
                      Home
                    </Link>
                  </motion.li>
                  <motion.li variants={fadeInUp}>
                    <Link to="/about-us" className="text-xs md:text-sm lg:text-sm text-black-0 font-medium hover:text-orange-500 transition-colors duration-200">
                      About
                    </Link>
                  </motion.li>
                  <motion.li variants={fadeInUp}>
                    <Link to="/blog" className="text-xs md:text-sm lg:text-sm text-black-0 font-medium hover:text-orange-500 transition-colors duration-200">
                      Blog
                    </Link>
                  </motion.li>
                  <motion.li variants={fadeInUp}>
                    <Link to="/courses" className="text-xs md:text-sm lg:text-sm text-black-0 font-medium hover:text-orange-500 transition-colors duration-200">
                      Courses
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Support Section */}
              <motion.div 
                className="col-span-1 md:col-span-2 lg:col-span-2"
                variants={fadeInUp}
              >
                <h3 className="text-sm md:text-base lg:text-base font-bold text-black-0 mb-3 md:mb-4 lg:mb-5">
                  Support
                </h3>
                <ul className="space-y-2 md:space-y-2 lg:space-y-3 font-medium">
                  <motion.li variants={fadeInUp}>
                    <Link to="/terms" className="text-xs md:text-sm lg:text-sm text-black-0 hover:text-orange-500 transition-colors duration-200">
                      Terms and condition
                    </Link>
                  </motion.li>
                  <motion.li variants={fadeInUp}>
                    <Link to="/privacy" className="text-xs md:text-sm lg:text-sm text-black-0 hover:text-orange-500 transition-colors duration-200">
                      Privacy policy
                    </Link>
                  </motion.li>
                  <motion.li variants={fadeInUp}>
                    <Link to="/return-policy" className="text-xs md:text-sm lg:text-sm text-black-0 hover:text-orange-500 transition-colors duration-200">
                      Return policy
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Contact Section */}
              <motion.div 
                className="col-span-1 md:col-span-3 lg:col-span-3"
                variants={fadeInUp}
              >
                <div className="space-y-4 md:space-y-5 lg:space-y-7">
                  {/* Phone */}
                  <motion.div variants={fadeInUp} className="group">
                    <a href="tel:8690993773" className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                      <i className='icon icon-phone text-gradient-orange text-xl md:text-2xl lg:text-2xl xl:text-30px transition-transform duration-200 group-hover:scale-110' />
                      <div>
                        <div className="text-xs font-bold text-gray-gray-1">Call Us</div>
                        <span className="text-sm md:text-sm lg:text-base font-medium text-black-0 group-hover:text-orange-500 transition-colors duration-200">8690993773</span>
                      </div>
                    </a>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={fadeInUp} className="group">
                    <a href="mailto:Disha.biswas@pm-mentors.org" className="flex items-center gap-2 transition-transform duration-200 hover:translate-x-1">
                      <i className='icon icon-email text-gradient-orange text-lg md:text-xl lg:text-xl xl:text-2xl transition-transform duration-200 group-hover:scale-110' />
                      <div>
                        <div className="text-xs font-bold text-gray-gray-1">Email Us</div>
                        <span className="text-sm md:text-sm lg:text-base font-medium text-black-0 group-hover:text-orange-500 transition-colors duration-200">Disha.biswas@pm-mentors.org</span>
                      </div>
                    </a>
                  </motion.div>

                  {/* Social Links */}
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-base md:text-lg lg:text-lg font-bold text-black-0 mb-2 md:mb-3">Social Link</h3>
                    <div className="flex space-x-3 md:space-x-4 lg:space-x-5">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.facebook.com/profile.php?id=61574176298360"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all"
                        aria-label="Facebook"
                      >
                        <i className='icon icon-facebook text-gradient-orange text-lg md:text-xl' />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.instagram.com/pm_mentors?igsh=eXp6bHJoZWRmcnB6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all"
                        aria-label="Instagram"
                      >
                        <i className='icon icon-instagram text-gradient-orange text-lg md:text-xl' />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.linkedin.com/company/e-and-e-hub-llp/about/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-gray-light-100 rounded-full text-[#FF610F] hover:bg-orange-100 hover:text-orange-600 transition-all"
                        aria-label="LinkedIn"
                      >
                        <i className='icon icon-linkdin text-gradient-orange text-lg md:text-xl' />
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Mobile Logo and Description - Visible only on mobile */}
            <div className="mt-6 block md:hidden">
              <Link to="/" className="flex items-center">
                <img
                  src="/images/main_logo.svg"
                  alt="PM Mentors Logo"
                  className="h-10 sm:h-12 w-auto"
                />
              </Link>
              <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-dark-200 leading-relaxed font-medium max-w-md">
                At PM Mentors, we believe that great projects are driven by great leaders.
                Our mission is to equip professionals with the skills, knowledge, and confidence
                to excel in project management, no matter the industry or scale.
              </p>
            </div>

            {/* Copyright */}
            <motion.div 
              className="mt-8 md:mt-10 lg:mt-12 xl:mt-14 pt-4 border-t border-[#D5D5D566]"
              variants={fadeInUp}
            >
              <p className="text-xs md:text-sm lg:text-sm text-center text-gray-dark-200 font-medium">
                © {new Date().getFullYear()} PM Mentors. All Right Reserved.
              </p>
            </motion.div>
          </motion.div>
          
          {/* Footer Image */}
          <motion.div 
            className="mt-6 md:mt-8 lg:mt-10"
            variants={fadeInUp}
          >
            <img 
              src="/images/Pm_mentor.svg" 
              alt="Background" 
              className="w-full h-full object-contain" 
            />
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;