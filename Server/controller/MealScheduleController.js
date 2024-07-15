// controllers/MealScheduleController.js

import { PrismaClient } from '@prisma/client';
import { isAdmin } from '../middleware/AuthAdmin.js';

const prisma = new PrismaClient();

export const getMealChoicesForAllUsers = async (req, res) => {
    try {
        
        if (!isAdmin(req.user)) {
            return res
                .status(403)
                .json({ message: 'Access denied. Admin only.' });
        }

        const mealChoices = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                mealSchedule: {
                    include: {
                        meal: true,
                    },
                },
            },
            orderBy: {
                orderDate: 'desc',
            },
        });

        const formattedMealChoices = mealChoices.map((choice) => ({
            userId: choice.user.id,
            userName: choice.user.name,
            userEmail: choice.user.email,
            mealName: choice.mealSchedule.meal.mealName,
            dayOfWeek: choice.mealSchedule.dayOfWeek,
            orderDate: choice.orderDate,
        }));

        res.json(formattedMealChoices);
    } catch (error) {
        console.error('Error fetching meal choices:', error);
        res.status(500).json({ message: 'Error fetching meal choices' });
    }
};


export const getMealChoicesForUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        
        if (!isAdmin(req.user) && req.user.id !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const mealChoices = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                mealSchedule: {
                    include: {
                        meal: true,
                    },
                },
            },
            orderBy: {
                orderDate: 'desc',
            },
        });

        const formattedMealChoices = mealChoices.map((choice) => ({
            mealName: choice.mealSchedule.meal.mealName,
            dayOfWeek: choice.mealSchedule.dayOfWeek,
            orderDate: choice.orderDate,
        }));

        res.json(formattedMealChoices);
    } catch (error) {
        console.error('Error fetching meal choices for user:', error);
        res.status(500).json({
            message: 'Error fetching meal choices for user',
        });
    }
};
