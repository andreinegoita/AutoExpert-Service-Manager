import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { VehicleModel } from '../models/VehicleModel';
import { ValidationException } from '../utils/AppError';

export const getVehicles = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Neautorizat' });
        }

        const vehicles = await VehicleModel.getAllByUser(req.user.id);
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const addVehicle = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Neautorizat' });
        }

        const { modelId, vin, plate, year } = req.body;

        if (vin.length !== 17) {
            throw new ValidationException("VIN invalid (trebuie 17 caractere)");
        }

        const newVehicle = await VehicleModel.create(
            req.user.id,
            modelId,
            vin,
            plate,
            year
        );

        res.status(201).json(newVehicle);
    } catch (err: any) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};

