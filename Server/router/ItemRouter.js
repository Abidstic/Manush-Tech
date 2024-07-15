import express from 'express';
import * as itemController from '../controller/ItemController.js';
import verifyToken from '../middleware/VerifyToken.js';

const router = express.Router();

router.get('/', itemController.getAllItems);
router.post('/addItems', verifyToken, itemController.createItem);
router.put('/:id', verifyToken, itemController.updateItem);
router.delete('/delete/:id', verifyToken, itemController.deleteItem);
router.get('/category/:category', itemController.getItemsByCategory);

export default router;
