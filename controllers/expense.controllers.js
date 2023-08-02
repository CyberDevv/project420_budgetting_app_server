import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Expense from '../models/expense.model';
import Budget from '../models/budget.model';
import User from '../models/user.model';
import logger from '../utils/winston';

// TODO: include previous and current balance after adding expenses

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

   // check if budget exists
   const budget = await Budget.findOne({
      user: req.user._id,
      category,
   });

   // get user
   const user = await User.findById(req.user._id);

   // check if amount is greater than budget amount
   if (budget && Number(amount) > Number(budget.budgetAmount)) {
      throw new BadRequestError('Amount cannot be greater than budget amount');

      // check if amount is greater than user balance
   } else if (Number(amount) > Number(user.balance)) {
      throw new BadRequestError('Amount cannot be greater than balance');
   }

   // add amount to budget spentAmount
   if (budget) {
      const newSpentAmount = Number(budget.spentAmount) + Number(amount);
      await Budget.findByIdAndUpdate(budget._id, {
         spentAmount: newSpentAmount,
      });
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

// Get an expense controller
export const getExpense = asyncHandler(async (req, res) => {
   const expenseId = req.params.expenseId;

   const expense = await Expense.findById(expenseId, { __v: 0 });

   if (!expense) throw new BadRequestError('Expense does not exist');

   res.status(StatusCodes.OK).json(expense);
});

// get total expenses amount and also by category
export const getExpensesAmount = asyncHandler(async (req, res) => {
   const expenses = await Expense.find({ user: req.user._id }, { __v: 0 });
   const budget = await Budget.find({ user: req.user._id }, { __v: 0 });

   // get total expenses amount
   const totalExpensesAmount = expenses.reduce((acc, expense) => {
      return acc + expense.amount;
   }, 0);

   // get the list of categories in expenses to it amount and budget to it spentAmount and sorted to a single array
   // const expensesByCategory = expenses
   //    .map((expense) => {
   //       return {
   //          category: expense.category,
   //          amount: expense.amount,
   //       };
   //    })
   //    .concat(
   //       budget.map((budget) => {
   //          return {
   //             category: budget.category,
   //             amount: budget.spentAmount,
   //          };
   //       })

   //       // sort the array by category
   //    );

   // get all expences and budget categories with their amount
   const expensesByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
         acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
   }, {});

   const budgetByCategory = budget.reduce((acc, budget) => {
      if (!acc[budget.category]) {
         acc[budget.category] = 0;
      }
      acc[budget.category] += budget.spentAmount;
      return acc;
   }, {});

   // concatenate both array and make the keys unique making the expensesByCategory priority
   const categories = { ...budgetByCategory, ...expensesByCategory };

   res.status(StatusCodes.OK).json({
      totalExpensesAmount,
      categories,
   });
});
