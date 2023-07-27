import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Expense from '../models/expense.model';
import User from '../models/user.model';
import logger from '../utils/winston';

// add an expense controller
export const addExpense = asyncHandler(async (req, res) => {
   const { category, amount, description, date } = req.body;

   if (!category) {
      throw new BadRequestError('Category is required');
   }

   if (!amount) {
      throw new BadRequestError('Amount is required');
   }

   // check if amount is a number
   if (isNaN(amount)) throw new BadRequestError('Amount must be a number');

   // check if amount is negative
   if (amount < 0) throw new BadRequestError('Amount must be positive');

   //  set date to current date if date is null or undefined
   let newDate;
   if (!date) {
      newDate = new Date();
   }

   // create new expense
   await new Expense({
      user: req.user._id,
      category,
      amount,
      description,
      date: date || newDate,
   }).save();

   //  deduct expense amount from user balance
   const user = await User.findById(req.user._id);
   const newBalance = user.balance - amount;
   await User.findByIdAndUpdate(req.user._id, { balance: newBalance });

   logger.info(`User ${req.user.email} added a new expense`);

   res.status(StatusCodes.CREATED).json({
      msg: 'Expense added successfully',
   });
});

// Get all expenses controller
export const getAllExpenses = asyncHandler(async (req, res) => {
   const expenses = await Expense.find({ user: req.user._id }, { __v: 0 }).sort(
      {
         date: -1,
      }
   );

   res.status(StatusCodes.OK).json(expenses);
});
