# Task Manager Pro - Deployment Guide

## 🚀 Production Deployment Checklist

### Backend Security ✅
- [x] Rate limiting implemented
- [x] Security headers (Helmet)
- [x] Input validation & sanitization
- [x] Environment variables validation
- [x] Error handling
- [x] CORS configuration

### Frontend Security ✅
- [x] Input sanitization
- [x] XSS protection
- [x] API error handling
- [x] Form validation

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long
CLIENT_URL=http://localhost:5173
PORT=8000
NODE_ENV=production
```

### Frontend
Update `API_BASE_URL` in `client/src/services/taskService.js` for production.

## Deployment Steps

### 1. Backend Deployment
```bash
cd backend
npm install
npm start
```

### 2. Frontend Deployment
```bash
cd client
npm install
npm run build
npm run preview
```

### 3. Database Setup
- Ensure MongoDB is running
- Database will be created automatically on first connection

## Security Notes
- JWT secret is 128 characters (secure)
- Rate limiting: 100 requests/15min, 5 auth requests/15min
- Input validation on all endpoints
- CORS restricted to CLIENT_URL only
- All user inputs are sanitized

## Performance Optimizations
- Gzip compression enabled
- Security headers set
- Request size limits enforced
- Database indexes recommended for production

## Monitoring
- Console logging for errors
- Environment validation on startup
- Graceful error handling throughout application