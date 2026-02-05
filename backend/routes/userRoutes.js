import express from 'express';
import {
    createUser,
    getUserById,
    getAllUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);

export default router;