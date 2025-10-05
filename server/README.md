# Case Manager - Backend API

Modern Express.js REST API for case management system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Start server
npm start

# Development with hot reload
npm run dev
```

Server runs on `http://localhost:4000`

---

## 📂 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration
│   │   └── index.js     # Environment variables
│   ├── db/              # Database
│   │   └── mongoose.js  # MongoDB connection
│   ├── middleware/      # Express middleware
│   │   ├── demo.js      # Demo mode
│   │   └── errorHandler.js  # Error handling
│   ├── models/          # Mongoose schemas
│   │   └── Case.js      # Case model
│   ├── routes/          # API routes
│   │   └── cases.js     # Case endpoints
│   ├── services/        # Business logic
│   │   └── excelService.js  # Excel export
│   ├── utils/           # Utilities
│   │   ├── helpers.js   # Helper functions
│   │   └── fieldMap.js  # Field mappings
│   └── index.js         # App entry point
├── .env.example         # Environment template
└── package.json         # Dependencies
```

---

## 🌐 API Endpoints

### Health Check

```
GET /api/health
```

### Cases

```
GET    /api/cases           # List all cases
GET    /api/cases/:id       # Get single case
POST   /api/cases           # Create case
PUT    /api/cases/:id       # Update case
DELETE /api/cases/:id       # Delete case
GET    /api/cases/export    # Export to Excel
```

---

## 🔧 Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/court_cases

# Security
CORS_ORIGIN=*

# Features
DEMO_MODE=0
```

---

## 📝 API Examples

### List Cases

```bash
GET /api/cases?search=john&field=მოსარჩელე&page=1&limit=50
```

### Create Case

```bash
POST /api/cases
Content-Type: application/json

{
  "plaintiff": "John Doe",
  "defendant": "Jane Smith",
  "case_number": "2/1234-23",
  "amount": "5000 ₾"
}
```

### Update Case

```bash
PUT /api/cases/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "amount": "6000 ₾"
}
```

### Delete Case

```bash
DELETE /api/cases/507f1f77bcf86cd799439011
```

### Export to Excel

```bash
GET /api/cases/export?search=&field=
```

---

## 🎯 Features

- ✅ RESTful API design
- ✅ MongoDB + Mongoose
- ✅ Error handling
- ✅ Input validation
- ✅ Search & filter
- ✅ Pagination
- ✅ Excel export
- ✅ Demo mode
- ✅ CORS support
- ✅ In-memory DB fallback (dev)

---

## 📦 Dependencies

```json
{
  "express": "^5.1.0", // Web framework
  "mongoose": "^8.19.0", // MongoDB ODM
  "cors": "^2.8.5", // CORS middleware
  "dotenv": "^17.2.3", // Environment variables
  "exceljs": "^4.4.0", // Excel generation
  "morgan": "^1.10.1" // HTTP logging
}
```

---

## 🏗️ Architecture

### Layered Structure

```
Routes → Controllers → Services → Models → Database
```

### Design Patterns

- **MVC**: Models, Views (JSON), Controllers
- **Middleware**: Modular request processing
- **Repository**: Mongoose as data layer
- **Service**: Business logic separation

---

## 🔒 Security

- Environment-based configuration
- Input normalization
- Error sanitization
- CORS configuration
- Demo mode for public instances

---

## 🚀 Deployment

### Production Build

```bash
npm run start
```

### Environment Variables

Set `NODE_ENV=production` in production

### MongoDB Setup

- Use hosted MongoDB (MongoDB Atlas, etc.)
- Update `MONGODB_URI` in environment

---

## 🧪 Development

### Hot Reload

```bash
npm run dev
```

### In-Memory Database

If MongoDB is unavailable, server automatically falls back to in-memory database (development only).

---

## 📖 Best Practices Implemented

- ✅ Separation of concerns
- ✅ Error handling middleware
- ✅ Environment configuration
- ✅ Modular structure
- ✅ Consistent naming
- ✅ JSDoc comments
- ✅ Graceful shutdown
- ✅ Request logging

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 4000
# Windows:
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process
```

### MongoDB connection error

- Ensure MongoDB is running
- Check `MONGODB_URI` in .env
- Server will use in-memory DB in development

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learn More

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)

---

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: October 2025

