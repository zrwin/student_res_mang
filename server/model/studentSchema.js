const mongoose = require("mongoose");

const studentSchema = {
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: Number,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
  },
  stream: {
    type: String,
  },
  status: {
    type: String,
  },
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
