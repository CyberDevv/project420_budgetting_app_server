import express from 'express';
import { getAllExpenses, addExpense } from '../controllers/expense.controllers';

const router = express.Router();

router.route('/').get(getAllExpenses).post(addExpense);

export default router;
