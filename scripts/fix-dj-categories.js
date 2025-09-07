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

// Correct category assignments based on your list
const correctCategories = {
  // Mainstage DJs
  'Armin van Buuren': ['mainstage', 'asot'],
  'David Guetta': ['mainstage'],
  'Dimitri Vegas & Like Mike': ['mainstage'],
  'Martin Garrix': ['mainstage'],
  'Steve Aoki': ['mainstage'],
  'Tiësto': ['mainstage', 'asot'],
  'Alesso': ['mainstage'],
  'Afrojack': ['mainstage'],
  'Hardwell': ['mainstage'],
  'Nicky Romero': ['mainstage'],
  'The Chainsmokers': ['mainstage'],
  'Don Diablo': ['mainstage'],
  'Oliver Heldens': ['mainstage'],
  'W&W': ['mainstage'],
  'KSHMR': ['mainstage'],
  'Quintino': ['mainstage'],
  'DVBBS': ['mainstage'],
  'Danny Avila': ['mainstage'],
  'Vini Vici': ['mainstage'],
  'Timmy Trumpet': ['mainstage'],
  'Steve Angello': ['mainstage'],
  'Sebastian Ingrosso': ['mainstage'],
  'Axwell /\\ Ingrosso': ['mainstage'],
  'Swedish House Mafia': ['mainstage', 'liveact'],
  
  // ASOT DJs
  'Paul van Dyk': ['asot'],
  'Ferry Corsten': ['asot'],
  'Above & Beyond': ['asot'],
  'Gareth Emery': ['asot'],
  'Aly & Fila': ['asot'],
  'Paul Oakenfold': ['asot'],
  'Andrew Rayel': ['asot'],
  'Cosmic Gate': ['asot'],
  'Markus Schulz': ['asot'],
  'MarLo': ['asot'],
  'Ben Nicky': ['asot'],
  'Giuseppe Ottaviani': ['asot'],
  'Rank 1': ['asot'],
  
  // Core (Techno) DJs
  'Adam Beyer': ['core'],
  'Charlotte de Witte': ['core'],
  'Amelie Lens': ['core'],
  'Carl Cox': ['core'],
  'Richie Hawtin': ['core'],
  'Nina Kraviz': ['core'],
  'Maceo Plex': ['core'],
  'Tale Of Us': ['core'],
  'Eric Prydz': ['mainstage', 'core', 'liveact'],
  'ANNA': ['core'],
  'Enrico Sangiuliano': ['core'],
  'Pan-Pot': ['core'],
  'Sven Väth': ['core'],
  'Solomun': ['elixir', 'core'],
  'Adriatique': ['core', 'elixir'],
  'Mathame': ['core'],
  '999999999': ['core'],
  
  // Elixir (House) DJs
  'Claptone': ['elixir'],
  'Black Coffee': ['elixir'],
  'Fisher': ['elixir'],
  'Chris Lake': ['elixir'],
  'Bedouin': ['elixir'],
  'Loco Dice': ['elixir'],
  'Jamie Jones': ['elixir'],
  'Marco Carola': ['elixir'],
  'Peggy Gou': ['elixir'],
  'The Martinez Brothers': ['elixir'],
  'CamelPhat': ['elixir'],
  'Gorgon City': ['elixir'],
  'Lost Frequencies': ['elixir'],
  'Robin Schulz': ['elixir'],
  'Joris Voorn': ['elixir'],
  'Dixon': ['elixir'],
  'Tchami': ['elixir'],
  'Malaa': ['elixir'],
  
  // Q-Dance DJs
  'Bassjackers': ['qdance'],
  'Brennan Heart': ['qdance'],
  'Coone': ['qdance'],
  'Da Tweekaz': ['qdance'],
  'D-Block & S-te-Fan': ['qdance'],
  'Headhunterz': ['qdance'],
  'Kayzo': ['qdance'],
  'Sub Zero Project': ['qdance'],
  'Wildstylez': ['qdance'],
  'Zatox': ['qdance'],
  'Showtek': ['qdance'],
  'Nervo': ['qdance'],
  
  // Live Act DJs
  'Justice': ['liveact'],
  'Gesaffelstein': ['core', 'liveact'],
  'Underworld': ['liveact'],
  'The Chemical Brothers': ['liveact'],
  'Apashe': ['liveact'],
  
  // Breakout stars (should be UNCOMMON or RARE)
  'John Summit': ['elixir'],
  'Fred again..': ['elixir'],
  'Anyma': ['core'],
  'Subtronics': ['liveact'],
  'Reinier Zonneveld': ['core'],
  'Acraze': ['elixir'],
  'James Hype': ['elixir'],
  'Vintage Culture': ['elixir'],
  'Miss Monique': ['core'],
  'Sara Landry': ['core'],
  'Goodboys': ['elixir'],
  'Maddix': ['mainstage'],
  'Nora En Pure': ['elixir']
};

