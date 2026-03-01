# Login Form (Vite + React + TypeScript)

A login/signup dashboard using React, Tailwind CSS, and **PostgreSQL** for storing user accounts.

## Project structure

- **`frontend/`** — All frontend code (Vite + React + TypeScript, components, contexts, API client).
- **`backend/`** — All backend code (Express API, PostgreSQL):
  - **`backend/routes/`** — API routes:
    - **`auth.js`** — `POST /api/register`, `POST /api/login`, `GET /api/me`
    - **`health.js`** — `GET /api/health`
  - **`backend/db.js`** — PostgreSQL connection pool setup.
  - **`backend/index.js`** — App entry, mounts routes under `/api`.

## PostgreSQL setup (required for register/login)

**Quick Start:**
1. Run the Windows setup script: `setup-postgresql.bat` (or see detailed instructions below)
2. Configure environment variables (see step 3 below)
3. Install and start the backend

**Detailed Instructions:**

1. **Ensure PostgreSQL is installed and running** 
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Default credentials: user `postgres`, password `12345`, port `5432`

2. **Create the database and tables** 
   
   **Option A: Windows batch script** (easiest)
   ```bash
   setup-postgresql.bat
   ```
   
   **Option B: Command line** 
   ```bash
   psql -U postgres -p 5432 -f postgresql-setup.sql
   ```
   
   **Option C: Manual SQL** (pgAdmin, DBeaver, etc.)
   - Run the SQL commands from `postgresql-setup.sql` in your PostgreSQL client

3. **Configure the backend** 
   ```bash
   cd backend
   copy .env.example .env
   REM Edit .env and set PostgreSQL credentials:
   REM DB_USER=postgres
   REM DB_PASSWORD=12345
   REM DB_HOST=localhost
   REM DB_PORT=5432
   ```

4. **Install and start the API**
   ```bash
   npm install
   npm run dev
   ```
   The API runs at **http://localhost:3001** by default.

5. **Optional:** In `frontend/`, create a `.env` file and set `VITE_API_URL=http://localhost:3001` if your API is on a different URL.

### Viewing data in PostgreSQL

Registered users are stored in the `loginform_users` database, table `users`. To view them:

1. **Using psql** (command line)
   ```bash
   psql -U postgres -d loginform_users
   SELECT * FROM users;
   ```

2. **Using pgAdmin** 
   - Open pgAdmin
   - Connect to PostgreSQL (localhost:5432)
   - Navigate to Databases → loginform_users → Schemas → public → Tables → users
   - Right-click and select "View/Edit Data" → All Rows

3. **Using DBeaver**
   - Create a new PostgreSQL connection to localhost:5432
   - Connect with user `postgres` and password `12345`
   - Browse to Database → loginform_users → public → users table

## Run the project locally

### 1. Install Node.js (if needed)

- Download and install from [nodejs.org](https://nodejs.org/) (LTS).
- Restart your terminal (or PC) after installing so `node` and `npm` are in your PATH.

### 2. Install dependencies

From the project folder:

```bash
npm run install:all
```

Or install frontend and backend separately:

```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Start backend and frontend

**Terminal 1 — API (required for login/register):**

```bash
npm run backend
```

**Terminal 2 — Frontend dev server:**

```bash
npm run dev
```

Then open the URL shown (usually **http://localhost:5173**) in your browser. **Register** and **login** use the API at **http://localhost:3001**.

### Alternative: run with the script (Windows)

Double-click **`run.cmd`** to install frontend dependencies (if needed) and start the **frontend** dev server. Start the API in a separate terminal with `npm run backend`.

---

## If `npm` is not recognized

- Make sure **Node.js** is installed and the installer option "Add to PATH" was checked.
- Use **Command Prompt** (cmd) instead of PowerShell if npm works there.
- Or open a new **Node.js command prompt** from the Start menu (if installed).

## Optional: environment variables

- **Frontend** (in `frontend/.env`): **`VITE_API_URL`** – API server URL (default: `http://localhost:3001`).
- **Backend** (in `backend/.env`): copy `backend/.env.example` to `backend/.env` and set **`DB_USER`**, **`DB_PASSWORD`**, **`DB_HOST`**, **`DB_PORT`** (and optionally `JWT_SECRET`, `PORT`).

## Scripts (from project root)

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start frontend dev server      |
| `npm run backend` | Start backend API              |
| `npm run build`    | Build frontend for production  |
| `npm run preview`  | Preview frontend build         |
| `npm run install:all` | Install frontend + backend deps |

## PostgreSQL Conversion

This project has been converted from MongoDB to PostgreSQL. For more details:
- See **[CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md)** for detailed changes
- See **[POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)** for setup instructions
- See **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** if migrating from MongoDB
