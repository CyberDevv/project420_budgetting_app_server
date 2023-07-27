import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   reportType: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true,
   },
   dateRange: { type: String },
   summaryStatistics: { type: Object },
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.model('Report', ReportSchema);
