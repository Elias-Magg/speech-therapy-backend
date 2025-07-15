const express = require('express');
const bodyParser = require('body-parser');
const exerciseBundleCrud = require('../crud/ExerciseBundleCrud');

const router = express.Router();

router.use(bodyParser.json());

// Create bundle
router.post('/bundles', async (req, res) => {
    try {
        const { title } = req.body;
        const bundle = await exerciseBundleCrud.createExerciseBundle(title);
        res.status(201).json(bundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add user to bundle
router.post('/users/:userId/bundles/:bundleId', async (req, res) => {
    try {
        await exerciseBundleCrud.addBundleToUser(req.params.userId, req.params.bundleId);
        res.json({ message: 'Bundle assigned to user' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bundle with exercises
router.get('/bundles/:id', async (req, res) => {
    try {
        const bundle = await exerciseBundleCrud.getBundleById(req.params.id);
        if (!bundle) return res.status(404).json({ error: 'Bundle not found' });
        res.json(bundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update bundle
router.put('/bundles/:id', async (req, res) => {
    try {
        const { title } = req.body;
        await exerciseBundleCrud.updateExerciseBundle(req.params.id, title);
        res.json({ message: 'Bundle updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete bundle
router.delete('/bundles/:id', async (req, res) => {
    try {
        await exerciseBundleCrud.deleteExerciseBundle(req.params.id);
        res.json({ message: 'Bundle deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;