const { scholarshipModel, admin, internshipmodel, leaderhip_programs, contactform, subscriber_notification, Blog, SiteSetting, User } = require('../models/model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config/appConfig');
const { isBinaryImage, extractBinaryImage, normalizeImageFromRequest, resolveImageUrl, resolveMediaValueUrl, processImageBuffer } = require('../utils/imageUtils');

const mailUser = config.mail.user;
const mailPass = config.mail.pass;
const canSendEmail = Boolean(mailUser && mailPass);

const transporter = canSendEmail
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    })
  : null;

const signUserToken = (user) =>
  jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
      fullName: user.fullName,
    },
    config.jwtSecret,
    { expiresIn: '14d' }
  );

const sanitizeUser = (user) => ({
  id: String(user._id),
  fullName: user.fullName,
  email: user.email,
  notifyOnNewOpportunity: Boolean(user.notifyOnNewOpportunity),
  lastLoginAt: user.lastLoginAt || null,
});

const sendMailIfEnabled = async (mailOptions) => {
  if (!canSendEmail || !transporter) return false;
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Mail delivery failed:', error.message);
    return false;
  }
};

const serializeScholarship = (req, item) => {
  const obj = item.toObject ? item.toObject() : item;
  const resolvedImage = resolveImageUrl(req, 'scholarship', obj);
  return {
    ...obj,
    image: resolvedImage,
    imageUrl: resolvedImage,
  };
};

const serializeInternship = (req, item) => {
  const obj = item.toObject ? item.toObject() : item;
  const resolvedImage = resolveImageUrl(req, 'internship', obj);
  return {
    ...obj,
    image: resolvedImage,
    imageUrl: resolvedImage,
  };
};

const serializeLeadership = (req, item) => {
  const obj = item.toObject ? item.toObject() : item;
  const resolvedImage = resolveImageUrl(req, 'leadership', obj);
  return {
    ...obj,
    image: resolvedImage,
    imageUrl: resolvedImage,
  };
};

const getYouTubeVideoId = (url = '') => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim();
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v') || '';
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('/')[0] || '';
      }
    }
    return '';
  } catch (error) {
    return '';
  }
};

const normalizeYoutubeVideos = (videos) => {
  if (!Array.isArray(videos)) return [];
  return videos
    .map((item) => ({
      title: String(item?.title || '').trim(),
      url: String(item?.url || '').trim(),
      description: String(item?.description || '').trim(),
    }))
    .filter((item) => item.url);
};

const getSiteConfig = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'main' }).select('updatedAt logo.contentType socialLinks');
    const hasLogo = Boolean(setting?.logo?.contentType);
    const version = setting?.updatedAt ? new Date(setting.updatedAt).getTime() : Date.now();
    const host = req.get('host') || '';
    const isLocalRequest = /localhost|127\.0\.0\.1/i.test(host);
    const baseUrl = config.backendPublicUrl && !isLocalRequest
      ? config.backendPublicUrl.replace(/\/+$/, '')
      : `${req.protocol}://${host}`;
    return res.status(200).json({
      hasLogo,
      logoUrl: hasLogo ? `${baseUrl}/api/site/logo?v=${version}` : '/logo_.jpg',
      socialLinks: setting?.socialLinks || {},
    });
  } catch (error) {
    return res.status(200).json({
      hasLogo: false,
      logoUrl: '/logo_.jpg',
      socialLinks: {},
    });
  }
};

const uploadSiteLogo = async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Logo file is required' });
    }
    const processed = await processImageBuffer(req.file.buffer, req.file.mimetype);

    await SiteSetting.findOneAndUpdate(
      { key: 'main' },
      {
        key: 'main',
        logo: {
          data: processed.data,
          contentType: processed.contentType || req.file.mimetype,
          fileName: `${(req.file.originalname || 'logo').replace(/\.[^/.]+$/, '')}.webp`,
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Logo updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update logo' });
  }
};

const getSiteLogo = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'main' }).select('logo');
    const binary = extractBinaryImage(setting?.logo);
    if (!binary) {
      return res.status(404).json({ message: 'Logo not found' });
    }
    res.set('Content-Type', binary.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(binary.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load logo' });
  }
};

