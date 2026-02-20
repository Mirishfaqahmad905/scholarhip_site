import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Api_url from '../constant/constant';
import { useNavigate } from 'react-router-dom';

const Mange_scholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`, { timeout: 60000 });
      setScholarships(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Failed to fetch scholarships. Please try again.');
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  const safeImageUrl = (value) => {
    const resolved = Api_url.buildMediaUrl ? Api_url.buildMediaUrl(value) : value;
    return resolved || '/fallback-image.svg';
  };

  const confirmDelete = (item) => {
    setSelectedScholarship(item);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${Api_url.BACKEND_URI}/api/delete/scholarship/${selectedScholarship._id}`);
      setShowModal(false);
      setScholarships((prev) => prev.filter((s) => s._id !== selectedScholarship._id));
      setSelectedScholarship(null);
      alert('Scholarship deleted successfully.');
    } catch (err) {
      console.error('Error deleting scholarship:', err);
      alert('Failed to delete scholarship.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">Manage Scholarships</h1>
      <button className="bg bg-red-500 p-4 text-white" onClick={() => navigate(-1)}>Back</button>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl border border-gray-300 bg-white shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && scholarships.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={safeImageUrl(item.image)}
                    alt="scholarship"
                    className="h-14 w-14 rounded-md object-cover"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                  />
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{Array.isArray(item.category) ? item.category.join(', ') : item.category}</td>
                <td className="p-3">{item.country}</td>
                <td className="p-3">{item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}</td>
                <td className="p-3">
                  <button
                    onClick={() => confirmDelete(item)}
                    className="rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">Loading scholarships...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-red-600">{error}</td>
              </tr>
            )}

            {!loading && !error && scholarships.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">No scholarships found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{selectedScholarship.name}</strong>?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mange_scholarship;
