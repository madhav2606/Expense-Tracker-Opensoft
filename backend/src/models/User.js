import mongoose from 'mongoose';
import { Expense } from './expenseModel.js';

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
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense', 
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group', 
    },
  ]
},{timestamps:true});

export const User = mongoose.model('User', UserSchema);