import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json()); 

app.use('/api', apiRoutes);
app.use(errorHandler)

const uploadsPath = path.resolve('uploads');
console.log(`📂 Servim fișiere statice din: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

app.listen(PORT, () => {
    console.log(`🚀 Serverul rulează pe http://localhost:${PORT}`);
});