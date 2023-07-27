import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Expense from '../models/expense.model';
import logger from '../utils/winston';

// Get all expenses controller
export const getAllExpenses = asyncHandler(async (req, res) => {
   const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
   });

   res.status(StatusCodes.OK).json(expenses);
});
