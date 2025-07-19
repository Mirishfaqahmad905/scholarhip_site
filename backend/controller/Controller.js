const {scholarshipModel,admin,internshipmodel,leaderhip_programs,contactform,subscriber_notification,Blog} = require('../models/model.js');
 const bcrypt=require('bcryptjs');
 const path=require('path');;
 const fs=require('fs');
 const multer=require('multer');;
 require('dotenv').config();
const nodemailer=require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'techhub905@gmail.com',
    pass: 'tdiyfaryeujmijpe', // ✅ Correct key name is `pass`
  }
});
// blog controoler


const saveBlog = async (req, res) => {
  try {
    const { title, author, category, content } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required.' });
    }

    // Parse content array
    let contentBlocks = JSON.parse(content);

    if (req.files && req.files.length > 0) {
      let imgIndex = 0;
      contentBlocks = contentBlocks.map((block) => {
        if (block.type === 'image' && req.files[imgIndex]) {
          block.value = req.files[imgIndex].path.replace(/\\/g, '/');
          imgIndex++;
        }
        return block;
      });
    }

    const blog = new Blog({
      title,
      author: author || 'Anonymous',
      category,
      content: contentBlocks
    });

    const saved = await blog.save();
    res.status(201).json({ message: '✅ Blog saved successfully', data: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Blog submission failed' });
  }
};


// const saveBlog = async (req, res) => {
//   try {
//     const { title, author, category, content } = req.body;

//     if (!title || !category || !content) {
//       return res.status(400).json({ error: 'Title, category, and content are required.' });
//     }

//     // Parse content array
//     let contentBlocks = JSON.parse(content);
//     let imageUrl = '';

//     if (req.files && req.files.length > 0) {
//       let imgIndex = 0;
//       contentBlocks = contentBlocks.map((block) => {
//         if (block.type === 'image' && req.files[imgIndex]) {
//           const imgPath = req.files[imgIndex].path.replace(/\\/g, '/');
//           block.value = imgPath;

//           // 👇 Save the first image as main image_url
//           if (!imageUrl) {
//             imageUrl = imgPath;
//           }

//           imgIndex++;
//         }
//         return block;
//       });
//     }

//     const blog = new Blog({
//       title,
//       author: author || 'Anonymous',
//       category,
//       content: contentBlocks,
//       image_url: imageUrl, // ✅ Save the first image as main
//     });

//     const saved = await blog.save();
//     res.status(201).json({ message: '✅ Blog saved successfully', data: saved });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: '❌ Blog submission failed' });
//   }
// };

// fetching bloge data from c databse controller
 const bloge_data_fetch= async (req, res) => {
  
try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Failed to fetch blogs.' });
  }
 } 
  // controller for delete the scholarship data
   const deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await scholarshipModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.status(200).json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({ message: 'Server error while deleting scholarship' });
  }
};



//
const subscriber_controller= async (req,res)=>{
   const {email}=req.body;
    console.log("subscriber controller called");
    try {
      const existingSubscriber=await subscriber_notification.findOne({email});
      if(existingSubscriber) {
        return res.status(400).json({message:"You are already subscribed"});
      }
      const newSubscriber=new subscriber_notification({email});;
      await newSubscriber.save();
      res.status(201).json({message:"Subscribed successfully"});
      
    } catch (error) {
      console.log("error occurred " + error);
    }
 
}
// delete message
const deleleMessage = async (req,res)=>{
   const {id} =req.params;
    try{
const deleteMessages= await contactform.findByIdAndDelete(id);
if(deleteMessages){
   res.status(200).send({message:"successfully deleted"})
}
    }
     catch(err){
       console.log("error accured");
     }
}
 //geting all contact data
 const gettting_contact_data = async (req,res)=>{   
   try {
     const constactData= await contactform.find();
     if (!constactData || constactData.length === 0) {
       return res.status(404).json({ message: "No contact data found" });
     }
      else 
         {
          res.status(200).json(constactData);

         }
   } catch (error) {
     console.log("error occurred " + error);
   }

  };

   // contact controller are calling here 
 const contact_controller= async (req,res)=>
{
 
  console.log("contact controller called");
   try {
     const { name, email, website, message } = req.body;
     const newContact = new contactform({ name, email, website, message });
     await newContact.save();
     res.status(201).json({ message: "Contact form submitted successfully" });  
   } catch (error) {
     console.log("error occurred " + error);
   }
}
  const saveInternshipData = async (req, res) => {
  console.log("save internship data ");
  try {
    const {
      internship_id,
      custome_message,
      name,
      image,
      description,
      hosted_country,
      document,
      eligabality_criteria,
      officialLink,
      duration,
      benifits,
      application_process,
      deadline
    } = req.body;

    if (!internship_id || !image || !description || !hosted_country) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const internship = new internshipmodel({
      internship_id,
      custome_message,
      name,
      image,
      description,
      hosted_country,
      document,
      eligabality_criteria,
      officialLink,
      duration,
      benifits,
      application_process,
      deadline
    });
    await internship.save();
    return res.status(201).json({ message: "internship saved successfully" });

  } catch (error) {
    console.log("error occurred " + error);
    res.status(500).json({ message: "Server error" });
  }
};
const get_internship = async (req,res)=>{
   try {
      const data = await internshipmodel.find()
       return res.status(200).json({message:data});
   } catch (error) {
     console.log("error accured");
   }
}



