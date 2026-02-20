import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api_url from '../constant/constant';

const SummerProgramModal = ({ program, onClose }) => {
  if (!program) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Ad Space */}
          <div className="hidden md:block md:w-1/6 bg-yellow-100 text-center p-2 rounded shadow-inner">
            <p className="text-xs text-yellow-700">Ad Space</p>
          </div>

          {/* Content */}
          <div className="flex-1 px-4">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{program.name}</h2>
            {program.image && (
              <img
                src={program.image}
                alt={program.name}
                className="w-full h-60 object-cover rounded mb-4 border"
              />
            )}
            <p className="text-gray-700 mb-4 leading-relaxed">{program.description}</p>
            {program.deadline && (
              <p className="mb-3 text-sm text-red-600"><span className="font-semibold text-black">Deadline:</span> {program.deadline}</p>
            )}
            {program.categories && program.categories.length > 0 && (
              <p className="mb-3 text-sm text-blue-700"><span className="font-semibold text-black">Category:</span> {program.categories.join(', ')}</p>
            )}
            {program.benefits && (
              <div className="mb-4">
                <span className="font-semibold text-black text-lg block mb-2">✨ Benefits:</span>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {Array.isArray(program.benefits)
                    ? program.benefits.map((item, i) => <li key={i} className="pl-2">{item}</li>)
                    : <li>{program.benefits}</li>
                  }
                </ul>
              </div>
            )}
            {program.eligibility && (
              <div className="mb-4">
                <span className="font-semibold text-black text-lg block mb-1">🎯 Eligibility:</span>
                <p className="text-gray-700 leading-relaxed">{program.eligibility}</p>
              </div>
            )}
            {program.howToApply && (
              <div className="mb-4">
                <span className="font-semibold text-black text-lg block mb-1">📝 How to Apply:</span>
                <p className="text-gray-700 leading-relaxed">{program.howToApply}</p>
              </div>
            )}
            {program.website && (
              <div className="mb-4">
                <span className="font-semibold text-black text-lg block mb-1">🔗 Website:</span>
                <a href={program.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{program.website}</a>
              </div>
            )}
          </div>

          {/* Right Ad Space */}
          <div className="hidden md:block md:w-1/6 bg-yellow-100 text-center p-2 rounded shadow-inner">
            <p className="text-xs text-yellow-700">Ad Space</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Summer_programe = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 'http://localhost:5000/api/get/scholarship_data'
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        const summerPrograms = res.data.filter(item =>
          item.categories?.some(cat => cat.toLowerCase() === 'summer_programe')
        );
        setPrograms(summerPrograms);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-10">🌞 Summer Programs</h1>

      {loading ? (
        <p className="text-center text-blue-600">Loading...</p>
      ) : programs.length === 0 ? (
        <p className="text-center text-gray-500">No summer programs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, idx) => (
            <div
              key={program._id || idx}
              className="bg-white rounded-xl shadow-md border hover:shadow-xl transition duration-300"
            >
              {program.image && (
                <img
                  src={program.image}
                  alt={program.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blue-700 mb-1">{program.name}</h2>
                {program.categories && (
                  <p className="text-sm text-gray-600 mb-2">📁 Category: {program.categories.join(', ')}</p>
                )}
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded hover:from-blue-700 hover:to-blue-900 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProgram && (
        <SummerProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default Summer_programe;
