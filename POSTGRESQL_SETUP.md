# PostgreSQL Setup Instructions

## Prerequisites
- PostgreSQL installed and running on your machine
- PostgreSQL credentials: password `12345`, port `5432`

## Setup Steps

### 1. Create Database and Tables

Run the SQL setup script in PostgreSQL:

**Option A: Using psql command line**
```bash
psql -U postgres -p 5432 -f postgresql-setup.sql
```

**Option B: Using pgAdmin or DBeaver**
- Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
- Connect to PostgreSQL (user: `postgres`, password: `12345`, port: `5432`)
- Open the `postgresql-setup.sql` file and execute it

**Option C: Manual SQL execution**
- Connect to PostgreSQL with admin credentials
- Copy and paste the contents of `postgresql-setup.sql` into your SQL client
- Execute the script

### 2. Configure Environment Variables

Copy the `.env.example` to `.env` in the `backend` folder:

**Windows (Command Prompt):**
```cmd
copy backend\.env.example backend\.env
```

**Mac/Linux:**
```bash
cp backend/.env.example backend/.env
```

Then edit `backend/.env` with your database credentials:
```
DB_USER=postgres
DB_PASSWORD=12345
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start the Backend Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Database Schema

The project uses a single `users` table with the following columns:

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, auto-generated |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| username | VARCHAR(255) | NULLABLE |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, default CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | NOT NULL, default CURRENT_TIMESTAMP |
| verified | BOOLEAN | DEFAULT FALSE |
| role | VARCHAR(50) | DEFAULT 'user', CHECK (user \| admin) |

### Indexes

- `idx_users_email`: Unique index on email for fast lookups
- `idx_users_created_at`: Index on created_at for sorting
- `idx_users_username`: Partial unique index on username (where not null)

## Troubleshooting

### Connection Error: "Connection refused"
- Verify PostgreSQL is running
- Check the port (default: 5432)
- Verify the credentials in `.env` match your PostgreSQL setup

### Error: "Database 'loginform_users' does not exist"
- Re-run the `postgresql-setup.sql` script
- Make sure you executed all commands in the script

### Error: "Unique constraint violation on email"
- This happens if you try to register with an email that already exists
- To clear test data: `DELETE FROM users;`

## API Endpoints

The backend provides the following authentication endpoints:

- **POST /api/register** - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }
  ```

- **POST /api/login** - Login and get JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **GET /api/me** - Get current user (requires Bearer token)
  Header: `Authorization: Bearer <token>`

## Notes

- All passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 7 days
- The database connection uses connection pooling from the `pg` module for better performance
