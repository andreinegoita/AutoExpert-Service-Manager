import { Router } from 'express';
import { login, register } from '../controllers/AuthController';
import { addVehicle, getVehicles } from '../controllers/VehicleController';
import { createAppointment, getMyAppointments } from '../controllers/AppointmentController';
import { getBrands, getModels, getServices } from '../controllers/DataController';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/StatsControlles';

const router = Router();


router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/vehicles', protect, getVehicles);
router.post('/vehicles', protect, addVehicle);

router.post('/appointments', protect, createAppointment);
router.get('/appointments', protect, getMyAppointments);

router.get('/services', getServices); 
router.get('/brands', getBrands);     
router.get('/models/:brandId', getModels); 

router.get('/dashboard/stats', protect, getDashboardStats);
export default router;