import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';

export const generateExpenseReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate ) throw new BadRequestError('Start and End date is required');

    if (endDate < startDate) throw new BadRequestError('endDate cannot be earlier than startDate');

    const collection = db.collection('expense');

    const filteredData = await collection.find({ date: { $gte: startDate, $lte: endDate } }).toArray();

    const report = { startDate, endDate, data: filteredData };

    res.status(StatusCodes.OK).json({
        message: "Report generated sucessfully",
        report
    })
})