const updateSiteSocialLinks = async (req, res) => {
  try {
    const payload = req.body || {};
    const socialLinks = {
      whatsapp: String(payload.whatsapp || '').trim(),
      instagram: String(payload.instagram || '').trim(),
      youtube: String(payload.youtube || '').trim(),
      facebook: String(payload.facebook || '').trim(),
      telegram: String(payload.telegram || '').trim(),
      linkedin: String(payload.linkedin || '').trim(),
      x: String(payload.x || '').trim(),
    };

    await SiteSetting.findOneAndUpdate(
      { key: 'main' },
      { key: 'main', socialLinks },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Social links updated successfully', socialLinks });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update social links' });
  }
};

const getSiteVideos = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: 'main' }).select('youtubeVideos');
    const videos = (setting?.youtubeVideos || [])
      .map((video) => {
        const videoId = getYouTubeVideoId(video.url);
        if (!videoId) return null;
        return {
          title: video.title || 'YouTube Video',
          description: video.description || '',
          url: video.url,
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        };
      })
      .filter(Boolean);
    return res.status(200).json({ videos });
  } catch (error) {
    return res.status(200).json({ videos: [] });
  }
};

const updateSiteVideos = async (req, res) => {
  try {
    const incoming = req.body?.videos;
    const videos = normalizeYoutubeVideos(incoming);
    await SiteSetting.findOneAndUpdate(
      { key: 'main' },
      { key: 'main', youtubeVideos: videos },
      { upsert: true, new: true }
    );
    return res.status(200).json({ message: 'YouTube videos updated successfully', videos });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update site videos' });
  }
};

