import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categories.js';
import transactionsRoutes from './routes/transactions.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use(errorHandler);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));

export default app;