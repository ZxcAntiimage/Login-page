# Fullstack Authentication System

A comprehensive authentication solution built with Next.js (frontend) and NestJS (backend) using modern authentication patterns and Feature-Sliced Design (FSD) methodology.

## 🚀 Project Overview

This monorepo contains a complete authentication system with:

- **Frontend**: Next.js 14 with shadcn/ui components
- **Backend**: NestJS with Passport.js authentication
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT-based with session support
- **Architecture**: Feature-Sliced Design (FSD)

## 📁 Project Structure

```
AuthProject/
├── apps/
│   ├── backend/          # NestJS backend with authentication
│   └── web/               # Next.js frontend with auth UI
├── packages/
│   ├── eslint-config/     # Shared ESLint configuration
│   ├── typescript-config/ # Shared TypeScript configuration
│   └── ui/                # Shared UI components (shadcn/ui)
└── README.md              # This file
```

## 🔧 Backend Features

### Authentication System
- **User Registration** with email verification
- **User Login** with JWT token generation
- **Password Reset** with verification codes
- **Session Management** with Express sessions
- **Profile Management** with protected routes

### Technologies
- **NestJS** - Progressive Node.js framework
- **Passport.js** - Authentication middleware
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Prisma ORM** - Database access with MySQL
- **Bcrypt** - Secure password hashing
- **Express Session** - Session management

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | User registration | ❌ |
| `/auth/login` | POST | User login | ❌ |
| `/auth/profile` | GET | Get user profile | ✅ |
| `/auth/logout` | POST | Logout | ✅ |
| `/auth/forgot-password` | POST | Request password reset | ❌ |
| `/auth/verify-code` | POST | Verify reset code | ❌ |
| `/auth/reset-password` | POST | Reset password | ❌ |
| `/auth/verify-email` | POST | Verify email | ❌ |

## 🎨 Frontend Features

### UI Components
- **Login Form** with email/password authentication
- **Registration Form** with profile information
- **Password Reset Flow** (forgot password → verify code → new password)
- **Email Verification** system
- **Protected Routes** with authentication checks

### Architecture
- **Feature-Sliced Design (FSD)** methodology
- **Type-safe API client** with automatic JWT handling
- **Loading state management**
- **Comprehensive error handling**
- **React hooks** for easy API integration

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v20+
- pnpm (recommended)
- MySQL 8.0+
- DBeaver or other MySQL client (optional)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/auth-project.git
   cd auth-project
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (see [.env Configuration](#env-configuration) below)

4. **Run database migrations**:
   ```bash
   cd apps/backend
   npx prisma migrate dev
   ```

5. **Start development servers**:

   **Backend**:
   ```bash
   cd apps/backend
   pnpm start:dev
   ```

   **Frontend**:
   ```bash
   cd apps/web
   pnpm dev
   ```

## 📝 .env Configuration

### Backend Configuration (`apps/backend/.env`)

```env
# Database configuration (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/my_db"

# JWT configuration
JWT_SECRET="your-very-secure-jwt-secret-key"
JWT_EXPIRES_IN="60m"

# Session configuration
SESSION_SECRET="your-very-secure-session-secret-key"

# Server configuration
PORT=5001
NODE_ENV=development
```

### Frontend Configuration (`apps/web/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt factor 10
- **JWT Security**: Tokens expire after 60 minutes by default
- **Session Security**: Sessions are HTTP-only and secure in production
- **Verification Codes**: Password reset codes expire after 15 minutes
- **Input Validation**: All DTOs use class-validator for input validation
- **CORS Protection**: Backend configured to accept only frontend requests

## 📊 Database Schema

The system uses a MySQL database with the following User model:

```prisma
model User {
  id                    Int       @id @default(autoincrement())
  email                 String    @unique
  password              String
  firstName             String?
  lastName              String?
  phone                 String?
  verificationCode      String?
  verificationCodeExp   DateTime?
  emailVerified         Boolean   @default(false)
  createdAt             DateTime  @default(now())
}
```

## 🚀 Usage Examples

### User Registration

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890"
  }'
```

### User Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Get Profile (Protected)

```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Development Workflow

### Adding UI Components

To add shadcn/ui components:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

### Running Tests

**Backend tests**:
```bash
cd apps/backend
pnpm test
```

**Frontend tests**:
```bash
cd apps/web
pnpm test
```

### Building for Production

```bash
# Build backend
cd apps/backend
pnpm build

# Build frontend
cd apps/web
pnpm build
```

## 📚 Documentation

- **Backend Authentication**: See `apps/backend/AUTHENTICATION_README.md`
- **Frontend Integration**: See `apps/web/FRONTEND_BACKEND_INTEGRATION.md`
- **Prisma Schema**: See `apps/backend/prisma/schema.prisma`

## 🎯 Best Practices

1. **Always use the API hooks** instead of direct fetch calls
2. **Handle errors gracefully** and provide user feedback
3. **Use loading states** to improve UX
4. **Secure sensitive data** - never log tokens or passwords
5. **Type all responses** for better developer experience
6. **Follow FSD principles** - keep API logic in features/shared layers
7. **Use shadcn/ui components** for consistent UI

## 🔮 Future Enhancements

- **Swagger/OpenAPI Documentation** - Interactive API documentation with Swagger UI
- **OAuth Integration** (Google, Facebook, GitHub)
- **Two-Factor Authentication** (2FA)
- **Role-Based Access Control** (RBAC)
- **Email Notifications** for password resets
- **Rate Limiting** for API endpoints
- **Audit Logging** for security events

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License.

---

**🎉 The authentication system is now fully configured and ready to use!**

For detailed backend documentation, see `apps/backend/AUTHENTICATION_README.md`
For frontend integration guide, see `apps/web/FRONTEND_BACKEND_INTEGRATION.md`