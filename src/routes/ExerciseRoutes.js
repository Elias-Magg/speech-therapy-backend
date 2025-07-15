const express = require('express');
const bodyParser = require('body-parser');
const exerciseCrud = require('../crud/ExerciseCrud');

const router = express.Router();

router.use(bodyParser.json());

// Create exercise
router.post('/exercises', async (req, res) => {
    try {
        const { bundleId, step, title, description, audio, picture, video_file_path } = req.body;
        const exercise = await exerciseCrud.createExercise(bundleId, step, title, description, audio, picture, video_file_path);
        res.status(201).json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const path = require('path');
const fs = require('fs');
const {upload} = require("../controllers/FileUploadController");

router.post('/exercises', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]), async (req, res) => {
    let videoFilePath;
    let audioBuffer;
    let pictureBuffer;
    try {
        const {bundleId, step, title, description} = req.body;

        // Handle buffers
        if (req.files.audio) {
            audioBuffer = req.files?.audio?.[0] ? fs.readFileSync(req.files.audio[0].path) : null;
            pictureBuffer = req.files?.picture?.[0] ? fs.readFileSync(req.files.picture[0].path) : null;
        }


        // Build video path for DB (save relative path)
        if (req.files.video) {
            videoFilePath = req.files?.video?.[0]
                ? path.join('uploads/videos', bundleId, path.basename(req.files.video[0].path))
                : null;
        }

        const exercise = await exerciseCrud.createExercise(
            bundleId,
            parseInt(step),
            title,
            description,
            audioBuffer,
            pictureBuffer,
            videoFilePath
        );

        res.status(201).json(exercise);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update exercise
router.put('/exercises/:id', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'picture', maxCount: 1 }
]), async (req, res) => {
    try {
        const updates = { ...req.body };

        if (req.files?.audio?.[0]) {
            updates.audio = fs.readFileSync(req.files.audio[0].path);
        }

        if (req.files?.picture?.[0]) {
            updates.picture = fs.readFileSync(req.files.picture[0].path);
        }

        if (req.files?.video?.[0]) {
            const bundleId = req.body.bundleId || 'general';
            updates.video_file_path = path.join('uploads/videos', bundleId, path.basename(req.files.video[0].path));
        }

        if (updates.step) {
            updates.step = parseInt(updates.step);
        }

        await exerciseCrud.updateExercise(req.params.id, updates);
        res.json({ message: 'Exercise updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete exercise
router.delete('/exercises/:id', async (req, res) => {
    try {
        await exerciseCrud.deleteExercise(req.params.id);
        res.json({ message: 'Exercise deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
