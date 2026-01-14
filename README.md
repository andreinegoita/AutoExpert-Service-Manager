# AutoExpert Manager - Professional README

A full-stack vehicle management and service booking platform built with modern web technologies. Manage your fleet, schedule maintenance, and track service history with ease.

## 🚀 Features

### Client Features
- **Digital Garage**: Register and manage multiple vehicles with detailed information (VIN, license plate, year, mileage)
- **Service Booking**: Schedule appointments for vehicle maintenance with real-time availability
- **Service History**: View complete appointment history with status tracking and costs
- **Document Tracking**: Monitor RCA, ITP, and Rovinieta expiration dates with visual alerts
- **PDF Reports**: Export service history as professional PDF documents
- **Vehicle Analytics**: Dashboard with cost analysis charts and maintenance statistics

### Admin Features
- **User Management**: View and manage all registered clients
- **Appointment Control**: Review all appointments across the platform with status updates
- **Revenue Tracking**: Monitor total income from completed services
- **Real-time Dashboard**: Track pending appointments, daily schedules, and system statistics

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library with hooks and latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization and charts
- **Axios** - HTTP client for API requests
- **React Router v7** - Client-side routing
- **React Hot Toast** - Toast notifications

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **PDFKit** - PDF generation
- **Multer** - File upload handling
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Testing & Build Tools
- **Jest** - Unit and integration testing
- **ts-jest** - TypeScript support for Jest
- **ts-node** - TypeScript execution for Node.js
- **Nodemon** - Auto-restart during development

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auto-expert-project
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with the following:
PORT=5000
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=autoexpertmanager
DB_PORT=5432
JWT_SECRET=cheie_secreta_foarte_lunga_pentru_token

# Create uploads directory
mkdir uploads

# Start the development server
npm run dev

# Run tests
npm test
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📚 Project Structure

```
auto-expert-project/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── interfaces/    # TypeScript interfaces
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── tests/         # Test suites
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Application entry point
│   ├── uploads/           # User-uploaded files
│   ├── jest.config.js     # Jest configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # Context API (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main App component
│   │   └── index.tsx      # React entry point
│   ├── public/            # Static assets
│   ├── tailwind.config.js # Tailwind configuration
│   └── package.json
│
└── README.md
```

## 🔐 Authentication & Security

- **JWT-based authentication** with 2-hour token expiration
- **Password hashing** using bcrypt with salt rounds
- **Protected routes** requiring valid authentication tokens
- **Role-based access control** (Admin vs Client)
- **Secure file uploads** with multer validation

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vehicle Endpoints
- `GET /api/vehicles` - Get user's vehicles
- `POST /api/vehicles` - Add new vehicle (with image upload)
- `PUT /api/vehicles/:id` - Update vehicle details
- `DELETE /api/vehicles/:id` - Delete vehicle

### Appointment Endpoints
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user's appointments
- `PATCH /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/export-pdf` - Export history as PDF

### Admin Endpoints
- `GET /api/admin/users` - List all users with roles and registration dates
- `GET /api/admin/appointments` - List all appointments with client names, services, and vehicle info
- `PATCH /api/admin/appointments/:id` - Update appointment status
- `DELETE /api/vehicles/:id` - Delete vehicle record

### Data Endpoints
- `GET /api/brands` - Get car brands
- `GET /api/models/:brandId` - Get models by brand
- `GET /api/services` - Get available services
- `GET /api/dashboard-stats` - Get user statistics

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables on hosting platform
2. Ensure PostgreSQL database is accessible
3. Run migrations if needed
4. Deploy with: `git push <remote> main`

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the application: `npm run build`
2. Connect repository to hosting platform
3. Set environment variables (API base URL)
4. Deploy automatically on push

## 🎨 UI/UX Highlights

- **Dark-themed interface** with gradient accents
- **Responsive design** for mobile and desktop
- **Smooth animations** with Framer Motion
- **Real-time notifications** with React Hot Toast
- **Interactive charts** for cost analysis
- **Modal dialogs** for vehicle and appointment details
- **Document status badges** with visual alerts

## 📝 License

This project is private and proprietary.

## 👥 Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: January 14, 2026