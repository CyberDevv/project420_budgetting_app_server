import express from 'express';
import { createBudget } from '../controllers/budget.controller';

const router = express.Router();

router.route('/').post(createBudget);

export default router;
