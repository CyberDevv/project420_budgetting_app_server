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
   savedAmount: {
      type: Number,
      default: 0,
   },
   targetDate: {
      type: Date,
      required: 'Target date is required',
   },
   description: {
      type: String,
      required: 'Description is required',
   },
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Goal', GoalSchema);
