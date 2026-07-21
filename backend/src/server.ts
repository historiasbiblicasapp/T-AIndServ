import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`[SERVER] Rodando na porta ${env.port}`);
  console.log(`[SERVER] Ambiente: ${env.nodeEnv}`);
  console.log(`[SERVER] API: http://localhost:${env.port}/api`);
});
