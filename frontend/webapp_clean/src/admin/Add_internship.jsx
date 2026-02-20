import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api_url from '../constant/constant';

const initialState = {
  internship_id: '',
  custome_message: '',
  name: '',
  image: '',
  description: '',
  hosted_country: '',
  document: '',
  eligabality_criteria: '',
  officialLink: '',
  duration: '',
  benifits: '',
  application_process: '',
  deadline: '',
};

const Add_internship = () => {
  const navigate=useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const showPage = useSelector((state) => state.admin.isAdminLoggedIn);
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
      await axios.post(`${Api_url.BACKEND_URI}/api/admin/saveInternship`, form);
      setSuccess('Internship added successfully!');
      navigate('/admin/admin_dashboard'); // Redirect to admin dashboard
      setForm(initialState);
    } catch (err) {
      setError('Error occurred: ' + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  return (
    <>


      {showPage ? (<>

           <button className='bg bg-slate-800 p-4 text text-white' onClick={()=>navigate(-1)}>Back</button>

        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">Add Internship</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Internship ID</label>
              <input type="text" name="internship_id" value={form.internship_id} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Custom Message</label>
              <input type="text" name="custome_message" value={form.custome_message} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Internship Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <input type="text" name="image" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Hosted Country</label>
              <input type="text" name="hosted_country" value={form.hosted_country} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Document (URL or description)</label>
              <input type="text" name="document" value={form.document} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Eligibility Criteria</label>
              <textarea name="eligabality_criteria" value={form.eligabality_criteria} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Official Link</label>
              <input type="text" name="officialLink" value={form.officialLink} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Duration</label>
              <input type="text" name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Benefits</label>
              <textarea name="benifits" value={form.benifits} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Application Process</label>
              <textarea name="application_process" value={form.application_process} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1">Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Internship'}
            </button>
          </form>
        </div>



      </>) :

        (<>


        </>
        )
      }


    </>
  );
};

export default Add_internship;