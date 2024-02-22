const express = require('express');
const Doctor = require('../model/doctorModel');
const Appointment = require('../model/appointmentModel'); 
const router = express.Router();
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination directory
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Specify the filename
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


router.get('/doctors', async (req, res) => {
  try {
  
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/doctors/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const doctors = await Doctor.findById(id);
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/dnew', upload.fields([{ name: 'pic', maxCount: 1 }, { name: 'cert', maxCount: 1 }]), async (req, res) => {
  
  try {
    const {
      uid,
      name,
      age,
      spec,
      edu,
      exp,
      lang,
      locat,
      conslt,
      type,
      cert,
      about,
      phn,
      email,
      cpass
    } = req.body;
    
    // Create a newDoctorData object with all the fields
    const newDoctorData = {
      uid,
      name,
      age,
      spec,
      edu,
      exp,
      lang,
      locat,
      conslt,
      type,
      about,
      phn,
      email,
      cpass,
      pic: req.files['pic'] ? await convertImageToBase64(req.files['pic'][0].path) : null, // Convert uploaded profile photo to base64 string
      cert: req.files['cert'] ? await convertImageToBase64(req.files['cert'][0].path) : null, // Convert uploaded certificate image to base64 string
    };
    
    if (req.files['pic']) {
      console.log('Received profile photo:', req.files['pic'][0]);
    } else {
      console.log('No profile photo received');
    }
    
    if (req.files['cert']) {
      console.log('Received certificate:', req.files['cert'][0]);
    } else {
      console.log('No certificate received');
    }

    const newDoctor = new Doctor(newDoctorData);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(500).send(err);
  }
});

async function convertImageToBase64(filePath) {
  try {
    const imageData = fs.readFileSync(filePath); // Read the uploaded file
    return imageData.toString('base64'); // Convert the image data to base64 string
  } catch (err) {
    console.error('Error converting image to base64:', err);
    throw err;
  }
}

// Update doctor profile
router.put('/doctors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete doctor profile
router.delete('/doctors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.put('/doctors/toggle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Toggle the status
    doctor.status = doctor.status === 'active' ? 'inactive' : 'active';

    const updatedDoctor = await doctor.save();

    res.status(200).json(updatedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/appointments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create a new appointment
    const appointment = new Appointment({
      doctorId: id,
      patientId: req.body.patientId,
      patientName: req.body.patientName,
      age: req.body.age,
      contactNo: req.body.contactNo,
      email: req.body.email,
      purpose: req.body.purpose,
    });

    const savedAppointment = await appointment.save();

    res.status(200).json(savedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/appointments/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/appointmentpat/:patientId', async (req, res) => {
  console.log("sfnaks")
  
 
  try {
    const { patientId } = req.params;
    console.log(patientId)
    const appointments = await Appointment.find({ patientId });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



/// image 

router.post('/doctors/upload-pic/:id', upload.single('file'), async (req, res) => {
  console.log("hello");
  const { id } = req.params;

  try {
    const doctor = await Doctor.findById(id);
    console.log('Received doctor ID:', id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    console.log(req.file);
    // Read th uploaded file
    const imageData = fs.readFileSync(req.file.path);

    // Convert the image data to base64 string
    const base64Image = imageData.toString('base64');

    // Update the doctor's profile picture field with the base64 string
    doctor.pic = base64Image;

    // Save the updated doctor object
    const updatedDoctor = await doctor.save();

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Profile picture uploaded successfully', doctor: updatedDoctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/doctors/search', async (req, res) => {
  const { name, specialization, location } = req.query; // Extract query parameters
  
  try {
    let query = {}; // Initialize an empty query object
    
    // Check if name parameter is provided
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
    }
    
    // Check if specialization parameter is provided
    if (specialization) {
      query.spec = { $regex: new RegExp(specialization, 'i') }; // Case-insensitive search for specialization
    }
    
    // Check if location parameter is provided
    if (location) {
      query.locat = { $regex: new RegExp(location, 'i') }; // Case-insensitive search for location
    }
    
    // Find doctors matching the query criteria
    const doctors = await Doctor.find(query);
    
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error searching doctors:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports = router;