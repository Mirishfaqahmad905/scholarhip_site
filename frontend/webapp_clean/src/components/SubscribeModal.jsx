import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Api_url from '../constant/constant';

const SubscribeModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isSubscribed = localStorage.getItem('subscribed');
    if (!isSubscribed) {
      setTimeout(() => setShowModal(true), 1000); // 1s delay
    }
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 'http://localhost:5000/api/subscriber'
      const response = await axios.post(`${Api_url.BACKEND_URI}/api/subscriber`, { email });
      if (response.status === 201) {
        setMessage('🎉 Subscribed successfully!');
        localStorage.setItem('subscribed', 'true');
        setTimeout(() => setShowModal(false), 2500);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setMessage('❌ Subscription failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fadeIn">
        <div className="relative w-full max-w-3xl bg-white/10 border border-white/30 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500">

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400 transition"
            onClick={() => setShowModal(false)}
            aria-label="Close"
          >
            &times;
          </button>

          {/* Header */}
          <div className="text-center p-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-serif">
              📬 Stay Updated with Scholarships!
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-lg mx-auto">
              Enter your email to receive scholarship alerts directly to your inbox.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-center gap-4 px-6 pb-8">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full md:w-2/3 px-6 py-4 rounded-lg border border-white/40 bg-white/20 text-white placeholder-white/70 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className="px-6 pb-6 text-center">
              <p className="text-lg font-medium text-white animate-pulse">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default SubscribeModal;
