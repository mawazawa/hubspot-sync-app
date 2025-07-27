/*
██╗  ██╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ████████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗
██║  ██║██║   ██║██╔══██╗██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝    ██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
███████║██║   ██║██████╔╝███████╗██████╔╝██║   ██║   ██║       ███████╗ ╚████╔╝ ██╔██╗ ██║██║     
██╔══██║██║   ██║██╔══██╗╚════██║██╔═══╝ ██║   ██║   ██║       ╚════██║  ╚██╔╝  ██║╚██╗██║██║     
██║  ██║╚██████╔╝██████╔╝███████║██║     ╚██████╔╝   ██║       ███████║   ██║   ██║ ╚████║╚██████╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝
*/

import dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';

// Load environment variables
dotenv.config();

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'hubspot-sync' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: process.env.LOG_FILE_PATH || './logs/app.log' 
    })
  ]
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  });
});

// Start server
app.listen(Number(PORT), HOST, () => {
  logger.info(`🚀 HubSpot Sync App running at http://${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

export default app;