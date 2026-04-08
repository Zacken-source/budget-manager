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

export const getStats = async (req, res, next) => {
    try {
        const uid = req.user.id
        const [summary] = await pool.query(
            `SELECT
                COALSESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expense
            FROM transactions WHERE user_id = ?`, [uid]
        )
        const [byCategory] = await pool.query(
            `SELECT c.name, c.icon, c.type, COALESCE(SUM(t.amount), 0) AS total
            FROM transactions t JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? GROUP BY c.id, t.type ORDER BY total DESC`, [uid]
        )
        const [byMonth] = await pool.query(
            `SELECT DATE_FORMAT(date, '%Y-%m') AS month,
            COALESCE(SUM(CASE WHEN type='income' THEN amount END), 0) AS income,
            COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0) AS expenses
            FROM transactions
            WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY month ORDER BY month ASC`, [uid]
        )
        res.json({ summary: summary[0], byCategory, byMonth })
    } catch (err) { next(err) }
}

export const exportCSV = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT t.date, t.type, t.amount, c.name AS category, t.description
            FROM transactions t JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? ORDER BY t.date DESC`, [req.user.id]
        )
        const header = 'Date,Type,Montant,Catégorie,Description'
        const line = rows.map(r => `${r.date},${r.type},${r.amount},${r.category},"${r.description ?? ''}"`
        )
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"')
        res.send([header, ...line].join('\n'))
    } catch (err) { next(err) }
}