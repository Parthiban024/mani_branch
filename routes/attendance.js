import express from 'express';
const router = express.Router();

import Attendance from '../models/attendance.model.js';

// Fetch all attendance data
router.route('/').get((req, res) => {
  Attendance.find()
    .then((attendance) => res.json(attendance))
    .catch((err) => res.status(400).json('Error:' + err));
});

// Save attendance data
router.route('/att').post(async (req, res) => {
  try {
    const { name, empId, checkInTime, checkOutTime, total } = req.body;
    const newAttendance = new Attendance({ name, empId, checkInTime, checkOutTime, total });
    await newAttendance.save();
    res.json('Data Saved!!!');
  } catch (error) {
    res.status(400).json('Error:' + error);
  }
});

// Fetch individual user's attendance data
router.route('/fetch/att-data/').get((req, res) => {
  const empId = req.query.empId;
  Attendance.find({ empId: empId })
    .then((attendance) => res.json(attendance))
    .catch((err) => res.status(400).json('err' + err));
});

// ... (Other routes)

export default router;
