const mongoose = require("mongoose");

const resultSchema = {
  year: {
    type: Number,
  },
  rollno: {
    type: Number,
    unique: true,
  },
  name: String,
  subject1: String,
  marks1: Number,
  totmarks1: Number,
  subject2: String,
  marks2: Number,
  totmarks2: Number,
  subject3: String,
  marks3: Number,
  totmarks3: Number,
  father: String,
  stream: String,
  gender: String,
};

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
