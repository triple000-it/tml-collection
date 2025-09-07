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

async function updateDjCategories() {
  try {
    console.log('🔄 Starting DJ category update...');
    
    // First, get all DJs
    const { data: djs, error: fetchError } = await supabaseAdmin
      .from('djs')
      .select('id, stage_name, category')
      .eq('is_active', true);
    
    if (fetchError) {
      console.error('❌ Error fetching DJs:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${djs.length} active DJs`);
    
    // Update all DJs to have category 'mainstage'
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('djs')
      .update({ 
        category: 'mainstage',
        updated_at: new Date().toISOString()
      })
      .eq('is_active', true)
      .select('id, stage_name, category');
    
    if (updateError) {
      console.error('❌ Error updating DJs:', updateError);
      return;
    }
    
    console.log(`✅ Successfully updated ${updateData.length} DJs to category 'mainstage'`);
    
    // Display updated DJs
    console.log('\n📋 Updated DJs:');
    updateData.forEach((dj, index) => {
      console.log(`${index + 1}. ${dj.stage_name} - ${dj.category}`);
    });
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
updateDjCategories();
