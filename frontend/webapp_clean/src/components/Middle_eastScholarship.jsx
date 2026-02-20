import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api_url from '../constant/constant';

const ScholarshipDetailModal = ({ open, onClose, scholarship }) => {
  if (!open || !scholarship) return null;

  // Utility to split text by newlines or commas into a list
  const toList = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === 'string'
      ? val.split(/\n|,/).map((v) => v.trim()).filter(Boolean)
      : [];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh] border-4 border-blue-200">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-blue-500 hover:text-blue-800 text-3xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Scholarship info */}
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-4 text-blue-800 text-center font-serif tracking-wide">{scholarship.name}</h2>
            <img
              src={scholarship.image}
              alt={scholarship.name}
              className="w-full h-56 object-cover rounded-xl mb-4 border-2 border-blue-100 shadow"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
            />
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold mr-2">
                {Array.isArray(scholarship.category) ? scholarship.category.join(', ') : scholarship.category}
              </span>
              {scholarship.region && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                  {Array.isArray(scholarship.region) ? scholarship.region.join(', ') : scholarship.region}
                </span>
              )}
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Deadline:</strong>{" "}
              <span className="font-medium">
                {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Country:</strong>{" "}
              <span className="font-medium">{scholarship.country || 'N/A'}</span>
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Description:</strong>
              <div className="whitespace-pre-line font-sans">{scholarship.description || 'N/A'}</div>
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Benefits:</strong>
              {toList(scholarship.benefits).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(scholarship.benefits).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Eligibility:</strong>
              {toList(scholarship.eligibility || scholarship.eligibilityCriteria).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(scholarship.eligibility || scholarship.eligibilityCriteria).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Required Documents:</strong>
              {toList(scholarship.documentsRequired || scholarship.requiredDocuments || scholarship.documents).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(scholarship.documentsRequired || scholarship.requiredDocuments || scholarship.documents).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2 text-gray-700">
              <strong className="text-blue-700">Official Link:</strong>{" "}
              {scholarship.officialLink || scholarship.link ? (
                <a
                  href={scholarship.officialLink || scholarship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                >
                  Visit Official Site
                </a>
              ) : (
                <span className="ml-2">N/A</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded font-bold shadow hover:from-blue-700 hover:to-blue-900 transition"
            >
              Close
            </button>
          </div>
          {/* Modal Ad space */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
            <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 h-24 rounded flex items-center justify-center font-bold text-lg text-yellow-900 shadow">Ad A</div>
            <div className="bg-gradient-to-br from-pink-200 to-pink-400 h-24 rounded flex items-center justify-center font-bold text-lg text-pink-900 shadow">Ad B</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Middle_eastScholarship = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      // http://localhost:5000/api/get/scholarship_data
      const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter for region "middle east" (case-insensitive, supports string or array)
  const middleEastScholarships = (data || []).filter(sch => {
    if (!sch.region) return false;
    if (Array.isArray(sch.region)) {
      return sch.region.some(r => typeof r === 'string' && r.toLowerCase().includes('middle east'));
    }
    return typeof sch.region === 'string' && sch.region.toLowerCase().includes('middle east');
  });

  const handleViewDetails = (sch) => {
    setSelected(sch);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Left ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start shadow">
        <h2 className="font-bold text-lg mb-4 text-blue-700 font-serif">Sponsored</h2>
        <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-400 rounded mb-4 flex items-center justify-center font-bold text-white shadow">Ad 1</div>
        <div className="w-full h-40 bg-gradient-to-br from-pink-200 to-pink-400 rounded flex items-center justify-center font-bold text-white shadow">Ad 2</div>
      </aside>

      {/* Center: Middle East Scholarships */}
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-800 font-serif tracking-wide">Middle East Scholarships</h1>
        {loading ? (
          <div className="text-center text-gray-500 text-lg font-semibold">Loading...</div>
        ) : middleEastScholarships.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {middleEastScholarships.map((sch, index) => (
              <div
                key={sch._id || sch.id || index}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition border-2 border-blue-100"
              >
                <img
                  src={sch.image}
                  alt={sch.name}
                  className="w-full h-40 object-cover rounded-xl mb-3 border"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                />
                <h2 className="font-semibold text-lg mb-1 text-blue-900 font-serif">{sch.name}</h2>
                <div className="text-sm text-gray-500 mb-1 font-medium">Category: {Array.isArray(sch.category) ? sch.category.join(', ') : sch.category}</div>
                <div className="text-sm text-gray-500 mb-1 font-medium">
                  Deadline: {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                </div>
                <button
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-900 font-semibold shadow"
                  onClick={() => handleViewDetails(sch)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg font-semibold">No Middle East scholarships found.</div>
        )}
      </main>

      {/* Right ads */}
      <aside className="w-full md:w-64 lg:w-72 bg-white/90 dark:bg-neutral-900/80 p-3 sm:p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 flex flex-col items-center rounded-none md:rounded-xl shadow-sm md:sticky md:top-20 self-start shadow">
        <h2 className="font-bold text-lg mb-4 text-blue-700 font-serif">Sponsored</h2>
        <div className="w-full h-40 bg-gradient-to-br from-green-200 to-green-400 rounded mb-4 flex items-center justify-center font-bold text-white shadow">Ad 3</div>
        <div className="w-full h-40 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded flex items-center justify-center font-bold text-white shadow">Ad 4</div>
      </aside>

      {/* Scholarship Detail Modal */}
      <ScholarshipDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        scholarship={selected}
      />
    </div>
  );
};

export default Middle_eastScholarship;