# Jal-Drishti Backend API Reference (Frontend Use)

## Authentication
Most endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## API Endpoint Reference Table

| Group     | Method | Endpoint                                      | Description                              | Auth Required |
|-----------|--------|-----------------------------------------------|------------------------------------------|:------------:|
| Admin     | POST   | /auth/admin/login                             | Admin login, returns JWT                 | No           |
| Admin     | GET    | /admin/ping                                   | Test admin route                         | Yes          |
| Admin     | POST   | /admin/operators                              | Register new operator                    | Yes          |
| Admin     | POST   | /admin/change-request/:requestId/action        | Approve/Reject change request            | Yes          |
| Admin     | GET    | /admin/daily-usage                            | Get daily usage summary                  | Yes          |
| Admin     | GET    | /admin/analytics/summary                      | Get analytics summary                    | Yes          |
| Admin     | GET    | /admin/analytics/pump-usage                   | Get pump usage summary                   | Yes          |
| Admin     | GET    | /admin/analytics/daily-trend                  | Get daily usage trend                    | Yes          |
| Admin     | GET    | /admin/analytics/alerts                       | Get shortage alert                       | Yes          |
| Admin     | POST   | /admin/addpumps                               | Add new pump                             | Yes          |
| Admin     | POST   | /admin/addtanks                               | Add new tank                             | Yes          |
| Admin     | GET    | /admin/alltanks                               | Get all tanks for admin's village        | Yes          |
| Admin     | POST   | /admin/announce                               | Create announcement                      | Yes          |
| Operator  | POST   | /operator/login                               | Operator login, returns JWT              | No           |
| Operator  | GET    | /operator/pump/:qrCode                        | Get pump details by QR code              | Yes          |
| Operator  | POST   | /operator/pump/change-request                 | Create pump change request               | Yes          |
| Operator  | POST   | /operator/daily-log/                          | Create daily log                         | Yes          |
| Resident  | POST   | /resident/register                            | Register new resident                    | No           |
| Resident  | POST   | /resident/login                               | Resident login, returns JWT              | No           |
| Resident  | POST   | /resident/complaint                           | Raise complaint                          | Yes          |
| Resident  | GET    | /resident/complaints                          | Get resident's complaints                 | Yes          |
| Resident  | GET    | /resident/announcements                       | Get announcements                         | Yes          |
| Resident  | GET    | /resident/water-status                        | Get current water status                  | Yes          |
| Daily Log | POST   | /dailylog                                     | Create a daily log entry                  | Yes          |

---

## Detailed Endpoint Reference

### Admin APIs
#### /auth/admin/login (POST)
Admin login, returns JWT.
Request: `{ "username": "admin", "password": "secret" }`
Response: `{ "token": "...", "admin": { "id": 1, "username": "admin" } }`

#### /admin/ping (GET)
Test admin route.
Response: `{ "message": "Admin route working" }`

#### /admin/operators (POST)
Register new operator.
Request: `{ "name": "John", "phone": "1234567890", "username": "john", "password": "pass", "village_id": 1 }`
Response: `{ "error": false, "message": "Operator registered successfully", "data": { "operator_id": 2, "username": "john" } }`

#### /admin/change-request/:requestId/action (POST)
Approve/Reject change request.
Request: `{ "action": "APPROVE", "admin_remark": "Valid" }`
Response: `{ "success": true, "message": "Change request approved and applied" }`

#### /admin/daily-usage (GET)
Get daily usage summary.
Response: `{ "success": true, "date": "2026-01-02", "total_pumps_used": 3, "total_usage_liters": 5000 }`

#### /admin/analytics/summary (GET)
Get analytics summary.
Response: `{ "success": true, "today_usage": 1000, "last_7_days_usage": 7000, "total_pumps": 5 }`

#### /admin/analytics/pump-usage (GET)
Get pump usage summary.
Response: `{ "success": true, "data": [...] }`

#### /admin/analytics/daily-trend (GET)
Get daily usage trend.
Response: `{ "success": true, "trend": [...] }`

#### /admin/analytics/alerts (GET)
Get shortage alert.
Response: `{ "success": true, "alert": "Water supply normal" }`

#### /admin/addpumps (POST)
Add new pump.
Request: `{ "pump_name": "Pump 1", "qr_code": "QR123", "latitude": 12.34, "longitude": 56.78, "flow_rate_lph": 1000, "village_id": 1 }`
Response: `{ "success": true, "message": "Pump added successfully", "pump": {...} }`

#### /admin/addtanks (POST)
Add new tank.
Request: `{ "tank_name": "Tank 1", "capacity_liters": 5000, "material_type": "Steel", "latitude": 12.34, "longitude": 56.78, "village_id": 1 }`
Response: `{ "success": true, "message": "Tank added successfully", "tank": {...} }`

#### /admin/alltanks (GET)
Get all tanks for admin's village.
Response: `{ "success": true, "tanks": [...] }`

#### /admin/announce (POST)
Create announcement.
Request: `{ "title": "Notice", "message": "Water supply update" }`
Response: `{ "success": true, "announcement": {...} }`

