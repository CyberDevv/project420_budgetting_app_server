import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   budgetAmount: {
      type: Number,
      required: 'Amount is required',
   },
   category: {
      type: String,
      required: 'Category is required',
   },
   description: String,
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Budget', BudgetSchema);
