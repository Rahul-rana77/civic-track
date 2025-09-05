const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getIssues, createIssue, updateIssueStatus } = require('../controllers/issuesController');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, '_'); // ✅ replace spaces
    const uniqueName = Date.now() + '-' + originalName;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// POST with image upload
router.post('/', upload.array('photo',5), createIssue); // photo is the form-data field name

router.get('/', getIssues);
router.patch('/:id/status', updateIssueStatus);

module.exports = router;