import express from 'express';
import { getAllGoals, createGoal, deleteGoal } from '../controllers/goal.controller';

const router = express.Router();

router.route('/').get(getAllGoals).post(createGoal);
router.route('/:id').get(getAllGoals).delete(createGoal);

export default router;
