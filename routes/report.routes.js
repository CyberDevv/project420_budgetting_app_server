import express from 'express';
import { generateExpenseReport } from '../controllers/report.controller';

const router = express.Router();

router.post('/gen-report', generateExpenseReport);

export default router;