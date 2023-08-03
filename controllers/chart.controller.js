import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Expense from '../models/expense.model';

// controller to get all most spent on expenses daily for chart
export const getChart = asyncHandler(async (req, res) => {
   const expenses = await Expense.find({ user: req.user._id }, { __v: 0 });

   const expensesByDate = expenses.reduce((acc, expense) => {
      const date = expense.date.toISOString().split('T')[0];
      if (!acc[date]) {
         acc[date] = {};
      }
      if (!acc[date][expense.category]) {
         acc[date][expense.category] = 0;
      }
      acc[date][expense.category] += expense.amount;
      return acc;
   }, {});

   res.status(StatusCodes.OK).json(expensesByDate);
});
