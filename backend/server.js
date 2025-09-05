const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ["https://civic-tracker.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// ✅ Ensure db.json exists on server start
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, '[]');
  console.log('📁 Created db.json');
}




// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, './uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, '_'); // ✅ replace spaces
    const uniqueName = Date.now() + '-' + originalName;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Save issue to db.json
function saveIssue(issue) {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    data.push(issue);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('✅ Issue saved');
  } catch (err) {
    console.error('❌ Error saving issue:', err.message);
  }
}

// ✅ API: Submit issue
app.post('/api/issues', upload.array('photo',5), (req, res) => {
  const issue = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    category: req.body.category,
    isAnonymous: req.body.isAnonymous === 'true',
    photoUrl: req.file ? `/backend/uploads/${req.file.filename}` : null,
    createdAt: new Date(),
    status: 'Reported'
  };
  saveIssue(issue);
  res.status(201).json(issue);
});

// ✅ API: Get all issues
app.get('/api/issues', (req, res) => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read issues.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
