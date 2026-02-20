import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api_url from '../constant/constant';

const Mange_bloge = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Fetch blogs on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/allbloge`);
        setData(res.data);
      } catch (error) {
        console.log('Error occurred: ' + error);
      }
    };
    fetchData();
  }, []);

  // Confirm delete
  const confirmDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete blog "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      deleteBlog(item._id);
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${Api_url.BACKEND_URI}/api/delete_bloge/${id}`);
      setData((prev) => prev.filter((blog) => blog._id !== id));
      Swal.fire('Deleted!', 'Blog deleted successfully.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Could not delete blog.', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded shadow"
        >
          ← Go Back
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-xl shadow-md">
          <thead className="bg-blue-100 text-left text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Heading</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.name || item.title}</td>
                  <td className="px-4 py-3">
                    <img
                      src={`http://localhost:5000/${item.content?.find(c => c.type === 'image')?.value || 'default.jpg'}`}
                      alt="blog"
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{item.heading || 'No heading'}</td>
                  <td className="px-4 py-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                      onClick={() => confirmDelete(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No blog data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mange_bloge;
