import mongoose from 'mongoose';
import { User } from './User.js';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

export const Activity= mongoose.model('Activity', activitySchema);