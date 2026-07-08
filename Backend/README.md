# NestStack_Tech Backend API

Backend API for the portfolio website with authentication, portfolio data management, file uploads, and contact form email sending.

## Tech Stack

- **Node.js** with Express
- **PostgreSQL** (Neon)
- **AWS S3** for file storage
- **AWS SES** for email sending
- **JWT** for authentication

## Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (default: us-east-1)
- `S3_BUCKET` - S3 bucket name for file uploads
- `SES_FROM_EMAIL` - Verified email for SES
- `SES_TO_EMAIL` - Your email to receive contact form submissions

### 3. Set Up Neon PostgreSQL

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (PostgreSQL URL)
4. Add it to `.env` as `DATABASE_URL`

### 4. Initialize Database

Run the schema to create tables:

```bash
# Option 1: Use Neon SQL Editor
# Copy the contents of schema.sql and run it in the Neon SQL Editor

# Option 2: Use psql (if you have it installed)
psql $DATABASE_URL < schema.sql
```

### 5. Set Up AWS S3

1. Create an S3 bucket
2. Create an IAM user with programmatic access
3. Grant the user S3 permissions (PutObject, GetObject)
4. Add credentials to `.env`

### 6. Set Up AWS SES

1. Go to AWS SES console
2. Verify your email address in the SES Sandbox (or request production access)
3. Create IAM user with SES permissions
4. Add credentials to `.env`

### 7. Start the Server

```bash
node server.js
```

Or add a start script to `package.json`:

```json
"scripts": {
  "start": "node server.js"
}
```

Then run:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/change-password` - Change password

### Portfolio Data
- `GET /api/portfolio` - Get all portfolio data
- `PUT /api/portfolio/bio` - Update bio
- `PUT /api/portfolio/contact` - Update contact
- `POST /api/portfolio/skills` - Add skill group
- `DELETE /api/portfolio/skills/:id` - Delete skill
- `POST /api/portfolio/projects` - Add project
- `DELETE /api/portfolio/projects/:id` - Delete project
- `POST /api/portfolio/certificates` - Add certificate
- `DELETE /api/portfolio/certificates/:id` - Delete certificate
- `POST /api/portfolio/reset` - Reset all data to defaults

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Add message
- `PATCH /api/messages/:id` - Update message status
- `DELETE /api/messages/:id` - Delete message
- `PATCH /api/messages/read/all` - Mark all as read

### File Upload
- `POST /api/upload` - Upload file to S3 (multipart/form-data with `file` field, optional `folder` body field)

### Contact Form
- `POST /api/contact` - Send contact form email via SES

## Default Credentials

- **Username**: `Kekeli@26`
- **Password**: `NestStack26`

**Important**: Change these in production by updating the password hash in the database using bcrypt.
