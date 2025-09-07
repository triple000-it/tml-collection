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

// Missing DJs from the original list
const missingDjs = [
  {
    stage_name: 'Axwell /\ Ingrosso',
    real_name: 'Axwell, Sebastian Ingrosso',
    nationality: 'Swedish',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Refune Music',
    biography: 'Swedish big room duo known for their energetic sound and Refune Music label.'
  },
  {
    stage_name: 'Bassjackers',
    real_name: 'Ralph van Hilst, Marlon Flohr',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Bass'],
    categories: ['mainstage'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Spinnin\' Records',
    biography: 'Dutch big room duo known for their energetic sound and festival performances.'
  },
  {
    stage_name: 'Bedouin',
    real_name: 'Bedouin',
    nationality: 'American',
    genres: ['Melodic House', 'Melodic Techno', 'Deep House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Crosstown Rebels',
    biography: 'Melodic house and techno nomads known for their emotional, cinematic sound.'
  },
  {
    stage_name: 'Ben Nicky',
    real_name: 'Ben Nicky',
    nationality: 'British',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Hard Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Armada Music',
    biography: 'British trance DJ known for his hyper-energy trance sound and energetic performances.'
  },
  {
    stage_name: 'Cosmic Gate',
    real_name: 'Nic Chagall, Bossi',
    nationality: 'German',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 7,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Wake Your Mind',
    biography: 'German trance duo known for their uplifting sound and Wake Your Mind label.'
  },
  {
    stage_name: 'Dixon',
    real_name: 'Dixon',
    nationality: 'German',
    genres: ['Melodic House', 'Melodic Techno', 'Deep House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Innervisions',
    biography: 'German DJ known for his melodic house and techno sound and Innervisions label.'
  },
  {
    stage_name: 'Enrico Sangiuliano',
    real_name: 'Enrico Sangiuliano',
    nationality: 'Italian',
    genres: ['Techno', 'Minimal Techno', 'Industrial Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Drumcode',
    biography: 'Italian techno producer known for his dark, industrial sound and Drumcode releases.'
  },
  {
    stage_name: 'Ferry Corsten',
    real_name: 'Ferry Corsten',
    nationality: 'Dutch',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 8,
    years_active: 25,
    debut_year: 1999,
    record_label: 'Flashover Recordings',
    biography: 'Dutch trance legend known for his uplifting sound and Flashover Recordings label.'
  },
  {
    stage_name: 'Gareth Emery',
    real_name: 'Gareth Emery',
    nationality: 'British',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Garuda Music',
    biography: 'British trance producer known for his melodic sound and Garuda Music label.'
  },
  {
    stage_name: 'Gesaffelstein',
    real_name: 'Mike Lévy',
    nationality: 'French',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Experimental'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Bromance Records',
    biography: 'French techno producer known for his dark, industrial sound and experimental approach.'
  },
  {
    stage_name: 'Giuseppe Ottaviani',
    real_name: 'Giuseppe Ottaviani',
    nationality: 'Italian',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Black Hole Recordings',
    biography: 'Italian trance producer known for his live trance performances and Black Hole releases.'
  },
  {
    stage_name: 'Gorgon City',
    real_name: 'Kye Gibbon, Matt Robson-Scott',
    nationality: 'British',
    genres: ['Deep House', 'Tech House', 'Progressive House', 'Future Bass'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Black Butter Records',
    biography: 'British deep house duo known for their melodic sound and Black Butter Records label.'
  },
  {
    stage_name: 'Joris Voorn',
    real_name: 'Joris Voorn',
    nationality: 'Dutch',
    genres: ['Techno', 'Deep House', 'Progressive House', 'Minimal House'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Rejected',
    biography: 'Dutch techno and house aesthete known for his melodic sound and Rejected label.'
  },
  {
    stage_name: 'Justice',
    real_name: 'Gaspard Augé, Xavier de Rosnay',
    nationality: 'French',
    genres: ['Electronic', 'French House', 'Electro', 'Experimental'],
    categories: ['liveact'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Ed Banger Records',
    biography: 'French electronic duo known for their innovative sound and Ed Banger Records releases.'
  },
  {
    stage_name: 'Loco Dice',
    real_name: 'Loco Dice',
    nationality: 'German',
    genres: ['Tech House', 'Deep House', 'Minimal House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Desolat',
    biography: 'German tech house and techno royalty known for his underground sound and Desolat label.'
  },
  {
    stage_name: 'Maceo Plex',
    real_name: 'Maceo Plex',
    nationality: 'Spanish',
    genres: ['Techno', 'Deep House', 'Progressive House', 'Minimal House'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Ellum Audio',
    biography: 'Spanish techno and house producer known for his melodic sound and Ellum Audio label.'
  },
  {
    stage_name: 'Marco Carola',
    real_name: 'Marco Carola',
    nationality: 'Italian',
    genres: ['Techno', 'Minimal Techno', 'Deep Techno', 'Progressive House'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Music On',
    biography: 'Italian techno legend known for his minimal sound and Music On label.'
  },
  {
    stage_name: 'MarLo',
    real_name: 'MarLo',
    nationality: 'Dutch',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Armada Music',
    biography: 'Dutch trance producer known for his uplifting sound and Armada Music releases.'
  },
  {
    stage_name: 'Markus Schulz',
    real_name: 'Markus Schulz',
    nationality: 'German',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 7,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Coldharbour Recordings',
    biography: 'German trance producer known for his uplifting sound and Coldharbour Recordings label.'
  },
  {
    stage_name: 'Mathame',
    real_name: 'Amedeo Giovanelli, Matteo Giovanelli',
    nationality: 'Italian',
    genres: ['Melodic Techno', 'Progressive House', 'Deep House', 'Ambient'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Afterlife',
    biography: 'Italian melodic techno duo known for their emotional sound and Afterlife releases.'
  },
  {
    stage_name: 'Pan-Pot',
    real_name: 'Tassilo Ippenberger, Thomas Benedix',
    nationality: 'German',
    genres: ['Techno', 'Minimal Techno', 'Deep Techno', 'Industrial Techno'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Mobilee Records',
    biography: 'German techno duo known for their minimal sound and Mobilee Records releases.'
  },
  {
    stage_name: 'Paul Oakenfold',
    real_name: 'Paul Oakenfold',
    nationality: 'British',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 25,
    debut_year: 1999,
    record_label: 'Perfecto Records',
    biography: 'British trance legend known for his uplifting sound and Perfecto Records label.'
  },
  {
    stage_name: 'Rank 1',
    real_name: 'Benno de Goeij, Piet Bervoets',
    nationality: 'Dutch',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Armada Music',
    biography: 'Dutch trance duo known for their uplifting sound and Armada Music releases.'
  },
  {
    stage_name: 'Sub Zero Project',
    real_name: 'Sub Zero Project',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Roughstate',
    biography: 'Dutch hardstyle duo known for their innovative sound and Roughstate releases.'
  },
  {
    stage_name: 'The Martinez Brothers',
    real_name: 'Chris Martinez, Steve Martinez',
    nationality: 'American',
    genres: ['Tech House', 'Deep House', 'Minimal House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Cuttin\' Headz',
    biography: 'American house music duo known for their tech house sound and Cuttin\' Headz label.'
  },
  {
    stage_name: 'Underworld',
    real_name: 'Karl Hyde, Rick Smith',
    nationality: 'British',
    genres: ['Electronic', 'Ambient', 'Experimental', 'Techno'],
    categories: ['liveact'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 30,
    debut_year: 1994,
    record_label: 'Underworld Records',
    biography: 'British electronic music pioneers known for their experimental sound and cult status.'
  },
  {
    stage_name: 'Wildstylez',
    real_name: 'Wildstylez',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Scantraxx',
    biography: 'Dutch hardstyle producer known for his euphoric sound and Scantraxx releases.'
  },
  {
    stage_name: 'Zatox',
    real_name: 'Zatox',
    nationality: 'Italian',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Zatox Records',
    biography: 'Italian hardstyle producer known for his energetic sound and Zatox Records label.'
  }
];

async function addMissingDjs() {
  try {
    console.log('🔄 Adding missing DJs to reach 120 total...');
    
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
    
    // Show summary by rarity
    console.log('\n📊 Summary by Rarity:');
    const rarityCounts = missingDjs.reduce((acc, dj) => {
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
addMissingDjs();
