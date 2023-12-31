import express from 'express';
import {
   addExpense,
   getAllExpenses,
   getExpense,
   getExpensesAmount,
} from '../controllers/expense.controllers';

const router = express.Router();

router.route('/').get(getAllExpenses).post(addExpense);
router.route('/getExpensesAmount').get(getExpensesAmount);
router.route('/:expenseId').get(getExpense);

export default router;
