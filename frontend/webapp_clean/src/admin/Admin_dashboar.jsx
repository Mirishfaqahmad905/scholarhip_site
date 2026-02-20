import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  BookOpen,
  ClipboardList,
  Plus,
  FileText,
  Users,
  MessageSquareText,
  Edit2Icon,
} from 'lucide-react';

const Admin_dashboar = () => {
  const isAdminLoggedIn = useSelector((state) => state.admin.isAdminLoggedIn);

  const actions = [
    {
      icon: <Home size={24} />,
      label: 'Dashboard',
      path: '/admin/admin_dashboard',
    },
    {
      icon: <BookOpen size={24} />,
      label: 'Scholarships',
      path: '/admin/manage_scholarships',
    },
    {
      icon: <ClipboardList size={24} />,
      label: 'Applications',
      path: '/admin/view-applications',
    },
    {
      icon: <Plus size={24} />,
      label: 'Add Scholarship',
      path: '/admin/addScholarship',
    },
    {
      icon: <FileText size={24} />,
      label: 'Add Blog',
      path: '/admin/add_blog',
    },
    {
      icon: <Users size={24} />,
      label: 'Add Internship',
      path: '/admin/add_internship',
    },
    {
      icon: <Users size={24} />,
      label: 'Add Leadership',
      path: '/admin/add_leadership_data',
    },
    {
      icon: <MessageSquareText size={24} />,
      label: 'Messages',
      path: '/admin/get_message_contact',
    },
     {
      icon: <Edit2Icon size={24} />,
      label: 'delete bloge',
      path: '/admin/delete_blog',
     }
  ];

  return (
    <>
      {isAdminLoggedIn ? (
        <div className='flex flex-col md:flex-row h-screen'>
          {/* Sidebar */}
          <nav className='bg-gray-800 text-white w-64 p-4 space-y-6'>
            <h2 className='text-xl font-bold mb-4'>Admin Panel</h2>
            <ul className='space-y-4'>
              {actions.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className='flex items-center gap-3 hover:bg-gray-700 rounded px-3 py-2 transition-all'
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side */}
          <div className='flex-1 p-6 overflow-y-auto bg-gray-50'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10'>
              {actions.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  className='group bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow hover:shadow-lg transition transform hover:-translate-y-1'
                >
                  <div className='text-blue-600 group-hover:text-blue-800 mb-2'>
                    {item.icon}
                  </div>
                  <p className='text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center'>
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>

            {/* Outlet */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center h-screen'>
          <h2 className='text-xl font-bold text-red-600'>Please login first as admin</h2>
        </div>
      )}
    </>
  );
};

export default Admin_dashboar;
