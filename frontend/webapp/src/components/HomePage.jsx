import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Ads from "../ads/Ads";
import axios from "axios";
 import SubscribeModal from "../components//SubscribeModal.jsx";
import Api_url from "../constant/constant";
// Scholarship Detail Modal
const ScholarshipDetailModal = ({ open, onClose, scholarship }) => {
  if (!open || !scholarship) return null;

  const toList = (val) =>
    Array.isArray(val)
      ? val
      : typeof val === "string"
      ? val.split(/\n|,|\./).map((v) => v.trim()).filter(Boolean)
      : [];

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

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
              onError={e => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Category</h3>
                <p>{Array.isArray(scholarship.category) ? scholarship.category.join(', ') : scholarship.category}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Deadline</h3>
                <p>{formatDate(scholarship.deadline)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Country</h3>
                <p>{scholarship.country || "N/A"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Region</h3>
                <p>{Array.isArray(scholarship.region) ? scholarship.region.join(', ') : scholarship.region}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Amount</h3>
                <p>{scholarship.amount ? scholarship.amount : "Varies / Fully Funded"}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="font-bold text-blue-700">Created At</h3>
                <p>{formatDate(scholarship.createdAt)}</p>
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
            {scholarship.howToApply && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">How to Apply</h3>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {scholarship.howToApply}
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Required Documents</h3>
              {toList(scholarship.document || scholarship.documentsRequired).length > 0 ? (
                <ul className="list-none space-y-2">
                  {toList(scholarship.document || scholarship.documentsRequired).map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{doc}</span>
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
        </div>
      </div>
    </div>
  );
};

// BrowseScholarshipModal with modal on result click
const BrowseScholarshipModal = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // http://localhost:5000/api/get/scholarship_data
      const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
      const filtered = res.data.filter((s) =>
        s.name?.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Browse All  Scholarships</h2>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Type scholarship name..."
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          {loading && <div className="text-center">Loading...</div>}
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((scholarship) => (
              <div
                key={scholarship._id || scholarship.id}
                className="bg-blue-50 rounded shadow p-4 flex flex-col items-center cursor-pointer hover:bg-blue-100 transition"
                onClick={() => setSelectedScholarship(scholarship)}
              >
                <img
                  src={scholarship.image}
                  alt={scholarship.name}
                  className="h-20 w-full object-contain mb-2 rounded"
                />
                <h3 className="font-semibold text-lg mb-1 text-center">{scholarship.name}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(scholarship.category || []).map((cat, i) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <span className="text-blue-600 underline text-sm mt-2">View Details</span>
              </div>
            ))}
          </div>
          {!loading && results.length === 0 && query.length > 1 && (
            <div className="text-center text-gray-500 mt-4">No scholarships found.</div>
          )}
        </div>
      </div>
      <ScholarshipDetailModal
        open={!!selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        scholarship={selectedScholarship}
      />
    </>
  );
};

const ScholarshipCarousel = ({ onViewDetails }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        const now = new Date();
        const openScholarships = (res.data || []).filter(
          (s) => s.deadline && new Date(s.deadline) >= now
        );
        openScholarships.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setScholarships(openScholarships);
      } catch {
        setScholarships([]);
      }
      setLoading(false);
    };
    fetchScholarships();
  }, []);

  const prev = () => setCurrent((prev) => (prev === 0 ? scholarships.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === scholarships.length - 1 ? 0 : prev + 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">Loading open scholarships...</span>
      </div>
    );
  }

  if (!scholarships.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500">No scholarships currently open.</span>
      </div>
    );
  }

  const visible = scholarships.slice(current, current + 3).concat(
    scholarships.length < 3
      ? []
      : scholarships.slice(0, Math.max(0, 3 - (scholarships.length - current)))
  );

  return (
    <div className="relative py-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Currently Open Scholarships</h2>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={prev}
          className="bg-blue-100 hover:bg-blue-300 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition"
          aria-label="Previous"
        >
          &#8592;
        </button>
        <div className="grid gap-6 md:grid-cols-3">
          {visible.map((sch, idx) => (
            <div
              key={sch._id || sch.id || idx}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
            >
              <img
                src={sch.image}
                alt={sch.name}
                className="h-32 w-full object-cover rounded mb-3 border"
                onError={e => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }}
              />
              <h3 className="font-bold text-lg mb-2 text-blue-800 text-center">{sch.name}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {(sch.category || []).map((cat, i) => (
                  <span
                    key={i}
                    className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <strong>Deadline:</strong>{" "}
                {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : "N/A"}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                <strong>Country:</strong> {sch.country || "N/A"}
              </div>
              <button
                className="mt-3 inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded font-semibold shadow hover:from-blue-800 hover:to-blue-900 transition"
                onClick={() => onViewDetails(sch)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={next}
          className="bg-blue-100 hover:bg-blue-300 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition"
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
      <div className="flex justify-center mt-4 gap-2">
        {scholarships.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-blue-200"} transition`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Homepage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setDetailModalOpen(true);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
        <SubscribeModal />
      <BrowseScholarshipModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ScholarshipDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        scholarship={selectedScholarship}
      />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-8">
        {/* Left Side: Ad Space */}
        <div className="md:col-span-1">
          <Ads />
        </div>
        {/* Main Content */}
        <section className="md:col-span-3">
          {/* Hero Section */}
          <div className="bg-blue-600 text-white py-12 px-4 text-center rounded mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Scholarship</h1>
            <p className="mb-6 text-lg md:text-xl">
              Discover scholarships that match your goals and aspirations.
            </p>
            {/* <Link
              to=""
              className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
            >
           click on browse scholarship and open your fav scholarship
            </Link> */}
            <button
              onClick={() => setModalOpen(true)}
              className="ml-4 bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
            >
              Browse Scholarship (Quick Search)
            </button>
          </div>

          {/* Carousel of Currently Open Scholarships */}
          <ScholarshipCarousel onViewDetails={handleViewDetails} />

          {/* Browse by Category */}
          <div className="bg-white py-10 px-4 rounded shadow mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/undergraduate-scholarship"
                className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 px-6 py-2 rounded font-medium transition"
              >
                Undergraduate
              </Link>
              <Link
                to="/master-scholarship"
                className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 px-6 py-2 rounded font-medium transition"
              >
                Postgraduate
              </Link>
              <Link
                to="/scholarships/international"
                className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 px-6 py-2 rounded font-medium transition"
              >
                International
              </Link>
              <Link
                to="/scholarships/region"
                className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 px-6 py-2 rounded font-medium transition"
              >
                By Region
              </Link>
              <Link
                to="/scholarships/field"
                className="bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-800 px-6 py-2 rounded font-medium transition"
              >
                By Fields
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Homepage;
