import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Expense from '../models/expense.model';

// controller to get all most spent on expenses daily for chart
export const getChart = asyncHandler(async (req, res) => {
   const expenses = await Expense.find({ user: req.user._id }, { __v: 0 }).sort(
      {
         date: -1,
      }
   );

   // get all expenses categories in descending order of amount summation
   let sortedExpensesCategories = [
      ...new Set(
         [...expenses]
            .sort((a, b) => b.amount - a.amount)
            .map((expense) => expense.category)
      ),
   ];
   // get the first 5 categories
   sortedExpensesCategories = sortedExpensesCategories.slice(0, 5);

   const expensesByDate = expenses.reduce((acc, expense) => {
      // get only last 10 days
      const date = expense.date.toISOString().split('T')[0];
      if (!acc[date]) {
         acc[date] = Object.fromEntries(
            sortedExpensesCategories.map((category) => [category, 0])
         );
      }

      acc[date][expense.category] += expense.amount;

      // limit length to 5
      acc[date] = Object.fromEntries(Object.entries(acc[date]).slice(0, 5));

      return acc;
   }, {});

   // limit expensesByDate object to first 2 objects
   const limitedExpensesByDate = Object.fromEntries(
      Object.entries(expensesByDate).slice(0, 10)
   );

   res.status(StatusCodes.OK).json(limitedExpensesByDate);
});
