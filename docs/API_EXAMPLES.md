# API Testing Examples

Use these examples with tools like Postman, Insomnia, or curl.

---

## 🔐 Authentication

### Register Company

```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "companyName": "Acme Legal Services",
  "companyEmail": "contact@acmelegal.com",
  "companyPhone": "+995 555 123 456",
  "companyAddress": "123 Main St, Tbilisi",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@acmelegal.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "companyId": "...",
    "email": "john@acmelegal.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CompanyAdmin",
    "status": "active"
  },
  "company": {
    "_id": "...",
    "name": "Acme Legal Services",
    "email": "contact@acmelegal.com"
  },
  "message": "Company registered successfully"
}
```

---

### Login

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "john@acmelegal.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "user": { ... },
  "company": { ... },
  "message": "Login successful"
}
```

**Note:** Auth token is set in HttpOnly cookie automatically.

---

### Get Current User

```http
GET http://localhost:4000/api/auth/me
Cookie: authToken=<token>
```

**Response:**

```json
{
  "user": {
    "_id": "...",
    "companyId": "...",
    "email": "john@acmelegal.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CompanyAdmin"
  },
  "company": {
    "_id": "...",
    "name": "Acme Legal Services",
    "email": "contact@acmelegal.com"
  }
}
```

---

### Logout

```http
POST http://localhost:4000/api/auth/logout
Cookie: authToken=<token>
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

## 👥 User Management (Admin Only)

### List All Users

```http
GET http://localhost:4000/api/users
Cookie: authToken=<token>
```

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "companyId": "...",
      "email": "john@acmelegal.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CompanyAdmin",
      "status": "active",
      "createdAt": "2025-10-06T..."
    }
  ]
}
```

---

### Create User

```http
POST http://localhost:4000/api/users
Cookie: authToken=<token>
Content-Type: application/json

{
  "email": "jane@acmelegal.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "Staff"
}
```

**Response:**

```json
{
  "_id": "...",
  "companyId": "...",
  "email": "jane@acmelegal.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "Staff",
  "status": "active"
}
```

---

### Update User

```http
PUT http://localhost:4000/api/users/:userId
Cookie: authToken=<token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith-Johnson",
  "role": "CompanyAdmin"
}
```

---

### Delete User

```http
DELETE http://localhost:4000/api/users/:userId
Cookie: authToken=<token>
```

**Response:**

```json
{
  "ok": true,
  "message": "User deleted successfully"
}
```

---

## 📋 Case Management

### List Cases

```http
GET http://localhost:4000/api/cases?search=smith&field=plaintiff&sort=createdAt&order=desc&page=1&limit=50
Cookie: authToken=<token>
```

**Query Parameters:**

- `search`: Search term (optional)
- `field`: Field to search in (optional): plaintiff, defendant, court, case_number, notes, or empty for all
- `sort`: Field to sort by (default: createdAt)
- `order`: asc or desc (default: asc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "companyId": "...",
      "plaintiff": "John Smith",
      "plaintiff_id": "01001234567",
      "defendant": "Acme Corp",
      "defendant_id": "01009876543",
      "court": "Tbilisi City Court",
      "judge": "Judge Anderson",
      "case_number": "2/1234-23",
      "initiation_date": "2023-01-15",
      "hearing_date": "2023-03-20",
      "notes": "Initial consultation completed",
      "amount": "5000 ₾",
      "createdAt": "2023-01-10T..."
    }
  ],
  "page": 1,
  "limit": 50,
  "count": 1
}
```

---

### Create Case

```http
POST http://localhost:4000/api/cases
Cookie: authToken=<token>
Content-Type: application/json

{
  "plaintiff": "John Smith",
  "plaintiff_id": "01001234567",
  "defendant": "Acme Corporation",
  "defendant_id": "01009876543",
  "court": "Tbilisi City Court",
  "judge": "Judge Anderson",
  "case_number": "2/1234-23",
  "initiation_date": "2023-01-15",
  "hearing_date": "2023-03-20",
  "notes": "Client seeks compensation for damages",
  "amount": "5000 ₾"
}
```

**Response:**

```json
{
  "_id": "...",
  "companyId": "...",
  "plaintiff": "John Smith",
  ...
  "createdBy": "...",
  "modifiedBy": "...",
  "createdAt": "2023-01-10T..."
}
```

---

### Get Case

```http
GET http://localhost:4000/api/cases/:caseId
Cookie: authToken=<token>
```

**Response:**

```json
{
  "_id": "...",
  "companyId": "...",
  "plaintiff": "John Smith",
  ...
}
```

---

### Update Case

