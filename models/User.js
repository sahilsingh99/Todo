const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
//const confiq=require('../config/config').get(process.env.NODE_ENV);
const salt=10;

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        maxlength: 100
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    tasks:[{ data: String , check: Boolean}],
    token:{
        type: String
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;