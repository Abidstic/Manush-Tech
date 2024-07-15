

import express from 'express';
import {
    getMealChoicesForAllUsers,
    getMealChoicesForUser,
} from '../controller/MealScheduleController.js';
import verifyToken from '../middleware/VerifyToken.js';

const router = express.Router();


router.get('/all', verifyToken, getMealChoicesForAllUsers);


router.get('/user/:userId', verifyToken, getMealChoicesForUser);

export default router;
