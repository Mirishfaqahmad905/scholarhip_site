import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaYoutube, FaFacebookMessenger } from 'react-icons/fa';
import Api_url from '../constant/constant';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
     try {
      e.preventDefault();
      // http://localhost:5000/api/contact
    const postdata = await axios.post(`${Api_url.BACKEND_URI}/api/contact`, formData);
    if(postdata.status === 201) {
       {
         alert("data save succesfully ");
       }
    console.log('Submitted Data:', formData);
     } 
    } catch (error) {
      console.error('Error submitting form:', error);
    // Here you could integrate with EmailJS, backend API, etc.
  };
    setFormData({
      name: '',
      email: '',
      website: '',
      message: ''
    });
};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">Contact Us</h1>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <a
            href="https://whatsapp.com/channel/0029VaCRSJbEQIalJCqFgp3d"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-800 text-lg"
          >
            <FaWhatsapp className="text-2xl" /> WhatsApp 
          </a>
          <a
            href="https://www.instagram.com/iam_mir905/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-700 text-lg"
          >
            <FaInstagram className="text-2xl" /> Instagram 
          </a>
          <a
            href="https://www.youtube.com/geekyskill4156"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-lg"
          >
            <FaYoutube className="text-2xl" /> YouTube Channel
          </a>
          <a
            href="https://m.me/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-lg"
          >
            <FaFacebookMessenger className="text-2xl" /> Messenger Chat
          </a>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="website" className="block font-medium text-gray-700 mb-1">
              Website (optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Contact;
