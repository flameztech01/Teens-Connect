import express from 'express';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';


const registerAdmin = asyncHandler(async (req, res) => {
    const { adminName, adminEmail, password } = req.body;

    if (!adminName || !adminEmail || !password) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    const adminExists = await Admin.findOne({ adminEmail });

    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
        adminName, adminEmail, password
    })

    if(admin) {
        const token = generateToken(res, admin._id);
        res.status(201).json({
            _id: admin._id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            token,
        });
    } else {
        res.status(400);
        throw new Error('Invalid Admin Data');
    }
});

//Auth Admin/set token
const authAdmin =asyncHandler(async (req, res, next ) => {
    const {adminEmail, password} = req.body;

    const admin = await Admin.findOne({adminEmail});
    if(admin && (await admin.matchPassword(password))) {
        const token = generateToken(res, admin._id);
        res.status(200).json({
            _id: admin._id,
            adminName: admin.adminName,
            adminEmail: admin.adminEmail,
            token,
        });
    } else{
        res.status(400);
        throw new Error('Invalid Email or Password');
    }
});

//Logout Admin
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie('adminToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'Admin logged out successfully'
    });
});

//Get all Users 
const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({});
    if(users) {
        res.status(200).json(users);
    } else{
        res.status(404);
        throw new Error('No users found');
    }
});

const getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(user) {
        res.status(200).json(user);
    } else{
        res.status(404);
        throw new Error('User not found');
    }
});

export {registerAdmin, authAdmin, logoutAdmin, getAllUsers, getSingleUser};