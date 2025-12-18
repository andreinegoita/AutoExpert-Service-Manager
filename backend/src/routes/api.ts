import { Router } from 'express';
import { login, register } from '../controllers/AuthController';
import { addVehicle, getVehicles } from '../controllers/VehicleController';
import { createAppointment, getMyAppointments } from '../controllers/AppointmentController';
import { getBrands, getModels, getServices } from '../controllers/DataController';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/StatsControlles';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/vehicles', protect, getVehicles);
router.post('/vehicles', protect, upload.single('image'), async (req: any, res: any) => {
    if (req.file) {
        req.body.image_url = `/uploads/${req.file.filename}`;
    }
    addVehicle(req, res);
});

router.post('/appointments', protect, createAppointment);
router.get('/appointments', protect, getMyAppointments);

router.get('/services', getServices); 
router.get('/brands', getBrands);     
router.get('/models/:brandId', getModels); 

router.get('/dashboard/stats', protect, getDashboardStats);
export default router;