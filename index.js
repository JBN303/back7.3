// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require('./config/db');
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const puserRoutes = require('./routes/puserRoutes')
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use userRoutes for handling login
app.use('/api', userRoutes);
// Use doctorRoutes
app.use('/api', doctorRoutes);
// Use patientRoutes
app.use('/api', patientRoutes);
// Use puserRoutes...
app.use('/api', puserRoutes);
// Use adminRoutes
app.use('/api/admin', adminRoutes);


app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'docere123' && password === 'jbn303') {
    // Valid credentials
    res.status(200).json({ message: 'Admin login successful' });
  } else {
    // Invalid credentials
    res.status(401).json({ error: 'Invalid Admin username or password' });
  }
});

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


