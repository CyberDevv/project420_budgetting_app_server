import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { BadRequestError, UnauthenticatedError } from '../errors';
import User from '../models/user.model';
import logger from '../utils/winston';

// login controller
export const login = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   // get user
   const user = await User.findOne({ email });

   if (!user)
      throw new UnauthenticatedError('Authentication failed, User not found.');

   // compare password
   const isPasswordMatch = await user.comparePassword(
      password,
      user.hashPassword
   );

   if (!isPasswordMatch)
      throw new UnauthenticatedError('Authentication failed. Wrong password.');

   logger.info(`User ${user.email} logged in`);

   res.status(StatusCodes.OK).json({
      token: jwt.sign(
         {
            email: user.email,
            name: user.name,
            _id: user.id,
         },
         process.env.JWT_SECRET,
         {
            expiresIn: '30d',
         }
      ),
   });
});

// register controller
export const register = asyncHandler(async (req, res) => {
   res.status(StatusCodes.OK).json({ msg: "success" });
});
