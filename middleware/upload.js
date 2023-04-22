

//!This middleware upload images to public/uploads, its required to be, otherwise cant continue to addProduct function
const path = require('path');
const express = require('express');
const multer = require('multer');

const app = express();

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up multer upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for handling file upload
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
