import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { AuthRequest } from '../interfaces/AppInterfaces'; 

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            const result = await pool.query(
                'SELECT id, full_name, email, role_id FROM users WHERE id = $1', 
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Utilizatorul nu mai există.' });
            }

            req.user = result.rows[0];
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token invalid, autorizare eșuată.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Nu există token, autorizare refuzată.' });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("🕵️ ADMIN CHECK - User primit:", req.user); 

    if (req.user && req.user.role_id === 1) {
        next();
    } else {
        res.status(403).json({ message: 'Acces interzis. Doar pentru administratori.' });
    }
};

export { AuthRequest };
