import { pool } from '../config/db';

export class ServiceModel {
    static async getAll() {
        const result = await pool.query('SELECT * FROM services ORDER BY base_price ASC');
        return result.rows;
    }
}