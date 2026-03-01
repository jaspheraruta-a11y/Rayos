-- ============================================================
-- PostgreSQL Setup for Rayos Project
-- Quick Copy-Paste SQL Commands
-- ============================================================

-- STEP 1: Create Database
-- Copy and run this in PostgreSQL

CREATE DATABASE loginform_users;

-- ============================================================

-- STEP 2: Connect to the database
-- In psql, run: \c loginform_users
-- Or in your client, select the loginform_users database

-- ============================================================

-- STEP 3: Create Users Table

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

-- ============================================================

-- STEP 4: Create Indexes for Performance

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;

-- ============================================================

-- VERIFICATION: Check everything was created

-- Check database exists
\l

-- Check tables in postgres
\dt

-- Check users table structure
\d+ users

-- Check indexes
\di

-- ============================================================

-- ADMIN COMMANDS (for testing/maintenance)

-- View all users
SELECT id, email, username, created_at, verified, role FROM users;

-- Count users
SELECT COUNT(*) as total_users FROM users;

-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Delete all users (for testing)
DELETE FROM users;

-- Reset auto-increment for UUID (not needed for UUID but shown for reference)
-- For UUID, just use: TRUNCATE TABLE users;

-- ============================================================

-- BACKUP & RESTORE

-- Backup database (run from command line, not in psql)
-- pg_dump -U postgres -d loginform_users > backup.sql

-- Restore database (run from command line)
-- psql -U postgres -d loginform_users < backup.sql

-- ============================================================

-- UPGRADE EXISTING TABLE (if migrating from MongoDB)

-- Add any new columns if needed
-- ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Update existing records
-- UPDATE users SET verified = true WHERE email LIKE '%@example.com';

-- ============================================================

-- PERFORMANCE MONITORING

-- Check table size
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname != 'pg_catalog' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
SELECT query, calls, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- ============================================================
-- END OF SQL SETUP
-- ============================================================
