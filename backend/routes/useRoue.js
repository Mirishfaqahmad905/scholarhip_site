const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { authenticateUser } = require('../middleware/authMiddleware');
const {
  saveScholarshipData,
  adminController,
  getScholarshipData,
  saveInternshipData,
  get_internship,
  add_leader_data,
  get_leadership_data,
  getScholarshipImage,
  getInternshipImage,
  getLeadershipImage,
  getSiteConfig,
  uploadSiteLogo,
  getSiteLogo,
  updateSiteSocialLinks,
  getSiteVideos,
  updateSiteVideos,
  contact_controller,
  subscriber_controller,
  gettting_contact_data,
  deleleMessage,
  saveBlog,
  bloge_data_fetch,
  deleteScholarship,
  Delete_bloge_,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require('../controller/Controller.js');

router.get('/get/allbloge', bloge_data_fetch);
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/x-ms-bmp',
]);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']);

const validateImageFile = (file) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  return allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(ext);
};

const memoryImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter(req, file, cb) {
    if (validateImageFile(file)) return cb(null, true);
    return cb(new Error('Only image files are allowed: jpg, jpeg, png, webp, gif, bmp'));
  },
});

router.post('/save/scholarshipdata', memoryImageUpload.single('imageFile'), saveScholarshipData);
router.get('/save/data/my', (req, res) => {
  res.send({ message: 'hello word' });
});
router.get('/get/internshipdata', get_internship);
router.post('/admin/login', adminController);
router.post('/add/leader_data', memoryImageUpload.single('imageFile'), add_leader_data);
router.get('/get/leader_data', get_leadership_data);
router.post('/admin/saveInternship', memoryImageUpload.single('imageFile'), saveInternshipData);
router.get('/get/scholarship_data', getScholarshipData);
router.get('/image/scholarship/:id', getScholarshipImage);
router.get('/image/internship/:id', getInternshipImage);
router.get('/image/leadership/:id', getLeadershipImage);
router.get('/site/config', getSiteConfig);
router.get('/site/logo', getSiteLogo);
router.get('/site/videos', getSiteVideos);
router.post('/admin/site/logo', memoryImageUpload.single('logoFile'), uploadSiteLogo);
router.post('/admin/site/social', updateSiteSocialLinks);
router.post('/admin/site/videos', updateSiteVideos);
router.post('/contact', contact_controller);
router.get('/getMessage', gettting_contact_data);
router.post('/subscriber', subscriber_controller);
router.delete('/deleleMessage/:id', deleleMessage);
router.delete('/delete/scholarship/:id', deleteScholarship);
router.delete('/delete_bloge/:id', Delete_bloge_);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'blog_images');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 10,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed: jpg, jpeg, png, webp, gif, bmp'));
  },
});

router.post('/add/blog', upload.array('images'), saveBlog);

// User Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateUser, getCurrentUser);
router.post('/logout', logoutUser);

module.exports = router;
