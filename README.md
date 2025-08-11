# Learning Management System (LMS) Backend API

A comprehensive Learning Management System backend built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Features

- 🔐 **JWT Authentication & Role-based Authorization** (Admin, Teacher, Student)
- 👥 **User Management** with secure password hashing
- 📚 **Classes & Courses Management** with relationships
- 💬 **Threaded Discussion Rooms** for each course
- 📊 **Progress Reports & Analytics**
- ✅ **Input Validation** with Zod schemas
- 📄 **Pagination** for all list endpoints
- 🌐 **CORS-enabled** for frontend integration
- 🗃️ **PostgreSQL Database** with Prisma ORM

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy and edit the .env file
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
JWT_SECRET="your-super-secure-jwt-secret-key-here"
PORT=3000
```

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Users
- `GET /users` - List all users (Admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Classes
- `POST /classes` - Create class (Teacher/Admin)
- `GET /classes` - List classes
- `GET /classes/:id` - Get class by ID
- `PUT /classes/:id` - Update class (Teacher/Admin)
- `DELETE /classes/:id` - Delete class (Admin only)

### Courses
- `POST /courses` - Create course (Teacher/Admin)
- `GET /courses` - List courses
- `GET /courses/:id` - Get course by ID
- `PUT /courses/:id` - Update course (Teacher/Admin)
- `DELETE /courses/:id` - Delete course (Teacher/Admin)

### Discussions
- `POST /courses/:id/discussions` - Create discussion post
- `GET /courses/:id/discussions` - Get course discussions

### Reports
- `GET /reports` - Get progress reports (with filters)
- `GET /reports/:id` - Get specific report
- `POST /reports` - Create/update progress report

## Sample Login Credentials

After running the seed script, you can use these credentials:

- **Admin**: `admin@lms.com` / `admin123`
- **Teacher**: `teacher1@lms.com` / `teacher123`
- **Student**: `student1@lms.com` / `student123`

## Role Permissions

### Admin
- Full access to all endpoints
- Can manage users, classes, courses, and view all reports

### Teacher
- Can manage their own classes and courses
- Can view reports for their courses
- Can participate in discussions

### Student
- Can view assigned courses
- Can participate in discussions
- Can view their own progress reports

## Database Schema

The system includes the following main entities:
- **Users** (Admin, Teacher, Student roles)
- **Classes** (managed by teachers)
- **Courses** (belong to classes)
- **Discussions** (threaded conversations per course)
- **Reports** (student progress tracking)

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation with Zod
- CORS protection
- SQL injection prevention via Prisma ORM

## Development

```bash
# Start development server with auto-reload
npm run dev

# Generate Prisma client after schema changes
npm run db:generate

# Create and apply new migration
npm run db:migrate

# Re-seed the database
npm run db:seed
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **CORS**: cors middleware

This LMS backend provides a solid foundation for building educational platforms with proper authentication, authorization, and data management capabilities.