import { pool } from '../config/db';

export class AppointmentModel {
    static async create(vehicleId: number, serviceId: number, date: string, notes: string) {
        const serviceQuery = await pool.query('SELECT base_price FROM services WHERE id = $1', [serviceId]);
        const price = serviceQuery.rows[0]?.base_price || 0;

        const query = `
            INSERT INTO appointments (vehicle_id, service_id, appointment_date, total_cost, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [vehicleId, serviceId, date, price, notes]);
        return result.rows[0];
    }

    static async getAllByOwner(userId: number) {
        const query = `
            SELECT a.id, a.appointment_date, a.status, a.total_cost, 
                   s.service_name, v.plate_number, b.name as brand
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            JOIN vehicles v ON a.vehicle_id = v.id
            JOIN car_models m ON v.model_id = m.id
            JOIN brands b ON m.brand_id = b.id
            WHERE v.owner_id = $1
            ORDER BY a.appointment_date DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
}