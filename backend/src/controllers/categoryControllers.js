import pool from '../config/database.js';

export const getCategories = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, icon FROM categories WHERE user_id = ? ORDER BY name', [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, type, icon } = req.body;
        if (!name || !type) {
            return res.status(400).json({ error: 'Le nom et le type sont requis' });
        }
        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type de catégorie invalide' });
        }
        const [result] = await pool.query(
            'INSERT INTO categories (name, type, icon, user_id) VALUES (?, ?, ?, ?)',
            [name, type, icon || null, req.user.id]
        );
        res.status(201).json({ id: result.insertId, name, type, icon: icon || null });
    } catch (error) {
        next(error);
    }
};