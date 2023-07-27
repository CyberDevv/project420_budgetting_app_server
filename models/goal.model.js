import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   goalAmount: {
      type: Number,
      required: 'Amount is required',
   },
   targetDate: {
      type: Date,
      required: 'Target date is required',
   },
   description: String,
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Goal', GoalSchema);
