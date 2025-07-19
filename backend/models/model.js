const mongoose=require('mongoose');
const leadership_schema = new mongoose.Schema({
  programTitle: { type: String, required: true },
  image: { type: String, required: true },
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
         type:String,
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
         type:['south america','Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Middle East', 'Oceania', 'Global','american'],
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
         type:String,
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
  image_url: {
    type: String,
    default: '', // Set default to empty or your placeholder image path
  },
  // Step 2: Blog Content Blocks
  content: {
    type: [ContentBlockSchema],
    required: true
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



 const subscriber_notification= mongoose.model("subscriber_notification", subscriberSchema);
 const contactform=mongoose.model("contactform", contactSchema);
 const leaderhip_programs= mongoose.model("leaderhip_programe",leadership_schema);
 const internshipmodel=mongoose.model("internship_model",internshipSchema);
  const admin=mongoose.model("admintabls",adminSchem);
 const scholarshipModel=mongoose.model("scholarshipSchema",scholarshipSchema);
module.exports={scholarshipModel,admin,internshipmodel,leaderhip_programs, contactform,subscriber_notification,Blog};
