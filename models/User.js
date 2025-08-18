const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:{ type: String, required: true },
    phone:   Number,
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
