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
        const { modelId, vin, plate, year } = req.body;
        
        let imageUrl = req.body.image_url; 
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        if (vin.length !== 17) throw new ValidationException("VIN trebuie sa aiba 17 caractere!");

        const parsedModelId = parseInt(modelId);
        const parsedYear = parseInt(year);

        const car = await VehicleModel.create(
            req.user!.id, 
            parsedModelId, 
            vin, 
            plate, 
            parsedYear, 
            imageUrl
        );
        
        res.status(201).json(car);
    } catch (err: any) {
        console.error(err); 
        res.status(err.statusCode || 500).json({ error: err.message });
    }
};