// Correct rarity assignments
const correctRarities = {
  // LEGENDARY (S-Tier)
  'Armin van Buuren': 'LEGENDARY',
  'Carl Cox': 'LEGENDARY',
  'David Guetta': 'LEGENDARY',
  'Eric Prydz': 'LEGENDARY',
  'Paul van Dyk': 'LEGENDARY',
  'Richie Hawtin': 'LEGENDARY',
  'Sven Väth': 'LEGENDARY',
  'Swedish House Mafia': 'LEGENDARY',
  'The Chemical Brothers': 'LEGENDARY',
  'Tiësto': 'LEGENDARY',
  'Above & Beyond': 'LEGENDARY',
  'Martin Garrix': 'LEGENDARY',
  'Steve Aoki': 'LEGENDARY',
  'The Chainsmokers': 'LEGENDARY',
  'Axwell /\\ Ingrosso': 'LEGENDARY',
  'Steve Angello': 'LEGENDARY',
  'Sebastian Ingrosso': 'LEGENDARY',
  'Dimitri Vegas & Like Mike': 'LEGENDARY',
  
  // EPIC (A-Tier)
  'Adam Beyer': 'EPIC',
  'Amelie Lens': 'EPIC',
  'Charlotte de Witte': 'EPIC',
  'Hardwell': 'EPIC',
  'Solomun': 'EPIC',
  'Tale Of Us': 'EPIC',
  'Alesso': 'EPIC',
  'Afrojack': 'EPIC',
  'Nicky Romero': 'EPIC',
  'W&W': 'EPIC',
  'KSHMR': 'EPIC',
  'Oliver Heldens': 'EPIC',
  'Don Diablo': 'EPIC',
  'Danny Avila': 'EPIC',
  'Vini Vici': 'EPIC',
  'Timmy Trumpet': 'EPIC',
  'DVBBS': 'EPIC',
  'Quintino': 'EPIC',
  
  // RARE (B-Tier) - Keep existing RARE DJs
  'Aly & Fila': 'RARE',
  'Black Coffee': 'RARE',
  'Claptone': 'RARE',
  'Fisher': 'RARE',
  'Chris Lake': 'RARE',
  'Headhunterz': 'RARE',
  'Jamie Jones': 'RARE',
  'Lost Frequencies': 'RARE',
  'Peggy Gou': 'RARE',
  'Robin Schulz': 'RARE',
  
  // UNCOMMON (C-Tier) - Breakout stars and rising artists
  'Adriatique': 'UNCOMMON',
  'ANNA': 'UNCOMMON',
  'Anyma': 'UNCOMMON',
  'Brennan Heart': 'UNCOMMON',
  'CamelPhat': 'UNCOMMON',
  'Coone': 'UNCOMMON',
  'Da Tweekaz': 'UNCOMMON',
  'D-Block & S-te-Fan': 'UNCOMMON',
  'Fred again..': 'UNCOMMON',
  'James Hype': 'UNCOMMON',
  'John Summit': 'UNCOMMON',
  'Maddix': 'UNCOMMON',
  'Nina Kraviz': 'UNCOMMON',
  'Nora En Pure': 'UNCOMMON',
  'Reinier Zonneveld': 'UNCOMMON',
  'Subtronics': 'UNCOMMON',
  'Tchami': 'UNCOMMON',
  'Vintage Culture': 'UNCOMMON',
  '999999999': 'UNCOMMON',
  'Acraze': 'UNCOMMON',
  'Miss Monique': 'UNCOMMON',
  'Sara Landry': 'UNCOMMON',
  'Goodboys': 'UNCOMMON',
  
  // COMMON (D-Tier & E-Tier) - Specialists and scene regulars
  'Bassjackers': 'COMMON',
  'Bedouin': 'COMMON',
  'Ben Nicky': 'COMMON',
  'Cosmic Gate': 'COMMON',
  'Dixon': 'COMMON',
  'Enrico Sangiuliano': 'COMMON',
  'Ferry Corsten': 'COMMON',
  'Gareth Emery': 'COMMON',
  'Gesaffelstein': 'COMMON',
  'Giuseppe Ottaviani': 'COMMON',
  'Gorgon City': 'COMMON',
  'Joris Voorn': 'COMMON',
  'Justice': 'COMMON',
  'Loco Dice': 'COMMON',
  'Maceo Plex': 'COMMON',
  'Marco Carola': 'COMMON',
  'MarLo': 'COMMON',
  'Markus Schulz': 'COMMON',
  'Mathame': 'COMMON',
  'Pan-Pot': 'COMMON',
  'Paul Oakenfold': 'COMMON',
  'Rank 1': 'COMMON',
  'Sub Zero Project': 'COMMON',
  'The Martinez Brothers': 'COMMON',
  'Underworld': 'COMMON',
  'Wildstylez': 'COMMON',
  'Zatox': 'COMMON',
  'Showtek': 'COMMON',
  'Nervo': 'COMMON'
};

async function fixDjCategories() {
  try {
    console.log('🔧 Fixing DJ categories and rarity assignments...\n');
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Update categories
    console.log('📝 Updating categories...');
    for (const [stageName, categories] of Object.entries(correctCategories)) {
      try {
        const { error } = await supabaseAdmin
          .from('djs')
          .update({ 
            categories: categories,
            updated_at: new Date().toISOString()
          })
          .eq('stage_name', stageName);
        
        if (error) {
          console.log(`❌ Error updating ${stageName}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Updated ${stageName}: [${categories.join(', ')}]`);
          updatedCount++;
        }
      } catch (err) {
        console.log(`❌ Error processing ${stageName}: ${err.message}`);
        errorCount++;
      }
    }
    
    // Update rarities
    console.log('\n📝 Updating rarities...');
    for (const [stageName, rarity] of Object.entries(correctRarities)) {
      try {
        const { error } = await supabaseAdmin
          .from('djs')
          .update({ 
            rarity: rarity,
            updated_at: new Date().toISOString()
          })
          .eq('stage_name', stageName);
        
        if (error) {
          console.log(`❌ Error updating ${stageName}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Updated ${stageName}: ${rarity}`);
          updatedCount++;
        }
      } catch (err) {
        console.log(`❌ Error processing ${stageName}: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Fix completed!`);
    console.log(`📊 Updated: ${updatedCount} DJs`);
    console.log(`❌ Errors: ${errorCount} DJs`);
    
  } catch (error) {
    console.error('❌ Fix error:', error);
  }
}

// Run the fix
fixDjCategories();