---

### Operator APIs
#### /operator/login (POST)
Operator login, returns JWT.
Request: `{ "mobile": "1234567890", "password": "pass" }`
Response: `{ "success": true, "token": "...", "operator": { "id": 2, "name": "John", "phone": "1234567890" } }`

#### /operator/pump/:qrCode (GET)
Get pump details by QR code.
Response: `{ "success": true, "pump": { "pump_id": 1, "pump_name": "Pump 1", "flow_rate_lph": 1000, "latitude": 12.34, "longitude": 56.78 } }`

#### /operator/pump/change-request (POST)
Create pump change request.
Request: `{ "request_type": "UPDATE", "pump_id": 1, ... }`
Response: `{ "success": true, "message": "Change request sent for admin approval", "request": {...} }`

#### /operator/daily-log/ (POST)
Create daily log.
Request: `{ "pump_id": 1, "start_time": "2026-01-02T08:00:00Z", "end_time": "2026-01-02T10:00:00Z", "chlorine_added": true, "gps_lat": 12.34, "gps_lng": 56.78 }`
Response: `{ "success": true, "message": "Daily log created successfully", "log": {...} }`

---

### Resident APIs
#### /resident/register (POST)
Register new resident.
Request: `{ "name": "Alice", "phone": "9876543210", "password": "pass", "village_id": 1, "address": "123 Main St" }`
Response: `{ "success": true, "message": "Resident registered successfully", "resident": {...} }`

#### /resident/login (POST)
Resident login, returns JWT.
Request: `{ "phone": "9876543210", "password": "pass" }`
Response: `{ "success": true, "token": "...", "resident": {...} }`

#### /resident/complaint (POST)
Raise complaint.
Request: `{ "category": "Water Quality", "description": "Issue details", "photo_url": "...", "pump_id": 1 }`
Response: `{ "success": true, "message": "Complaint submitted successfully", "complaint": {...} }`

#### /resident/complaints (GET)
Get resident's complaints.
Response: `{ "success": true, "complaints": [...] }`

#### /resident/announcements (GET)
Get announcements.
Response: `{ "success": true, "announcements": [...] }`

---

## Notes
- All protected routes require JWT in the Authorization header.
- All request/response bodies are JSON.
- Error responses include `{ success: false, message: "..." }` and appropriate HTTP status codes.
- For more details, see controller and route files in `/server/src/`.

**POST** `/admin/operators`  
**Auth:** Bearer JWT (admin)

**Use:** Admin registers a new operator.

**Request Body:**
```json
{
	"name": "John",
	"phone": "1234567890",
	"username": "john",
	"password": "pass",
	"village_id": 1
}
```
**Response Example:**
```json
{
	"error": false,
	"message": "Operator registered successfully",
	"data": {
		"operator_id": 2,
		"username": "john"
	}
}
```

---

## 3. Operator Login

**POST** `/operator/login`

**Use:** Operator logs in with mobile and password. Returns JWT and operator info.

**Request Body:**
```json
{
	"mobile": "1234567890",
	"password": "pass"
}
```
**Response Example:**
```json
{
	"success": true,
	"token": "JWT_TOKEN",
	"operator": {
		"id": 2,
		"name": "John",
		"phone": "1234567890"
	}
}
```

---

## 4. Get Pump by QR

**GET** `/operator/pump/:qrCode`  
**Auth:** Bearer JWT (operator)

**Use:** Get pump details by QR code for the logged-in operator.

**Headers:**
`Authorization: Bearer JWT_TOKEN`

**Response Example:**
```json
{
	"success": true,
	"pump": {
		"pump_id": 1,
		"pump_name": "Pump 1",
		"flow_rate_lph": 1000,
		"latitude": 12.34,
		"longitude": 56.78
	}
}
```

---

## 5. Create Daily Log

**POST** `/operator/daily-log/`  
**Auth:** Bearer JWT (operator)

**Use:** Operator creates a daily log for a pump.

**Request Body:**
```json
{
	"pump_id": 1,
	"reading": 123.45,
	"date": "2025-12-31"
}
```
**Response Example:**
```json
{
	"success": true,
	"message": "Log created"
}
```

---

## 6. Admin Ping (Test)

**GET** `/admin/ping`

**Use:** Test if admin route is working.

**Response Example:**
```json
{
	"message": "Admin route working"
}
```
	Create a <code>.env</code> file in <code>server/</code>:
	```env
	DATABASE_URL=your_database_url
	JWT_SECRET=your_jwt_secret
	```

3. <b>Prisma Setup</b>
	```sh
	npx prisma migrate deploy
	npx prisma generate
	# (Optional) Seed DB:
	npx prisma db seed
	```

4. <b>Run the server</b>
	```sh
	bun run dev
	# or
	npm run dev
	```

Server runs on <b>http://localhost:4000</b> by default.

---

## 🛠️ Tech Stack

- [Hono](https://hono.dev/) — Express-like web framework
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Bun](https://bun.sh/) or Node.js
- [JWT](https://jwt.io/) for authentication


