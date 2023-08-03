import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Goal from '../models/goal.model';
import Report from '../models/report.model';
import User from '../models/user.model';
import logger from '../utils/winston';

// Get all goals controller
export const getAllGoals = asyncHandler(async (req, res) => {
   const goal = await Goal.find({ user: req.user._id });

   res.status(StatusCodes.OK).json(goal);
});

// Set a goal controller
export const createGoal = asyncHandler(async (req, res) => {
   const { goalAmount, targetDate, description, creditAmount } = req.body;

   // Check if user balance is greater than targetDate
   const userFromDb = await User.findById(req.user._id);

   if (creditAmount > Number(userFromDb.balance)) {
      throw new BadRequestError(
         'Credit amount cannot be greater than user balance'
      );
   }

   // create a new goal
   const goal = await new Goal({
      user: req.user._id,
      goalAmount: goalAmount,
      targetDate: moment(targetDate).toISOString(),
      description: description,
      savedAmount: +creditAmount,
   }).save();

   //    debit user balance
   const user = await User.findById(req.user._id);
   user.balance -= Number(creditAmount);
   user.save();

   // create new report
   if (creditAmount) {
      await new Report({
         user: req.user._id,
         reportType: 'Goal Report',
         date: moment().toISOString(),
         summaryStatistics: {
            transactionId: goal._id,
            amount: creditAmount,
            type: 'debit',
         },
      }).save();
   }

   res.status(StatusCodes.CREATED).json({
      message: 'Goal created successfully',
      goal,
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

// addsavings controller
export const addSavings = asyncHandler(async (req, res) => {
   const { amount } = req.body;

   const goal = await Goal.findById(req.params.goalId);
   if (!goal) throw new BadRequestError('Goal does not exist');

   if (goal.user.toString() !== req.user._id.toString()) {
      throw new UnauthenticatedError(
         'You are not authorized to perform this action'
      );
   }

   if (Number(goal.savedAmount) + Number(amount) > Number(goal.goalAmount)) {
      throw new BadRequestError('You cannot save more than your target amount');
   }

   goal.savedAmount += Number(amount);
   await goal.save();

   //    debit user balance
   const user = await User.findById(req.user._id);
   user.balance -= Number(amount);
   user.save();

   // create new report
   await new Report({
      user: req.user._id,
      reportType: 'Goal Report',
      date: moment().toISOString(),
      summaryStatistics: {
         transactionId: goal._id,
         amount: amount,
         type: 'debit',
      },
   }).save();

   logger.info(
      `User ${req.user._id} debited with ${amount} for savings to goal ${goal._id}`
   );

   res.status(StatusCodes.OK).json({
      message: 'Savings added successfully',
      goal,
   });
});
