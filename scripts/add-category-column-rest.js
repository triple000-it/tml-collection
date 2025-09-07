const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

async function addCategoryColumn() {
  try {
    console.log('🔄 Adding category column to djs table via REST API...');
    
    const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
    const data = JSON.stringify({
      sql: "ALTER TABLE djs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'mainstage';"
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: options.headers,
      body: data
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error adding category column:', errorText);
      
      // If exec_sql doesn't exist, provide manual instructions
      if (errorText.includes('exec_sql')) {
        console.log('\n📋 Manual instructions to add the category column:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to Table Editor > djs table');
        console.log('3. Click "Add Column"');
        console.log('4. Set column name: category');
        console.log('5. Set column type: text');
        console.log('6. Set default value: mainstage');
        console.log('7. Click "Save"');
        console.log('\nAfter adding the column, run the update script again.');
      }
      return;
    }
    
    const result = await response.json();
    console.log('✅ Successfully added category column to djs table');
    console.log('📊 All existing DJs now have category: mainstage');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
addCategoryColumn();
