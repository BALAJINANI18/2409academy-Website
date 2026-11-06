# 2409 Academy - Backend (Spring Boot + PostgreSQL)

Register / login API for the website. Passwords are stored as BCrypt hashes in the
`users` table of the `2409_academy` database. The API returns a 24-hour JWT.

## Requirements
- Java 21 LTS or newer, Maven
- PostgreSQL (server running) and pgAdmin
- Node.js 20.19+ or 22+ for the frontend (Vite 8)

## 1. One-time database setup (pgAdmin)
1. Create the database (only once). Open a Query Tool on the default `postgres` database and run this **by itself**:
   ```sql
   CREATE DATABASE "2409_academy";
   ```
   (`CREATE DATABASE` cannot run together with other statements in pgAdmin. That is the
   "cannot run inside a transaction block" error.)
2. Right-click **2409_academy -> Query Tool**, open `backend/database/schema.sql`, and run it (F5).
   You should see an empty `users` table with 6 columns.

## 2. Check the two settings in `src/main/resources/application.properties`
| Setting | Default | Change it if... |
|---|---|---|
| `spring.datasource.url` | `...localhost:5433/2409_academy` | your PostgreSQL server uses another port (commonly **5432** or **5433**). Find it in pgAdmin: right-click the server -> Properties -> Connection -> Port |
| `spring.datasource.password` | `newpassword123` | the `postgres` password on **that same server** is different |

Instead of editing the file you can set environment variables in PowerShell before running:
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5433/2409_academy"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
```
To set/reset the password, run in pgAdmin (on the server you connect to):
```sql
ALTER USER postgres WITH PASSWORD 'newpassword123';
```

## 3. Run the backend
```powershell
cd backend
mvn spring-boot:run
```
Success looks like: `Started AcademyApiApplication in ... seconds` (API at http://localhost:8080).

## 4. Run the frontend (second terminal, project root)
```powershell
npm install
npm run dev
```
Open http://localhost:5173 and use **Sign up** / **Log in**. Vite forwards `/api` to port 8080 automatically.
After signing up, check pgAdmin: `SELECT user_id, full_name, email, role, created_at FROM users;`

## Admin panel
1. Make your account an admin (once). Sign up on the website first, then in pgAdmin run this on `2409_academy`
   (put your own email):
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
2. Refresh the website (or log out and log in). An **Admin** link appears in the top menu. You can also open
   http://localhost:5173/admin directly.
3. In the panel you can see totals, search users, make a student an admin (or back), and delete users.
   You cannot change or delete your own account from the panel (so you can't lock yourself out).
   Role changes take effect immediately because the API reads the role from the database on every request.

## Test the API without the website (PowerShell)
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/register -ContentType "application/json" -Body '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/auth/login -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
```

## API
- `POST /api/auth/register` `{ "fullName", "email", "password" (8-72 chars) }` -> 201 `{ token, user, message }`
- `POST /api/auth/login` `{ "email", "password" }` -> 200 `{ token, user, message }`
- `GET /api/me` (needs `Authorization: Bearer <token>`) -> the logged-in user, with their current role
- Admin only (role `ADMIN`): `GET /api/admin/stats`, `GET /api/admin/users`, `PUT /api/admin/users/{id}/role` with `{ "role": "ADMIN" | "STUDENT" }`, `DELETE /api/admin/users/{id}`
- Errors come back as `{ "message": "..." }`: 400 invalid input, 401 wrong email/password or not logged in, 403 not an admin, 409 email already registered, 503 database unreachable.

## Troubleshooting
| You see | Cause / fix |
|---|---|
| `password authentication failed for user "postgres"` | Password in `application.properties` (or `DB_PASSWORD`) is not the password of the server on that port. See step 2. |
| `Connection to localhost:5432 refused` | PostgreSQL service not running, or it is on another port. |
| `database "2409_academy" does not exist` | Do step 1. |
| `Schema-validation: missing table [users]` / `missing column` | Run `backend/database/schema.sql` inside the `2409_academy` database (not the `postgres` database). |
| `Port 8080 was already in use` | Stop the other app, or set `server.port=8081` and also change the proxy target in `vite.config.js`. |
| `/admin` says "Admins only" | Your role is still STUDENT. Run the `UPDATE users SET role = 'ADMIN' ...` query above, then refresh. |
| Website says "server is not available" | The backend is not running, or crashed on startup. Read the `Caused by:` lines in its terminal. |

## Before a public launch
This is a starter auth system. Add rate limiting, email verification, password reset, HTTPS, a strong
`APP_JWT_SECRET` and production CORS (`CORS_ALLOWED_ORIGINS`). Do not expose PostgreSQL to the internet.
For a deployed site, host the API on a server and build the frontend with `VITE_API_BASE_URL` set to its HTTPS URL
(a deployed site cannot reach `localhost` on your PC).
