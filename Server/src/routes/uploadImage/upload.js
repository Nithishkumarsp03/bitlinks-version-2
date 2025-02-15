const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// File upload route supporting multiple fields
router.post('/upload', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'visitingcard', maxCount: 1 }
]), (req, res) => {
  try {
    const filePaths = {};
    
    if (req.files.profileImage) {
      filePaths.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }
    
    if (req.files.visitingcard) {
      filePaths.visitingcard = `/uploads/${req.files.visitingcard[0].filename}`;
    }

    res.status(200).json(filePaths);
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

module.exports = router;
