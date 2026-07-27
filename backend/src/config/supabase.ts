import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const supabaseUrl = env.supabaseUrl || 'http://localhost';
const supabaseAnonKey = env.supabaseAnonKey || 'anon-key-placeholder';
const supabaseServiceKey = env.supabaseServiceKey || 'service-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
