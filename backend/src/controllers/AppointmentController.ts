import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AppointmentModel } from '../models/AppointmentModel';
import PDFDocument from 'pdfkit';
import { pool } from '../config/db';

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Neautorizat' });
        }

        const { vehicleId, serviceId, date, notes } = req.body;

        const appointment = await AppointmentModel.create(
            vehicleId,
            serviceId,
            date,
            notes
        );

        res.status(201).json(appointment);
    } catch (err: any) {
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Neautorizat' });
        }

        const appointments = await AppointmentModel.getAllByOwner(req.user.id);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const exportAppointmentsPDF = async (req: any, res: any) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                a.appointment_date, 
                s.service_name, 
                v.plate_number, 
                b.name as brand_name,    -- Luăm brandul din tabela brands (alias b)
                m.model_name,            -- Luăm modelul din tabela models (alias m)
                a.status, 
                a.total_cost
            FROM appointments a
            JOIN vehicles v ON a.vehicle_id = v.id
            JOIN car_models m ON v.model_id = m.id  -- JOIN NOU
            JOIN brands b ON m.brand_id = b.id      -- JOIN NOU
            JOIN services s ON a.service_id = s.id
            WHERE v.owner_id = $1
            ORDER BY a.appointment_date DESC
        `;
        
        const result = await pool.query(query, [userId]);
        const appointments = result.rows;

        console.log("Date pentru PDF:", appointments);

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Istoric_Service_${Date.now()}.pdf`);

        doc.pipe(res);

        
        doc.fontSize(20).text('Raport Istoric Service - AutoExpert', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generat la: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();
        
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        if (appointments.length === 0) {
            doc.fontSize(14).text("Nu există istoric de service pentru acest cont.", { align: 'center' });
        } else {
            appointments.forEach((app) => {
                doc.fontSize(12).font('Helvetica-Bold')
                   .text(`${new Date(app.appointment_date).toLocaleDateString()} - ${app.service_name}`);
                
                doc.font('Helvetica').fontSize(10)
                   .text(`Vehicul: ${app.brand_name} ${app.model_name} (${app.plate_number})`);
                
                doc.text(`Cost: ${app.total_cost} RON | Status: ${app.status.toUpperCase()}`);
                
                doc.moveDown(0.5);
                doc.moveTo(50, doc.y).lineTo(550, doc.y).opacity(0.2).stroke().opacity(1);
                doc.moveDown(0.5);
            });

            const total = appointments.reduce((sum: number, item: any) => sum + Number(item.total_cost), 0);
            doc.moveDown();
            doc.fontSize(14).font('Helvetica-Bold').text(`Total Cheltuieli: ${total} RON`, { align: 'right' });
        }

        doc.end();
    } catch (err) {
        console.error("❌ Eroare generare PDF:", err); 
        res.status(500).json({ error: 'Eroare la generarea PDF-ului' });
    }
};