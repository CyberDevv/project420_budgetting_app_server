import express from 'express';
import { setBalance, getBalance } from '../controllers/balance.controller';

const router = express.Router();

router.route('/').get(getBalance).patch(setBalance);

export default router;
