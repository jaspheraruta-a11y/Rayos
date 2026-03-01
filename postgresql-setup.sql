-- ============================================================
-- PostgreSQL Setup: Users & Registration Database
-- Database: loginform_users
-- ============================================================

-- Create database
CREATE DATABASE loginform_users;

-- Connect to the database (in PostgreSQL client, use: \c loginform_users)

-- Create users table
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

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;

-- ============================================================
-- Example data (optional)
-- ============================================================
 
