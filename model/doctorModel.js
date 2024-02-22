// models/doctorModel.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    uid: Number,
    name: String,
    age: Number,
    spec: String,
    edu: String,
    exp: String,
    lang: String,
    locat: String,
    conslt: String,
    type: String,
    cert: String,
    pic: String,
    about: String,
    phn: Number,
    email: String,
    cpass: String,
    status: { type: String, default: 'Inactive' },
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
