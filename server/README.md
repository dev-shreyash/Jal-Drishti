## 📦 API Request & Response Examples

| Method | Endpoint                      | Request Body Example                                                                 | Response Example (Success) |
|--------|-------------------------------|--------------------------------------------------------------------------------------|----------------------------|
| POST   | /auth/admin/login             | `{ "username": "admin", "password": "secret" }`                                   | `{ "token": "...", "admin": { "id": 1, "username": "admin" } }` |
| GET    | /admin/ping                   | —                                                                                    | `{ "message": "Admin route working" }` |
| POST   | /admin/operators              | `{ "name": "John", "phone": "1234567890", "username": "john", "password": "pass", "village_id": 1 }` | `{ "error": false, "message": "Operator registered successfully", "data": { "operator_id": 2, "username": "john" } }` |
| POST   | /operator/login               | `{ "mobile": "1234567890", "password": "pass" }`                                  | `{ "success": true, "token": "...", "operator": { "id": 2, "name": "John", "phone": "1234567890" } }` |
| GET    | /operator/pump/:qrCode        | — (set Authorization header with Bearer token)                                        | `{ "success": true, "pump": { "pump_id": 1, "pump_name": "Pump 1", "flow_rate_lph": 1000, "latitude": 12.34, "longitude": 56.78 } }` |
| POST   | /operator/daily-log/          | `{ "pump_id": 1, "reading": 123.45, "date": "2025-12-31" }` (plus Bearer token)  | `{ "success": true, "message": "Log created" }` |

---
## 🚦 API Routes for Frontend Development

| Method | Endpoint                      | Description                                   | Auth Required |
|--------|-------------------------------|-----------------------------------------------|:------------:|
| POST   | /auth/admin/login             | Admin login (returns JWT)                     |      No      |
| GET    | /admin/ping                   | Test admin route                              |     Yes*     |
| POST   | /admin/operators              | Register new operator (admin only)            |     Yes      |
| POST   | /operator/login               | Operator login (returns JWT)                  |      No      |
| GET    | /operator/pump/:qrCode        | Get pump details by QR (operator only)        |     Yes      |
| POST   | /operator/daily-log/          | Create daily log (operator only)              |     Yes      |

<sup>* /admin/ping may not require auth depending on implementation, but is intended for admin use.</sup>

---

<div align="center">

# Backend API Use Cases (Frontend Reference Only)

---

## 1. Admin Login

**POST** `/auth/admin/login`

**Use:** Admin logs in with username and password. Returns JWT and admin info.

**Request Body:**
```json
{
	"username": "admin",
	"password": "secret"
}
```
**Response Example:**
```json
{
	"token": "JWT_TOKEN",
	"admin": {
		"id": 1,
		"username": "admin"
	}
}
```

---

## 2. Register Operator

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


