import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';
import User from '../models/user.model';
import logger from '../utils/winston';

// get balance controller
export const getBalance = asyncHandler(async (req, res) => {
   //  return the user balance
   const user = await User.findById(req.user._id);
   res.status(StatusCodes.OK).json({ balance: user.balance });
});

// set balance controller
export const setBalance = asyncHandler(async (req, res) => {
   const { amount } = req.body;

   // check if amount is a number
   if (isNaN(amount)) throw new BadRequestError('Amount must be a number');

   // check if amount is negative
   if (amount < 0) throw new BadRequestError('Amount must be positive');

   // get user current balance
   const userBalance = await User.findById(req.user._id)
   const newBalance = Number(userBalance.balance) + Number(amount);
   
   // update user balance
   const user = await User.findByIdAndUpdate(
      req.user._id,
      { balance: newBalance },
      { new: true }
   );

   logger.info(`User ${user.email} balance updated to ${user.balance}`);

   res.status(StatusCodes.OK).json({
      "msg": 'User balance updated successfully',
      "balance": user.balance
   });
});
