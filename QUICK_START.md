# MongoDB to PostgreSQL Conversion - Complete Setup Guide

## Summary of Changes

Your Rayos project has been successfully converted from **MongoDB** to **PostgreSQL**. All database queries, connection logic, and environment configuration have been updated.

## Quick Start (3 Steps)

### Step 1: Set Up PostgreSQL Database

**Using the batch script (Windows):**
```cmd
setup-postgresql.bat
```

**Or manually with psql:**
```cmd
psql -U postgres -p 5432 -f postgresql-setup.sql
```

### Step 2: Create .env File

In the `backend` folder, create `.env` file with your PostgreSQL credentials:
```
DB_USER=postgres
DB_PASSWORD=12345
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key-here
PORT=3001
```

Or copy from template:
```cmd
cd backend
copy .env.example .env
```

### Step 3: Install & Start

```cmd
cd backend
npm install
npm start
```

Backend will run at: **http://localhost:3001**

## Files Modified

### Backend Code Changes
- `backend/package.json` - Replaced `mongodb` → `pg`
- `backend/db.js` - MongoDB Client → PostgreSQL Pool
- `backend/routes/auth.js` - All MongoDB queries → SQL queries
- `backend/routes/health.js` - Health check updated for PostgreSQL
- `backend/index.js` - Error messages updated
- `backend/.env.example` - Updated with PostgreSQL credentials

### New Files Created
- `postgresql-setup.sql` - SQL script to create database and tables
- `setup-postgresql.bat` - Windows batch script for automated setup
- `POSTGRESQL_SETUP.md` - Detailed setup instructions
- `MIGRATION_GUIDE.md` - Guide for migrating existing MongoDB data
- `CONVERSION_SUMMARY.md` - Detailed conversion notes
- This file: `QUICK_START.md`

## Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);
```

## Key API Endpoints

All endpoints remain **unchanged** - no frontend modifications needed!

- `POST /api/register` - Create new account
- `POST /api/login` - Login and receive JWT token
- `GET /api/me` - Get current user (with Bearer token)
- `GET /api/health` - Health check

## Environment Variables

### Backend (.env)

| Variable | Example | Purpose |
|----------|---------|---------|
| `DB_USER` | postgres | PostgreSQL username |
| `DB_PASSWORD` | 12345 | PostgreSQL password |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `JWT_SECRET` | your-key | JWT signing secret |
| `PORT` | 3001 | Backend server port |

### Frontend (.env) - Optional

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | http://localhost:3001 | Backend API URL |

## Troubleshooting

### "psql command not found"
- Install PostgreSQL: https://www.postgresql.org/download/
- Add PostgreSQL bin folder to Windows PATH

### "Database does not exist"
```sql
-- Create manually if needed:
CREATE DATABASE loginform_users;
```

### "Connection refused"
- Verify PostgreSQL is running
- Check host, port, and credentials in .env
- Default: host=localhost, port=5432, user=postgres

### "Unique constraint violation on email"
- User with that email already exists
- To clear test data: `DELETE FROM users;`

## Verifying Setup

### Test connection with psql:
```bash
psql -U postgres -d loginform_users -c "SELECT COUNT(*) FROM users;"
```

### Test API with curl:
```bash
# Register
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Development Workflow

### Terminal 1 - Backend (API)
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Open browser: **http://localhost:5173**

## Important Notes

1. **Passwords are hashed with bcrypt** - Never store plain text passwords
2. **Junction IDs:** MongoDB ObjectId → PostgreSQL UUID (auto-generated)
3. **Connection Pooling:** PostgreSQL uses efficient connection pooling
4. **No Frontend Changes:** All API contracts remain the same
5. **JWT Tokens:** Still 7-day expiration (unchanged)

## Next Steps

1. ✓ Run `setup-postgresql.bat` to create database
2. ✓ Configure `backend/.env` with credentials
3. ✓ Run `npm install` in backend folder
4. ✓ Start backend with `npm start`
5. Start frontend in separate terminal
6. Test registration and login
7. View data in PostgreSQL using psql or pgAdmin

## Support & Documentation

- **Setup Details:** See [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)
- **Conversion Details:** See [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)
- **MongoDB Migration:** See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Node pg Module:** https://node-postgres.com/

## Reverting to MongoDB (if needed)

If you need to revert to MongoDB:
1. Keep a git backup of the PostgreSQL changes
2. Restore original files from git history
3. Update `backend/package.json` to use `mongodb` instead of `pg`
4. Update `.env` to use `MONGODB_URI`
5. Run `npm install`

---

**Conversion Status:** ✓ Complete  
**Created:** March 1, 2026  
**Database:** PostgreSQL 12+  
**Backend:** Node.js Express  
**Frontend:** React + Vite  
