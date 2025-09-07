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

// Remaining DJs from the original list that need to be added
const remainingDjs = [
  // D-Tier & E-Tier: COMMON (The Specialists & New Guard)
  {
    stage_name: 'Acraze',
    real_name: 'Acraze',
    nationality: 'American',
    genres: ['Bass House', 'Future Bass', 'Trap', 'Electronic'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 3,
    years_active: 4,
    debut_year: 2020,
    record_label: 'Spinnin\' Records',
    biography: 'American DJ and producer known for his bass house sound and viral hits.'
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
    stage_name: 'Danny Avila',
    real_name: 'Danny Avila',
    nationality: 'Spanish',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Bass'],
    categories: ['mainstage'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Universal Music',
    biography: 'Spanish DJ and producer known for his big room sound and energetic performances.'
  },
  {
    stage_name: 'Goodboys',
    real_name: 'Goodboys',
    nationality: 'British',
    genres: ['Deep House', 'Tech House', 'Progressive House', 'Future Bass'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Spinnin\' Records',
    biography: 'British deep house duo known for their melodic sound and commercial success.'
  },
  {
    stage_name: 'Kayzo',
    real_name: 'Hayden Capuozzo',
    nationality: 'American',
    genres: ['Dubstep', 'Hardstyle', 'Trap', 'Bass Music'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Monstercat',
    biography: 'American DJ and producer known for his heavy dubstep and hardstyle fusion.'
  },
  {
    stage_name: 'Malaa',
    real_name: 'Malaa',
    nationality: 'French',
    genres: ['Deep House', 'Tech House', 'Bass House', 'Future House'],
    categories: ['elixir'],
    rarity: 'COMMON',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Confession',
    biography: 'French DJ and producer known for his deep house sound and mysterious persona.'
  },
  {
    stage_name: 'Miss Monique',
    real_name: 'Miss Monique',
    nationality: 'Ukrainian',
    genres: ['Progressive House', 'Melodic Techno', 'Deep House', 'Ambient'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Siona Records',
    biography: 'Ukrainian DJ and producer known for her melodic progressive house sound.'
  },
  {
    stage_name: 'Nervo',
    real_name: 'Miriam Nervo, Olivia Nervo',
    nationality: 'Australian',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Bass'],
    categories: ['mainstage'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Spinnin\' Records',
    biography: 'Australian DJ duo known for their big room sound and commercial success.'
  },
  {
    stage_name: 'Showtek',
    real_name: 'Wouter Janssen, Sjoerd Janssen',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Big Room', 'Progressive House', 'Electro House'],
    categories: ['qdance'],
    rarity: 'COMMON',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Skink Records',
    biography: 'Dutch duo known for their hardstyle roots and big room evolution.'
  },
  {
    stage_name: 'Sara Landry',
    real_name: 'Sara Landry',
    nationality: 'American',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'COMMON',
    total_appearances: 3,
    years_active: 4,
    debut_year: 2020,
    record_label: 'KNTXT',
    biography: 'Rising techno star known for her dark, industrial sound and energetic performances.'
  },
  {
    stage_name: 'Andrew Rayel',
    real_name: 'Andrew Rayel',
    nationality: 'Moldovan',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Armada Music',
    biography: 'Moldovan trance producer known for his uplifting sound and Armada Music releases.'
  },
  {
    stage_name: 'Apashe',
    real_name: 'Apashe',
    nationality: 'Canadian',
    genres: ['Bass Music', 'Trap', 'Electronic', 'Orchestral'],
    categories: ['liveact'],
    rarity: 'COMMON',
    total_appearances: 3,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Kannibalen Records',
    biography: 'Canadian producer known for his live brass orchestra bass music and cinematic sound.'
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
    stage_name: 'Sebastian Ingrosso',
    real_name: 'Sebastian Ingrosso',
    nationality: 'Swedish',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Refune Music',
    biography: 'Swedish DJ and producer known for his big room sound and Refune Music label.'
  },
  {
    stage_name: 'Steve Angello',
    real_name: 'Steve Angello',
    nationality: 'Swedish',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'COMMON',
    total_appearances: 6,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Refune Music',
    biography: 'Swedish DJ and producer known for his big room sound and Refune Music label.'
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

async function addFinalDjs() {
  try {
    console.log('🔄 Adding final DJs to complete the collection...');
    
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
addFinalDjs();
