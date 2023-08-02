import express from 'express';
import { createBudget, getAllBudgets, spendBudget } from '../controllers/budget.controller';

const router = express.Router();

router.route('/').post(createBudget).get(getAllBudgets);
router.route('/:budgetId/spend').patch(spendBudget)

export default router;
