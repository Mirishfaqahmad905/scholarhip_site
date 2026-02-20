import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Api_url from '../constant/constant';

const CompitionDetailModal = ({ open, onClose, item }) => {
  if (!open || !item) return null;

  // Utility to split text by newlines or commas into a list
  const toList = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === 'string'
      ? val.split(/\n|,/).map((v) => v.trim()).filter(Boolean)
      : [];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Competition info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">{item.name || item.title}</h2>
            <img
              src={item.image}
              alt={item.name || item.title}
              className="w-full h-56 object-cover rounded mb-4"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
            />
            <div className="mb-2">
              <strong>Category:</strong> {Array.isArray(item.category) ? item.category.join(', ') : item.category || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Deadline:</strong>{" "}
              {item.deadline ? new Date(item.deadline).toLocaleDateString() : "N/A"}
            </div>
            <div className="mb-2">
              <strong>Description:</strong>
              <div className="text-gray-700 whitespace-pre-line">{item.description || 'N/A'}</div>
            </div>
            <div className="mb-2">
              <strong>Benefits:</strong>
              {toList(item.benefits).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(item.benefits).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-700 ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Eligibility:</strong>
              {toList(item.eligibility || item.eligibilityCriteria).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(item.eligibility || item.eligibilityCriteria).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-700 ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Required Documents:</strong>
              {toList(item.documentsRequired || item.requiredDocuments || item.documents).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(item.documentsRequired || item.requiredDocuments || item.documents).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-700 ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2">
              <strong>How to Apply:</strong>
              {toList(item.howToApply).length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {toList(item.howToApply).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-700 ml-2">N/A</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Official Link:</strong>{" "}
              {item.officialLink || item.link ? (
                <a
                  href={item.officialLink || item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Visit Official Site
                </a>
              ) : (
                <span className="text-gray-500 ml-2">N/A</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Close
            </button>
          </div>
          {/* Modal Ad space */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
            <div className="bg-gray-200 h-24 rounded flex items-center justify-center">Ad A</div>
            <div className="bg-gray-200 h-24 rounded flex items-center justify-center">Ad B</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Compition = () => {
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
        // http://localhost:5000/api/get/scholarship_data
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        setData(res.data || []);
        setLoading(false);
      } catch (err) {
        setError('Error occurred fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter for scholarships with category including "compition"
  const compitionPrograms = data.filter(
    (item) => Array.isArray(item.category) && item.category.includes("compition")
  );

  const handleViewDetails = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="flex gap-6 bg-gray-50 min-h-screen py-8">
      {/* Left Ad Space */}
      <div className="w-1/5 flex flex-col items-center">
        <div className="w-full h-80 mb-8 bg-gray-200 rounded flex items-center justify-center">
          Ad Space
        </div>
        <div className="w-full h-80 bg-gray-200 rounded flex items-center justify-center">
          Ad Space
        </div>
      </div>
      {/* Center Content */}
      <div className="w-3/5">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700">Competitions</h2>
        {loading && <div className="text-center text-lg">Loading...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {compitionPrograms.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500">No competitions found.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data && compitionPrograms.map((item) => (
            <div
              key={item._id}
              className="border rounded-2xl p-6 shadow-xl bg-white flex flex-col items-center hover:shadow-2xl transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded-xl border"
                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
              />
              <h3 className="text-2xl font-bold mb-2 text-blue-800">{item.name}</h3>
              <div className="mb-1 text-gray-700">
                <strong>Deadline:</strong>{" "}
                {item.deadline ? new Date(item.deadline).toLocaleDateString() : "N/A"}
              </div>
              <button
                className="mt-4 inline-block bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-900 transition"
                onClick={() => handleViewDetails(item)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Right Ad Space */}
      <div className="w-1/5 flex flex-col items-center">
        <div className="w-full h-80 mb-8 bg-gray-200 rounded flex items-center justify-center">
          Ad Space
        </div>
        <div className="w-full h-80 bg-gray-200 rounded flex items-center justify-center">
          Ad Space
        </div>
      </div>
      {/* Modal */}
      <CompitionDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selected}
      />
    </div>
  );
};

export default Compition;