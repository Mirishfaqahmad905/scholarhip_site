import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api_url from "../constant/constant";

const categories = ["summer_programe", "famouse_scholarship", "compition", "Undergraduate", "Master", "PhD", "highschool", "exchangeprograme"];
const regions = [
  "south america",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Australia",
  "Middle East",
  "Oceania",
  "Global",
  "american"
];
const Add_schoarship = ({ onSubmit }) => {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    id:"",
    name: "",
    image: "",
    description: "",
    category: [],
    benefits: "",
    eligibilityCriteria: "",
    amount: "",
    deadline: "",
    region: "",
    country: "",
    officialLink: "",
    document: "",
    hostUniversity:"",
    howToApply:""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "category") {
      setForm((prev) => ({
        ...prev,
        category: checked
          ? [...prev.category, value]
          : prev.category.filter((cat) => cat !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validate all fields
    // "http://localhost:5000/api/save/scholarshipdata"
    const data = { ...form, amount: Number(form.amount) };
    try {
      const res = await axios.post(
        `${Api_url.BACKEND_URI}/api/save/scholarshipdata`,
        data
      );
      setSuccess("Scholarship data saved successfully!");
      setForm({
         id: "",
        name: "",
        image: "",
        description: "",
        category: [],
        benefits: "",
        eligibilityCriteria: "",
        amount: "",
        deadline: "",
        region: "",
        country: "",
        officialLink: "",
        document: "",
        hostUniversity: "",
        howToApply: "",
      });
      if (onSubmit) onSubmit(data);
      console.log("Scholarship data saved successfully:", res.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error saving scholarship data. Please check all fields."
      );
      console.error("Error saving scholarship data:", error);
    }
  };
  return (

 <>

   <button className="bg  bg-slate-600 p-4 " onClick={() => navigate(-1)}> go back</button>
    <form
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Add Scholarship</h2>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-2 rounded">
          {success}
        </div>
      )}
       <div>
        <label className="block font-medium mb-1">Id (Should be string )</label>
        <input
          type="text"
          name="id"
          value={form.id}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Image URL</label>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <span className="block font-medium mb-1">Category</span>
        <div className="flex gap-4 flex-wrap">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="category"
                value={cat}
                checked={form.category.includes(cat)}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-medium mb-1">Benefits</label>
        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Eligibility Criteria</label>
        <textarea
          name="eligibilityCriteria"
          value={form.eligibilityCriteria}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Region</label>
        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Country</label>
        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Official Link</label>
        <input
          type="url"
          name="officialLink"
          value={form.officialLink}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Document Requirments  (optional)</label>
        <input
          type="text"
          name="document"
          value={form.document}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Host University (optional)</label>
        <input
          type="text"
          name="hostUniversity"
          value={form.hostUniversity}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        </div>
      <div>
        <label className="block font-medium mb-1">How to Apply (optional)</label>
        <textarea
          name="howToApply"
          value={form.howToApply}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

   
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
      >
        Submit
      </button>
        <p>{success}</p>
    </form>
    </>
  );
};
export default Add_schoarship;