const saveScholarshipData = async (req, res) => {
  try {
    const {
      id,
      name,
      image,
      description,
      category,
      benefits,
      eligibilityCriteria,
      amount,
      deadline,
      region,
      country,
      officialLink,
      document,
      hostUniversity,
      howToApply
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !image ||
      !description ||
      !category ||
      !category.length ||
      !benefits ||
      !eligibilityCriteria ||
      !deadline ||
      !region ||
      !country ||
      !officialLink
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const scholarship = new scholarshipModel({
      id,
      name,
      image,
      description,
      category,
      benefits,
      eligibilityCriteria,
      amount,
      deadline: new Date(deadline),
      region,
      country,
      officialLink,
      document: document || "",
      hostUniversity: hostUniversity || "",
      howToApply: howToApply || ""
    });
    await scholarship.save();
// to send notification to all subscribers
    console.log("Scholarship saved successfully, sending notifications...");
  const subscribers = await subscriber_notification.find({});
    const emails = subscribers.map(sub => sub.email);

    if (emails.length > 0) {
      const mailOptions = {
        from: process.env.GMAIL,
        to: emails,
        subject: "🎓 New Scholarship Uploaded!",
        html: `
          <h2>${name}</h2>
          <p>${description}</p>
          <p><strong>Category:</strong> ${category.join(', ')}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <a href="${officialLink}" style="color:blue;">Apply Now</a>
          <hr />
          <p style="font-size:12px;">You're receiving this email because you subscribed to our scholarship updates.</p>
        `
      };

      // Send Notification Email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending emails:", err);
        } else {
          console.log("Emails sent to:", emails);
        }
      });
    }



    res.status(201).json({ message: "Scholarship saved successfully!" });
  } catch (error) {
    console.error("Error saving scholarship:", error);
    res.status(500).json({ message: "Error saving scholarship", error: error.message });
  }
};
const adminController = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }
    // Find admin by username
    const adminUser = await admin.findOne({ username: username });
    if (!adminUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // If matched
    return res.status(200).send({ message: "login successfully" });
  } catch (error) {
    console.log("error occurred " + error);
    res.status(500).json({ message: "Server error" });
  }
};
 const getScholarshipData= async(req,res)=>{
   console.log("getScholarshipData called");
   try {
     const scholarshipData= await scholarshipModel.find(  );
     if (!scholarshipData || scholarshipData.length === 0) {
       return res.status(404).json({ message: "No scholarship data found" });
     }
      res.status(200).json(scholarshipData);
   } catch (error) {
     console.log("error occurred " + error);
     res.status(500).json({ message: "Server error" });  
   }    
 }

const add_leader_data = async (req, res) => {
  const {
    id,
    programTitle,
    image,
    hostCountry,
    hostOrganization,
    programLocation,
    duration,
    benefits,
    eligibility,
    howToApply,
    documentsRequired,
    deadline,
    description,
    officialLink,
  } = req.body;

  try {
    // Check all required fields
    if (
       !id ||
      !programTitle ||
      !image ||
      !hostCountry ||
      !hostOrganization ||
      !programLocation ||
      !duration ||
      !benefits ||
      !eligibility ||
      !howToApply ||
      !documentsRequired ||
      !deadline ||
      !description
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date" });
    }

    const leadershipProgram = new leaderhip_programs({
      id,
      programTitle,
      image,
      hostCountry,
      hostOrganization,
      programLocation,
      duration,
      benefits,
      eligibility,
      howToApply,
      documentsRequired,
      deadline: deadlineDate,
      description,
      officialLink,
    });

    await leadershipProgram.save();
    res.status(201).json({ message: "Leadership program added successfully!" });
  } catch (error) {
    console.error("Error adding leadership program:", error);
    res.status(500).json({ message: "Error adding leadership program", error: error.message });
  }
};
const get_leadership_data = async (req, res) => {
  console.log("controller function called");
  try {
    const routing_data = await leaderhip_programs.find();
    if (!routing_data || routing_data.length === 0) {
      return res.status(404).json({ message: "No leadership programs found" });
    }
    // Send the data as a response
    return res.status(200).json(routing_data);
  } catch (error) {
    console.log("error occurred " + error);
    res.status(500).json({ message: "Server error" });
  
  }
}; 
// delte bloge
 const Delete_bloge_ = async (req,res)=>{
    const {id}=req.params;
     try {
      const delete_bloge= await Blog.findByIdAndDelete(id);
      if(delete_bloge){
        res.status(200).json({message:"Bloge deleted successfully"});
      } else {
        res.status(404).json({message:"Bloge not found"});
      }
     } catch (error) {
       console.log("error accured in delete bloge controller",error);
       res.status(500).json({message:"Internal Server Error"});
     }

 }
module.exports = {
  // Admin & Scholarship
  adminController,
  saveScholarshipData,
  getScholarshipData,

  // Internship
  saveInternshipData,
  get_internship,

  // Leadership
  add_leader_data,
  get_leadership_data,

  // Contact
  contact_controller,
  gettting_contact_data,

  // Subscribers
  subscriber_controller,
  deleleMessage,
  saveBlog,
  bloge_data_fetch,
  deleteScholarship,
  Delete_bloge_
}
 
