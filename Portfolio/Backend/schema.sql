-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio bio table
CREATE TABLE IF NOT EXISTS bio (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  about TEXT,
  avatar TEXT,
  cv_url TEXT,
  github_url TEXT,
  roles TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  items TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact table
CREATE TABLE IF NOT EXISTS contact (
  id SERIAL PRIMARY KEY,
  phone1 VARCHAR(50),
  email VARCHAR(255),
  linkedin TEXT,
  twitter TEXT,
  instagram TEXT,
  facebook TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  tags TEXT[],
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  date VARCHAR(50),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(50) DEFAULT 'unread',
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: NestStack26)
-- This is a placeholder - you should change this in production
INSERT INTO users (username, password_hash)
VALUES ('Kekeli@26', '$2b$10$placeholder_hash_replace_with_bcrypt')
ON CONFLICT (username) DO NOTHING;
