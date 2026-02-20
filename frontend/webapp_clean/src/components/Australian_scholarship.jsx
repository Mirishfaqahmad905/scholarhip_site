import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Api_url from '../constant/constant';

const ScholarshipDetailModal = ({ open, onClose, scholarship }) => {
  if (!open || !scholarship) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">{scholarship.name}</h2>
        <img
          src={scholarship.image}
          alt={scholarship.name}
          className="w-full h-56 object-cover rounded mb-4"
        />
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
            {Array.isArray(scholarship.category) ? scholarship.category.join(', ') : scholarship.category}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {scholarship.region}
          </span>
        </div>
        <div className="mb-2">
          <strong>Benefits:</strong> <span className="text-gray-700">{scholarship.benefits}</span>
        </div>
        <div className="mb-2">
          <strong>Eligibility:</strong> <span className="text-gray-700">{scholarship.eligibilityCriteria}</span>
        </div>
        <div className="mb-2">
          <strong>Deadline:</strong>{" "}
          <span className="text-gray-700">
            {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div className="mb-2">
          <strong>Country:</strong> <span className="text-gray-700">{scholarship.country}</span>
        </div>
        <div className="mb-2">
          <strong>Description:</strong> <span className="text-gray-700">{scholarship.description}</span>
        </div>
        <div className="mb-2">
          <strong>Official Link:</strong>{" "}
          <a
            href={scholarship.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {scholarship.officialLink}
          </a>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Australian_scholarship = () => {
  const [data, setData] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      // http://localhost:5000/api/get/scholarship_data
      const response = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching scholarship data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const australianScholarships = (data || []).filter(
    (item) =>
      (typeof item.region === "string" && item.region.trim().toLowerCase() === "australia") ||
      (Array.isArray(item.region) && item.region.some(
        (r) => typeof r === "string" && r.trim().toLowerCase() === "australia"
      ))
  );

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-8 bg-gray-50 min-h-screen">
      {/* Left side for ads or spacing */}
      <div className="md:w-1/4 mb-6 md:mb-0">
        {/* You can add an <Ads /> component here if needed */}
      </div>
      {/* Main container for Australian scholarships */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {australianScholarships && australianScholarships.length > 0 ? (
          australianScholarships.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-semibold mb-2 text-blue-800">{item.name}</h2>
                <p className="text-gray-700 mb-4 flex-1">{item.benefits}</p>
                <div className="mt-auto">
                  <span className="inline-block gap-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    {Array.isArray(item.category) ? item.category.join(', ') : item.category}
                  </span>
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 mt-2"
                  >
                    View | Apply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No Australian scholarships found.
          </div>
        )}
      </div>
      {/* Modal for details */}
      <ScholarshipDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        scholarship={selectedScholarship}
      />
    </div>
  );
};

export default Australian_scholarship;