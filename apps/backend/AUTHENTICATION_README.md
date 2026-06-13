# Authentication System with Passport.js

This backend implements a complete authentication system using Passport.js with NestJS. The system includes:

## Features

1. **User Registration** - Create new user accounts with email, password, and profile information
2. **User Login** - Authenticate users with email and password
3. **JWT Authentication** - Secure API endpoints with JSON Web Tokens
4. **Session Management** - Express session support for traditional web applications
5. **Password Reset** - Forgot password flow with verification codes
6. **Email Verification** - Verify user email addresses
7. **Profile Management** - Get and update user profile information

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **Passport.js** - Authentication middleware for Node.js
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Prisma ORM** - Database access and management
- **Bcrypt** - Password hashing
- **Express Session** - Session management

## Authentication Strategies

### 1. Local Strategy
- Username/email and password authentication
- Uses `passport-local` package
- Validates user credentials against database
- Located in `src/auth/strategies/local.strategy.ts`

### 2. JWT Strategy
- Token-based authentication
- Uses `passport-jwt` package
- Validates JWT tokens from Authorization header
- Located in `src/auth/strategies/jwt.strategy.ts`

### 3. Session Serialization
- Manages user sessions
- Serializes/deserializes user data for sessions
- Located in `src/auth/session.serializer.ts`

## API Endpoints

### Authentication Routes
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `GET /auth/profile` - Get user profile (JWT protected)
- `POST /auth/logout` - Logout (JWT protected)

### Password Reset Routes
- `POST /auth/forgot-password` - Request password reset code
- `POST /auth/verify-code` - Verify password reset code
- `POST /auth/reset-password` - Reset password with verification code

### Email Verification Routes
- `POST /auth/verify-email` - Request email verification

## Setup Instructions

1. **Install dependencies**:
   ```bash
   cd apps/backend
   pnpm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure your database and secret keys.

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server**:
   ```bash
   pnpm start:dev
   ```

## Configuration

### Environment Variables
Create a `.env` file in the `apps/backend` directory with the following variables:

```env
# Database configuration
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# JWT configuration
JWT_SECRET="your-very-secure-jwt-secret-key"
JWT_EXPIRES_IN="60m"

# Session configuration
SESSION_SECRET="your-very-secure-session-secret-key"

# Server configuration
PORT=5000
NODE_ENV=development
```

### Database Schema
The Prisma schema defines the User model with the following fields:
- `id` - Auto-incremented primary key
- `email` - Unique user email
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `phone` - User's phone number
- `verificationCode` - Password reset verification code
- `verificationCodeExp` - Verification code expiration
- `emailVerified` - Email verification status
- `createdAt` - User creation timestamp

## Usage Examples

### User Registration
```bash
curl -X POST http://localhost:5000/auth/register \
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
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Verify Reset Code
```bash
curl -X POST http://localhost:5000/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "code": "123456",
    "newPassword": "newsecurepassword123"
  }'
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt with a salt factor of 10
2. **JWT Security**: Tokens expire after 60 minutes by default
3. **Session Security**: Sessions are HTTP-only and secure in production
4. **Verification Codes**: Password reset codes expire after 15 minutes
5. **Input Validation**: All DTOs use class-validator for input validation

## Error Handling

The system provides appropriate error responses for:
- Invalid credentials
- Duplicate email registration
- Expired or invalid verification codes
- Missing or invalid JWT tokens
- Unauthorized access attempts

## Extending the System

To add additional authentication methods:

1. **Create a new strategy**: Implement a new Passport.js strategy
2. **Add to AuthModule**: Register the strategy in the providers array
3. **Create guards**: Implement appropriate authentication guards
4. **Add routes**: Extend the AuthController with new endpoints
5. **Update services**: Add any necessary methods to AuthService