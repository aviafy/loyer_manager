# Multi-Tenant System - Quick Reference

## 🚀 Quick Start

### Setup (First Time)

```bash
# 1. Backend Setup
cd server
cp .env.example .env
npm install

# 2. Frontend Setup
cd ../client
cp .env.example .env.local
npm install

# 3. Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# 4. Start Backend
cd ../server
npm run dev

# 5. Start Frontend (new terminal)
cd ../client
npm run dev

# 6. Open browser
http://localhost:3000/register
```

---

## 📍 Key Routes

### Frontend Routes

```
/register          - Company registration
/login             - User login
/                  - Cases list (protected)
/cases/[id]        - Case details (protected)
/users             - User management (admin only)
/shared/[token]    - Public case view (no auth)
```

### API Routes

```
POST   /api/auth/register      - Register company + admin
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
GET    /api/auth/me            - Current user

GET    /api/users              - List users
POST   /api/users              - Create user (admin)
PUT    /api/users/:id          - Update user (admin)
DELETE /api/users/:id          - Delete user (admin)

GET    /api/cases              - List cases (company-scoped)
POST   /api/cases              - Create case (staff/admin)
GET    /api/cases/:id          - Get case
PUT    /api/cases/:id          - Update case (staff/admin)
DELETE /api/cases/:id          - Delete case (staff/admin)
GET    /api/cases/export       - Export to Excel

POST   /api/shareable-links           - Create link (staff/admin)
GET    /api/shareable-links/case/:id  - Get links for case
GET    /api/shareable-links/:token/verify - Verify link (public)
PUT    /api/shareable-links/:id/revoke    - Revoke link
```

---

## 👥 User Roles

| Role         | View Cases | Create/Edit Cases | Delete Cases | Manage Users | Create Links |
| ------------ | ---------- | ----------------- | ------------ | ------------ | ------------ |
| CompanyAdmin | ✅         | ✅                | ✅           | ✅           | ✅           |
| Staff        | ✅         | ✅                | ✅           | ❌           | ✅           |
| ReadOnly     | ✅         | ❌                | ❌           | ❌           | ❌           |

---

## 🔐 Authentication Flow

```
1. Register Company → Auto-login → Redirect to cases
2. Login → Set cookie → Redirect to cases
3. Protected routes check auth → Redirect to login if not authenticated
4. Logout → Clear cookie → Redirect to login
```

---

## 🔗 Shareable Links

### Create Link

```javascript
POST /api/shareable-links
{
  "caseId": "case_id",
  "expiresInDays": 30,           // Optional
  "recipientEmail": "user@example.com",  // Optional
  "password": "secret123"         // Optional
}
```

### Access Link

```
http://localhost:3000/shared/{token}
http://localhost:3000/shared/{token}?password=secret123
```

---

## 💾 Database Collections

| Collection     | Key Fields                                    |
| -------------- | --------------------------------------------- |
| companies      | name, email, status, settings                 |
| users          | companyId, email, role, password              |
| cases          | companyId, plaintiff, defendant, court        |
| shareablelinks | companyId, caseId, token, password, expiresAt |

---

## 🛠️ Common Tasks

### Add New User

1. Login as admin
2. Click "Users" in header
3. Click "Add User"
4. Fill form and select role
5. Click "Save"

### Create Shareable Link

1. Open case details
2. Scroll to "Shareable Links"
3. Click "Create Link"
4. Set options (expiry, password, etc.)
5. Click "Create Link"
6. Click "Copy" to get URL

### Export Cases to Excel

1. Go to cases list
2. Optional: Use search to filter
3. Click "Excel ექსპორტი"
4. File downloads automatically

---

## 🐛 Quick Troubleshooting

| Issue                      | Solution                                 |
| -------------------------- | ---------------------------------------- |
| Can't login                | Check credentials, verify user is active |
| "Authentication required"  | Login again, check cookie in browser     |
| Can't create case          | Verify role (must be Staff or Admin)     |
| Can't see Users page       | Only admins can access user management   |
| Shareable link not working | Check status, expiration, password       |
| Cross-company data visible | This shouldn't happen - report bug       |

---

## 📊 Key Security Features

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens in HttpOnly cookies
- ✅ Company-scoped data isolation
- ✅ Role-based access control
- ✅ Protected shareable links
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Token expiration

---

## 🧪 Test Credentials

### After Registration

You'll create your own admin account. Example:

```
Company: Test Company
Email: admin@testcompany.com
Password: password123
```

Then add staff:

```
Email: staff@testcompany.com
Password: password123
Role: Staff
```

---

## 📝 Environment Variables

### Required (Backend)

```env
MONGODB_URI=mongodb://localhost:27017/loyer_manager
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Optional (Backend)

```env
PORT=4000
NODE_ENV=development
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
DEMO_MODE=false
```

### Required (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🔄 Workflow Example

### Complete Workflow

1. **Register Company** at `/register`
2. **Login** automatically
3. **Create first case** from home page
4. **View case details** by clicking case in table
5. **Create shareable link** in case details
6. **Share link** with external party
7. **Add staff user** from Users page (admin only)
8. **Staff logs in** and can manage cases
9. **Export cases** to Excel when needed

---

## 📞 Quick Links

- **Full Documentation**: See `MULTI_TENANT_GUIDE.md`
- **Backend Code**: `server/src/`
- **Frontend Code**: `client/src/`
- **Models**: `server/src/models/`
- **Routes**: `server/src/routes/`

---

## 💡 Tips

- Always test with multiple companies to verify data isolation
- Use different browsers for testing multiple users
- Check browser DevTools → Application → Cookies for auth token
- Monitor MongoDB compass to see data structure
- Use incognito mode to test public shareable links

---

**Version:** 2.0.0 (Multi-Tenant)  
**Last Updated:** October 2025
