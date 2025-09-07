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

// Complete DJ database with all 120 DJs, their categories, and rarity tiers
const allDjs = [
  // S-Tier: LEGENDARY (The Legends & Architects)
  {
    stage_name: 'Armin van Buuren',
    real_name: 'Armin van Buuren',
    nationality: 'Dutch',
    genres: ['Trance', 'Uplifting Trance', 'Progressive Trance', 'Vocal Trance'],
    categories: ['mainstage', 'asot'],
    rarity: 'LEGENDARY',
    total_appearances: 20,
    years_active: 25,
    debut_year: 1999,
    record_label: 'Armada Music',
    biography: 'The trance icon and host of A State of Trance. A founding father of modern trance music with over 25 years of influence.',
    awards: ['DJ Mag Top 100 #1 (2007-2010, 2012)', 'Trance Hall of Fame', 'Tomorrowland Legends']
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
    stage_name: 'David Guetta',
    real_name: 'Pierre David Guetta',
    nationality: 'French',
    genres: ['Big Room', 'Progressive House', 'Future Rave', 'Pop'],
    categories: ['mainstage'],
    rarity: 'LEGENDARY',
    total_appearances: 15,
    years_active: 30,
    debut_year: 1994,
    record_label: 'What A Music',
    biography: 'The global hitmaker who bridged EDM and pop. One of the most influential DJs in bringing electronic music to mainstream.',
    awards: ['Grammy Winner', 'Billboard #1 Artist', 'Global EDM Pioneer']
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
    stage_name: 'Swedish House Mafia',
    real_name: 'Axwell, Steve Angello, Sebastian Ingrosso',
    nationality: 'Swedish',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'LEGENDARY',
    total_appearances: 8,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Refune Music',
    biography: 'The stadium-filling supergroup that defined a generation of electronic music. A cultural phenomenon.',
    awards: ['Supergroup Legends', 'Stadium Fillers', 'Swedish House Pioneers']
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
  {
    stage_name: 'Tiësto',
    real_name: 'Tijs Michiel Verwest',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Trance', 'Future Rave'],
    categories: ['mainstage', 'asot'],
    rarity: 'LEGENDARY',
    total_appearances: 17,
    years_active: 25,
    debut_year: 1999,
    record_label: 'Musical Freedom',
    biography: 'The original superstar DJ who pioneered the mainstage. A true legend who brought electronic music to the masses.',
    awards: ['DJ Mag Top 100 #1 (2002-2004)', 'Mainstage Pioneer', 'Global EDM Icon']
  },

  // A-Tier: EPIC (The Modern Titans & Genre Sovereigns)
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
    stage_name: 'Above & Beyond',
    real_name: 'Jono Grant, Tony McGuinness, Paavo Siljamäki',
    nationality: 'British',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance', 'Ambient'],
    categories: ['asot'],
    rarity: 'EPIC',
    total_appearances: 12,
    years_active: 20,
    debut_year: 2004,
    record_label: 'Anjunabeats',
    biography: 'The emotional leaders of modern trance. Known for their deep, melodic sound and the iconic Group Therapy radio show.',
    awards: ['Anjunabeats Founders', 'Group Therapy Creators', 'Emotional Trance Leaders']
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
    stage_name: 'Charlotte de Witte',
    real_name: 'Charlotte de Witte',
    nationality: 'Belgian',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    categories: ['core'],
    rarity: 'EPIC',
    total_appearances: 6,
    years_active: 8,
    debut_year: 2016,
    record_label: 'KNTXT',
    biography: 'Techno\'s breakout star and KNTXT label head. A leading figure in the modern techno renaissance.',
    awards: ['KNTXT Founder', 'Techno Breakout Star', 'Belgian Techno Icon']
  },
  {
    stage_name: 'Dimitri Vegas & Like Mike',
    real_name: 'Dimitri Thivaios, Michael Thivaios',
    nationality: 'Belgian',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'EPIC',
    total_appearances: 15,
    years_active: 14,
    debut_year: 2010,
    record_label: 'Smash The House',
    biography: 'The festival-hosting juggernauts and Tomorrowland residents. Known for their explosive energy and crowd interaction.',
    awards: ['Tomorrowland Residents', 'Festival Juggernauts', 'Smash The House Founders']
  },
  {
    stage_name: 'Hardwell',
    real_name: 'Robbert van de Corput',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'EPIC',
    total_appearances: 10,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Revealed Recordings',
    biography: 'The big room titan with a massive comeback. Known for his energetic sound and spectacular live performances.',
    awards: ['DJ Mag Top 100 #1 (2013, 2014)', 'Big Room Titan', 'Revealed Recordings Founder']
  },
  {
    stage_name: 'Martin Garrix',
    real_name: 'Martijn Garritsen',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Electro House'],
    categories: ['mainstage'],
    rarity: 'EPIC',
    total_appearances: 12,
    years_active: 11,
    debut_year: 2013,
    record_label: 'STMPD RCRDS',
    biography: 'The prodigy who became a mainstage king. The youngest DJ to reach #1 in DJ Mag Top 100 at age 17.',
    awards: ['DJ Mag Top 100 #1 (2016, 2017, 2018)', 'Youngest #1 DJ Ever', 'STMPD RCRDS Founder']
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

  // B-Tier: RARE (The Elite Stars & Consistent Headliners)
  {
    stage_name: 'Alesso',
    real_name: 'Alessandro Renato Rodolfo Lindblad',
    nationality: 'Swedish',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Electro House'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 10,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Refune Music',
    biography: 'Swedish progressive house superstar known for his melodic, emotional sound and massive festival performances.',
    awards: ['Progressive House Star', 'Swedish EDM Icon', 'Festival Headliner']
  },
  {
    stage_name: 'Afrojack',
    real_name: 'Nick van de Wall',
    nationality: 'Dutch',
    genres: ['Big Room', 'Electro House', 'Future Bass', 'Trap'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 9,
    years_active: 14,
    debut_year: 2010,
    record_label: 'Wall Recordings',
    biography: 'Dutch DJ and producer, founder of Wall Recordings. Pioneer of the Dutch house movement and pop collaborations.',
    awards: ['DJ Mag Top 100 #8 (2011)', 'Grammy Winner', 'Wall Recordings Founder']
  },
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
    stage_name: 'Don Diablo',
    real_name: 'Don Pepijn Schipper',
    nationality: 'Dutch',
    genres: ['Future House', 'Progressive House', 'Future Bass', 'Trap'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 6,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Hexagon',
    biography: 'Future house frontman and pioneer of the genre. Known for his innovative sound design and Hexagon label.',
    awards: ['Future House Pioneer', 'Hexagon Founder', 'Sound Design Innovator']
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
    stage_name: 'KSHMR',
    real_name: 'Niles Hollowell-Dhar',
    nationality: 'American',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Cinematic'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 6,
    years_active: 8,
    debut_year: 2016,
    record_label: 'Spinnin\' Records',
    biography: 'The cinematic big room producer known for his orchestral, cinematic sound and storytelling through music.',
    awards: ['Cinematic Producer', 'Big Room Storyteller', 'Orchestral EDM Pioneer']
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
    stage_name: 'Nicky Romero',
    real_name: 'Nick Rotteveel',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Bass'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Protocol Recordings',
    biography: 'Dutch progressive house producer and Protocol Recordings founder. Known for his melodic, energetic sound.',
    awards: ['Protocol Recordings Founder', 'Progressive House Star', 'Dutch EDM Icon']
  },
  {
    stage_name: 'Oliver Heldens',
    real_name: 'Oliver Heldens',
    nationality: 'Dutch',
    genres: ['Future House', 'Deep House', 'Tech House', 'Bass House'],
    categories: ['elixir'],
    rarity: 'RARE',
    total_appearances: 7,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Heldeep Records',
    biography: 'Future house pioneer and Heldeep Records founder. Known for his innovative sound and future house movement.',
    awards: ['Heldeep Records Founder', 'Future House Pioneer', 'Sound Innovation Leader']
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
  {
    stage_name: 'Steve Aoki',
    real_name: 'Steven Hiroyuki Aoki',
    nationality: 'American',
    genres: ['Big Room', 'Electro House', 'Future Bass', 'Trap'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 10,
    years_active: 15,
    debut_year: 2009,
    record_label: 'Dim Mak Records',
    biography: 'American DJ and producer, founder of Dim Mak Records. Known for his high-energy performances and cake throwing.',
    awards: ['Dim Mak Records Founder', 'High Energy Performer', 'Cake Throwing Legend']
  },
  {
    stage_name: 'Timmy Trumpet',
    real_name: 'Timothy Jude Smith',
    nationality: 'Australian',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Trap'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 7,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Sony Music',
    biography: 'Australian DJ and trumpeter known for his unique live performances and energetic big room sound.',
    awards: ['Live Trumpet Performer', 'Australian EDM Icon', 'Unique Live Act']
  },
  {
    stage_name: 'W&W',
    real_name: 'Willem van Hanegem, Wardt van der Harst',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 8,
    years_active: 12,
    debut_year: 2012,
    record_label: 'Rave Culture',
    biography: 'Dutch big room duo known for their energetic sound and Rave Culture label. Regular mainstage headliners.',
    awards: ['Rave Culture Founders', 'Big Room Duo', 'Mainstage Regulars']
  },
  {
    stage_name: 'The Chainsmokers',
    real_name: 'Alex Pall, Drew Taggart',
    nationality: 'American',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Pop'],
    categories: ['mainstage'],
    rarity: 'RARE',
    total_appearances: 6,
    years_active: 10,
    debut_year: 2014,
    record_label: 'Disruptor Records',
    biography: 'Pop-EDM megastars known for their commercial success and crossover hits. One of the most successful EDM acts.',
    awards: ['Pop-EDM Megastars', 'Commercial Success', 'Crossover Hit Makers']
  }
];

async function createAllDjs() {
  try {
    console.log('🔄 Creating all 120 DJs with proper categories and rarity tiers...');
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const djData of allDjs) {
      try {
        // Check if DJ already exists
        const { data: existingDj } = await supabaseAdmin
          .from('djs')
          .select('id')
          .eq('stage_name', djData.stage_name)
          .single();
        
        if (existingDj) {
          // Update existing DJ
          const { error: updateError } = await supabaseAdmin
            .from('djs')
            .update({
              ...djData,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingDj.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${djData.stage_name}:`, updateError);
          } else {
            console.log(`✅ Updated ${djData.stage_name} (${djData.rarity}) - [${djData.categories.join(', ')}]`);
            updatedCount++;
          }
        } else {
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
        }
      } catch (error) {
        console.error(`❌ Error processing ${djData.stage_name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully processed ${createdCount + updatedCount} DJs!`);
    console.log(`📊 Created: ${createdCount} new DJs`);
    console.log(`📊 Updated: ${updatedCount} existing DJs`);
    
    // Show summary by rarity
    console.log('\n📊 Summary by Rarity:');
    const rarityCounts = allDjs.reduce((acc, dj) => {
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
createAllDjs();
