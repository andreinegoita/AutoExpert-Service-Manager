import { Router } from 'express';
import { login, register } from '../controllers/AuthController';
import { addVehicle, getVehicles, deleteVehicle, updateVehicle } from '../controllers/VehicleController';
import { createAppointment, getMyAppointments, exportAppointmentsPDF } from '../controllers/AppointmentController';
import { getBrands, getModels, getServices } from '../controllers/DataController';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/StatsControlles';
import { getAllUsers, getAllAppointments, updateAppointmentStatus } from '../controllers/AdminController';

import { adminOnly } from '../middleware/authMiddleware';
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
router.delete('/vehicles/:id', protect, deleteVehicle);
router.put('/vehicles/:id', protect, upload.single('image'), updateVehicle);

router.post('/appointments', protect, createAppointment);
router.get('/appointments', protect, getMyAppointments);
router.get('/appointments/export-pdf', protect, exportAppointmentsPDF);

router.get('/services', getServices); 
router.get('/brands', getBrands);     
router.get('/models/:brandId', getModels);  

router.get('/dashboard-stats', protect, getDashboardStats);

router.get('/admin/users', protect, adminOnly, getAllUsers);
router.get('/admin/appointments', protect, adminOnly, getAllAppointments);
router.patch('/admin/appointments/:id', protect, adminOnly, updateAppointmentStatus);



export default router;