import { Request } from 'express';

export interface IVehicleAction {
    getFullDescription(): string;
    calculateTax(): number;
}

export interface AuthRequest extends Request {
    user?: {
        id: number;
        role_id: number;
    };
}

export interface IVehicleDTO {
    id: number;
    owner_id: number;
    model_id: number;
    vin: string;
    plate_number: string;
    manufacture_year: number;
    brand_name?: string; 
    model_name?: string; 
    fuel_type?: string; 
}