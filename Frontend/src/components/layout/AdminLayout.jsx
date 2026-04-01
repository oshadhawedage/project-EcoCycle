import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../header/AdminHeader';
import Footer from '../footer/Footer';

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      
      <AdminHeader />

      <main className="flex-grow pt-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default AdminLayout;