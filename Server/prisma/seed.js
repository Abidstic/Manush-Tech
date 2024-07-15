import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Seed Roles
    const roles = [{ roleName: 'Admin' }, { roleName: 'User' }];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { roleName: role.roleName },
            update: {},
            create: role,
        });
    }

    // Seed Users
    const adminRole = await prisma.role.findUnique({
        where: { roleName: 'Admin' },
    });
    const userRole = await prisma.role.findUnique({
        where: { roleName: 'User' },
    });

    const users = [
        {
            email: 'admin@example.com',
            password: 'admin123',
            name: 'Admin User',
            roleId: adminRole.id,
        },
        {
            email: 'user1@example.com',
            password: 'user123',
            name: 'Regular User 1',
            roleId: userRole.id,
        },
        {
            email: 'user2@example.com',
            password: 'user123',
            name: 'Regular User 2',
            roleId: userRole.id,
        },
        {
            email: 'banneduser@example.com',
            password: 'banned123',
            name: 'Banned User',
            roleId: userRole.id,
            isBanned: true,
        },
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.users.upsert({
            where: { email: user.email },
            update: {},
            create: {
                ...user,
                password: hashedPassword,
            },
        });
    }

    // Seed Items
    const items = [
        { itemName: 'Chicken Curry', category: 'Protein' },
        { itemName: 'Rice', category: 'Starch' },
        { itemName: 'Fish Curry', category: 'Protein' },
        { itemName: 'Egg Curry', category: 'Protein' },
        { itemName: 'Egg Bhorta', category: 'Protein' },
        { itemName: 'Potato Bhorta', category: 'Vegetables' },
        { itemName: 'Daal', category: 'Protein' },
        { itemName: 'Begun Bhaji', category: 'Vegetables' },
    ];

    for (const item of items) {
        await prisma.item.upsert({
            where: { itemName: item.itemName },
            update: {},
            create: item,
        });
    }

    // Seed Meals
    const meals = [
        { mealName: 'Breakfast' },
        { mealName: 'Lunch' },
        { mealName: 'Dinner' },
    ];

    for (const meal of meals) {
        await prisma.meal.upsert({
            where: { mealName: meal.mealName },
            update: {},
            create: meal,
        });
    }

    // Seed MealItems (associating items with meals)
    const breakfast = await prisma.meal.findUnique({
        where: { mealName: 'Breakfast' },
    });
    const lunch = await prisma.meal.findUnique({
        where: { mealName: 'Lunch' },
    });
    const dinner = await prisma.meal.findUnique({
        where: { mealName: 'Dinner' },
    });

    const mealItems = [
        { mealId: breakfast.id, itemName: 'Egg Bhorta' },
        { mealId: breakfast.id, itemName: 'Rice' },
        { mealId: lunch.id, itemName: 'Chicken Curry' },
        { mealId: lunch.id, itemName: 'Rice' },
        { mealId: lunch.id, itemName: 'Daal' },
        { mealId: dinner.id, itemName: 'Fish Curry' },
        { mealId: dinner.id, itemName: 'Rice' },
        { mealId: dinner.id, itemName: 'Begun Bhaji' },
    ];

    for (const mealItem of mealItems) {
        const item = await prisma.item.findUnique({
            where: { itemName: mealItem.itemName },
        });
        await prisma.mealItem.create({
            data: { mealId: mealItem.mealId, itemId: item.id },
        });
    }

    // Seed MealSchedules (for a week)
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    for (const day of daysOfWeek) {
        await prisma.mealSchedule.create({
            data: { mealId: breakfast.id, dayOfWeek: day },
        });
        await prisma.mealSchedule.create({
            data: { mealId: lunch.id, dayOfWeek: day },
        });
        await prisma.mealSchedule.create({
            data: { mealId: dinner.id, dayOfWeek: day },
        });
    }

    // Seed Orders
    const user1 = await prisma.users.findUnique({
        where: { email: 'user1@example.com' },
    });
    const user2 = await prisma.users.findUnique({
        where: { email: 'user2@example.com' },
    });

    const schedules = await prisma.mealSchedule.findMany();

    // Create orders for the next 7 days
    for (let i = 0; i < 7; i++) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() + i);

        await prisma.order.create({
            data: {
                userId: user1.id,
                scheduleId: schedules[i * 3].id, // Breakfast
                orderDate,
            },
        });

        await prisma.order.create({
            data: {
                userId: user2.id,
                scheduleId: schedules[i * 3 + 1].id, // Lunch
                orderDate,
            },
        });
    }

    console.log('Seed data has been inserted.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
