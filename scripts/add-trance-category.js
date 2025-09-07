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

// List of DJs that should have the "trance" category added
const tranceDjs = [
  'Armin van Buuren',
  'Tiësto',
  'Above & Beyond',
  'Paul van Dyk',
  'Ferry Corsten',
  'Gareth Emery',
  'Aly & Fila',
  'John O\'Callaghan',
  'Markus Schulz',
  'Cosmic Gate',
  'ATB',
  'Rank 1',
  'Dash Berlin',
  'W&W',
  'Andrew Rayel',
  'Aly & Fila',
  'Giuseppe Ottaviani',
  'Solarstone',
  'Roger Shah',
  'Jorn van Deynhoven'
];

async function addTranceCategory() {
  try {
    console.log('🔄 Adding trance category to existing DJs...');
    
    // First, get all DJs with their current categories
    const { data: djs, error: fetchError } = await supabaseAdmin
      .from('djs')
      .select('id, stage_name, categories')
      .eq('is_active', true);
    
    if (fetchError) {
      console.error('❌ Error fetching DJs:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${djs.length} active DJs`);
    
    let updatedCount = 0;
    
    // Update DJs that should have trance category
    for (const dj of djs) {
      const shouldHaveTrance = tranceDjs.some(tranceDj => 
        dj.stage_name.toLowerCase().includes(tranceDj.toLowerCase()) ||
        tranceDj.toLowerCase().includes(dj.stage_name.toLowerCase())
      );
      
      if (shouldHaveTrance) {
        const currentCategories = dj.categories || ['mainstage'];
        
        // Add trance category if not already present
        if (!currentCategories.includes('trance')) {
          const newCategories = [...currentCategories, 'trance'];
          
          const { error: updateError } = await supabaseAdmin
            .from('djs')
            .update({ 
              categories: newCategories,
              updated_at: new Date().toISOString()
            })
            .eq('id', dj.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${dj.stage_name}:`, updateError);
          } else {
            console.log(`✅ Added trance to ${dj.stage_name}: [${newCategories.join(', ')}]`);
            updatedCount++;
          }
        } else {
          console.log(`ℹ️  ${dj.stage_name} already has trance category: [${currentCategories.join(', ')}]`);
        }
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} DJs with trance category!`);
    console.log('📋 DJs now have multiple categories support');
    
    // Show summary of all DJs with their categories
    console.log('\n📊 Summary of DJ categories:');
    const { data: updatedDjs } = await supabaseAdmin
      .from('djs')
      .select('stage_name, categories')
      .eq('is_active', true)
      .order('stage_name');
    
    if (updatedDjs) {
      updatedDjs.forEach(dj => {
        console.log(`• ${dj.stage_name}: [${dj.categories.join(', ')}]`);
      });
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
addTranceCategory();
