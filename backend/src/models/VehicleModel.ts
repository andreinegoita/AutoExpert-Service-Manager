import { pool } from "../config/db";

export class VehicleModel {
  static async getAllByUser(userId: number) {
    const query = `
            SELECT v.id, v.plate_number, v.vin, v.manufacture_year, v.image_url, 
                   v.itp_expiry, v.rca_expiry, v.rovinieta_expiry, v.mileage,
                   m.model_name, b.name as brand
            FROM vehicles v
            JOIN car_models m ON v.model_id = m.id
            JOIN brands b ON m.brand_id = b.id
            WHERE v.owner_id = $1
        `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async create(
    userId: number,
    modelId: number,
    vin: string,
    plate: string,
    year: number,
    imageUrl?: string
  ) {
    const query = `
            INSERT INTO vehicles (owner_id, model_id, vin, plate_number, manufacture_year, image_url, mileage) 
            VALUES ($1, $2, $3, $4, $5, $6, 0) 
            RETURNING *
        `;
    const result = await pool.query(query, [
      userId,
      modelId,
      vin,
      plate,
      year,
      imageUrl || null,
    ]);
    return result.rows[0];
  }

  static async delete(vehicleId: number, userId: number) {
    const query = `DELETE FROM vehicles WHERE id = $1 AND owner_id = $2`;
    const result = await pool.query(query, [vehicleId, userId]);
    return (result.rowCount || 0) > 0;
  }

  static async update(id: number, userId: number, data: any) {
    const fields = [];
    const values = [];
    let idx = 1;

    if (data.plate_number) { fields.push(`plate_number = $${idx++}`); values.push(data.plate_number); }
    if (data.vin) { fields.push(`vin = $${idx++}`); values.push(data.vin); }
    if (data.manufacture_year) { fields.push(`manufacture_year = $${idx++}`); values.push(data.manufacture_year); }
    if (data.image_url) { fields.push(`image_url = $${idx++}`); values.push(data.image_url); }
    
    if (data.mileage) { fields.push(`mileage = $${idx++}`); values.push(data.mileage); }
    if (data.itp_expiry) { fields.push(`itp_expiry = $${idx++}`); values.push(data.itp_expiry); }
    if (data.rca_expiry) { fields.push(`rca_expiry = $${idx++}`); values.push(data.rca_expiry); }
    if (data.rovinieta_expiry) { fields.push(`rovinieta_expiry = $${idx++}`); values.push(data.rovinieta_expiry); }

    values.push(id);
    values.push(userId);

    const query = `
        UPDATE vehicles 
        SET ${fields.join(", ")} 
        WHERE id = $${idx++} AND owner_id = $${idx++}
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}