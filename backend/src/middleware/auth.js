import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    try {
        const token = header.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ error: 'Token invalide ou expire' });
    }
};