# PostgreSQL Conversion Complete ✓

This guide summarizes the changes made to convert your project from MongoDB to PostgreSQL.

## Files Modified

### Backend Configuration
1. **backend/package.json** - Replaced `mongodb` with `pg` dependency
2. **backend/db.js** - Converted from MongoDB to PostgreSQL connection pool
3. **backend/index.js** - Updated error messages for PostgreSQL
4. **backend/routes/auth.js** - Converted all MongoDB queries to SQL
5. **backend/routes/health.js** - Updated health check for PostgreSQL
6. **backend/.env.example** - Updated with PostgreSQL credentials

### New Files Created
1. **postgresql-setup.sql** - SQL script to create database, tables, and indexes
2. **POSTGRESQL_SETUP.md** - Complete setup instructions
3. **MIGRATION_GUIDE.md** - Guide for migrating from MongoDB (if needed)
4. **CONVERSION_SUMMARY.md** - This file

## Key Changes

### Database Connection
**Before (MongoDB)**
```javascript
import { MongoClient } from 'mongodb';
const mongoClient = new MongoClient(MONGODB_URI);
```

**After (PostgreSQL)**
```javascript
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ user, password, host, port, database });
```

### Schema Changes

#### User ID
- MongoDB: `ObjectId` → PostgreSQL: `UUID` (auto-generated)

#### Field Names (snake_case for SQL)
- `_id` → `id`
- `passwordHash` → `password_hash`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

#### Query Examples

**Find User (MongoDB)**
```javascript
const users = collection('users');
const user = await users.findOne({ email: 'user@example.com' });
```

**Find User (PostgreSQL)**
```javascript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);
const user = result.rows[0];
```

**Insert User (MongoDB)**
```javascript
const result = await users.insertOne({ email, passwordHash, createdAt });
const userId = result.insertedId.toString();
```

**Insert User (PostgreSQL)**
```javascript
const result = await pool.query(
  'INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, $3) RETURNING id',
  [email, passwordHash, createdAt]
);
const userId = result.rows[0].id;
```

## Quick Start

### 1. Set Up PostgreSQL Database

**Option A: Command Line (Windows)**
```cmd
psql -U postgres -p 5432 -f postgresql-setup.sql
```

**Option B: Using psql interactive shell**
```cmd
psql -U postgres -p 5432
\i postgresql-setup.sql
\d users
```

### 2. Configure Environment Variables

Create `backend/.env` with:
```
DB_USER=postgres
DB_PASSWORD=12345
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key
PORT=3001
```

### 3. Install and Run

```cmd
cd backend
npm install
npm start
```

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

## API Endpoints (Unchanged)

All endpoints remain the same:
- `POST /api/register` - Create new account
- `POST /api/login` - Login and get JWT
- `GET /api/me` - Get current user
- `GET /api/health` - Health check

## Important Notes

### Passwords
- All passwords are hashed with bcrypt10
- Never store plain-text passwords
- Existing MongoDB passwords will NOT work with PostgreSQL migration (re-hash needed)

### Connection Pooling
- PostgreSQL uses connection pooling for better performance
- Default pool size: 10 connections
- See `backend/db.js` for pool configuration

### Error Handling
- MongoDB errors (e.g., `code: 11000`) mapped to PostgreSQL equivalents (`code: 23505`)
- Error responses remain consistent for frontend

### UUID vs ObjectId
- PostgreSQL uses `UUID` for primary keys (random 128-bit identifiers)
- More efficient for distributed systems
- Backend automatically generates unique IDs

## Reverting to MongoDB (if needed)

If you need to switch back to MongoDB:
1. Restore original `backend/db.js` from git history
2. Restore original `backend/routes/auth.js` from git history
3. Revert `backend/package.json` to use `mongodb` instead of `pg`
4. Update `.env` to use `MONGODB_URI`
5. Run `npm install`

## Troubleshooting

### "Database does not exist"
```sql
CREATE DATABASE loginform_users;
```

### "Table does not exist"
```sql
-- Run the SQL setup script
\i postgresql-setup.sql
```

### "Password authentication failed"
- Check `DB_PASSWORD` in `.env` matches PostgreSQL password
- Verify PostgreSQL user (default: `postgres`)

### "Connection refused"
- Ensure PostgreSQL is running
- Check `DB_HOST` and `DB_PORT` are correct
- Verify no firewall blocking port 5432

### "EADDRINUSE: address already in use :::3001"
- Another app is using port 3001
- Change `PORT` in `.env` or kill the process

## Next Steps

1. **Install dependencies**: `npm install` in backend folder
2. **Run SQL setup**: Execute `postgresql-setup.sql`
3. **Configure .env**: Add PostgreSQL credentials
4. **Test API**: Run backend and test endpoints with curl/Postman
5. **Update frontend**: No changes needed (API contract unchanged)

## Performance Tips

- Indexes on `email`, `created_at`, and `username` are configured
- Connection pooling handles concurrent requests efficiently
- Consider adding prepared statements for frequently used queries
- Monitor connection pool with `pool.query('SELECT COUNT(*) FROM pg_stat_activity');`

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node pg Module](https://node-postgres.com/)
- [SQL vs MongoDB Cheat Sheet](https://docs.mongodb.com/manual/reference/sql-comparison/)

---

**Conversion completed on:** March 1, 2026
**Database:** PostgreSQL
**ORM/Driver:** pg (node-postgres)
**Node.js:** v16+
