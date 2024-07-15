import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

const generateToken = (userId, userRole) => {
    return jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export async function registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, roleId } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                name,
                roleId,
            },
        });

        const token = generateToken(user.id, user.roleId);

        res.status(201).json({ userId: user.id, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        const token = generateToken(user.id, user.roleId);
        res.json({
            userId: user.id,
            token,
            role: user.roleId,
            isBanned: user.isBanned,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function getUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await prisma.users.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function updateUser(req, res) {
    const userId = req.params.id;
    const { name, email, roleId, isBanned } = req.body;

    try {
        const user = await prisma.users.update({
            where: { id: parseInt(userId) },
            data: {
                name,
                email,
                roleId,
                isBanned,
            },
        });
        console.log(user);
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

export async function deleteUser(req, res) {
    const userId = req.params.id;

    try {
        await prisma.users.delete({
            where: { id: parseInt(userId) },
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
}
