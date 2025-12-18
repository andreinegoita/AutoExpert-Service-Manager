import { pool } from '../config/db';

export class VehicleModel {
    static async getAllByUser(userId: number) {
        const query = `
            SELECT v.id, v.plate_number, v.vin, v.manufacture_year, m.model_name, b.name as brand
            FROM vehicles v
            JOIN car_models m ON v.model_id = m.id
            JOIN brands b ON m.brand_id = b.id
            WHERE v.owner_id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async create(userId: number, modelId: number, vin: string, plate: string, year: number, imageUrl?: string) {
        const query = `
            INSERT INTO vehicles (owner_id, model_id, vin, plate_number, manufacture_year, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        const result = await pool.query(query, [userId, modelId, vin, plate, year, imageUrl || null]);
        return result.rows[0];
    }
}