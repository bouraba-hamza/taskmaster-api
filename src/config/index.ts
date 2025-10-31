import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/taskmaster',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default config;