//1 require mongoose  
const mongoose = require('mongoose');

//2 create schema
const { Schema,model} = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: {type: String, required: true},
    phone: Number,
});

//3 export
module.exports = User = model("User", userSchema);