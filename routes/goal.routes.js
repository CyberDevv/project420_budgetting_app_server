import express from 'express';
import { getAllGoals, createGoal, deleteGoal, addSavings } from '../controllers/goal.controller';

const router = express.Router();

router.get('/goals', getAllGoals);
router.post('/create-goal', createGoal);
router.delete('/delete/:goal', deleteGoal);
router.patch('/:goalId', addSavings);

export default router;
