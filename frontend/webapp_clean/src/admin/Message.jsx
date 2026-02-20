import React, { useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Api_url from '../constant/constant';
const Message = () => {
  const [data, setData] = useState([]);
const navigate=useNavigate();
 const  messages= useSelector((state)=>state.admin.isAdminLoggedIn);
const getData = async () => {
   
    try {
      const response = await fetch('http://localhost:5000/api/getMessage');
      const result = await response.json();
      setData(result);
      console.log("Data fetched successfully:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteMessage = async (id) => {
    // `http://localhost:5000/api/deleleMessage
    try {
      const response = await fetch(`${Api_url.BACKEND_URI}/api/deleleMessage/${id}`, {
        method: 'DELETE',
      });
      if (response.status===200) {
        setData(data.filter(item => item._id !== id));
        console.log('Deleted successfully');
      } else {
        console.error('Failed to delete');
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
     <>
     {
      messages  ? 
      
      (<>
       <button onClick={() => navigate(-1)} className='bg bg-black text text-white p-4 '> back</button>
    <div className="p-6">
      <h2 className="text-white text-2xl font-bold mb-4">Messages</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th className="text-white px-4 py-2">Name</th>
              <th className="text-white px-4 py-2">Email</th>
              <th className="text-white px-4 py-2">Website</th>
              <th className="text-white px-4 py-2">Message</th>
              <th className="text-white px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="text-black px-4 py-2">{item.name}</td>
                  <td className="text-black px-4 py-2">{item.email}</td>
                <Link>     <td className="text-black px-4 py-2">{item.website}</td></Link>
                  <td className="text-black px-4 py-2">{item.message}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteMessage(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-white text-center py-4" colSpan="5">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
      
      </>): 
      
      (<>
        <p>Please log in first. to manage user messages</p>
      </>)
      
     }
   
    </>
  );
};

export default Message;
