import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getUserStatsController } from '../controller/userStats.controller';

const router = express.Router();

router.get('/stats', authenticate, getUserStatsController);

export default router;
