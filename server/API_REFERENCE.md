# 🌐 API Reference

Quick reference for all API endpoints.

---

## Base URL

```
http://localhost:4000/api
```

---

## 📋 Endpoints

### Health Check

```http
GET /api/health
```

**Response**:

```json
{
  "ok": true,
  "demo": false,
  "version": "1.0.0",
  "environment": "development"
}
```

---

### 📊 Cases

#### 1. List All Cases

```http
GET /api/cases
```

**Query Parameters**:

- `search` (string, optional) - Search term
- `field` (string, optional) - Field to search in
- `sort` (string, optional) - Sort field (default: "createdAt")
- `order` (string, optional) - Sort order: "asc" or "desc"
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Results per page (default: 50, max: 500)

**Example**:

```bash
GET /api/cases?search=john&field=მოსარჩელე&page=1&limit=20
```

**Response**:

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "plaintiff": "John Doe",
      "defendant": "Jane Smith",
      "case_number": "2/1234-23",
      "amount": "5000 ₾",
      "court": "თბილისის საქალაქო სასამართლო",
      "createdAt": "2025-10-05T12:00:00.000Z",
      "updatedAt": "2025-10-05T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "count": 1
}
```

---

#### 2. Get Single Case

```http
GET /api/cases/:id
```

**Path Parameters**:

- `id` (string, required) - Case ID (MongoDB ObjectId)

**Example**:

```bash
GET /api/cases/507f1f77bcf86cd799439011
```

**Response**:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "plaintiff": "John Doe",
  "defendant": "Jane Smith",
  "case_number": "2/1234-23",
  "amount": "5000 ₾",
  "court": "თბილისის საქალაქო სასამართლო",
  "plaintiff_id": "01001234567",
  "defendant_id": "01007654321",
  "initiation_date": "2025-01-15",
  "hearing_date": "2025-02-20",
  "notes": "Important case notes",
  "createdAt": "2025-10-05T12:00:00.000Z",
  "updatedAt": "2025-10-05T12:00:00.000Z"
}
```

**Error Response** (404):

```json
{
  "error": "Case not found"
}
```

---

#### 3. Create New Case

```http
POST /api/cases
```

**Body** (application/json):

```json
{
  "plaintiff": "John Doe",
  "plaintiff_id": "01001234567",
  "defendant": "Jane Smith",
  "defendant_id": "01007654321",
  "amount": "5000 ₾",
  "court": "თბილისის საქალაქო სასამართლო",
  "case_number": "2/1234-23",
  "initiation_date": "2025-01-15",
  "hearing_date": "2025-02-20",
  "notes": "Case notes here"
}
```

**Response** (201 Created):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "plaintiff": "John Doe",
  "defendant": "Jane Smith",
  ...
  "createdAt": "2025-10-05T12:00:00.000Z",
  "updatedAt": "2025-10-05T12:00:00.000Z"
}
```

**Demo Mode Response** (403):

```json
{
  "error": "Demo mode: write disabled"
}
```

---

#### 4. Update Case

```http
PUT /api/cases/:id
```

**Path Parameters**:

- `id` (string, required) - Case ID

**Body** (application/json):

```json
{
  "amount": "6000 ₾",
  "hearing_date": "2025-03-01"
}
```

**Response**:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "plaintiff": "John Doe",
  "amount": "6000 ₾",
  "hearing_date": "2025-03-01",
  ...
  "updatedAt": "2025-10-05T13:00:00.000Z"
}
```

---

#### 5. Delete Case

```http
DELETE /api/cases/:id
```

**Path Parameters**:

- `id` (string, required) - Case ID

**Response**:

```json
{
  "ok": true,
  "message": "Case deleted successfully"
}
```

**Error Response** (404):

```json
{
  "error": "Case not found"
}
```

---

#### 6. Export to Excel

```http
GET /api/cases/export
```

**Query Parameters**:

