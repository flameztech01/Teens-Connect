import express from 'express';
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminName: {type: String, required: true},
    adminEmail: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
})

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;