import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Budget from '../models/budget.model';
import logger from '../utils/winston';

// Get all goals controller
export const getAllGoals = asyncHandler(async (req, res) => {
   const goal = await Goal.find({ user: req.user._id });

   res.status(StatusCodes.OK).json(goal);
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

   res.status(StatusCodes.CREATED).json({
      message: 'Budget created successfully',
      budget,
   });
});

// Delete a goal controller
export const deleteGoal = asyncHandler(async (req, res) => {
   const goalId = req.params.goal;

   const goal = await Goal.findById(goalId);
   if (!goal) throw new BadRequestError('Goal does not exist');

   await Goal.findByIdAndRemove(goalId);

   res.status(StatusCodes.OK).json({
      message: 'Goal deleted successfully',
   });
});
