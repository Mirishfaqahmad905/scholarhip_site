import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Api_url from '../constant/constant';
import { useSelector } from 'react-redux';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const showFooter= useSelector((state)=>state.admin.isAdminLoggedIn);


  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      // http://localhost:5000/api/subscriber
      const res = await axios.post(`${Api_url.BACKEND_URI}/api/subscriber`, { email });
      if (res.status === 201 || res.status === 200) {
        setMessage('✅ Subscribed successfully!');
        setEmail('');
      }
    } catch (error) {
      console.log('Error occurred:', error);
      setMessage('❌ Subscription failed. Please try again.');
    }
  };

  return (
     <>
      {showFooter ? (
    <>  
    


     </>
      ):(
      <>
      
    <footer className="bg-black text-white py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo and Description */}
        <div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTueryKaOue45mpyaZV0WItWLfJ-2lEE7twMzJBLCZG7mPh3fgDKomaRh-g5EQLcD9HGxU&usqp=CAU"
            alt="scholarship logo"
            className="w-20 h-20 object-cover rounded-full mb-3"
          />
          <p className="text-sm text-gray-300">
            scholarshipforstudneet is a global platform offering students easy access to various scholarship opportunities around the world.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-base mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
            <li><Link to="/competition" className="hover:text-blue-400">Competition</Link></li>
          </ul>
        </div>

        {/* Scholarship Categories */}
        <div>
          <h3 className="font-semibold text-base mb-2">Scholarships</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/european-scholarship" className="hover:text-blue-400">European</Link></li>
            <li><Link to="/asian_scholarship" className="hover:text-blue-400">Asian</Link></li>
            <li><Link to="/african-scholarship" className="hover:text-blue-400">African</Link></li>
            <li><Link to="/american-scholarship" className="hover:text-blue-400">American</Link></li>
            <li><Link to="/australian-scholarship" className="hover:text-blue-400">Australian</Link></li>
            <li><Link to="/south-american-scholarship" className="hover:text-blue-400">South American</Link></li>
            <li><Link to="/middle_eastscholarship" className="hover:text-blue-400">Middle East</Link></li>
            <li><Link to="/chinese_govt_scholarship" className="hover:text-blue-400">Chinese Govt</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-base mb-2">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="px-3 py-1 rounded bg-white text-black w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
            >
              Subscribe
            </button>
          </form>
          {message && <p className="text-xs mt-2 text-green-400">{message}</p>}
          <p className="text-xs text-gray-400 mt-4">© 2025 scholarshipforstudneet. All rights reserved.</p>
        </div>
      </div>
    </footer>
      
      </>)
    }
     
    </>
  );
};

export default Footer;
