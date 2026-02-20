import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api_url from '../constant/constant';

const Bloge = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${Api_url.BACKEND_URI}/api/get/allbloge`);
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to load blogs. Please try again later.");
        console.error("Blog fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedBlog(null), 300);
    document.body.classList.remove('overflow-hidden');
  };

  const getFirstAvailableImage = (blog) => {
    const contentImage = blog.content?.find(c => c.type === 'image' && c.value && !c.value.startsWith('http:///'));
    if (contentImage?.value) return contentImage.value;
    if (Array.isArray(blog.image_urls) && blog.image_urls.length > 0 && blog.image_urls[0]) return blog.image_urls[0];
    return '/fallback-image.svg';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-200 min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
        🌍 Explore Our Latest Blogs
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
            >
              <img
                src={getFirstAvailableImage(blog)}
                alt={blog.title}
                className="w-full h-48 object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold text-gray-800 truncate">{blog.title}</h2>
                <p className="text-sm text-gray-600">📂 {blog.category}</p>
                <button
                  onClick={() => openModal(blog)}
                  className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow"
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && selectedBlog && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-xl relative animate-scaleIn border border-gray-300"
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-3xl text-gray-800 hover:text-red-500 transition"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-blue-800 mb-2 border-b pb-2">{selectedBlog.title}</h2>
            <p className="text-sm text-gray-600 mb-4">
              ✍️ <span className="font-medium">{selectedBlog.author || 'Anonymous'}</span> &nbsp;| &nbsp;🏷️ <span className="font-medium">{selectedBlog.category}</span>
            </p>

            <div className="space-y-6">
              {selectedBlog.content.map((block, idx) => {
                if (block.type === 'heading') return <h3 key={idx} className="text-2xl font-semibold text-indigo-700 border-l-4 pl-3 border-indigo-400">{block.value}</h3>;
                if (block.type === 'text') return <p key={idx} className="text-base text-gray-800 leading-relaxed">{block.value}</p>;
                if (block.type === 'textarea') return <p key={idx} className="text-gray-700 italic text-base border-l-2 pl-4 border-gray-400">{block.value}</p>;
                if (block.type === 'quote') return <blockquote key={idx} className="text-lg font-medium italic text-purple-600 border-l-4 border-purple-400 pl-4">{block.value}</blockquote>;
                if (block.type === 'image' && block.value && !block.value.startsWith('http:///')) {
                  return (
                    <img
                      key={idx}
                      src={block.value}
                      alt="blog content"
                      className="rounded-xl shadow-lg max-h-96 w-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                    />
                  );
                }
                return null;
              })}

              {Array.isArray(selectedBlog.image_urls) && selectedBlog.image_urls.map((url, idx) => (
                url && url.trim() && !url.startsWith('http:///') && (
                  <img
                    key={`external-${idx}`}
                    src={url}
                    alt={`external-${idx}`}
                    className="rounded-xl shadow-md max-h-96 w-full object-cover"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback-image.svg'; }}
                  />
                )
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-fadeIn {
              animation: fadeIn 0.25s ease-out forwards;
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Bloge;
