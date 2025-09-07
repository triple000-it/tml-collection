import { createClient } from '@supabase/supabase-js';

// Admin client with service role key (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client if service role key is available
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Check if admin client is available
export const isAdminClientAvailable = () => {
  const hasServiceKey = typeof window !== 'undefined' 
    ? false // Service role key is not available in browser
    : !!supabaseServiceKey;
  
  console.log('Admin client check:', { 
    hasServiceKey, 
    isServer: typeof window === 'undefined',
    serviceKeyExists: !!supabaseServiceKey 
  });
  
  return hasServiceKey;
};
