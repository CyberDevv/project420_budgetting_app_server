import logger from '../utils/winston';

export const requestLogger = (req, res, next) => {
   logger.info(`Received ${req.method} request`, {
      path: req.url,
      userId: req.user ? req.user._id : ' ',
      queryParams: req.query,
      statusCode: res.statusCode,
   });
   next();
};
