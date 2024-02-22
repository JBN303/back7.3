const express = require('express');
const PUser = require('../model/patientmodel');
const router = express.Router();


router.post('/plogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const puser = await PUser.findOne({ Email:email,Password:password });
    if (!puser) {
      return res.status(401).json({ message: 'Invalid e-mail or password for patient' });
    }
    else{
      res.status(200).json(puser);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//  status changer 🔽

router.put('/patients/toggle/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await PUser.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patient.status = patient.status === 'active' ? 'inactive' : 'active';
    const updatedPatient = await patient.save();
    res.status(200).json(updatedPatient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ..............

module.exports = router;