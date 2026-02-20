import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Api_url from '../constant/constant';

const LeadershipDetailModal = ({ open, onClose, item }) => {
  if (!open || !item) return null;

  const toList = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === 'string'
      ? val.split(/\n|,|\./).map((v) => v.trim()).filter(Boolean)
      : [];

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
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
                {item.programTitle || item.name}
              </h2>
              {item.hostOrganization && (
                <p className="text-lg font-semibold text-blue-600">
                  Hosted by: {item.hostOrganization}
                </p>
              )}
            </div>
            <img
              src={item.image}
              alt={item.programTitle || item.name}
              className="w-full h-64 object-cover rounded-xl mb-6 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Category</h3>
                <p>{item.category || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Deadline</h3>
                <p>{formatDate(item.deadline)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Duration</h3>
                <p>{item.duration || 'N/A'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Location</h3>
                <p>{item.programLocation || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Description</h3>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {item.description || 'N/A'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Benefits</h3>
              {toList(item.benefits).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(item.benefits).map((b, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Eligibility</h3>
              {toList(item.eligibility || item.eligibilityCriteria).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(item.eligibility || item.eligibilityCriteria).map((e, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{e}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Required Documents</h3>
              {toList(item.documentsRequired || item.requiredDocuments || item.documents).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(item.documentsRequired || item.requiredDocuments || item.documents).map((d, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">N/A</p>
              )}
            </div>
            {item.howToApply && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">How to Apply</h3>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {Array.isArray(item.howToApply)
                    ? item.howToApply.join('\n')
                    : item.howToApply}
                </div>
              </div>
            )}
            {item.officialLink || item.link ? (
              <div className="text-center mb-6">
                <a
                  href={item.officialLink || item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Visit Official Site
                </a>
              </div>
            ) : (
              <div className="text-center mb-6 text-gray-500">No official link available</div>
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
              Featured Program
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

const Leadership_programe = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // http://localhost:5000/api/get/leader_data
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/leader_data`);
        setData(res.data);
      } catch (err) {
        setError('Error fetching leadership data: ' + (err.response?.data?.message || err.message));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleViewDetails = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Left container */}
      <div className="md:w-1/4 mb-4">
        <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-blue-400 rounded mb-4 flex items-center justify-center font-bold text-white shadow">Ad 1</div>
        <div className="w-full h-40 bg-gradient-to-br from-green-200 to-green-400 rounded flex items-center justify-center font-bold text-white shadow">Ad 2</div>
      </div>
      {/* Main content */}
      <div className="md:w-3/4 flex flex-wrap gap-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-white rounded-lg shadow-md p-4 w-full md:w-80 flex flex-col items-center border-2 border-blue-100 hover:shadow-xl transition"
            >
              <img
                src={item.image}
                alt={item.programTitle}
                className="h-40 w-full object-cover rounded mb-3 border"
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
              />
              <h2 className="text-xl font-semibold mb-2 text-blue-800 text-center">{item.programTitle}</h2>
              <div className="text-sm text-gray-500 mb-1 font-medium">
                Category: {item.category || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 mb-1 font-medium">
                Location: {item.programLocation || 'N/A'}
              </div>
              <div className="text-sm text-gray-500 mb-1 font-medium">
                Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-900 font-semibold shadow"
                onClick={() => handleViewDetails(item)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No leadership programs found.</div>
        )}
      </div>
      {/* Modal */}
      <LeadershipDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selected}
      />
    </div>
  );
};

export default Leadership_programe;