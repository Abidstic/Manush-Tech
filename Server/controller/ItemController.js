import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Get all items
export async function getAllItems(req, res) {
    try {
        const items = await prisma.item.findMany();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new item
export async function createItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { itemName, category } = req.body;
    try {
        const newItem = await prisma.item.create({
            data: { itemName, category },
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update an existing item
export async function updateItem(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { itemName, category } = req.body;
    try {
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data: { itemName, category },
        });
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete an item
export async function deleteItem(req, res) {
    const { id } = req.params;
    try {
        await prisma.item.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get items by category
export async function getItemsByCategory(req, res) {
    const { category } = req.params;
    try {
        const items = await prisma.item.findMany({
            where: { category },
        });
        res.json(items);
    } catch (error) {
        console.error('Error fetching items by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
