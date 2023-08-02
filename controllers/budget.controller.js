import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Budget from '../models/budget.model';
import logger from '../utils/winston';

// Get all budget controller
export const getAllBudgets = asyncHandler(async (req, res) => {
   const budgets = await Budget.find({ user: req.user._id }, { __v: 0 });

   res.status(StatusCodes.OK).json(budgets);
});

// create budget controller
export const createBudget = asyncHandler(async (req, res) => {
   const { budgetAmount, category, description } = req.body;

   // create a new goal
   const budget = await new Budget({
      user: req.user._id,
      budgetAmount,
      category,
      description,
   }).save();

   logger.info(`User ${req.user.email} added a new budget`);

   res.status(StatusCodes.CREATED).json({
      message: 'Budget created successfully',
      budget,
   });
});

// update budget controller
export const spendBudget = asyncHandler(async (req, res) => {
   const { debitAmount } = req.body;

   // check if debitAmount is greater than budgetAmount from the db
   const budgetFromDb = await Budget.findById(req.params.budgetId);
   if (debitAmount > budgetFromDb.budgetAmount) {
      throw new BadRequestError(
         'Debit amount cannot be greater than budget amount'
      );
   }

   // update budget
    await Budget.findByIdAndUpdate(req.params.budgetId, {
       spentAmount: budgetFromDb.budgetAmount - debitAmount,
    });

   if (!budgetFromDb) {
      throw new BadRequestError('Budget not found');
   }

   logger.info(`User ${req.user.email} spent from budget`);

   res.status(StatusCodes.OK).json({
      message: 'Budget updated successfully',
   });
});
