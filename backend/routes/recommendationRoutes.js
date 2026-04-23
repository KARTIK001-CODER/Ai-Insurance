import express from 'express';
import { createRecommendation } from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/recommend', createRecommendation);

export default router;
