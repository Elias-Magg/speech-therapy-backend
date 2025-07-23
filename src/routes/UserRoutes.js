const express = require('express');
const bodyParser = require('body-parser');
const userCrud = require('../crud/UserCrud')
const User = require("../models/User");

const router = express.Router();

router.use(bodyParser.json());

// Create user
router.post('/users', async (req, res) => {
    try {
        const { type, email, name, surname } = req.body;
        const user = await userCrud.createUser(new User(null, type, email, name, surname, null));
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user with bundles and exercises
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userCrud.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { type, email, name, surname, clinician_id} = req.body;
        const user = await userCrud.updateUser(new User(req.params.id, type, email, name, surname, clinician_id));
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await userCrud.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;