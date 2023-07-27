import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   amount: {
      type: Number,
      required: 'Amount is required',
   },
   description: String,
   category: {
      type: String,
      required: 'Category is required',
   },
   date: {
      type: Date,
      default: Date.now,
   },
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Expense', ExpenseSchema);
