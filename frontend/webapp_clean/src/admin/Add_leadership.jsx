import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api_url from '../constant/constant';
const initialState = {
  id:"",
  programTitle: '',
  image:"",
  hostCountry: '',
  hostOrganization: '',
  programLocation: '',
  duration: '',
  benefits: '',
  eligibility: '',
  howToApply: '',
  documentsRequired: '',
  deadline: '',
  description: '',
  officialLink: '',
};

const Add_leadership = () => {
  const navigate=useNavigate();
  const showLeadershpprogram= useSelector(state => state.admin.isAdminLoggedIn);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // http://localhost:5000/api/add/leader_data
      await axios.post(`${Api_url.BACKEND_URI}/api/add/leader_data`, form);
      setSuccess('Leadership program added successfully!');
      setForm(initialState);
    } catch (err) {
      setError('Error occurred: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
     <>
      { showLeadershpprogram ? (

        <>
 <button className='bg bg-red-400 text text-white p-3 ' onClick={() => navigate(-1)}>Back</button>

    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Add Leadership Program</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
             <div>
          <label className="block font-medium mb-1">Program id</label>
          <input type="text" name="id" value={form.id} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="Programe id " />
        </div>
        <div>
          <label className="block font-medium mb-1">Program Title</label>
          <input type="text" name="programTitle" value={form.programTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="Emerging Leaders Program in USA 2025" />
        </div>
         <div>
          <label className="block font-medium mb-1">Program image</label>
          <input type="text" name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="https://example.com/image.jpg" />
        </div>
        <div>
          <label className="block font-medium mb-1">Host Country</label>
          <input type="text" name="hostCountry" value={form.hostCountry} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Host Organization</label>
          <input type="text" name="hostOrganization" value={form.hostOrganization} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Program Location</label>
          <input type="text" name="programLocation" value={form.programLocation} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Duration</label>
          <input type="text" name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Benefits</label>
          <textarea name="benefits" value={form.benefits} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="List all benefits, e.g. round-trip, accommodation, meals, etc." />
        </div>
        <div>
          <label className="block font-medium mb-1">Eligibility Criteria</label>
          <textarea name="eligibility" value={form.eligibility} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="List all eligibility criteria" />
        </div>
        <div>
          <label className="block font-medium mb-1">How to Apply</label>
          <textarea name="howToApply" value={form.howToApply} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="Describe the application process" />
        </div>
        <div>
          <label className="block font-medium mb-1">Documents Required</label>
          <textarea name="documentsRequired" value={form.documentsRequired} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="List all required documents" />
        </div>
        <div>
          <label className="block font-medium mb-1">Deadline</label>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder="Full program description" />
        </div>
        <div>
          <label className="block font-medium mb-1">Official Link (if any)</label>
          <input type="url" name="officialLink" value={form.officialLink} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Leadership Program'}
        </button>
      </form>
    </div>
        </>

      ): (

        <>
<p>loging first </p>

        </>
      )}
     
    
     </>
  );
};

export default Add_leadership;