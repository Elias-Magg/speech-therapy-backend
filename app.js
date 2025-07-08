// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');


require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;


const uploadRoutes = require('./routes/uploadRoutes');
const viewRoutes = require('./routes/viewRoutes');


const pool = require('./db');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use(cors());
app.use(express.json());


app.use('/api/exercises', uploadRoutes); // για upload
app.use('/api/exercises', viewRoutes);   // για viewing bundles/steps


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
