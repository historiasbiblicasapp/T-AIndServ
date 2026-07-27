import 'dotenv/config';

const isVercel = process.env.VERCEL === '1';

export const env = {
  supabaseUrl: isVercel
    ? process.env.SUPABASE_URL || ''
    : (process.env.SUPABASE_URL || ''),
  supabaseAnonKey: isVercel
    ? process.env.SUPABASE_ANON_KEY || ''
    : (process.env.SUPABASE_ANON_KEY || ''),
  supabaseServiceKey: isVercel
    ? process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    : (process.env.SUPABASE_SERVICE_ROLE_KEY || ''),
  port: parseInt(process.env.PORT || '3333', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
