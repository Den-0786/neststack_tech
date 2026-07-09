-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio bio table
CREATE TABLE bio (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  about TEXT,
  avatar TEXT,
  cv_url TEXT,
  github_url TEXT,
  roles VARCHAR(MAX),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  items VARCHAR(MAX) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact table
CREATE TABLE contact (
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
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tags VARCHAR(MAX),
  github_url TEXT,
  live_url TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  date VARCHAR(50),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(50) DEFAULT 'unread',
  attachments VARCHAR(MAX),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitors table to track daily unique visitors
CREATE TABLE visitors (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255) NOT NULL,
  visit_date DATE NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(visitor_id, visit_date)
);

-- Social links table for footer social media icons
CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Initial admin user will be created via API endpoint
-- Use POST /api/auth/register to create the first user (if you add registration)
-- Or insert manually with bcrypt hashed password
