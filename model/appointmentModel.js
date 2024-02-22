const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  patientName: String,
  age: Number,
  date: Date, // Include date field to store appointment date
  day: String, // Include day field to store preferred time of the day
  purpose: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
