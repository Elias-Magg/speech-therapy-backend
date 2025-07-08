// routes/exerciseRoutes.js
const express = require('express');
const router = express.Router();

//multer: handles file uploads
const multer = require('multer');


//path: builds safe paths (for saving videos)
const path = require('path');
const fs = require('fs');

//It imports the v4 function from the uuid library and renames it as uuidv4
//This function generates a universally unique ID (UUID).
//So every uploaded file gets a unique filename and doesn't overwrite other files. -> uuidv4(); 

const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

/*Defines the directory where videos will be saved on your server
If the folder doesn’t exist, it creates it
 */
//{ recursive: true }:Allows it to create nested folders (e.g. uploads/videos) safely, even if uploads/ doesn't exist yet.
const videoPath = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(videoPath)) fs.mkdirSync(videoPath, { recursive: true });

// Multer setup

//Tells multer: "store files in memory (RAM)" — this is ideal for small binary files
const storage = multer.memoryStorage(); // for audio and images (BYTEA)
const upload = multer({
  storage: multer.memoryStorage()
});


// POST /api/exercises/upload-bundle
router.post('/upload-bundle', upload.fields([
  { name: 'steps', maxCount: 1 },
  { name: 'media' }, // accepts multiple files (audio/image/video)
]), async (req, res) => {
  const { title } = req.body;
  const steps = JSON.parse(req.body.steps || '[]'); // JSON array of step objects
  const files = req.files.media || [];

  if (!title || !steps.length) {
    return res.status(400).json({ error: 'Missing title or steps' });
  }

  try {
    // 1. Insert bundle
    const bundleResult = await pool.query(
      'INSERT INTO speech_therapy.exercise_bundle (title) VALUES ($1) RETURNING id',
      [title]
    );
    const bundleId = bundleResult.rows[0].id;

    // 2. Insert each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const fileGroup = files.filter(f => f.originalname.startsWith(`step${i}_`));
      let audio = null;
      let picture = null;
      let video_file_path = null;

      for (const file of fileGroup) {
        if (file.mimetype.startsWith('audio/')) audio = file.buffer;
        else if (file.mimetype.startsWith('image/')) picture = file.buffer;
        else if (file.mimetype.startsWith('video/')) {
          // Save video to disk manually
          const videoFilename = uuidv4() + path.extname(file.originalname);
          const videoFullPath = path.join(videoPath, videoFilename);
          fs.writeFileSync(videoFullPath, file.buffer);
          video_file_path = `/videos/${videoFilename}`;
        }
      }

      await pool.query(
        `INSERT INTO speech_therapy.exercise 
         (bundle_id, type, step, title, description, audio, picture, video_file_path) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [bundleId, step.type, step.step, step.title, step.description, audio, picture, video_file_path]
      );
    }

    res.status(200).json({ success: true, bundleId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error uploading bundle' });
  }
});

module.exports = router;
