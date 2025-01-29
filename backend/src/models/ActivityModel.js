import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Activity', activitySchema);