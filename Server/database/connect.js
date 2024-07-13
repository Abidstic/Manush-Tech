import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to the database.');

        const tables = await prisma.$queryRaw`
            SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
        `;

        if (tables.length === 0) {
            console.log(
                'No tables found in the database. Please run migrations.'
            );
        } else {
            console.log('Existing tables:');
            tables.forEach((table) => console.log(table.name));
        }

        return prisma;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

export default connectDB;
