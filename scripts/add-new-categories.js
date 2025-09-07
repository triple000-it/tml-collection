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

// Category mappings based on DJ names and genres
const categoryMappings = {
  // ASOT (Trance) DJs
  asot: [
    'Armin van Buuren', 'Above & Beyond', 'Paul van Dyk', 'Ferry Corsten',
    'Gareth Emery', 'Aly & Fila', 'John O\'Callaghan', 'Markus Schulz',
    'Cosmic Gate', 'ATB', 'Rank 1', 'Dash Berlin', 'Andrew Rayel',
    'Giuseppe Ottaviani', 'Solarstone', 'Roger Shah', 'Jorn van Deynhoven'
  ],
  
  // Core (Techno) DJs
  core: [
    'Charlotte de Witte', 'Amelie Lens', 'Nina Kraviz', 'Adam Beyer',
    'Carl Cox', 'Richie Hawtin', 'Maceo Plex', 'Pan-Pot'
  ],
  
  // Q-Dance (Hardstyle) DJs
  qdance: [
    'Headhunterz', 'Wildstylez', 'Brennan Heart', 'Coone', 'Da Tweekaz',
    'Sub Zero Project', 'D-Block & S-te-Fan', 'Noisecontrollers', 'Frontliner'
  ],
  
  // Elixir (House) DJs
  elixir: [
    'Don Diablo', 'Oliver Heldens', 'Tchami', 'Malaa', 'Fisher', 'Chris Lake',
    'Claude VonStroke', 'Green Velvet', 'Hot Since 82', 'Pete Tong',
    'Eats Everything', 'Honey Dijon', 'The Martinez Brothers', 'Solomun', 'Dixon', 'Ame'
  ],
  
  // Live Act DJs
  liveact: [
    'Pendulum', 'Netsky', 'Rudimental', 'Chase & Status', 'Sub Focus',
    'Dimension', 'Culture Shock', 'Metrik', 'Wilkinson', 'High Contrast', 'London Elektricity'
  ]
};

// Genre-based category mappings
const genreMappings = {
  asot: ['Trance', 'Uplifting Trance', 'Psytrance', 'Progressive Trance', 'Vocal Trance'],
  core: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno', 'Minimal Techno', 'Deep Techno'],
  qdance: ['Hardstyle', 'Hardcore', 'Rawstyle', 'Euphoric Hardstyle', 'Frenchcore', 'Jumpstyle'],
  elixir: ['House', 'Deep House', 'Tech House', 'Future House', 'Progressive House', 'Minimal House', 'Disco House']
};

async function addNewCategories() {
  try {
    console.log('🔄 Adding new Tomorrowland stage categories to DJs...');
    
    // First, get all DJs with their current categories
    const { data: djs, error: fetchError } = await supabaseAdmin
      .from('djs')
      .select('id, stage_name, categories, genres')
      .eq('is_active', true);
    
    if (fetchError) {
      console.error('❌ Error fetching DJs:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${djs.length} active DJs`);
    
    let updatedCount = 0;
    
    // Process each DJ
    for (const dj of djs) {
      const currentCategories = dj.categories || ['mainstage'];
      let newCategories = [...currentCategories];
      let hasChanges = false;
      
      // Check name-based mappings
      for (const [category, djNames] of Object.entries(categoryMappings)) {
        const shouldHaveCategory = djNames.some(djName => 
          dj.stage_name.toLowerCase().includes(djName.toLowerCase()) ||
          djName.toLowerCase().includes(dj.stage_name.toLowerCase())
        );
        
        if (shouldHaveCategory && !newCategories.includes(category)) {
          newCategories.push(category);
          hasChanges = true;
        }
      }
      
      // Check genre-based mappings
      for (const [category, genreList] of Object.entries(genreMappings)) {
        const hasMatchingGenre = dj.genres && dj.genres.some(genre => 
          genreList.some(mappingGenre => 
            genre.toLowerCase().includes(mappingGenre.toLowerCase()) ||
            mappingGenre.toLowerCase().includes(genre.toLowerCase())
          )
        );
        
        if (hasMatchingGenre && !newCategories.includes(category)) {
          newCategories.push(category);
          hasChanges = true;
        }
      }
      
      // Update if there are changes
      if (hasChanges) {
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
          console.log(`✅ Updated ${dj.stage_name}: [${newCategories.join(', ')}]`);
          updatedCount++;
        }
      } else {
        console.log(`ℹ️  ${dj.stage_name}: [${currentCategories.join(', ')}] (no changes needed)`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} DJs with new categories!`);
    
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
addNewCategories();
