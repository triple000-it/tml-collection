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
    
    // Try to add the category column using a direct SQL query
    const { data, error } = await supabaseAdmin
      .from('djs')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing djs table:', error);
      return;
    }
    
    // Since we can't directly alter the table structure via the client,
    // we'll need to manually add the column in the Supabase dashboard
    console.log('⚠️  Cannot add column directly via client.');
    console.log('📋 Please add the category column manually in Supabase dashboard:');
    console.log('');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Table Editor > djs table');
    console.log('3. Click "Add Column"');
    console.log('4. Set column name: category');
    console.log('5. Set column type: text');
    console.log('6. Set default value: mainstage');
    console.log('7. Click "Save"');
    console.log('');
    console.log('After adding the column, run the update script again.');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
addCategoryColumn();
