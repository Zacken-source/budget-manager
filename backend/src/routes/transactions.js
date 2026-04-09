import { Router } from "express";
import {
    getTransactions, createTransaction, updateTransaction, deleteTransaction, getStats, exportCSV
} from "../controllers/transactionControllers.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get('/stats', getStats);
router.get('/export', exportCSV);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);


export default router;