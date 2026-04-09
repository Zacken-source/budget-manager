import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getCategories, createCategory } from '../controllers/categoryControllers.js';

const router = Router();

router.use(requireAuth);

router.get('/', getCategories);
router.post('/', createCategory);

export default router;