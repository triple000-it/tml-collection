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

// Missing DJs from the verification
const missingDjs = [
  {
    stage_name: 'John O\'Callaghan',
    real_name: 'John O\'Callaghan',
    nationality: 'Irish',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Armada Music',
    biography: 'Irish trance producer known for his uplifting sound and Armada Music releases.'
  },
  {
    stage_name: 'Deborah de Luca',
    real_name: 'Deborah de Luca',
    nationality: 'Italian',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Sola Records',
    biography: 'Italian techno producer known for her dark, industrial sound and Sola Records releases.'
  },
  {
    stage_name: 'Angerfist',
    real_name: 'Danny Masseling',
    nationality: 'Dutch',
    genres: ['Hardcore', 'Hardstyle', 'Rawstyle', 'Hard Dance'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Master of Hardcore',
    biography: 'Dutch hardcore king known for his aggressive sound and Master of Hardcore releases.'
  },
  {
    stage_name: 'DJ Snake',
    real_name: 'William Sami Étienne Grigahcine',
    nationality: 'French',
    genres: ['Trap', 'Future Bass', 'Electronic', 'Hip Hop'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Interscope Records',
    biography: 'French DJ and producer known for his trap sound and commercial success.'
  },
  {
    stage_name: 'deadmau5',
    real_name: 'Joel Zimmerman',
    nationality: 'Canadian',
    genres: ['Progressive House', 'Techno', 'Electro House', 'Experimental'],
    categories: ['liveact'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Mau5trap',
    biography: 'Canadian DJ and producer known for his progressive house sound and Mau5trap label.'
  },
  {
    stage_name: 'Ofenbach',
    real_name: 'César de Rummel, Dorian Lo',
    nationality: 'French',
    genres: ['Deep House', 'Progressive House', 'Future Bass', 'Electronic'],
    categories: ['liveact'],
    rarity: 'COMMON',
    total_appearances: 3,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Ofenbach Music',
    biography: 'French deep house duo known for their melodic sound and live performances.'
  }
];

async function addMissingDjs() {
  try {
    console.log('🔄 Adding final missing DJs...\n');
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const djData of missingDjs) {
      try {
        // Check if DJ already exists
        const { data: existingDj } = await supabaseAdmin
          .from('djs')
          .select('id, stage_name')
          .eq('stage_name', djData.stage_name)
          .single();
        
        if (existingDj) {
          console.log(`ℹ️  Skipped ${djData.stage_name} (already exists)`);
          skippedCount++;
          continue;
        }
        
        // Create new DJ
        const { error: createError } = await supabaseAdmin
          .from('djs')
          .insert({
            ...djData,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (createError) {
          console.error(`❌ Error creating ${djData.stage_name}:`, createError);
        } else {
          console.log(`✅ Created ${djData.stage_name} (${djData.rarity}) - [${djData.categories.join(', ')}]`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${djData.stage_name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully processed ${createdCount + skippedCount} DJs!`);
    console.log(`📊 Created: ${createdCount} new DJs`);
    console.log(`📊 Skipped: ${skippedCount} existing DJs`);
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the creation
addMissingDjs();
