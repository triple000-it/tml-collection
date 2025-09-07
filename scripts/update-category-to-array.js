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

async function updateCategoryToArray() {
  try {
    console.log('🔄 Updating category field to support multiple categories...');
    
    // First, get all DJs with their current category
    const { data: djs, error: fetchError } = await supabaseAdmin
      .from('djs')
      .select('id, stage_name, category')
      .eq('is_active', true);
    
    if (fetchError) {
      console.error('❌ Error fetching DJs:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${djs.length} active DJs`);
    
    // Update each DJ to have categories as an array
    for (const dj of djs) {
      const currentCategory = dj.category || 'mainstage';
      const categoriesArray = Array.isArray(currentCategory) ? currentCategory : [currentCategory];
      
      const { error: updateError } = await supabaseAdmin
        .from('djs')
        .update({ 
          categories: categoriesArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', dj.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${dj.stage_name}:`, updateError);
      } else {
        console.log(`✅ Updated ${dj.stage_name}: [${categoriesArray.join(', ')}]`);
      }
    }
    
    console.log('\n🎉 Successfully updated all DJs to use categories array!');
    console.log('📋 Next step: Add the "trance" category to existing DJs');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
updateCategoryToArray();
