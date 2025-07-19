import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api_url from '../constant/constant';

const Add_bloge = () => {
  const [step, setStep] = useState(1);
  const [blogMeta, setBlogMeta] = useState({ title: '', author: '', category: '' });
  const [fields, setFields] = useState([]);
 const  navigate=useNavigate();
  const addField = (type) => {
     
    const newField = {
      id: Date.now(),
      type,
      value: type === 'image' ? null : ''
    };
    setFields([...fields, newField]);
  };

  const updateFieldValue = (id, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, value } : f));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleMetaChange = (e) => {
    setBlogMeta({ ...blogMeta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', blogMeta.title);
      formData.append('author', blogMeta.author);
      formData.append('category', blogMeta.category);

      const contentForJSON = [];

      fields.forEach(field => {
        if (field.type === 'image' && field.value) {
          formData.append('images', field.value);
          contentForJSON.push({ type: field.type, value: '' });
        } else {
          contentForJSON.push({ type: field.type, value: field.value });
        }
      });

      formData.append('content', JSON.stringify(contentForJSON));
// http://localhost:5000/api/add/blog
      const response = await axios.post(${Api_url.BACKEND_URI}/api/add/blog, formData);
      if (response.status === 201) {
        alert('✅ Blog submitted successfully!');
        setStep(1);
        setBlogMeta({ title: '', author: '', category: '' });
        setFields([]);
      }
    } catch (error) {
      console.error('❌ Error submitting blog:', error);
      alert('Submission failed. Check console for details.');
    }
  };
 
  return (
     <>
     
      
      <button onClick={()=>navigate(-1)} className='bg bg-red-400 p-3 text-white font-bold' >Back</button>
    
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Blog</h1>

      <div className="flex gap-4 justify-center mb-8">
        {['Blog Info', 'Blog Content', 'Preview'].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i + 1)}
            className={px-4 py-2 rounded ${step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={blogMeta.title}
            onChange={handleMetaChange}
            placeholder="Blog Title"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="author"
            value={blogMeta.author}
            onChange={handleMetaChange}
            placeholder="Author Name"
            className="w-full border p-2 rounded"
          />
          <select
            name="category"
            value={blogMeta.category}
            onChange={handleMetaChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Internship">Internship</option>
            <option value="Leadership">Leadership</option>
            <option value="Announcement">Announcement</option>
          </select>
          <button onClick={() => setStep(2)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Next</button>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => addField('heading')} className="bg-blue-500 text-white px-3 py-1 rounded">+ Heading</button>
            <button onClick={() => addField('text')} className="bg-green-500 text-white px-3 py-1 rounded">+ Text</button>
            <button onClick={() => addField('textarea')} className="bg-yellow-500 text-white px-3 py-1 rounded">+ Description</button>
            <button onClick={() => addField('image')} className="bg-purple-500 text-white px-3 py-1 rounded">+ Image</button>
            <button onClick={() => addField('quote')} className="bg-pink-500 text-white px-3 py-1 rounded">+ Quote</button>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="relative border p-3 rounded">
                <button onClick={() => removeField(field.id)} className="absolute top-1 right-1 text-red-600 font-bold">×</button>
                {field.type === 'heading' && (
                  <input type="text" value={field.value} onChange={(e) => updateFieldValue(field.id, e.target.value)} placeholder="Heading" className="w-full border px-3 py-2 font-bold text-lg" />
                )}
                {field.type === 'text' && (
                  <input type="text" value={field.value} onChange={(e) => updateFieldValue(field.id, e.target.value)} placeholder="Text" className="w-full border px-3 py-2" />
                )}
                {field.type === 'textarea' && (
                  <textarea value={field.value} onChange={(e) => updateFieldValue(field.id, e.target.value)} placeholder="Description" rows="4" className="w-full border px-3 py-2" />
                )}
                {field.type === 'quote' && (
                  <blockquote className="pl-4 border-l-4 italic text-gray-600">
                    <textarea value={field.value} onChange={(e) => updateFieldValue(field.id, e.target.value)} placeholder="Quote..." className="w-full bg-transparent focus:outline-none" />
                  </blockquote>
                )}
                {field.type === 'image' && (
                  <input type="file" accept="image/*" onChange={(e) => updateFieldValue(field.id, e.target.files[0])} className="w-full" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="bg-gray-400 text-white px-6 py-2 rounded">Back</button>
            <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded">Preview</button>
          </div>
        </>
      )}

      {step === 3 && (
        <div className="border p-6 rounded shadow bg-gray-50">
          <h2 className="text-2xl font-bold mb-2">{blogMeta.title}</h2>
          <p className="text-sm text-gray-600 mb-4">by {blogMeta.author || 'Anonymous'} | Category: {blogMeta.category}</p>
          <div className="space-y-4">
            {fields.map((field) => {
              if (field.type === 'heading') return <h3 key={field.id} className="text-xl font-semibold">{field.value}</h3>;
              if (field.type === 'text') return <p key={field.id}>{field.value}</p>;
              if (field.type === 'textarea') return <p key={field.id} className="text-gray-700">{field.value}</p>;
              if (field.type === 'quote') return <blockquote key={field.id} className="border-l-4 pl-4 italic text-gray-500">{field.value}</blockquote>;
              if (field.type === 'image') return field.value ? <img key={field.id} src={URL.createObjectURL(field.value)} alt="Uploaded" className="w-full max-h-96 object-cover rounded" /> : null;
              return null;
            })}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="bg-gray-400 text-white px-6 py-2 rounded">Edit</button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">Submit Blog</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Add_bloge;
