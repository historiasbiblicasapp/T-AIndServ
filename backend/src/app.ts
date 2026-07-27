import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { routes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Segurança
app.use(helmet());

// CORS
const corsOrigin = env.nodeEnv === 'production'
  ? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : env.corsOrigin
  : env.corsOrigin;

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export { app };
