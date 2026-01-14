import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { VehicleModel } from "../models/VehicleModel";
import { ValidationException } from "../utils/AppError";

export const getVehicles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Neautorizat" });
    }

    const vehicles = await VehicleModel.getAllByUser(req.user.id);
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

export const addVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId, vin, plate, year } = req.body;

    let imageUrl = req.body.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (vin.length !== 17)
      throw new ValidationException("VIN trebuie sa aiba 17 caractere!");

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

export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id);
    const userId = req.user!.id;

    if (isNaN(vehicleId)) {
      return res.status(400).json({ error: "ID invalid" });
    }

    const deleted = await VehicleModel.delete(vehicleId, userId);

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Vehiculul nu a fost găsit sau nu îți aparține." });
    }

    res.json({ message: "Vehicul șters cu succes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la ștergerea vehiculului" });
  }
};

export const updateVehicle = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const updatedCar = await VehicleModel.update(id, userId, updateData);

    if (!updatedCar) {
      return res.status(404).json({ message: "Vehiculul nu a fost găsit." });
    }

    res.json(updatedCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la actualizare" });
  }
};
