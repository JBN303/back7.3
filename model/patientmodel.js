// models/patientModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    Name: String,
    Address: String,
    Phone: Number,
    Email: String,
    Age: Number,
    Gender: String,
    Username: String,
    Password: String,
    status: { type: String, default: 'Inactive' }, // Add the status field
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;