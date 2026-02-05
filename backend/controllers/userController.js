import express from 'express';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

//Create New User 
const createUser = asyncHandler(async (req, res, next) => {
    const { name, userName, email, dateOfBirth, gender, location, whatsappNumber, curriculumVitae } = req.body;

    if (!name || !userName || !email || !whatsappNumber || !curriculumVitae) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    } 
    const user = await User.create({
        name, 
        userName, 
        email, 
        dateOfBirth,
        gender,
        location,
        whatsappNumber,
        curriculumVitae,
        portfolioLink: req.body.portfolioLink || '',
        skills: req.body.skills || [],
        interests: req.body.interests || [],
        bio: req.body.bio || '',
        profilePicture: req.body.profilePicture || ''
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            userName: user.userName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            location: user.location,
            whatsappNumber: user.whatsappNumber,
            whatsappLink: `https://wa.me/${user.whatsappNumber}`,
            curriculumVitae: user.curriculumVitae,
            portfolioLink: user.portfolioLink,
            skills: user.skills,
            interests: user.interests,
            bio: user.bio,
            profilePicture: user.profilePicture
        })
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//Get Single User 
const getUserById = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

//Get all Users 
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({});
    if(users) {
        res.json(users);
    } else{
        res.status(404);
        throw new Error('No users found');
    }
});

export { createUser, getUserById, getAllUsers };
