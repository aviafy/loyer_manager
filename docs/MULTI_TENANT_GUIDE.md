# Multi-Tenant System - Complete Guide

## 🎯 Overview

Your loyer_manager application has been successfully transformed into a **secure, multi-tenant case management system** where:

- Each company has its own isolated data and users
- Company admins can manage their team members
- Role-based access control ensures proper authorization
- Secure shareable links allow external case viewing

---

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)

#### **New Models**

1. **Company** (`server/src/models/Company.js`)

   - Company information (name, email, phone, address)
   - Settings (maxUsers, maxCases)
   - Status tracking

2. **User** (`server/src/models/User.js`)

   - Linked to a company via `companyId`
   - Three roles: `CompanyAdmin`, `Staff`, `ReadOnly`
   - Password hashing with bcrypt
   - Email unique per company (not globally)

3. **Case** (Updated `server/src/models/Case.js`)

   - Now includes `companyId` for multi-tenancy
   - All existing fields preserved (plaintiff, defendant, judge, court, etc.)
   - New: `hearing_dates` array for multiple hearings
   - Tracks `createdBy` and `modifiedBy`

4. **ShareableLink** (`server/src/models/ShareableLink.js`)
   - Creates secure, unique tokens for case sharing
   - Optional password protection
   - Optional recipient email restriction
   - Expiration dates
   - Access tracking

#### **Authentication & Authorization**

**Authentication Middleware** (`server/src/middleware/auth.js`)

- Verifies JWT tokens from HttpOnly cookies
- Attaches `user`, `company`, and `companyId` to request

**Authorization Middleware** (`server/src/middleware/authorize.js`)

- `requireAdmin`: Only CompanyAdmin
- `requireStaffOrAdmin`: CompanyAdmin or Staff
- `authorize(...roles)`: Custom role checking

#### **API Routes**

**Auth Routes** (`/api/auth`)

- `POST /register` - Register new company + first admin user
- `POST /login` - Login with email + password
- `POST /logout` - Clear authentication cookie
- `GET /me` - Get current user info

**User Routes** (`/api/users`) - Requires authentication

- `GET /` - List all users in company
- `POST /` - Create user (admin only)
- `GET /:id` - Get user details
- `PUT /:id` - Update user (admin only)
- `DELETE /:id` - Delete user (admin only)

**Case Routes** (`/api/cases`) - Requires authentication, company-scoped

- `GET /` - List cases (filtered by companyId)
- `POST /` - Create case (staff/admin only)
- `GET /:id` - Get case details
- `PUT /:id` - Update case (staff/admin only)
- `DELETE /:id` - Delete case (staff/admin only)
- `GET /export` - Export cases to Excel

**Shareable Link Routes** (`/api/shareable-links`)

- `POST /` - Create shareable link (staff/admin only)
- `GET /case/:caseId` - Get all links for a case
- `GET /:token/verify` - Public route to verify and view case
- `PUT /:id/revoke` - Revoke a link (staff/admin only)
- `DELETE /:id` - Delete a link (staff/admin only)

---

### Frontend (Next.js 14 with App Router)

#### **Authentication System**

**AuthContext** (`client/src/contexts/AuthContext.js`)

- Global state management for user and company
- Methods: `register()`, `login()`, `logout()`, `checkAuth()`
- Helper flags: `isAuthenticated`, `isAdmin`, `isStaffOrAdmin`

**ProtectedRoute** (`client/src/components/auth/ProtectedRoute.js`)

- Wrapper component for authenticated pages
- Optional `requireAdmin` prop for admin-only pages
- Auto-redirects to login if not authenticated

#### **Pages**

1. **Register** (`/register`)

   - Company registration form
   - Creates company + first admin user
   - Auto-login after registration

2. **Login** (`/login`)

   - Email + password authentication
   - Sets HttpOnly cookie with JWT

3. **Home** (`/`)

   - Cases list (protected)
   - Create, edit, delete cases
   - Company-scoped data only

4. **Case Details** (`/cases/[id]`)

   - View full case information
   - Create shareable links (staff/admin)
   - Manage existing shareable links
   - Copy/revoke links

5. **Users** (`/users`)

   - Admin-only page
   - Manage company users
   - Add users, update roles, delete users

6. **Shared Case View** (`/shared/[token]`)
   - Public page (no auth required)
   - Password protection support
   - Read-only case information
   - Access tracking

