import express from 'express';
import { getAllExpenses } from '../controllers/expense.controllers';

const router = express.Router();

router.route('/').get(getAllExpenses);
router.route('/register').post();

export default router;