const registerUser = async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const notifyOnNewOpportunity = req.body?.notifyOnNewOpportunity !== false;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName || !emailPattern.test(email) || password.length < 6) {
      return res.status(400).json({ message: 'Full name, valid email, and password (min 6 chars) are required' });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await User.create({
      fullName,
      email,
      passwordHash,
      notifyOnNewOpportunity,
    });

    const token = signUserToken(created);
    await sendMailIfEnabled({
      from: mailUser,
      to: email,
      subject: 'Welcome to Scholarship For Studneet',
      html: `
        <h2>Welcome, ${fullName}</h2>
        <p>Your account has been created successfully.</p>
        <p>You will receive updates when new opportunities are published.</p>
      `,
    });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizeUser(created),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed' });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signUserToken(user);
    await sendMailIfEnabled({
      from: mailUser,
      to: user.email,
      subject: 'Login Alert',
      html: `
        <h2>Hello ${user.fullName}</h2>
        <p>Your account logged in at ${new Date().toLocaleString()}.</p>
        <p>If this was not you, reset your password immediately.</p>
      `,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.sub;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch current user' });
  }
};

const logoutUser = async (req, res) => res.status(200).json({ message: 'Logout successful' });

// blog controoler


// const saveBlog = async (req, res) => {
//   try {
//     const { title, author, category, content } = req.body;

//     if (!title || !category || !content) {
//       return res.status(400).json({ error: 'Title, category, and content are required.' });
//     }

//     // Parse content array
//     let contentBlocks = JSON.parse(content);

//     if (req.files && req.files.length > 0) {
//       let imgIndex = 0;
//       contentBlocks = contentBlocks.map((block) => {
//         if (block.type === 'image' && req.files[imgIndex]) {
//           block.value = req.files[imgIndex].path.replace(/\\/g, '/');
//           imgIndex++;
//         }
//         return block;
//       });
//     }

//     const blog = new Blog({
//       title,
//       author: author || 'Anonymous',
//       category,
//       content: contentBlocks
//     });

//     const saved = await blog.save();
//     res.status(201).json({ message: '✅ Blog saved successfully', data: saved });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: '❌ Blog submission failed' });
//   }
// };



const saveBlog = async (req, res) => {
  try {
    const { title, author, category, content, image_urls } = req.body;

    // Validate required fields
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required.' });
    }

    // Parse content blocks (from JSON string to JS array)
    let contentBlocks = JSON.parse(content);

    // Replace image-type block values with file paths (if files are uploaded)
    if (req.files && req.files.length > 0) {
      let imgIndex = 0;
      contentBlocks = contentBlocks.map((block) => {
        if (block.type === 'image' && req.files[imgIndex]) {
          block.value = `/uploads/blog_images/${req.files[imgIndex].filename}`;
          imgIndex++;
        }
        return block;
      });
    }

    // Parse and validate image URLs from frontend (optional)
    let imageUrlsArray = [];
    if (image_urls) {
      try {
        const parsed = JSON.parse(image_urls); // image_urls must be a JSON array string
        if (Array.isArray(parsed)) {
          imageUrlsArray = parsed.filter(url => typeof url === 'string' && url.trim() !== '');
        }
      } catch (e) {
        return res.status(400).json({ error: 'Invalid format for image_urls. Must be a JSON array of strings.' });
      }
    }

    // Create new blog
    const blog = new Blog({
      title,
      author: author || 'Anonymous',
      category,
      content: contentBlocks,
      image_urls: imageUrlsArray
    });

    const saved = await blog.save();
    res.status(201).json({ message: '✅ Blog saved successfully', data: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Blog submission failed' });
  }
};

// fetching bloge data from c databse controller
 const bloge_data_fetch= async (req, res) => {
  
try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // newest first
    const normalized = blogs.map((blogDoc) => {
      const blog = blogDoc.toObject ? blogDoc.toObject() : blogDoc;
      const content = Array.isArray(blog.content)
        ? blog.content.map((block) =>
            block?.type === 'image' && block?.value
              ? { ...block, value: resolveMediaValueUrl(req, block.value) || block.value }
              : block
          )
        : [];
      const image_urls = Array.isArray(blog.image_urls)
        ? blog.image_urls.map((value) => resolveMediaValueUrl(req, value) || value)
        : [];

      return {
        ...blog,
        content,
        image_urls,
      };
    });
    res.status(200).json(normalized);
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
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!normalizedEmail || !emailPattern.test(normalizedEmail)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      const existingSubscriber=await subscriber_notification.findOne({email: normalizedEmail});
      if(existingSubscriber) {
        return res.status(200).json({message:"You are already subscribed"});
      }
      const newSubscriber=new subscriber_notification({email: normalizedEmail});;
      await newSubscriber.save();
      res.status(201).json({message:"Subscribed successfully"});
      
    } catch (error) {
      console.log("error occurred " + error);
      return res.status(500).json({ message: "Server error while subscribing" });
    }
 
}
// delete message
const deleleMessage = async (req,res)=>{
   const {id} =req.params;
    try{
const deleteMessages= await contactform.findByIdAndDelete(id);
if(deleteMessages){
   return res.status(200).send({message:"successfully deleted"})
}
      return res.status(404).json({ message: "Message not found" });
    }
     catch(err){
       console.log("error accured");
       return res.status(500).json({ message: "Server error while deleting message" });
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
     return res.status(500).json({ message: "Server error while fetching contacts" });
   }

  };

   // contact controller are calling here 
 const contact_controller= async (req,res)=>
{
 
  console.log("contact controller called");
   try {
     const { name, email, website, message } = req.body;
     if (!name || !email || !message) {
       return res.status(400).json({ message: "name, email and message are required" });
     }
     const newContact = new contactform({ name, email, website, message });
     await newContact.save();
     res.status(201).json({ message: "Contact form submitted successfully" });  
   } catch (error) {
     console.log("error occurred " + error);
     return res.status(500).json({ message: "Server error while saving contact form" });
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
    const imageValue = await normalizeImageFromRequest(req, image);

    if (!internship_id || !imageValue || !description || !hosted_country) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const internship = new internshipmodel({
      internship_id,
      custome_message,
      name,
      image: imageValue,
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

    // Send notifications to registered users
    const users = await User.find({ notifyOnNewOpportunity: true });
    const userEmails = users.map(user => user.email);

    if (userEmails.length > 0 && canSendEmail && transporter) {
      const userMailOptions = {
        from: mailUser,
        to: userEmails,
        subject: "💼 New Internship Opportunity Added!",
        html: `
          <h2>${name}</h2>
          <p>${description}</p>
          <p><strong>Host Country:</strong> ${hosted_country}</p>
          <p><strong>Duration:</strong> ${duration}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <a href="${officialLink}" style="color:blue;">Apply Now</a>
          <hr />
          <p style="font-size:12px;">You're receiving this email because you registered for notifications on new opportunities.</p>
        `
      };

      try {
        await transporter.sendMail(userMailOptions);
        console.log("User notification emails sent to:", userEmails.length, "users");
      } catch (mailError) {
        console.error("Error sending user emails:", mailError);
      }
    }

    return res.status(201).json({ message: "internship saved successfully" });

  } catch (error) {
    console.log("error occurred " + error);
    res.status(500).json({ message: "Server error" });
  }
};
const get_internship = async (req,res)=>{
   try {
      const data = await internshipmodel.find().lean();
      const normalized = data.map((item) => serializeInternship(req, item));
       return res.status(200).json({message: normalized});
   } catch (error) {
     console.log("error accured");
     return res.status(200).json({ message: [] });
   }
}



const saveScholarshipData = async (req, res) => {
  try {
    const normalizeToArray = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string' && value.trim()) {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    };

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
      requiredDocuments,
      hostUniversity,
      howToApply
    } = req.body;
    const categoryArray = normalizeToArray(category);
    const regionArray = normalizeToArray(region);
    const imageValue = await normalizeImageFromRequest(req, image);
    const requiredDocsValue = String(requiredDocuments || document || '').trim();
    const isRussianScholarship =
      regionArray.some((value) => /russia|russian/i.test(String(value))) ||
      /russia|russian/i.test(String(country || ''));

    // Validate required fields
    if (
      !name ||
      !imageValue ||
      !description ||
      !categoryArray.length ||
      !benefits ||
      !eligibilityCriteria ||
      !deadline ||
      !regionArray.length ||
      !country ||
      !officialLink
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isRussianScholarship && !requiredDocsValue) {
      return res.status(400).json({ message: "Required documents are mandatory for Russian scholarships." });
    }
    const scholarship = new scholarshipModel({
      id,
      name,
      image: imageValue,
      description,
      category: categoryArray,
      benefits,
      eligibilityCriteria,
      amount,
      deadline: new Date(deadline),
      region: regionArray,
      country,
      officialLink,
      document: requiredDocsValue,
      requiredDocuments: requiredDocsValue,
      hostUniversity: hostUniversity || "",
      howToApply: howToApply || ""
    });
    await scholarship.save();
// to send notification to all subscribers
    console.log("Scholarship saved successfully, sending notifications...");
  const subscribers = await subscriber_notification.find({});
    const emails = subscribers.map(sub => sub.email);

    if (emails.length > 0 && canSendEmail && transporter) {
      const mailOptions = {
        from: mailUser,
        to: emails,
        subject: "🎓 New Scholarship Uploaded!",
        html: `
          <h2>${name}</h2>
          <p>${description}</p>
          <p><strong>Category:</strong> ${categoryArray.join(', ')}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <a href="${officialLink}" style="color:blue;">Apply Now</a>
          <hr />
          <p style="font-size:12px;">You're receiving this email because you subscribed to our scholarship updates.</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Emails sent to:", emails);
      } catch (mailError) {
        console.error("Error sending emails:", mailError);
      }
    } else if (!canSendEmail) {
      console.warn("Skipping email notifications: GMAIL or APP_PASSWORD is missing.");
    }

    // Send notifications to registered users
    const users = await User.find({ notifyOnNewOpportunity: true });
    const userEmails = users.map(user => user.email);

    if (userEmails.length > 0 && canSendEmail && transporter) {
      const userMailOptions = {
        from: mailUser,
        to: userEmails,
        subject: "🎓 New Scholarship Opportunity Added!",
        html: `
          <h2>${name}</h2>
          <p>${description}</p>
          <p><strong>Category:</strong> ${categoryArray.join(', ')}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <a href="${officialLink}" style="color:blue;">Apply Now</a>
          <hr />
          <p style="font-size:12px;">You're receiving this email because you registered for notifications on new opportunities.</p>
        `
      };

      try {
        await transporter.sendMail(userMailOptions);
        console.log("User notification emails sent to:", userEmails.length, "users");
      } catch (mailError) {
        console.error("Error sending user emails:", mailError);
      }
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
     const scholarshipData= await scholarshipModel.find().select('-__v').lean();
      const normalized = scholarshipData.map((item) => serializeScholarship(req, item));
      res.status(200).json(normalized);
   } catch (error) {
     console.log("error occurred " + error);
     res.status(200).json([]);
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
  const resolvedImageValue = await normalizeImageFromRequest(req, image);

  try {
    // Check all required fields
    if (
       !id ||
      !programTitle ||
      !resolvedImageValue ||
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
      image: resolvedImageValue,
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

    // Send notifications to registered users
    const users = await User.find({ notifyOnNewOpportunity: true });
    const userEmails = users.map(user => user.email);

    if (userEmails.length > 0 && canSendEmail && transporter) {
      const userMailOptions = {
        from: mailUser,
        to: userEmails,
        subject: "🌟 New Leadership Program Added!",
        html: `
          <h2>${programTitle}</h2>
          <p>${description}</p>
          <p><strong>Host Country:</strong> ${hostCountry}</p>
          <p><strong>Duration:</strong> ${duration}</p>
          <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
          <a href="${officialLink}" style="color:blue;">Apply Now</a>
          <hr />
          <p style="font-size:12px;">You're receiving this email because you registered for notifications on new opportunities.</p>
        `
      };

      try {
        await transporter.sendMail(userMailOptions);
        console.log("User notification emails sent to:", userEmails.length, "users");
      } catch (mailError) {
        console.error("Error sending user emails:", mailError);
      }
    }

    res.status(201).json({ message: "Leadership program added successfully!" });
  } catch (error) {
    console.error("Error adding leadership program:", error);
    res.status(500).json({ message: "Error adding leadership program", error: error.message });
  }
};
const get_leadership_data = async (req, res) => {
  console.log("controller function called");
  try {
    const routing_data = await leaderhip_programs.find().lean();
    // Send the data as a response
    return res.status(200).json(routing_data.map((item) => serializeLeadership(req, item)));
  } catch (error) {
    console.log("error occurred " + error);
    return res.status(200).json([]);
  
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

const getScholarshipImage = async (req, res) => {
  try {
    const item = await scholarshipModel.findById(req.params.id).select('image');
    const binary = extractBinaryImage(item?.image);
    if (!item || !binary) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', binary.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(binary.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load image' });
  }
};

const getInternshipImage = async (req, res) => {
  try {
    const item = await internshipmodel.findById(req.params.id).select('image');
    const binary = extractBinaryImage(item?.image);
    if (!item || !binary) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', binary.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(binary.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load image' });
  }
};

const getLeadershipImage = async (req, res) => {
  try {
    const item = await leaderhip_programs.findById(req.params.id).select('image');
    const binary = extractBinaryImage(item?.image);
    if (!item || !binary) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.set('Content-Type', binary.contentType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(binary.data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load image' });
  }
};

module.exports = {
  // Admin & Scholarship
  adminController,
  saveScholarshipData,
  getScholarshipData,

  // Internship
  saveInternshipData,
  get_internship,
  getInternshipImage,

  // Leadership
  add_leader_data,
  get_leadership_data,
  getLeadershipImage,

  // Contact
  contact_controller,
  gettting_contact_data,

  // Subscribers
  subscriber_controller,
  deleleMessage,
  saveBlog,
  bloge_data_fetch,
  deleteScholarship,
  Delete_bloge_,
  getScholarshipImage,
  getSiteConfig,
  uploadSiteLogo,
  getSiteLogo,
  updateSiteSocialLinks,
  getSiteVideos,
  updateSiteVideos,

  // User Auth
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
}
 


