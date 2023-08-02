import express from 'express';
import { createBudget, getAllBudgets, spendBudget, updateBudgetAmount } from '../controllers/budget.controller';

const router = express.Router();

router.route('/').post(createBudget).get(getAllBudgets);
// router.route('/:budgetId/spend').patch(spendBudget)
router.route('/:budgetId/updateBudgetAmount').patch(updateBudgetAmount);

export default router;
