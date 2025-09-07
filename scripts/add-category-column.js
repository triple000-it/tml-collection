const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addCategoryColumn() {
  try {
    console.log('🔄 Adding category column to djs table...');
    
    // Add the category column to the djs table
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE djs 
        ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'mainstage';
      `
    });
    
    if (error) {
      console.error('❌ Error adding category column:', error);
      return;
    }
    
    console.log('✅ Successfully added category column to djs table');
    console.log('📊 All existing DJs now have category: mainstage');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
addCategoryColumn();
