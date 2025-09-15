// models/User.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{ type: String, required: true },
    phone:   { type: String },
    address: { type: String, default: "" },
    city:    { type: String, default: "" },
    zip:     { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  
  { timestamps: true }
);

module.exports = model("User", userSchema);
