import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import { error404 } from './controllers/error404.controller';
import connectDB from './utils/dbConnect';
import logger from './utils/winston';
import('express-async-errors');
import { errorHandlerMiddleware } from './middleware';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes'

dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// jwt setup

// routes
app.get('/ping', (req, res) => {
   res.status(200).json({ sucess: true });
});
app.use('/auth', authRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use(error404);

// error handler
app.use(errorHandlerMiddleware);

// server setup
const start = async () => {
   try {
      await connectDB(process.env.MONGODB_URI);
      app.listen(
         process.env.PORT,
         logger.info(`Server is running on port ${process.env.PORT}`)
      );
   } catch (error) {
      logger.error(error);
   }
};

start();
