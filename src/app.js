// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');


require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;


const pool = require("./config/db-connection");

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});


const userRoutes = require('./routes/UserRoutes');
const exerciseRoutes = require('./routes/ExerciseRoutes');
const exerciseBundleRoutes = require('./routes/ExerciseBundleRoutes');

// Middleware for parsing JSON
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', exerciseBundleRoutes);


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


