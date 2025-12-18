import { pool } from '../config/db';
import bcrypt from 'bcrypt';

export class UserModel {
    static async create(fullName: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, full_name',
            [fullName, email, hashedPassword]
        );
        return result.rows[0];
    }

    static async findByEmail(email: string) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
}