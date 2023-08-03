import express from 'express';
import { getChart } from '../controllers/chart.controller';

const router = express.Router();

router.route('/').get(getChart);

export default router;
