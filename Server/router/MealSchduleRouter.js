// routes/mealScheduleRoutes.js

import express from 'express';
import {
    getMealChoicesForAllUsers,
    getMealChoicesForUser,
} from '../controller/MealScheduleController.js';
import verifyToken from '../middleware/VerifyToken.js';

const router = express.Router();

// Route to get meal choices for all users (admin only)
router.get('/all', verifyToken, getMealChoicesForAllUsers);

// Route to get meal choices for a specific user
router.get('/user/:userId', verifyToken, getMealChoicesForUser);

export default router;
