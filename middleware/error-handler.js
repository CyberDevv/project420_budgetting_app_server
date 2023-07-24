import { StatusCodes } from 'http-status-codes';
import logger from '../utils/winston';

const errorHandlerMiddleware = (err, req, res, next) => {
   let customError = {
      // set default
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong try again later',
      path: req.url,
   };

   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
         .map((item) => item.message)
         .join(',');
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }
   if (err.code && err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
         err.keyValue
      )} field, please choose another value`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }
   if (err.name === 'CastError') {
      customError.msg = `No item found with id : ${err.value}`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   logger.error(`An error occurred: ${customError.msg}`, {
      path: customError.path,
   });

   return res.status(customError.statusCode).json({ error: customError });
};

export default errorHandlerMiddleware;