#### **Header** (Updated)

- Shows company name and user info when authenticated
- Admin users see "Users" link
- Logout button
- Hides when not authenticated

---

## 🚀 Getting Started

### **Environment Variables**

Create/update `server/.env`:

```env
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/loyer_manager

# JWT secret (use a strong random string in production)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS origin (your frontend URL)
CORS_ORIGIN=http://localhost:3000

# Frontend URL (for shareable links)
FRONTEND_URL=http://localhost:3000

# Server port
PORT=4000

# Environment
NODE_ENV=development
```

Create/update `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### **Installation**

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in new terminal)
cd client
npm install
npm run dev
```

### **First Time Setup**

1. Navigate to `http://localhost:3000/register`
2. Fill in company information:
   - Company Name
   - Company Email
   - Company Phone (optional)
   - Company Address (optional)
3. Create first admin user:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
4. Click "Create Account"
5. You'll be automatically logged in

---

## 👥 User Roles

### **CompanyAdmin**

- Full access to all company data
- Can manage users (add, edit, delete)
- Can create, edit, delete cases
- Can create and manage shareable links
- Cannot be demoted/deleted if they're the only admin

### **Staff**

- Can view all company cases
- Can create, edit, delete cases
- Can create and manage shareable links
- Cannot manage users

### **ReadOnly**

- Can view all company cases
- Cannot create, edit, or delete cases
- Cannot create shareable links
- Cannot manage users

---

## 🔗 Shareable Links

### **Creating a Link**

1. Navigate to a case details page
2. Scroll to "Shareable Links" section
3. Click "Create Link"
4. Configure options:
   - **Expires in (days)**: Set expiration (optional)
   - **Recipient Email**: Restrict to specific email (optional)
   - **Password**: Add password protection (optional)
5. Click "Create Link"
6. Copy the generated URL

### **Link Features**

- **Unique tokens**: Each link has a secure 64-character token
- **Access tracking**: Counts how many times link is accessed
- **Status management**: Active, Revoked, or Expired
- **Public access**: No login required to view
- **Read-only**: Recipients cannot modify data

### **Link Security**

- Optional password protection
- Optional email restriction
- Expiration dates
- Can be revoked at any time
- Access logs with timestamps

---

## 🔒 Security Features

### **Authentication**

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens stored in HttpOnly cookies (XSS protection)
- Tokens expire after 7 days (configurable)
- Automatic token verification on each request

### **Authorization**

- Role-based access control (RBAC)
- All routes check user permissions
- Company-scoped data isolation
- Middleware prevents cross-company data access

### **Multi-Tenancy**

- Every query filtered by `companyId`
- Database indexes on `companyId` for performance
- No cross-company data leakage
- Each company's data completely isolated

### **Data Validation**

- Email uniqueness per company (not global)
- Password strength requirements (min 6 chars)
- Input sanitization and normalization
- Mongoose schema validation

---

## 📊 Database Schema

