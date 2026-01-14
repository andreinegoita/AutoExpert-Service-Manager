import { VehicleModel } from '../models/VehicleModel';
import { pool } from '../config/db';
import { ValidationException } from '../utils/AppError';

jest.mock('../config/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('VehicleModel Tests', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('1. Should return a list of vehicles for a user', async () => {
        const mockVehicles = [{ id: 1, plate: 'B100ABC' }];
        (pool.query as jest.Mock).mockResolvedValue({ rows: mockVehicles });

        const result = await VehicleModel.getAllByUser(1);
        expect(result).toEqual(mockVehicles);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('2. Should create a vehicle if VIN has 17 chars', async () => {
        const mockCar = { id: 1, vin: '12345678901234567' };
        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockCar] });

        const result = await VehicleModel.create(1, 1, '12345678901234567', 'B123TST', 2020);
        expect(result).toEqual(mockCar);
    });

    it('3. Should handle database errors gracefully', async () => {
        (pool.query as jest.Mock).mockRejectedValue(new Error('DB Connection Failed'));

        await expect(VehicleModel.getAllByUser(1))
            .rejects
            .toThrow('DB Connection Failed');
    });

    it('4. Should use correct SQL query with parameters', async () => {
        (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
        
        await VehicleModel.getAllByUser(5);
        
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT'), 
            [5]
        );
    });

    it('5. Should return empty array if user has no vehicles', async () => {
        (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
        const result = await VehicleModel.getAllByUser(99);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
});