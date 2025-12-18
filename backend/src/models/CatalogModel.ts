import { pool } from '../config/db';

export class CatalogModel {
    static async getBrands() {
        const result = await pool.query('SELECT * FROM brands ORDER BY name ASC');
        return result.rows;
    }

    static async getModelsByBrand(brandId: number) {
        const result = await pool.query('SELECT * FROM car_models WHERE brand_id = $1', [brandId]);
        return result.rows;
    }
}