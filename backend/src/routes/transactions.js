import { Router } from "express";
import {
    getTransactions, createTransaction, updateTransaction, deleteTransaction, getStats, exportCSV
} from "../controllers/transactionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/stats', getStats);
router.get('/export', exportCSV);

export default router;