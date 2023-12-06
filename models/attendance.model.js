import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AttSchema = new Schema({
  name: String,
  empId: String,
  checkInTime: String,
  checkOutTime: String,
  total: String, // Add the 'total' field
});

const Attendance = mongoose.model('check', AttSchema);

export default Attendance;
