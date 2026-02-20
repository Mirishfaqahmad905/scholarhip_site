import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api_url from '../constant/constant';

const ScholarshipDetailModal = ({ open, onClose, scholarship }) => {
  if (!open || !scholarship) return null;

  const toList = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === 'string'
      ? val.split(/\n|,|\./).map((v) => v.trim()).filter(Boolean)
      : [];

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] border-4 border-blue-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-500 hover:text-blue-800 text-3xl font-bold bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold mb-2 text-blue-800 font-serif tracking-wide bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                {scholarship.name}
              </h2>
              {scholarship.hostUniversity && (
                <p className="text-lg font-semibold text-blue-600">
                  Hosted by: {scholarship.hostUniversity}
                </p>
              )}
            </div>
            <img
              src={scholarship.image}
              alt={scholarship.name}
              className="w-full h-64 object-cover rounded-xl mb-6 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Category</h3>
                <p>{Array.isArray(scholarship.category) ? scholarship.category.join(', ') : scholarship.category}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Region</h3>
                <p>{Array.isArray(scholarship.region) ? scholarship.region.join(', ') : scholarship.region}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Deadline</h3>
                <p>{formatDate(scholarship.deadline)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Country</h3>
                <p>{scholarship.country || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Description</h3>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {scholarship.description}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Benefits</h3>
              {toList(scholarship.benefits).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(scholarship.benefits).map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Eligibility Criteria</h3>
              {toList(scholarship.eligibilityCriteria).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(scholarship.eligibilityCriteria).map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
            {scholarship.officialLink && (
              <div className="text-center mb-6">
                <a
                  href={scholarship.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Apply Now on Official Website
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded font-bold shadow hover:from-blue-700 hover:to-blue-900 transition"
            >
              Close
            </button>
          </div>
          {/* Side Ad Space */}
          <div className="w-full md:w-1/4 space-y-4 mt-6 md:mt-0">
            <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 h-32 rounded-lg flex items-center justify-center font-bold text-yellow-900 shadow-lg">
              Featured Scholarship
            </div>
            <div className="bg-gradient-to-br from-blue-200 to-blue-400 h-32 rounded-lg flex items-center justify-center font-bold text-blue-900 shadow-lg">
              Related Programs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PHD_scholarship = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // "http://localhost:5000/api/get/scholarship_data"
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        setData(res.data);
      } catch (error) {
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter for category "phd" (case-insensitive, supports string or array)
  const phdScholarships = (data || []).filter(sch => {
    if (!sch.category) return false;
    if (Array.isArray(sch.category)) {
      return sch.category.some(c => typeof c === 'string' && c.toLowerCase().includes('phd'));
    }
    return typeof sch.category === 'string' && sch.category.toLowerCase().includes('phd');
  });

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Left ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start">
        <h2 className="font-bold text-lg mb-4 text-blue-700">Sponsored</h2>
        <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-400 rounded mb-4 flex items-center justify-center font-semibold text-white">Ad 1</div>
        <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-pink-400 rounded flex items-center justify-center font-semibold text-white">Ad 2</div>
      </aside>

      {/* Center: PHD Scholarships */}
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800">PhD Scholarships</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : phdScholarships.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {phdScholarships.map((sch, index) => (
              <div key={sch._id || sch.id || index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition">
                <img
                  src={sch.image}
                  alt={sch.name}
                  className="w-full h-44 object-cover rounded-xl mb-4 border"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                />
                <h2 className="font-bold text-xl mb-2 text-blue-700 text-center">{sch.name}</h2>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {Array.isArray(sch.category) ? sch.category.join(', ') : sch.category}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Deadline:</strong> {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                </div>
                <button
                  onClick={() => handleViewDetails(sch)}
                  className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-green-600 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No PhD scholarships found.</div>
        )}
      </main>

      {/* Right ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start">
        <h2 className="font-bold text-lg mb-4 text-blue-700">Sponsored</h2>
        <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-400 rounded mb-4 flex items-center justify-center font-semibold text-white">Ad 3</div>
        <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-pink-400 rounded flex items-center justify-center font-semibold text-white">Ad 4</div>
      </aside>
      {/* Modal for details */}
      <ScholarshipDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        scholarship={selectedScholarship}
      />
    </div>
  );
};

export default PHD_scholarship;