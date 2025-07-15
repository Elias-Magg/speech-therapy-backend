const express = require('express');
const bodyParser = require('body-parser');
const userCrud = require('../crud/UserCrud')

const router = express.Router();

router.use(bodyParser.json());

// Create user
router.post('/users', async (req, res) => {
    try {
        const { type, name, surname } = req.body;
        const user = await userCrud.createUser(type, name, surname);
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
        await userCrud.updateUser(req.params.id, req.body);
        res.json({ message: 'User updated' });
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