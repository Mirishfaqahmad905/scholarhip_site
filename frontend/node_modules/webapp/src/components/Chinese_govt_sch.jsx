import React, { useEffect, useState } from "react";
import axios from "axios";
import Api_url from "../constant/constant";

// Scholarship Detail Modal
const ScholarshipDetailModal = ({ scholarship, onClose }) => {
  if (!scholarship) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh] border-2 border-blue-300">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Ads inside Modal */}
        <div className="mb-6">
          <div className="w-full h-20 bg-yellow-100 border-2 border-yellow-400 rounded-lg flex items-center justify-center text-yellow-700 font-semibold shadow-inner">
            Advertisement Space
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {scholarship.image && (
            <img
              src={scholarship.image}
              alt={scholarship.name}
              className="w-full md:w-56 h-40 object-cover rounded-xl border"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-blue-700">{scholarship.name}</h2>
            <p className="mb-4 text-gray-700 whitespace-pre-line">{scholarship.description}</p>

            <div className="mb-2">
              <span className="font-semibold">Deadline:</span>{" "}
              <span className="text-red-600">{new Date(scholarship.deadline).toDateString()}</span>
            </div>

            {scholarship.hostUniversity && (
              <div className="mb-2">
                <span className="font-semibold">Host University:</span> {scholarship.hostUniversity}
              </div>
            )}

            {scholarship.category && scholarship.category.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Categories:</span> {scholarship.category.join(", ")}
              </div>
            )}

            {scholarship.eligibilityCriteria && (
              <div className="mb-2">
                <span className="font-semibold">Eligibility:</span>
                <p className="whitespace-pre-line ml-2 text-gray-700">{scholarship.eligibilityCriteria}</p>
              </div>
            )}

            {scholarship.benefits && (
              <div className="mb-2">
                <span className="font-semibold">Benefits:</span>
                <p className="whitespace-pre-line ml-2 text-gray-700">{scholarship.benefits}</p>
              </div>
            )}

            {scholarship.document && (
              <div className="mb-2">
                <span className="font-semibold">Required Documents:</span>
                <p className="whitespace-pre-line ml-2 text-gray-700">{scholarship.document}</p>
              </div>
            )}

            {scholarship.howToApply && (
              <div className="mb-2">
                <span className="font-semibold">How to Apply:</span>
                <p className="whitespace-pre-line ml-2 text-gray-700">{scholarship.howToApply}</p>
              </div>
            )}

            {scholarship.officialLink && (
              <div className="mb-2">
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href={scholarship.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {scholarship.officialLink}
                </a>
              </div>
            )}

            {scholarship.country && (
              <div className="mb-2">
                <span className="font-semibold">Country:</span> {scholarship.country}
              </div>
            )}

            {scholarship.region && (
              <div className="mb-2">
                <span className="font-semibold">Region:</span> {scholarship.region.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Chinese_govt_sch = () => {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      // "http://localhost:5000/api/get/scholarship_data"
      try {
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        const filtered = res.data.filter(
          (sch) => sch.country && sch.country.toLowerCase() === "china"
        );
        setScholarships(filtered);
      } catch (err) {
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-2 md:px-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
        Chinese Government Scholarships
      </h1>

      <div className="flex justify-center mb-8">
        <div className="w-full md:w-2/3 h-24 bg-yellow-100 border-2 border-yellow-400 rounded-lg flex items-center justify-center text-yellow-700 font-semibold text-lg shadow-inner">
          {/* Advertisement Space */}





        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-blue-600 text-xl font-semibold">Loading scholarships...</span>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-500 text-lg">No Chinese government scholarships found.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships.map((sch, idx) => (
            <div
              key={sch._id || idx}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100 flex flex-col"
            >
              {sch.image && (
                <img
                  src={sch.image}
                  alt={sch.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-blue-700 mb-2">{sch.name}</h2>
                <p className="text-gray-700 mb-3 line-clamp-3">{sch.description}</p>
                <div className="mb-2">
                  <span className="font-semibold">Deadline:</span>{" "}
                  <span className="text-red-600">{new Date(sch.deadline).toDateString()}</span>
                </div>
                <div className="flex-1"></div>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                  onClick={() => setSelectedScholarship(sch)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};

export default Chinese_govt_sch;
