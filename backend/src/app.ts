import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env.js';
import { routes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const isVercel = process.env.VERCEL === '1';

// Segurança
app.use(helmet());

// CORS
const corsOrigin = isVercel
  ? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : env.corsOrigin
  : env.nodeEnv === 'production'
    ? '*'
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

// Frontend estático (produção)
if (env.nodeEnv === 'production') {
  const frontendDist = path.join(process.cwd(), '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handler
app.use(errorHandler);

export { app };
