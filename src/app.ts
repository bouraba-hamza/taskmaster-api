import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { setRoutes } from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './utils/logger';

const app = express();

// Security middleware - Enhanced configuration
app.use(helmet({
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  
  // HTTP Strict Transport Security - Force HTTPS (6 months)
  hsts: {
    maxAge: 15552000,
    includeSubDomains: true,
    preload: true
  },
  
  // Prevent clickjacking attacks
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  hidePoweredBy: true // Removes "X-Powered-By: Express"
}));

// Middleware
app.use(cors()); // Simplified CORS for development
app.use(json());
app.use(loggerMiddleware);

// Set up routes
setRoutes(app);

// Error handling middleware
app.use(errorHandler);

export default app;