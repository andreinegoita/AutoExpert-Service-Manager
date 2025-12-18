import { Response } from 'express';
import { AuthRequest } from '../interfaces/AppInterfaces';
import { pool } from '../config/db';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const carsQuery = await pool.query(
            'SELECT COUNT(*) FROM vehicles WHERE owner_id = $1', 
            [userId]
        );

        const costQuery = await pool.query(
            "SELECT SUM(total_cost) FROM appointments a JOIN vehicles v ON a.vehicle_id = v.id WHERE v.owner_id = $1 AND a.status = 'completed'",
            [userId]
        );

        const nextApptQuery = await pool.query(`
            SELECT a.appointment_date, s.service_name 
            FROM appointments a 
            JOIN vehicles v ON a.vehicle_id = v.id
            JOIN services s ON a.service_id = s.id
            WHERE v.owner_id = $1 AND a.appointment_date > NOW()
            ORDER BY a.appointment_date ASC 
            LIMIT 1
        `, [userId]);

        res.json({
            totalCars: parseInt(carsQuery.rows[0].count),
            totalSpent: parseFloat(costQuery.rows[0].sum || '0'),
            nextAppointment: nextApptQuery.rows[0] || null
        });

    } catch (err) {
        res.status(500).json({ error: 'Eroare la calcularea statisticilor.' });
    }
};