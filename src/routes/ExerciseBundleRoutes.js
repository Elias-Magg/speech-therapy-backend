const express = require('express');
const bodyParser = require('body-parser');
const exerciseBundleCrud = require('../crud/ExerciseBundleCrud');
const ExerciseBundle = require("../models/ExerciseBundle");
const userExerciseBundleAssociation = require("../crud/UserExerciseBundleAssociationCrud");

const router = express.Router();

router.use(bodyParser.json());

// Create bundle
router.post('/bundles', async (req, res) => {
    try {
        const { title, global } = req.body;
        const bundle = await exerciseBundleCrud.createExerciseBundle(new ExerciseBundle(null,title, global));
        res.status(201).json(bundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add user to bundle
router.post('/bundles/:bundleId/users/:userId', async (req, res) => {
    try {
        await userExerciseBundleAssociation.createUserExerciseBundleAssociation(req.params.userId, req.params.bundleId);
        res.json({ message: 'Bundle assigned to user' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bundle with exercises
router.get('/bundles/:id', async (req, res) => {
    try {
        const bundle = await exerciseBundleCrud.getBundleById(req.params.id, true);
        if (!bundle) return res.status(404).json({ error: 'Bundle not found' });
        res.json(bundle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get bundles with user id
// TODO : get whole bundles (without exercises)
router.get('/bundles/users/:userId', async (req, res) => {
    try {
        const bundles = await exerciseBundleCrud.getBundlesByUserId(req.params.user_id);
        if (!bundles) return res.status(404).json({ error: 'No bundle not found' });
        res.json(bundles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update bundle
router.put('/bundles/:id', async (req, res) => {
    try {
        const { title, global } = req.body;
        let updatedBundle = new ExerciseBundle(req.params.id, title, global);
        await exerciseBundleCrud.updateExerciseBundle(updatedBundle);
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