### **Companies Collection**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  address: String,
  settings: {
    maxUsers: Number (default: 10),
    maxCases: Number (default: 1000)
  },
  status: String (active/suspended/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### **Users Collection**

```javascript
{
  _id: ObjectId,
  companyId: ObjectId (indexed),
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (CompanyAdmin/Staff/ReadOnly),
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
// Compound unique index: (companyId + email)
```

### **Cases Collection**

```javascript
{
  _id: ObjectId,
  companyId: ObjectId (indexed),
  plaintiff: String,
  plaintiff_id: String,
  defendant: String,
  defendant_id: String,
  court: String,
  judge: String,
  case_number: String,
  initiation_date: String,
  hearing_date: String,
  hearing_dates: [{
    date: String,
    notes: String,
    status: String (scheduled/completed/cancelled/postponed)
  }],
  notes: String,
  amount: String,
  createdBy: ObjectId,
  modifiedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
// Indexes: (companyId + createdAt), (companyId + case_number)
```

### **ShareableLinks Collection**

```javascript
{
  _id: ObjectId,
  companyId: ObjectId (indexed),
  caseId: ObjectId (indexed),
  token: String (unique, indexed),
  recipientEmail: String,
  password: String,
  expiresAt: Date (indexed),
  accessCount: Number,
  lastAccessedAt: Date,
  status: String (active/revoked/expired),
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Configuration

### **JWT Configuration**

Edit `server/src/routes/auth.js`:

```javascript
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
```

### **Cookie Configuration**

Cookies are automatically configured based on environment:

- **Development**: `secure: false`, `sameSite: 'lax'`
- **Production**: `secure: true`, `sameSite: 'lax'`

### **CORS Configuration**

Edit `server/src/config/index.js` or set `CORS_ORIGIN` env variable.

---

## 🧪 Testing the System

### **Test Workflow**

1. **Register Company**

   ```
   POST /api/auth/register
   {
     "companyName": "Test Company",
     "companyEmail": "test@company.com",
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@test.com",
     "password": "password123"
   }
   ```

2. **Add Staff User**

   ```
   POST /api/users
   {
     "email": "staff@test.com",
     "password": "password123",
     "firstName": "Jane",
     "lastName": "Smith",
     "role": "Staff"
   }
   ```

3. **Create Case**

   ```
   POST /api/cases
   {
     "plaintiff": "John Smith",
     "defendant": "Acme Corp",
     "court": "Tbilisi City Court",
     "amount": "5000 ₾"
   }
   ```

4. **Create Shareable Link**

   ```
   POST /api/shareable-links
   {
     "caseId": "case_id_here",
     "expiresInDays": 30,
     "password": "secret123"
   }
   ```

5. **Access Shared Case**
   Navigate to: `http://localhost:3000/shared/{token}?password=secret123`

---

## 📝 Migration from Old System

If you have existing cases in the database:

1. **Add companyId to existing cases**:

   ```javascript
   // Run in MongoDB shell
   db.cases.updateMany(
     { companyId: { $exists: false } },
     { $set: { companyId: ObjectId("your_company_id") } }
   );
   ```

2. **Create indexes**:
   ```javascript
   db.cases.createIndex({ companyId: 1, createdAt: -1 });
   db.cases.createIndex({ companyId: 1, case_number: 1 });
   db.users.createIndex({ companyId: 1, email: 1 }, { unique: true });
   ```

---

## 🐛 Troubleshooting

### **Issue: "Authentication required" on protected routes**

- Check browser cookies (should have `authToken`)
- Verify `JWT_SECRET` matches between requests
- Check cookie expiration

### **Issue: Cannot create case (403 error)**

- Verify user role (must be Staff or CompanyAdmin)
- Check authentication status

### **Issue: Cannot see other company's data**

- This is expected! Multi-tenancy isolates data
- Each company only sees their own data

### **Issue: Shareable link not working**

- Verify link status (active/revoked/expired)
- Check expiration date
- If password protected, ensure password is provided
- Check `FRONTEND_URL` environment variable

---

## 🚢 Production Deployment

### **Security Checklist**

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (secure cookies)
- [ ] Set proper `CORS_ORIGIN`
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Set up backup strategy
- [ ] Configure rate limiting
- [ ] Enable request logging
- [ ] Set up monitoring

### **Environment Variables (Production)**

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret-256-bits>
MONGODB_URI=<production-mongodb-uri>
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
PORT=4000
```

---

## 📚 Additional Resources

- **MongoDB Indexes**: Ensure proper performance with multi-tenancy
- **JWT Best Practices**: Consider refresh tokens for long-lived sessions
- **Rate Limiting**: Add to prevent abuse (e.g., express-rate-limit)
- **Logging**: Consider Winston or Morgan for production logging
- **Monitoring**: Set up health checks and monitoring (e.g., PM2)

---

## ✅ Features Implemented

- [x] Multi-tenant architecture with complete data isolation
- [x] Company self-registration
- [x] User management (CRUD operations)
- [x] Role-based access control (CompanyAdmin, Staff, ReadOnly)
- [x] JWT authentication with HttpOnly cookies
- [x] Password hashing with bcrypt
- [x] Company-scoped case management
- [x] Shareable links with optional password protection
- [x] Access tracking and link revocation
- [x] Protected routes in frontend
- [x] Auth context for state management
- [x] Preserved original UI design
- [x] Dynamic, reusable form components
- [x] Header on all pages with user info

---

## 📞 Support

For questions or issues:

1. Check this guide first
2. Review the code comments
3. Check browser console for errors
4. Check server logs for backend errors

---

**Built with:** Node.js, Express, MongoDB, Mongoose, Next.js 14, React, JWT, bcrypt
