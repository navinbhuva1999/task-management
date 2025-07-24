import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-light-300 font-jakarta flex">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-4 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout; 