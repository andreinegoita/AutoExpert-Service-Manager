import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/AppInterfaces';
import { JwtPayload } from 'jsonwebtoken';

interface JwtUserPayload extends JwtPayload {
    id: number;
    role_id: number;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Neautorizat' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtUserPayload;

        req.user = {
            id: decoded.id,
            role_id: decoded.role_id
        };

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalid' });
    }
};
export { AuthRequest };

