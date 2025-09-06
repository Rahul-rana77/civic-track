import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use memory storage for Render compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// ✅ In-memory storage (for demo - will reset on redeploy)
let issues = [];

// GET all issues
router.get("/", (req, res) => {
  console.log("GET /api/issues requested");
  res.json({
    success: true,
    count: issues.length,
    data: issues
  });
});

// ✅ POST new issue
router.post("/", upload.single("photo"), (req, res) => {
  try {
    console.log("POST /api/issues received:", req.body);
    
    let photoUrl = null;
    if (req.file) {
      // Convert to base64 for temporary storage
      photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const newIssue = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      isAnonymous: req.body.isAnonymous === "true",
      photoUrl: photoUrl,
      status: "Reported",
      createdAt: new Date().toISOString()
    };

    issues.push(newIssue);
    
    console.log("New issue created:", newIssue.id);
    
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: newIssue
    });
    
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create issue",
      message: error.message 
    });
  }
});

// ✅ Test route for issues
router.get("/test", (req, res) => {
  res.json({ 
    message: "Issues route is working!",
    timestamp: new Date().toISOString()
  });
});

export default router;