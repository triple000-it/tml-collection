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

// Remaining DJs that failed due to UNCOMMON rarity constraint
const remainingDjs = [
  // C-Tier: UNCOMMON (The Power Players & Rapid Risers)
  {
    stage_name: 'Adriatique',
    real_name: 'Adrian Shala, Adrian Schweizer',
    nationality: 'Swiss',
    genres: ['Melodic Techno', 'Deep House', 'Progressive House', 'Minimal House'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Siamese',
    biography: 'Melodic techno stars known for their emotional, cinematic sound and Siamese label.'
  },
  {
    stage_name: 'ANNA',
    real_name: 'Anna Miranda',
    nationality: 'Brazilian',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Drumcode',
    biography: 'Techno powerhouse from Brazil known for her dark, industrial sound and Drumcode releases.'
  },
  {
    stage_name: 'Anyma',
    real_name: 'Matteo Milleri',
    nationality: 'Italian',
    genres: ['Melodic Techno', 'Progressive House', 'Ambient', 'Cinematic'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Afterlife',
    biography: 'The visual and sonic futuristic project. Known for his cinematic, otherworldly performances.'
  },
  {
    stage_name: 'Brennan Heart',
    real_name: 'Fabian Bohn',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'UNCOMMON',
    total_appearances: 7,
    years_active: 15,
    debut_year: 2009,
    record_label: 'We R Music',
    biography: 'Hardstyle heavyweight and We R Music founder. Known for his emotional, melodic hardstyle.'
  },
  {
    stage_name: 'CamelPhat',
    real_name: 'Dave Whelan, Mike Di Scala',
    nationality: 'British',
    genres: ['Melodic House', 'Melodic Techno', 'Deep House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 6,
    years_active: 10,
    debut_year: 2014,
    record_label: 'When Stars Align',
    biography: 'Grammy-nominated melodic house/techno duo known for their emotional, cinematic sound.'
  },
  {
    stage_name: 'Coone',
    real_name: 'Koen Bauweraerts',
    nationality: 'Belgian',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'UNCOMMON',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Dirty Workz',
    biography: 'Hardstyle legend and Dirty Workz founder. Known for his energetic, crowd-pleasing hardstyle.'
  },
  {
    stage_name: 'Da Tweekaz',
    real_name: 'Marcus van der Berg, Sven van der Berg',
    nationality: 'Norwegian',
    genres: ['Happy Hardcore', 'Hardstyle', 'Hardcore', 'Hard Dance'],
    categories: ['qdance'],
    rarity: 'UNCOMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Hard With Style',
    biography: 'Happy hardcore heroes known for their fun, energetic sound and crowd interaction.'
  },
  {
    stage_name: 'D-Block & S-te-Fan',
    real_name: 'Diederik Bakker, Stefan van Leewen',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'UNCOMMON',
    total_appearances: 7,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Scantraxx',
    biography: 'Hardstyle innovators known for their melodic, emotional sound and Scantraxx releases.'
  },
  {
    stage_name: 'Fred again..',
    real_name: 'Frederick John Philip Gibson',
    nationality: 'British',
    genres: ['Future Bass', 'Garage', 'House', 'Experimental'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Atlantic Records',
    biography: 'The genre-blending critical darling known for his innovative sound and viral hits.'
  },
  {
    stage_name: 'James Hype',
    real_name: 'James Hype',
    nationality: 'British',
    genres: ['Tech House', 'Bass House', 'Drill House', 'Future House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Fool Me Once',
    biography: 'The technical drill house king known for his high-energy sets and technical skills.'
  },
  {
    stage_name: 'John Summit',
    real_name: 'John Summit',
    nationality: 'American',
    genres: ['Tech House', 'Deep House', 'Bass House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Off The Grid',
    biography: 'The tech house phenomenon of the 2020s known for his viral hits and energetic performances.'
  },
  {
    stage_name: 'Maddix',
    real_name: 'Maddix',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'UNCOMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Revealed Recordings',
    biography: 'The high-energy mainstage weapon known for his explosive sound and festival performances.'
  },
  {
    stage_name: 'Nina Kraviz',
    real_name: 'Nina Kraviz',
    nationality: 'Russian',
    genres: ['Techno', 'Minimal Techno', 'Deep Techno', 'Experimental'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'трип',
    biography: 'The influential techno artist and label owner known for her unique sound and трип label.'
  },
  {
    stage_name: 'Nora En Pure',
    real_name: 'Daniela Di Lillo',
    nationality: 'Swiss',
    genres: ['Deep House', 'Progressive House', 'Melodic House', 'Tropical House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Enormous Tunes',
    biography: 'The purveyor of deep house known for her melodic, tropical sound and Enormous Tunes releases.'
  },
  {
    stage_name: 'Reinier Zonneveld',
    real_name: 'Reinier Zonneveld',
    nationality: 'Dutch',
    genres: ['Live Techno', 'Industrial Techno', 'Acid Techno', 'Minimal Techno'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 4,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Filth on Acid',
    biography: 'Live techno maestro known for his live performances and Filth on Acid label.'
  },
  {
    stage_name: 'Subtronics',
    real_name: 'Jesse Kardon',
    nationality: 'American',
    genres: ['Riddim', 'Dubstep', 'Bass Music', 'Experimental'],
    categories: ['liveact'],
    rarity: 'UNCOMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Cyclops Recordings',
    biography: 'The leader of the modern riddim movement known for his heavy, experimental sound.'
  },
  {
    stage_name: 'Tchami',
    real_name: 'Martin Bresso',
    nationality: 'French',
    genres: ['Future House', 'Deep House', 'Tech House', 'Bass House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 6,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Confession',
    biography: 'Future house pioneer known for his innovative sound and Confession label.'
  },
  {
    stage_name: 'Vintage Culture',
    real_name: 'Lukas Ruiz',
    nationality: 'Brazilian',
    genres: ['Deep House', 'Progressive House', 'Melodic House', 'Tropical House'],
    categories: ['elixir'],
    rarity: 'UNCOMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Só Track Boa',
    biography: 'Brazilian house music superstar known for his melodic, tropical sound and Só Track Boa label.'
  },
  {
    stage_name: '999999999',
    real_name: '999999999',
    nationality: 'Italian',
    genres: ['Live Acid Techno', 'Industrial Techno', 'Acid Techno', 'Experimental'],
    categories: ['core'],
    rarity: 'UNCOMMON',
    total_appearances: 3,
    years_active: 6,
    debut_year: 2018,
    record_label: '999999999',
    biography: 'Live acid techno destroyers known for their intense, experimental performances.'
  }
];

async function addRemainingDjs() {
  try {
    console.log('🔄 Adding remaining DJs with UNCOMMON rarity...');
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const djData of remainingDjs) {
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
    
    // Show summary by rarity
    console.log('\n📊 Summary by Rarity:');
    const rarityCounts = remainingDjs.reduce((acc, dj) => {
      acc[dj.rarity] = (acc[dj.rarity] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(rarityCounts).forEach(([rarity, count]) => {
      console.log(`• ${rarity}: ${count} DJs`);
    });
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the creation
addRemainingDjs();
