import pool from '../config/database.js'

export const getTransactions = async (req, res, next) => {
    try {
        const { type, category_id, date_from, date_to } = req.query
        let query = `
            SELECT t.*, c.name AS category_name, c.icon AS category_icon
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
            `
        const params = [req.user.id]
        if (type) {
            query += ' AND t.type = ?'
            params.push(type)
        }

        if (category_id) {
            query += ' AND t.category_id = ?'
            params.push(category_id)
        }

        if (date_from && !isNaN(Date.parse(date_from))) {
            query += ' AND t.date >= ?'
            params.push(date_from)
        }

        if (date_to && !isNaN(Date.parse(date_to))) {
            query += ' AND t.date <= ?'
            params.push(date_to)
        }
        query += ' ORDER BY t.date DESC, t.created_at DESC'
        const [rows] = await pool.query(query, params)
        res.json(rows)
    } catch (err) { next(err) }
}

export const createTransaction = async (req, res, next) => {
    try {
        const { category_id, amount, type, description, date } = req.body
        if (!category_id || !amount || !type || !date)
            return res.status(400).json({ error: 'Champs requis manquants' })
        if (!['income', 'expense'].includes(type))
            return res.status(400).json({ error: 'Type invalide' })
        if (isNaN(amount) || Number(amount) <= 0)
            return res.status(400).json({ error: 'Montant doit etre positif' })
        const [result] = await pool.query(
            `INSERT INTO transactions(user_id, category_id, amount, type, description, date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, category_id, amount, type, description || null, date]
        )
        const [rows] = await pool.query(
            `SELECT t.*, c.name AS category_name, c.icon AS category_icon
            FROM transactions t JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?`, [result.insertId]
        )
        res.status(201).json(rows[0])
    } catch (err) { next(err) }
}

export const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        const { category_id, amount, type, description, date } = req.body
        const [check] = await pool.query(
            'SELECT id FROM transactions WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        )
        if (!check[0]) return res.status(404).json({ error: 'Transaction introuvable' })
        await pool.query(
            'UPDATE transactions SET category_id=?,amount=?,type=?,description=?,date=? WHERE id=?',
            [category_id, amount, type, description || null, date, id]
        )
        const [rows] = await pool.query(
            `SELECT t.*, c.name AS category_name, c.icon AS category_icon
            FROM transactions t JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?`, [id]
        )
        res.json(rows[0])
    } catch (err) { next(err) }
}

export const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        const [check] = await pool.query(
            'SELECT id FROM transactions WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        )
        if (!check[0]) return res.status(404).json({ error: 'Transaction introuvable' })
        await pool.query('DELETE FROM transactions WHERE id = ?', [id])
        res.status(204).send()
    } catch (err) { next(err) }
}