```http
PUT http://localhost:4000/api/cases/:caseId
Cookie: authToken=<token>
Content-Type: application/json

{
  "hearing_date": "2023-04-15",
  "notes": "Hearing rescheduled. New evidence submitted.",
  "amount": "7500 ₾"
}
```

---

### Delete Case

```http
DELETE http://localhost:4000/api/cases/:caseId
Cookie: authToken=<token>
```

**Response:**

```json
{
  "ok": true,
  "message": "Case deleted successfully"
}
```

---

### Export Cases to Excel

```http
GET http://localhost:4000/api/cases/export?search=&field=
Cookie: authToken=<token>
```

**Response:** Excel file download

---

## 🔗 Shareable Links

### Create Shareable Link

```http
POST http://localhost:4000/api/shareable-links
Cookie: authToken=<token>
Content-Type: application/json

{
  "caseId": "case_id_here",
  "expiresInDays": 30,
  "recipientEmail": "client@example.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "_id": "...",
  "companyId": "...",
  "caseId": "...",
  "token": "abc123def456...",
  "expiresAt": "2023-11-06T...",
  "recipientEmail": "client@example.com",
  "status": "active",
  "accessCount": 0,
  "url": "http://localhost:3000/shared/abc123def456..."
}
```

---

### Get Links for Case

```http
GET http://localhost:4000/api/shareable-links/case/:caseId
Cookie: authToken=<token>
```

**Response:**

```json
{
  "data": [
    {
      "_id": "...",
      "token": "abc123...",
      "url": "http://localhost:3000/shared/abc123...",
      "expiresAt": "2023-11-06T...",
      "status": "active",
      "accessCount": 5,
      "lastAccessedAt": "2023-10-15T..."
    }
  ]
}
```

---

### Verify Shareable Link (Public)

```http
GET http://localhost:4000/api/shareable-links/:token/verify
```

Or with password:

```http
GET http://localhost:4000/api/shareable-links/:token/verify?password=secret123
```

**Response (Success):**

```json
{
  "case": {
    "_id": "...",
    "plaintiff": "John Smith",
    "defendant": "Acme Corp",
    ...
  },
  "link": {
    "_id": "...",
    "expiresAt": "2023-11-06T...",
    "recipientEmail": "client@example.com",
    "accessCount": 6
  }
}
```

**Response (Password Required):**

```json
{
  "error": "Password required",
  "requiresPassword": true
}
```

**Response (Invalid/Expired):**

```json
{
  "error": "Link is no longer valid"
}
```

---

### Revoke Link

```http
PUT http://localhost:4000/api/shareable-links/:linkId/revoke
Cookie: authToken=<token>
```

**Response:**

```json
{
  "_id": "...",
  "status": "revoked",
  ...
}
```

---

### Delete Link

```http
DELETE http://localhost:4000/api/shareable-links/:linkId
Cookie: authToken=<token>
```

**Response:**

```json
{
  "ok": true,
  "message": "Link deleted successfully"
}
```

---

## 🧪 Complete Test Scenario

### 1. Register Company

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "companyEmail": "test@company.com",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@test.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 2. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 3. Create Case

```bash
curl -X POST http://localhost:4000/api/cases \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "plaintiff": "John Smith",
    "defendant": "Acme Corp",
    "court": "Tbilisi City Court",
    "amount": "5000 ₾"
  }'
```

### 4. Create Shareable Link

```bash
curl -X POST http://localhost:4000/api/shareable-links \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "caseId": "CASE_ID_FROM_STEP_3",
    "expiresInDays": 30,
    "password": "secret123"
  }'
```

### 5. Access Shared Case (No Auth Required)

```bash
curl -X GET "http://localhost:4000/api/shareable-links/TOKEN_FROM_STEP_4/verify?password=secret123"
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "All fields are required"
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions",
  "required": ["CompanyAdmin"],
  "current": "Staff"
}
```

### 404 Not Found

```json
{
  "error": "Case not found"
}
```

### 409 Conflict

```json
{
  "error": "Company email already registered"
}
```

---

## 💡 Tips

1. **Save Cookies**: Use `-c cookies.txt` (curl) or enable cookie jar in Postman
2. **Include Cookies**: Use `-b cookies.txt` (curl) or cookies are auto-included in Postman
3. **Test Multi-tenancy**: Create 2 companies, verify data isolation
4. **Test Roles**: Create users with different roles, test permissions
5. **Test Links**: Create password-protected and unrestricted links

---

## 🔍 Postman Collection

Import these as a Postman collection:

```json
{
  "info": {
    "name": "Loyer Manager Multi-Tenant API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"companyName\": \"Test Company\",\n  \"companyEmail\": \"test@company.com\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@test.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

**Base URL Variable**: `http://localhost:4000/api`

---

**Last Updated:** October 2025
