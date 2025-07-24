import Button from './ui/Button';


const ProjectManagementBanner = () => {
  return (
    <section className="bg-white py-16 font-jakarta">
      <div className="container mx-auto px-3 sm:px-6 lg:px-20">
        <div className="bg-gray-light-F8 rounded-[40px] p-8 md:py-[100px] text-center relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <img src="/images/project_bg.svg" alt="Background" className="w-full h-full object-cover rounded-[40px]" />
          </div>
          <div className="text-xl sm:text-3xl font-medium mb-4">Land Your Dream Job in <span className="relative font-bold">
            Project Management
            <img src="/images/section_header_line.png" alt="Background" className="absolute -bottom-3 left-0 w-full h-2.5" />
          </span></div>
          <div className="mb-6 sm:mb-10 text-gray-black font-semibold text-sm sm:text-xl">From beginner to certified project management expert — we've got you covered!</div>
          <Button variant="primary" className="px-8 sm:px-6 py-2 sm:py-3 !rounded-full bg-white text-xs sm:text-sm text-black-0 font-semibold">
            Ask Sachin
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectManagementBanner; 