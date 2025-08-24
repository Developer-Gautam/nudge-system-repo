# Nudge System Backend

A modular Node.js/Express backend for the nudge system application.

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection configuration
│   └── constants.js     # Application constants and configuration
├── controllers/
│   ├── authController.js    # Authentication logic (register, login)
│   └── questionController.js # Question handling logic
├── middleware/
│   └── auth.js         # JWT authentication middleware
├── models/
│   └── User.js         # User mongoose model
├── routes/
│   ├── auth.js         # Authentication routes
│   └── questions.js    # Question-related routes
├── utils/
│   └── questionsData.js # Questions data
├── server.js           # Main modular server
└── package.json
```

## Features

- **Modular Architecture**: Clean separation of concerns
- **Authentication**: JWT-based user authentication
- **Questionnaire System**: Multi-step questionnaire with progress tracking
- **MongoDB Integration**: User data persistence
- **Error Handling**: Centralized error handling
- **CORS Support**: Cross-origin resource sharing

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Questions (Protected Routes)
- `GET /api/questions` - Get all questions
- `POST /api/answer` - Submit answer
- `GET /api/progress` - Get user progress
- `POST /api/activity` - Update user activity

### Health Check
- `GET /health` - Server health check

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (create `.env` file):
   ```
   MONGODB_URI=mongodb://localhost:27017/nudge-system
   JWT_SECRET=your-secret-key
   PORT=5001
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Modular Architecture

The `server.js` file uses a clean modular structure:

- **Configuration**: Database and constants moved to `config/`
- **Models**: User schema moved to `models/User.js`
- **Controllers**: Business logic separated into `controllers/`
- **Routes**: API endpoints organized in `routes/`
- **Middleware**: Authentication logic in `middleware/`
- **Utils**: Questions data moved to `utils/`

## Benefits of the New Structure

1. **Maintainability**: Easier to find and modify specific functionality
2. **Scalability**: Easy to add new features and routes
3. **Testing**: Individual modules can be tested in isolation
4. **Code Reusability**: Shared utilities and middleware
5. **Team Collaboration**: Multiple developers can work on different modules
6. **Debugging**: Easier to identify and fix issues

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5001)