- `search` (string, optional) - Search term
- `field` (string, optional) - Field to filter by

**Example**:

```bash
GET /api/cases/export?search=john&field=მოსარჩელე
```

**Response**:

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Downloads Excel file: `cases_[timestamp].xlsx`

---

## 🔒 Demo Mode

When `DEMO_MODE=1` is set:

- **POST** requests return 403
- **PUT** requests return 403
- **DELETE** requests return 403
- **GET** requests work normally

---

## 🚨 Error Responses

### Validation Error (400)

```json
{
  "error": "Validation Error",
  "details": ["Field is required"]
}
```

### Invalid ID (400)

```json
{
  "error": "Invalid ID format"
}
```

### Not Found (404)

```json
{
  "error": "Case not found"
}
```

### Demo Mode (403)

```json
{
  "error": "Demo mode: write disabled"
}
```

### Server Error (500)

```json
{
  "error": "Internal Server Error"
}
```

---

## 📝 Field Mappings

Georgian UI labels map to database fields:

| Georgian Label                | Database Field  |
| ----------------------------- | --------------- |
| #                             | \_id            |
| მოსარჩელე                     | plaintiff       |
| საიდენთიფიკაციო ნომერი (მოს.) | plaintiff_id    |
| მოპასუხე                      | defendant       |
| საიდენთიფიკაციო ნომერი (მოპ.) | defendant_id    |
| მოთხოვნის ოდენობა             | amount          |
| განმხილველი ორგანო            | court           |
| საქმის ნომერი                 | case_number     |
| კომენტარი                     | notes           |
| წარმოებში მიღების თარიღი      | initiation_date |
| სხდომის თარიღი                | hearing_date    |

---

## 🧪 Testing Examples

### Using cURL (Git Bash/WSL)

#### List Cases

```bash
curl http://localhost:4000/api/cases
```

#### Create Case

```bash
curl -X POST http://localhost:4000/api/cases \
  -H "Content-Type: application/json" \
  -d '{"plaintiff":"John Doe","defendant":"Jane Smith"}'
```

#### Get Case

```bash
curl http://localhost:4000/api/cases/507f1f77bcf86cd799439011
```

#### Update Case

```bash
curl -X PUT http://localhost:4000/api/cases/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"amount":"6000"}'
```

#### Delete Case

```bash
curl -X DELETE http://localhost:4000/api/cases/507f1f77bcf86cd799439011
```

---

### Using PowerShell

#### List Cases

```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/cases -UseBasicParsing | Select-Object -ExpandProperty Content
```

#### Create Case

```powershell
Invoke-WebRequest -Uri http://localhost:4000/api/cases `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"plaintiff":"John Doe","defendant":"Jane Smith"}' `
  -UseBasicParsing
```

---

## 📚 Status Codes

| Code | Meaning      | When                            |
| ---- | ------------ | ------------------------------- |
| 200  | OK           | Successful GET, PUT, DELETE     |
| 201  | Created      | Successful POST                 |
| 400  | Bad Request  | Validation error, invalid ID    |
| 403  | Forbidden    | Demo mode write attempt         |
| 404  | Not Found    | Case not found, route not found |
| 500  | Server Error | Unexpected error                |

---

## 🔧 Configuration

Environment variables (`.env`):

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/court_cases
CORS_ORIGIN=*
DEMO_MODE=0
```

---

## 🎯 Best Practices

### Request Headers

Always include:

```
Content-Type: application/json
```

### ID Format

MongoDB ObjectId: 24 hex characters

```
507f1f77bcf86cd799439011
```

### Date Format

Use ISO format or Georgian format:

```
YYYY-MM-DD    (e.g., 2025-01-15)
DD.MM.YYYY    (e.g., 15.01.2025)
DD/MM/YYYY    (e.g., 15/01/2025)
```

---

**Quick Reference**: Keep this handy for API integration!

**Last Updated**: October 2025

