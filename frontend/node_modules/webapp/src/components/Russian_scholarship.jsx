import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import Api_url from '../constant/constant';

const toList = (value) =>
  Array.isArray(value)
    ? value
    : typeof value === 'string'
    ? value.split(/\n|,|\./).map((item) => item.trim()).filter(Boolean)
    : [];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

const safeImage = (value) => (typeof value === 'string' && value.trim() ? value : '/fallback-image.svg');

const DetailModal = ({ open, onClose, scholarship }) => {
  if (!open || !scholarship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-2xl hover:bg-white/20"
          aria-label="Close details"
        >
          &times;
        </button>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-cyan-200">{scholarship.name}</h2>
            <img
              src={safeImage(scholarship.image)}
              alt={scholarship.name}
              className="h-64 w-full rounded-2xl border border-cyan-400/20 object-cover"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
            />
            <p className="text-slate-200">{scholarship.description || 'No description available.'}</p>

            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
              <h3 className="mb-2 text-lg font-semibold text-cyan-200">Required Documents</h3>
              {toList(scholarship.requiredDocuments || scholarship.document).length ? (
                <ul className="space-y-1 text-slate-100">
                  {toList(scholarship.requiredDocuments || scholarship.document).map((doc, i) => (
                    <li key={i}>• {doc}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300">No document list provided.</p>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
            <h3 className="text-lg font-semibold text-cyan-200">Scholarship Summary</h3>
            <p><span className="font-semibold">Country:</span> {scholarship.country || 'N/A'}</p>
            <p><span className="font-semibold">Deadline:</span> {formatDate(scholarship.deadline)}</p>
            <p><span className="font-semibold">Amount:</span> {scholarship.amount || 'Varies / Fully funded'}</p>
            <p><span className="font-semibold">Host University:</span> {scholarship.hostUniversity || 'N/A'}</p>

            <div>
              <h4 className="mb-1 font-semibold text-cyan-200">Eligibility</h4>
              <ul className="space-y-1 text-slate-100">
                {toList(scholarship.eligibilityCriteria).map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-cyan-200">Benefits</h4>
              <ul className="space-y-1 text-slate-100">
                {toList(scholarship.benefits).map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            {scholarship.officialLink && (
              <a
                href={scholarship.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500"
              >
                Open Official Link
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Russian_scholarship = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/scholarship_data`);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const russianData = useMemo(
    () =>
      data.filter((item) => {
        const country = String(item.country || '').toLowerCase();
        const regionValues = Array.isArray(item.region) ? item.region : [item.region];
        const regionMatched = regionValues.some((r) => /russia|russian/i.test(String(r || '')));
        return regionMatched || /russia|russian/i.test(country);
      }),
    [data]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_45%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-cyan-200 sm:text-4xl">Russian Scholarships</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Dedicated section with required document details and official links.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
            Responsive and optimized for desktop + mobile
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-center text-slate-300">Loading scholarships...</div>
        ) : russianData.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 text-center text-slate-300">
            No Russian scholarships found yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {russianData.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/70 shadow-lg transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <img
                  src={safeImage(item.image)}
                  alt={item.name}
                  className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                />
                <div className="space-y-2 p-4">
                  <h2 className="line-clamp-2 text-lg font-bold text-cyan-100">{item.name}</h2>
                  <p className="text-sm text-slate-300"><span className="font-semibold">Country:</span> {item.country || 'N/A'}</p>
                  <p className="text-sm text-slate-300"><span className="font-semibold">Deadline:</span> {formatDate(item.deadline)}</p>
                  <p className="line-clamp-2 text-sm text-slate-300">
                    <span className="font-semibold">Documents:</span>{' '}
                    {(item.requiredDocuments || item.document || 'Not provided').toString()}
                  </p>
                  <button
                    onClick={() => { setSelected(item); setOpen(true); }}
                    className="mt-2 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <DetailModal
        open={open}
        onClose={() => setOpen(false)}
        scholarship={selected}
      />
    </div>
  );
};

export default Russian_scholarship;
