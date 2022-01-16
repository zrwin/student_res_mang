const mongoose = require("mongoose");
const userSchema = {
  name: {
    type: String,
  },
  password: String,
  confirmpas: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
};

const User = mongoose.model("User", userSchema);

module.exports = User;
