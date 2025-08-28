// models/User.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{ type: String, required: true },

    // ✅ corrections/ajouts
    phone:   { type: String },
    address: { type: String, default: "" },
    city:    { type: String, default: "" },
    zip:     { type: String, default: "" },

    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
