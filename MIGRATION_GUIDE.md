# MongoDB to PostgreSQL Migration Guide

If you have existing MongoDB data, use this guide to migrate to PostgreSQL.

## Step 1: Export Data from MongoDB

If you have existing users in MongoDB, export them first:

```bash
# Export MongoDB collection to JSON
mongoexport --db loginform_users --collection users --out users_backup.json
```

## Step 2: Set Up PostgreSQL

Follow the instructions in `POSTGRESQL_SETUP.md` to:
1. Create the PostgreSQL database and tables
2. Configure environment variables

## Step 3: Migrate Data (if applicable)

If you have existing user data in `users_backup.json`:

```javascript
// migration.js - Node.js script to import JSON data to PostgreSQL
import pkg from 'pg';
import fs from 'fs';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'loginform_users',
});

async function migrateData() {
  try {
    const data = JSON.parse(fs.readFileSync('users_backup.json', 'utf8'));
    
    for (const user of data) {
      await pool.query(
        `INSERT INTO users (id, email, username, password_hash, created_at, updated_at, verified, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE
         SET email = $2, username = $3, updated_at = $5`,
        [
          user._id,
          user.email.toLowerCase(),
          user.username || null,
          user.passwordHash,
          user.createdAt,
          user.updatedAt || user.createdAt,
          user.verified || false,
          user.role || 'user'
        ]
      );
    }
    
    console.log(`✓ Migrated ${data.length} users successfully`);
    await pool.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateData();
```

Run the migration:
```bash
node migration.js
```

## Step 4: Update Backend Code

The backend has already been updated to use PostgreSQL. Just install dependencies and start:

```bash
cd backend
npm install
npm start
```

## Step 5: Verify Migration

Test the authentication endpoints:

```bash
# Test registration
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## Differences from MongoDB

| Aspect | MongoDB | PostgreSQL |
|--------|---------|-----------|
| ID Type | ObjectId | UUID |
| Query Style | Aggregation pipeline | SQL |
| Field Names | camelCase (_id, passwordHash) | snake_case (id, password_hash) |
| Connections | Single client | Connection pool |
| Transactions | Built-in | Explicit mode |

## Rollback (if needed)

If you need to keep MongoDB as backup:

1. Keep your MongoDB instance running separately
2. To switch back: update `.env` to point to MongoDB
3. Restore the original `backend/db.js` and `backend/routes/auth.js` from git

## Support

For issues during migration, check:
- PostgreSQL credentials in `.env`
- Database exists: `\l` in psql
- Tables exist: `\dt` in psql
- User data: `SELECT COUNT(*) FROM users;` in psql
