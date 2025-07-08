const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all bundles
router.get('/bundles', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM speech_therapy.exercise_bundle ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching bundles' });
  }
});

// Get steps for a specific bundle
router.get('/bundle/:bundleId', async (req, res) => {
  const { bundleId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, step, type, title, description,
              encode(audio, 'base64') as audio,
              encode(picture, 'base64') as picture,
              video_file_path
       FROM speech_therapy.exercise
       WHERE bundle_id = $1
       ORDER BY step ASC`,
      [bundleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching steps' });
  }
});

module.exports = router;
