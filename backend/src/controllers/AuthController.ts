import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = await UserModel.create(fullName, email, password);
        res.status(201).json(newUser);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Email sau parolă incorectă' });
        }

        const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
        res.json({ token, user: { id: user.id, name: user.full_name } });
    } catch (err) {
        res.status(500).json({ error: 'Eroare server' });
    }
};