import { Response } from 'express';
import { pool } from '../config/db';

export const getAllUsers = async (req: any, res: Response) => {
    const result = await pool.query('SELECT id, full_name, email, role_id, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
};

export const getAllAppointments = async (req: any, res: Response) => {
    const query = `
        SELECT a.id, a.appointment_date, a.status, a.total_cost, 
               u.full_name as client_name, s.service_name, v.plate_number
        FROM appointments a
        JOIN vehicles v ON a.vehicle_id = v.id
        JOIN users u ON v.owner_id = u.id
        JOIN services s ON a.service_id = s.id
        ORDER BY a.appointment_date DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
};

export const updateAppointmentStatus = async (req: any, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; 
    
    await pool.query('UPDATE appointments SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Status actualizat' });
};