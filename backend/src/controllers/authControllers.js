import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const signToken = (user) =>
    jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
    );

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' })
        };
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }   
        const hash = await bcrypt.hash(password, 12);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hash]
        );
        const user = { id: result.insertId, email };
        res.status(201).json({ token: signToken(user),
            user: {id: user.id, username, email: user.email},
         });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email ou username déjà pris' });
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }
        const {password: _pwd, ...safeUser} = user;
        res.json({ token: signToken(safeUser),
            user: safeUser });

        const isValid = await bcrypt.compare(password, user.password);

        console.log("RESULT:", isValid);
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email FROM users WHERE id = ?',
            [req.user.id]
        );
        if (!rows[0]) {
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};
