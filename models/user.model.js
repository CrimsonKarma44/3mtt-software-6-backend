const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  occupation: {type: String, required: false},
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true, select: false },
  phoneNumber: {type: String, required: false},
  yearsOfExperience: {type: Number, required: false},
  officeAddress: {type: String, required: false},
  residentialAddress: {type: String, required: false},
  profilePhoto: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
