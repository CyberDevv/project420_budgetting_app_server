import express from 'express';
import { getAllGoals, createGoal, deleteGoal } from '../controllers/goal.controller';

const router = express.Router();

router.get('/goals', getAllGoals);
router.post('/create-goal', createGoal);
router.delete('/delete/:goal', deleteGoal);

export default router;
