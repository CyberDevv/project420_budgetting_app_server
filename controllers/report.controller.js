import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Report from '../models/report.model';
import moment from 'moment';

export const generateExpenseReport = asyncHandler(async (req, res) => {
   const { startDate, endDate } = req.body;

   if (!startDate || !endDate)
      throw new BadRequestError('Start and End date is required');

   if (endDate < startDate)
      throw new BadRequestError('endDate cannot be earlier than startDate');

   const startDateq = moment(startDate).startOf('day').toISOString();
   const endDateq = moment(endDate).endOf('day').toISOString();

   const report = await Report.find(
      {
         user: req.user._id,
         date: {
            $gte: startDateq,
            $lte: endDateq,
         },
      },
      { __v: 0 }
   ).sort({ date: 'asc' });

   const reports = {
      data: report,
      startDateq,
      endDateq,
      length: report.length,
   };

   res.status(StatusCodes.OK).json({
      reports,
   });
});
