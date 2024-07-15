import express from 'express';
import { body } from 'express-validator';
import {
    getWeeklyMealSchedule,
    updateMealChoice,
    scheduleMonthlyMeals,
    getUserMealOrders,
} from '../controller/MealOrderController.js';

const router = express.Router();

router.get('/weekly-schedule', getWeeklyMealSchedule);

router.post(
    '/update-choice',

    [
        body('userId').isInt(),
        body('scheduleId').isInt(),
        body('orderDate').isISO8601(),
    ],

    updateMealChoice
);
router.post(
    '/schedule-month',
    [
        body('userId').isInt(),
        body('month').isInt({ min: 1, max: 12 }),
        body('year').isInt(),
        body('mealChoices').isObject(),
    ],
    scheduleMonthlyMeals
);

router.get('/user-orders/:userId', getUserMealOrders);

export default router;
