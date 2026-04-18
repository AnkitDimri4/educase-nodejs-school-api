
---

# Educase Node.js School API

A simple **Node.js + Express + MySQL** REST API for managing schools and fetching nearby schools based on latitude and longitude.

Live deployment (production):

- Base URL: [https://educase-nodejs-school-api-production.up.railway.app](https://educase-nodejs-school-api-production.up.railway.app)

---

## Screenshots

| API Health Check | Add School (POST `/api/addSchool`) |
| ---------------- | ----------------------------------- |
| <img src="https://github.com/user-attachments/assets/818d2a57-85f4-4ee3-83a9-3ef3ebb09f03" alt="Railway deploy/logs" width="400" /> | <img src="https://github.com/user-attachments/assets/66e941c1-615b-419b-b6e9-dcdd9e621e80" alt="Add school request" width="400" /> |

|  |  |
| --------------------- | ------------------- |
| <img src="https://github.com/user-attachments/assets/03d6d4da-25de-4acd-bec8-45edceeeb494" alt="API health check" width="400" /> | <img src="https://github.com/user-attachments/assets/249aaaf1-b6e6-4270-a944-f97e6d680091" alt="Railway environment variables" width="400" /> |

|  |  |
| ------------ | ----------------- |
| <img src="https://github.com/user-attachments/assets/255fcf3c-adc6-4baa-a74e-ad2f0766a2da" alt="Add school success response" width="400" /> | <img src="https://github.com/user-attachments/assets/68c168fd-f2b9-4c0c-9e26-bc6da42cbed1" alt="Schools table in Railway MySQL" width="400" /> |

---

## Features

- Add a new school with name, address, and coordinates.
- List all schools sorted by distance from a given location.
- MySQL database with connection pooling.
- Environment-based configuration for local and production.
- Ready to deploy on Railway (API + MySQL).

---

## Tech Stack

<p align="left">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Railway-111827?style=for-the-badge&logo=railway&logoColor=white" />
<img src="https://img.shields.io/badge/dotenv-000000?style=for-the-badge&logo=dotenv&logoColor=white" />
<img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" />
</p>

---

## Project Structure

```text
src/
  index.js        # Express app bootstrap, routes registration
  db.js           # MySQL connection pool using env variables
  initDb.js       # One-time script to create the schools table
  routes/
    schools.js    # /addSchool and /listSchools endpoints
```

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/AnkitDimri4/educase-nodejs-school-api.git
cd educase-nodejs-school-api
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (you can base it on this example):

```env
# Server
PORT=4000

# Local MySQL configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
```

> Make sure you have a local MySQL server running and a database named `school_management` (or update `DB_NAME` accordingly).

### 3. Initialize the database (local)

Run the init script once to create the `schools` table:

```bash
npm run init:db
```

This executes `src/initDb.js`, which runs:

```sql
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

### 4. Run the server (local)

For development with auto-reload:

```bash
npm run dev
```

Or plain start:

```bash
npm start
```

The API will be available at:  
`http://localhost:4000`

---

## API Endpoints

Base URL (local): `http://localhost:4000`  
Base URL (production): `https://educase-nodejs-school-api-production.up.railway.app`

### Health Check

**GET** `/`

Response:

```json
{
  "message": "School Management API is running"
}
```

### Add School

**POST** `/api/addSchool`

**Body (JSON):**

```json
{
  "name": "Railway Test School",
  "address": "Cloud City India",
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**Successful Response (201):**

```json
{
  "message": "School added successfully",
  "schoolId": 1
}
```

### List Schools by Distance

**GET** `/api/listSchools?lat=<latitude>&lon=<longitude>`

Example:

```http
GET /api/listSchools?lat=28.60&lon=77.20
```

**Response (example shape):**

```json
[
  {
    "id": 1,
    "name": "Railway Test School",
    "address": "Cloud City India",
    "latitude": 28.6139,
    "longitude": 77.209,
    "distanceKm": 1.23
  }
]
```

> Internally, the API calculates the distance between the given coordinates and each school, then sorts results by distance ascending.

---

## Deployment (Railway)

This project is deployed on Railway with:

- One **Node.js service**: `educase-nodejs-school-api`
- One **MySQL service**: `MySQL`

### Environment variables on Railway (Node service)

Configured variables:

```env
DB_HOST = mysql.railway.internal
DB_PORT = 3306
DB_USER = <value from MYSQLUSER>
DB_PASSWORD = <value from MYSQLPASSWORD>
DB_NAME = <value from MYSQLDATABASE>  # e.g. railway
```

Railway injects `PORT` automatically; the app uses:

```js
const PORT = process.env.PORT || 4000;
```

### Initializing DB on Railway

The `schools` table on Railway was created by running:

```bash
npm run init:db
```

once as the start command, then switching back to:

```bash
npm start
```

for normal operation.

---

## Scripts

```bash
# Start API in production mode
npm start

# Development with auto-reload (nodemon)
npm run dev

# Initialize database (create schools table if not exists)
npm run init:db
```

---

## Notes

- Do not commit your real `.env` file or Railway secrets.
- For local testing, ensure MySQL is running and credentials in `.env` are valid.
- For production, update the Railway env variables if the DB password/user ever rotate.

---


## Author

**Ankit Dimri**  
Full-Stack / AI Developer  

[![GitHub](https://img.shields.io/badge/GitHub-AnkitDimri4-black?logo=github)](https://github.com/AnkitDimri4)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankit%20Dimri-blue?logo=linkedin)](https://linkedin.com/in/ankit-dimri-a6ab98263)
[![LeetCode](https://img.shields.io/badge/LeetCode-Profile-orange?logo=leetcode)](https://leetcode.com/u/user4612MW/)

---
