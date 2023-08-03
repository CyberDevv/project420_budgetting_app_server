import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   reportType: {
      type: String,
      required: true,
   },
   date: {
      type: String,
      required: true,
   },
   summaryStatistics: {
      type: Object,
      required: true,
   },
});


export default mongoose.model('Report', ReportSchema);
