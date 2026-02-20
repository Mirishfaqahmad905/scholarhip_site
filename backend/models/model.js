const mongoose=require('mongoose');
const ImageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  fileName: { type: String, default: '' },
}, { _id: false });

const leadership_schema = new mongoose.Schema({
  programTitle: { type: String, required: true },
  image: { type: mongoose.Schema.Types.Mixed, required: true },
  hostCountry: { type: String, required: true },
  hostOrganization: { type: String, required: false },
  programLocation: { type: String, required: true },
  duration: { type: String, required: true },
  benefits: { type: String, required: true },
  eligibility: { type: String, required: true },
  howToApply: { type: String, required: true },
  documentsRequired: { type: String, required: true },
  deadline: { type: Date, required: true },
  description: { type: String, required: true },
  officialLink: { type: String }
}, { timestamps: true });
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});
const scholarshipSchema = new mongoose.Schema({
    id:{
         type:String,
         required:true, 
    },
    name:{
        type:String,
        required:true
    },
     image:{
         type:mongoose.Schema.Types.Mixed,
         required:true
     },
    description:{
        type:String,
        required:true
    },
    category:{
        type: [String], // This allows an array of strings
    enum: ["summer_programe","famouse_scholarship","compition","Undergraduate", "Master", "PhD","highschool","exchangeprograme"], // (optional) restricts allowed values
        required:true
    },
     benefits:{
        type:String,
        required:true
    },
    eligibilityCriteria:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:false
    },
    deadline:{
        type:Date,
        required:true
    },
     region:{
         type:['south america','Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Middle East', 'Oceania', 'Global','american', 'Russia', 'russia', 'Russian Region'],
         required:true 
     },
     country:{
         type:String,
         required:true
     },
     officialLink:{
         type:String,
         required:true
     },
     document:{
         type:String,
         required:false
     },
     requiredDocuments: {
         type: String,
         required: false
     },
    hostUniversity:{
        type:String,
        required:false || true // Assuming this field is optional
    },
    howToApply:{
        type:String,
        required:false || true // Assuming this field is optional
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
});
 const adminSchem= new mongoose.Schema({
     username:{
         type:String,
         required:true,
     },
     password:{
         type:String,
         required:true,
     }
 });

 const internshipSchema= new mongoose.Schema({
    internship_id:{
         type:String,required:true
    },
    custome_message:{
         type:String,
         required:true  
    },
     name:{
         type:String,
         required:true
     },
      image:{
         type:mongoose.Schema.Types.Mixed,
         required:true
      },
       description:{
         type:String,required:true
       },
       hosted_country:{
         type:String,required:true,         
       }  ,
       document:{
        type:String,required:false,
       },
       eligabality_criteria:{
         type:String,
          required:true
       },
       officialLink:{
         type:String,required:true,
       },
       duration:{
         type:String,required:true
       },
      benifits:{
         type:String,required:true
      },
      application_process:{
         type:String,
         required:true,
      },
       deadline:{
        type:Date,
        required:true 
       },
       created:{
         type:Date,
         default:Date.now
       }
    
 });
 const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  website: {
    type: String,
    trim: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});




// Schema for each content block (dynamic fields)
const ContentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['heading', 'text', 'textarea', 'quote', 'image'],
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // string or object (e.g., image file info)
    required: true
  }
}, { _id: false }); // prevent extra _id for each block

// Main Blog schema
const BlogSchema = new mongoose.Schema({
  // Step 1: Blog Meta Info
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  category: {
    type: String,
    enum: ['Scholarship', 'Internship', 'Leadership', 'Announcement'],
    required: true
  },
  // Step 2: Blog Content Blocks
  content: {
    type: [ContentBlockSchema],
    required: true
  },
  image_urls: {
    type: [String], // array of image URLs
    default: []
  },
  // Step 3: Optional - For future extensions
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', BlogSchema);

const SiteSettingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'main' },
    logo: {
      data: { type: Buffer },
      contentType: { type: String },
      fileName: { type: String, default: '' },
    },
    socialLinks: {
      whatsapp: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      facebook: { type: String, default: '' },
      telegram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      x: { type: String, default: '' },
    },
    youtubeVideos: [
      {
        title: { type: String, default: '' },
        url: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const SiteSetting = mongoose.model('site_setting', SiteSettingSchema);

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  notifyOnNewOpportunity: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null },
}, { timestamps: true });

const User = mongoose.model('users', UserSchema);


 const subscriber_notification= mongoose.model("subscriber_notification", subscriberSchema);
 const contactform=mongoose.model("contactform", contactSchema);
 const leaderhip_programs= mongoose.model("leaderhip_programe",leadership_schema);
 const internshipmodel=mongoose.model("internship_model",internshipSchema);
  const admin=mongoose.model("admintabls",adminSchem);
const scholarshipModel=mongoose.model("scholarshipSchema",scholarshipSchema);
module.exports={scholarshipModel,admin,internshipmodel,leaderhip_programs, contactform,subscriber_notification,Blog,SiteSetting,User};
