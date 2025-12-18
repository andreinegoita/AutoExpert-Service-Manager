import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppointmentModel } from '../models/AppointmentModel';

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { vehicleId, serviceId, date, notes } = req.body;
        const appointment = await AppointmentModel.create(vehicleId, serviceId, date, notes);
        res.status(201).json(appointment);
    } catch (err: any) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await AppointmentModel.getAllByOwner(req.user.id);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};