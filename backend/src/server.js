import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before any other imports
// Path is relative to src folder, so go up one level to find .env in backend root
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import chapterRoutes from './routes/chapters.js';
import userRoutes from './routes/users.js';
import aiRoutes from './routes/ai.js';

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
});

await fastify.register(websocket);

// JWT verification decorator
fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// MongoDB Connection
try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptink');
  fastify.log.info('✅ MongoDB connected successfully');
} catch (error) {
  fastify.log.error('❌ MongoDB connection error:', error);
  process.exit(1);
}

// Health check
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(projectRoutes, { prefix: '/api/projects' });
fastify.register(chapterRoutes, { prefix: '/api/chapters' });
fastify.register(userRoutes, { prefix: '/api/users' });
fastify.register(aiRoutes, { prefix: '/api/ai' });

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
