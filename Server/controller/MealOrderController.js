import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// View weekly meal schedules
export async function getWeeklyMealSchedule(req, res) {
    try {
        const weeklySchedule = await prisma.mealSchedule.findMany({
            where: {
                dayOfWeek: {
                    in: [
                        'Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                    ],
                },
            },
            include: {
                meal: true,
            },
            orderBy: {
                dayOfWeek: 'asc',
            },
        });

        res.json(weeklySchedule);
    } catch (error) {
        console.error('Error fetching weekly meal schedule:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Select and update meal choices
export async function updateMealChoice(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, scheduleId, orderDate } = req.body;

    try {
        const currentDate = new Date();
        const orderDateObj = new Date(orderDate);

        if (orderDateObj < currentDate) {
            return res
                .status(400)
                .json({ message: 'Cannot modify meals for previous days' });
        }

        const order = await prisma.order.upsert({
            where: {
                userId_scheduleId_orderDate: {
                    userId: parseInt(userId),
                    scheduleId: parseInt(scheduleId),
                    orderDate: orderDateObj,
                },
            },
            update: {},
            create: {
                userId: parseInt(userId),
                scheduleId: parseInt(scheduleId),
                orderDate: orderDateObj,
            },
        });

        res.json(order);
    } catch (error) {
        console.error('Error updating meal choice:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Schedule meals for an entire month
export async function scheduleMonthlyMeals(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, month, year, mealChoices } = req.body;

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const orders = [];

        for (
            let date = startDate;
            date <= endDate;
            date.setDate(date.getDate() + 1)
        ) {
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
            const mealChoice = mealChoices[dayOfWeek] || null;

            if (mealChoice) {
                const order = await prisma.order.create({
                    data: {
                        userId: parseInt(userId),
                        scheduleId: parseInt(mealChoice),
                        orderDate: new Date(date),
                    },
                });
                orders.push(order);
            }
        }

        res.json(orders);
    } catch (error) {
        console.error('Error scheduling monthly meals:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Get user's meal orders
export async function getUserMealOrders(req, res) {
    const userId = req.params.userId;

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: parseInt(userId),
            },
            include: {
                mealSchedule: {
                    include: {
                        meal: true,
                    },
                },
            },
            orderBy: {
                orderDate: 'asc',
            },
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user meal orders:', error);
        res.status(500).send('Internal Server Error');
    }
}
