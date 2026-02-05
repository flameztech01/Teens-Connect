import express from 'express';
import mongoose from 'mongoose';

const userSchema  = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    dateOfBirth: {type: Date, required: true},
    gender: {type: String, enum: ['male', 'female', 'other'], required: true},
    location: {type: String, required: true},
    whatsappNumber: {type: String, required: true},
    whatsappLink: {type: String},
    curriculumVitae: {type: String},
    portfolioLink: {type: String},
    skills: [{type: String}],
    interests: [{type: String}],
    bio: {type: String},
    profilePicture: {type: String},
    createdAt: {type: Date, default: Date.now},
},
{timestamps: true})


const User = mongoose.model('User', userSchema);
export default User;