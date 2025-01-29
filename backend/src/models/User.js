import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String, 
    enum: ['Admin', 'User'],
    default: 'User'
  },
  status: {
    type: String, 
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
},{timestamps:true});

export const User = mongoose.model('User', UserSchema);