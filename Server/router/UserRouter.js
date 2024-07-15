import express from 'express';
import {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
} from '../controller/UserController.js';
import verifyToken from '../middleware/VerifyToken.js';
import { userValidationRules, validate } from '../middleware/Validation.js';

const router = express.Router();
router.get('/', getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', verifyToken, getUserById);
router.put('/update/:id', verifyToken, updateUser);
router.delete('/user/:id', verifyToken, deleteUser);

export default router;
