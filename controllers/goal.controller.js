import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import Goal from '../models/goal.model';
import logger from '../utils/winston';

// Get all goals controller
export const getAllGoals = asyncHandler(async (req, res) => {
    const goal = await Goal.find({ user: req.user._id });

    res.status(StatusCodes.OK).json(goal);
});

// Set a goal controller
export const createGoal = asyncHandler(async (req, res) => {
    const { goalAmount, targetDate, description } = req.body;

    // create a new goal
    const goal = await new Goal ({
        user: req.user._id,
        goalAmount: goalAmount,
        targetDate: targetDate,
        description: description,
        createdOn: new Date
    }).save();

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
        message: 'Goal deleted successfully'
    })
})