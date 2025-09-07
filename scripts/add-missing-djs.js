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

// Missing DJs to add (excluding the 25 we already have)
const missingDjs = [
  // S-Tier: LEGENDARY
  {
    stage_name: 'Above & Beyond',
    real_name: 'Jono Grant, Tony McGuinness, Paavo Siljamäki',
    nationality: 'British',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance', 'Ambient'],
    categories: ['asot'],
    rarity: 'LEGENDARY',
    total_appearances: 12,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Anjunabeats',
    biography: 'The emotional leaders of modern trance. Known for their deep, melodic sound and the iconic Group Therapy radio show.',
    awards: ['Anjunabeats Founders', 'Group Therapy Creators', 'Emotional Trance Leaders']
  },
  {
    stage_name: 'Carl Cox',
    real_name: 'Carl Cox',
    nationality: 'British',
    genres: ['Techno', 'House', 'Acid House', 'Tech House'],
    categories: ['core'],
    rarity: 'LEGENDARY',
    total_appearances: 18,
    years_active: 35,
    debut_year: 1989,
    record_label: 'Intec Digital',
    biography: 'The techno godfather and global ambassador of electronic music. A true legend with 35+ years of influence.',
    awards: ['Techno Hall of Fame', 'Ibiza Legend', 'Global Techno Ambassador']
  },
  {
    stage_name: 'Eric Prydz',
    real_name: 'Eric Sheridan Prydz',
    nationality: 'Swedish',
    genres: ['Progressive House', 'Techno', 'Ambient', 'Melodic Techno'],
    categories: ['mainstage', 'core'],
    rarity: 'LEGENDARY',
    total_appearances: 12,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Mouseville Records',
    biography: 'The visionary behind Pryda, Cirez D, and his epic HOLO show. A true innovator in progressive electronic music.',
    awards: ['Progressive House Legend', 'HOLO Show Creator', 'Swedish Electronic Pioneer']
  },
  {
    stage_name: 'Paul van Dyk',
    real_name: 'Matthias Paul',
    nationality: 'German',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'LEGENDARY',
    total_appearances: 16,
    years_active: 30,
    debut_year: 1994,
    record_label: 'Vandit Records',
    biography: 'Trance legend and pioneer who helped define the genre. One of the most respected figures in electronic music.',
    awards: ['Trance Hall of Fame', 'German Electronic Music Pioneer', 'Vandit Records Founder']
  },
  {
    stage_name: 'Richie Hawtin',
    real_name: 'Richard Hawtin',
    nationality: 'Canadian',
    genres: ['Minimal Techno', 'Techno', 'Ambient', 'Experimental'],
    categories: ['core'],
    rarity: 'LEGENDARY',
    total_appearances: 14,
    years_active: 30,
    debut_year: 1994,
    record_label: 'Minus',
    biography: 'The minimalist techno innovator and pioneer of minimal electronic music. A true visionary in the underground scene.',
    awards: ['Minimal Techno Pioneer', 'Underground Legend', 'Minus Records Founder']
  },
  {
    stage_name: 'Sven Väth',
    real_name: 'Sven Väth',
    nationality: 'German',
    genres: ['Techno', 'Trance', 'Progressive House', 'Ambient'],
    categories: ['core'],
    rarity: 'LEGENDARY',
    total_appearances: 13,
    years_active: 35,
    debut_year: 1989,
    record_label: 'Cocoon Recordings',
    biography: 'The techno shaman and Cocoon icon. A legendary figure in the German electronic music scene.',
    awards: ['Cocoon Legend', 'German Techno Pioneer', 'Ibiza Icon']
  },
  {
    stage_name: 'The Chemical Brothers',
    real_name: 'Tom Rowlands, Ed Simons',
    nationality: 'British',
    genres: ['Big Beat', 'Electronic', 'Ambient', 'Experimental'],
    categories: ['liveact'],
    rarity: 'LEGENDARY',
    total_appearances: 6,
    years_active: 30,
    debut_year: 1994,
    record_label: 'Virgin Records',
    biography: 'Live electronic music legends who pioneered the big beat genre. A cultural institution in electronic music.',
    awards: ['Big Beat Pioneers', 'Live Electronic Legends', 'Cultural Icons']
  },

  // A-Tier: EPIC
  {
    stage_name: 'Adam Beyer',
    real_name: 'Adam Beyer',
    nationality: 'Swedish',
    genres: ['Techno', 'Minimal Techno', 'Tech House', 'Industrial Techno'],
    categories: ['core'],
    rarity: 'EPIC',
    total_appearances: 10,
    years_active: 25,
    debut_year: 1999,
    record_label: 'Drumcode',
    biography: 'The techno king and Drumcode boss. A leading figure in modern techno and the founder of one of the most influential techno labels.',
    awards: ['Drumcode Founder', 'Techno King', 'Swedish Techno Pioneer']
  },
  {
    stage_name: 'Amelie Lens',
    real_name: 'Amelie Lens',
    nationality: 'Belgian',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'EPIC',
    total_appearances: 8,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Lenske',
    biography: 'A leading force in the new wave of techno. Known for her high-energy sets and dark, industrial sound.',
    awards: ['Techno Rising Star', 'Belgian Techno Queen', 'Lenske Founder']
  },
  {
    stage_name: 'Solomun',
    real_name: 'Mladen Solomun',
    nationality: 'Bosnian-German',
    genres: ['Deep House', 'Melodic Techno', 'Progressive House', 'Minimal House'],
    categories: ['elixir', 'core'],
    rarity: 'EPIC',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Diynamic Music',
    biography: 'The melodic deep house and techno don. Known for his emotional, melodic sound and Diynamic Music label.',
    awards: ['Diynamic Music Founder', 'Melodic House Don', 'Deep House Legend']
  },
  {
    stage_name: 'Tale Of Us',
    real_name: 'Carmine Conte, Matteo Milleri',
    nationality: 'Italian',
    genres: ['Melodic Techno', 'Progressive House', 'Ambient', 'Cinematic'],
    categories: ['core'],
    rarity: 'EPIC',
    total_appearances: 7,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Afterlife',
    biography: 'The architects of the melodic, cinematic Afterlife sound. Known for their emotional, visual performances.',
    awards: ['Afterlife Founders', 'Melodic Techno Architects', 'Cinematic Sound Pioneers']
  },

  // B-Tier: RARE
  {
    stage_name: 'Aly & Fila',
    real_name: 'Aly Amr Fathalah, Fadi Wassef Naguib',
    nationality: 'Egyptian',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['asot'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 20,
    debut_year: 2004,
    record_label: 'FSOE Recordings',
    biography: 'Egyptian trance duo known for their uplifting, emotional sound and Future Sound of Egypt radio show.',
    awards: ['FSOE Founders', 'Uplifting Trance Leaders', 'Egyptian Trance Pioneers']
  },
  {
    stage_name: 'Black Coffee',
    real_name: 'Nkosinathi Innocent Maphumulo',
    nationality: 'South African',
    genres: ['Deep House', 'Afro House', 'Soulful House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 6,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Soulistic Music',
    biography: 'Grammy-winning deep house icon from South Africa. Known for his soulful, African-influenced sound.',
    awards: ['Grammy Winner', 'Soulistic Music Founder', 'African House Pioneer']
  },
  {
    stage_name: 'Claptone',
    real_name: 'Unknown',
    nationality: 'German',
    genres: ['Deep House', 'Tech House', 'Minimal House', 'Disco House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 7,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Clap Music',
    biography: 'The enigmatic house music phenomenon. Known for his mysterious persona and deep, melodic house sound.',
    awards: ['Enigmatic House Phenomenon', 'Clap Music Founder', 'Deep House Mystery']
  },
  {
    stage_name: 'Fisher',
    real_name: 'Paul Nicholas Fisher',
    nationality: 'Australian',
    genres: ['Tech House', 'Deep House', 'Minimal House', 'Bass House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 5,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Catch & Release',
    biography: 'The tech house superstar known for his high-energy sets and viral hits. A rising star in the house music scene.',
    awards: ['Tech House Superstar', 'Viral Hit Maker', 'Australian House Icon']
  },
  {
    stage_name: 'Chris Lake',
    real_name: 'Chris Lake',
    nationality: 'British',
    genres: ['Tech House', 'Deep House', 'Bass House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Black Book Records',
    biography: 'The tech house hitmaker and label boss. Known for his consistent production and Black Book Records label.',
    awards: ['Black Book Records Founder', 'Tech House Hitmaker', 'Consistent Producer']
  },
  {
    stage_name: 'Headhunterz',
    real_name: 'Willem Rebergen',
    nationality: 'Dutch',
    genres: ['Hardstyle', 'Euphoric Hardstyle', 'Rawstyle', 'Hardcore'],
    categories: ['qdance'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Art of Creation',
    biography: 'Hardstyle legend and one of the most influential figures in the genre. Known for his melodic, emotional hardstyle.',
    awards: ['Hardstyle Legend', 'Art of Creation Founder', 'Euphoric Hardstyle Pioneer']
  },
  {
    stage_name: 'Jamie Jones',
    real_name: 'Jamie Jones',
    nationality: 'Welsh',
    genres: ['Tech House', 'Deep House', 'Minimal House', 'Progressive House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 7,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Hot Creations',
    biography: 'The cool king of tech house and Paradise boss. Known for his underground sound and Hot Creations label.',
    awards: ['Hot Creations Founder', 'Paradise Boss', 'Tech House King']
  },
  {
    stage_name: 'Lost Frequencies',
    real_name: 'Felix De Laet',
    nationality: 'Belgian',
    genres: ['Deep House', 'Progressive House', 'Future Bass', 'Tropical House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 5,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Found Frequencies',
    biography: 'Belgian deep house producer known for his melodic, tropical sound and Found Frequencies label.',
    awards: ['Found Frequencies Founder', 'Tropical House Pioneer', 'Melodic Deep House Star']
  },
  {
    stage_name: 'Peggy Gou',
    real_name: 'Peggy Gou',
    nationality: 'South Korean',
    genres: ['Deep House', 'Disco House', 'Tech House', 'Minimal House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 4,
    years_active: 6,
    debut_year: 2018,
    record_label: 'Gudu Records',
    biography: 'A global fashion and music icon. Known for her disco-influenced house sound and Gudu Records label.',
    awards: ['Gudu Records Founder', 'Fashion Music Icon', 'Disco House Revivalist']
  },
  {
    stage_name: 'Robin Schulz',
    real_name: 'Robin Schulz',
    nationality: 'German',
    genres: ['Deep House', 'Tropical House', 'Progressive House', 'Future Bass'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 6,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Warner Music',
    biography: 'German deep house producer known for his tropical, melodic sound and commercial success.',
    awards: ['Tropical House Pioneer', 'Commercial Success', 'German Deep House Star']
  },

  // C-Tier: UNCOMMON
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
    biography: 'Melodic techno stars known for their emotional, cinematic sound and Siamese label.',
    awards: ['Siamese Founders', 'Melodic Techno Stars', 'Cinematic Sound Creators']
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
    biography: 'Techno powerhouse from Brazil known for her dark, industrial sound and Drumcode releases.',
    awards: ['Drumcode Artist', 'Brazilian Techno Powerhouse', 'Industrial Techno Star']
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
    biography: 'The visual and sonic futuristic project. Known for his cinematic, otherworldly performances.',
    awards: ['Afterlife Artist', 'Futuristic Project', 'Cinematic Performer']
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
    biography: 'Hardstyle heavyweight and We R Music founder. Known for his emotional, melodic hardstyle.',
    awards: ['We R Music Founder', 'Hardstyle Heavyweight', 'Euphoric Hardstyle Leader']
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
    biography: 'Grammy-nominated melodic house/techno duo known for their emotional, cinematic sound.',
    awards: ['Grammy Nominated', 'Melodic House Duo', 'Cinematic Sound Creators']
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
    biography: 'Hardstyle legend and Dirty Workz founder. Known for his energetic, crowd-pleasing hardstyle.',
    awards: ['Dirty Workz Founder', 'Hardstyle Legend', 'Energetic Performer']
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
    biography: 'Happy hardcore heroes known for their fun, energetic sound and crowd interaction.',
    awards: ['Happy Hardcore Heroes', 'Fun Energetic Sound', 'Crowd Interaction Masters']
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
    biography: 'Hardstyle innovators known for their melodic, emotional sound and Scantraxx releases.',
    awards: ['Hardstyle Innovators', 'Melodic Hardstyle', 'Scantraxx Artists']
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
    biography: 'The genre-blending critical darling known for his innovative sound and viral hits.',
    awards: ['Genre Blending Artist', 'Critical Darling', 'Viral Hit Creator']
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
    biography: 'The technical drill house king known for his high-energy sets and technical skills.',
    awards: ['Technical Drill House King', 'High Energy Performer', 'Technical Skills Master']
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
    biography: 'The tech house phenomenon of the 2020s known for his viral hits and energetic performances.',
    awards: ['Tech House Phenomenon', 'Viral Hit Maker', '2020s Rising Star']
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
    biography: 'The high-energy mainstage weapon known for his explosive sound and festival performances.',
    awards: ['High Energy Mainstage Weapon', 'Explosive Sound Creator', 'Festival Performer']
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
    biography: 'The influential techno artist and label owner known for her unique sound and трип label.',
    awards: ['трип Founder', 'Influential Techno Artist', 'Unique Sound Creator']
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
    biography: 'The purveyor of deep house known for her melodic, tropical sound and Enormous Tunes releases.',
    awards: ['Deep House Purveyor', 'Melodic Tropical Sound', 'Enormous Tunes Artist']
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
    biography: 'Live techno maestro known for his live performances and Filth on Acid label.',
    awards: ['Live Techno Maestro', 'Filth on Acid Founder', 'Live Performance Artist']
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
    biography: 'The leader of the modern riddim movement known for his heavy, experimental sound.',
    awards: ['Riddim Movement Leader', 'Heavy Experimental Sound', 'Cyclops Recordings Founder']
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
    biography: 'Future house pioneer known for his innovative sound and Confession label.',
    awards: ['Future House Pioneer', 'Confession Founder', 'Innovative Sound Creator']
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
    biography: 'Brazilian house music superstar known for his melodic, tropical sound and Só Track Boa label.',
    awards: ['Brazilian House Superstar', 'Melodic Tropical Sound', 'Só Track Boa Founder']
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
    biography: 'Live acid techno destroyers known for their intense, experimental performances.',
    awards: ['Live Acid Techno Destroyers', 'Intense Experimental Performances', 'Acid Techno Leaders']
  }
];

async function addMissingDjs() {
  try {
    console.log('🔄 Adding missing DJs to complete the collection...');
    
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
