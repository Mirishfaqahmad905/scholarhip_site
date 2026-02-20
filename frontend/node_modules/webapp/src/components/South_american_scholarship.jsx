import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const South_american_scholarship = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // http://localhost:5000/api/get/scholarship_data
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        setData(res.data);
      } catch (error) {
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter for region "south america" (case-insensitive, supports string or array)
  const southAmericaScholarships = (data || []).filter(sch => {
    if (!sch.region) return false;
    if (Array.isArray(sch.region)) {
      return sch.region.some(r => typeof r === 'string' && r.toLowerCase().includes('south america'));
    }
    return typeof sch.region === 'string' && sch.region.toLowerCase().includes('south america');
  });

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start">
        <h2 className="font-bold text-lg mb-4">Sponsored</h2>
        <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">Ad 1</div>
        <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">Ad 2</div>
      </aside>

      {/* Center: South America Scholarships */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">South America Scholarships</h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : southAmericaScholarships.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {southAmericaScholarships.map((sch, index) => (
              <div key={sch._id || sch.id || index} className="bg-white rounded shadow p-4 flex flex-col hover:shadow-lg transition">
                <img
                  src={sch.image}
                  alt={sch.name}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                />
                <h2 className="font-semibold text-lg mb-1">{sch.name}</h2>
                <div className="text-sm text-gray-500 mb-1">Category: {Array.isArray(sch.category) ? sch.category.join(', ') : sch.category}</div>
                <div className="text-sm text-gray-500 mb-1">
                  Deadline: {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                </div>
                <button
                  onClick={() => handleViewDetails(sch)}
                  className="mt-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-green-600 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No South America scholarships found.</div>
        )}
      </main>

      {/* Right ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start">
        <h2 className="font-bold text-lg mb-4">Sponsored</h2>
        <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center">Ad 3</div>
        <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">Ad 4</div>
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

export default South_american_scholarship;