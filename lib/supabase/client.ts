import { createBrowserClient } from '@supabase/ssr';
import { SupabaseConfig } from './config';
import { Database } from './database.model';

export function createClient() {
  return createBrowserClient<Database>(SupabaseConfig.supabaseUrl, SupabaseConfig.supabaseKey);
}
