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

// Expected DJs by category from your list
const expectedCategories = {
  'mainstage': [
    'Armin van Buuren', 'David Guetta', 'Dimitri Vegas & Like Mike', 'Martin Garrix', 
    'Steve Aoki', 'Tiësto', 'Alesso', 'Afrojack', 'Hardwell', 'Nicky Romero', 
    'The Chainsmokers', 'Don Diablo', 'Oliver Heldens', 'W&W', 'KSHMR', 'Quintino', 
    'DVBBS', 'Danny Avila', 'Vini Vici', 'Timmy Trumpet', 'Steve Angello', 
    'Sebastian Ingrosso', 'Axwell /\\ Ingrosso', 'Swedish House Mafia'
  ],
  'asot': [
    'Armin van Buuren', 'Paul van Dyk', 'Ferry Corsten', 'Above & Beyond', 
    'Gareth Emery', 'Aly & Fila', 'Paul Oakenfold', 'Andrew Rayel', 'Cosmic Gate', 
    'Markus Schulz', 'MarLo', 'Ben Nicky', 'Giuseppe Ottaviani', 'John O\'Callaghan', 'Rank 1'
  ],
  'core': [
    'Adam Beyer', 'Charlotte de Witte', 'Amelie Lens', 'Carl Cox', 'Richie Hawtin', 
    'Nina Kraviz', 'Maceo Plex', 'Tale Of Us', 'Eric Prydz', 'ANNA', 'Deborah de Luca', 
    'Enrico Sangiuliano', 'Pan-Pot', 'Sven Väth', 'Solomun', 'Adriatique', 'Mathame', '999999999'
  ],
  'elixir': [
    'Claptone', 'Black Coffee', 'Fisher', 'Chris Lake', 'Solomun', 'Bedouin', 
    'Loco Dice', 'Jamie Jones', 'Marco Carola', 'Peggy Gou', 'The Martinez Brothers', 
    'CamelPhat', 'Gorgon City', 'Lost Frequencies', 'Robin Schulz', 'Joris Voorn', 
    'Adriatique', 'Dixon', 'Tchami', 'Malaa'
  ],
  'qdance': [
    'Bassjackers', 'Brennan Heart', 'Coone', 'Da Tweekaz', 'D-Block & S-te-Fan', 
    'Headhunterz', 'Kayzo', 'Sub Zero Project', 'Wildstylez', 'Angerfist', 'DJ Snake', 
    'Nervo', 'Showtek', 'Zatox'
  ],
  'liveact': [
    'Justice', 'Gesaffelstein', 'Eric Prydz', 'Swedish House Mafia', 'Underworld', 
    'The Chemical Brothers', 'deadmau5', 'Apashe', 'Ofenbach'
  ]
};

// Breakout stars and recent phenoms (should be UNCOMMON or RARE)
const breakoutStars = [
  'John Summit', 'Fred again..', 'Anyma', 'Subtronics', 'Reinier Zonneveld', 
  'Acraze', 'James Hype', 'Vintage Culture', 'Miss Monique', 'Sara Landry', 
  'Goodboys', 'Maddix', 'Nora En Pure'
];

// Iconic headliners (should be LEGENDARY or EPIC)
const iconicHeadliners = [
  'Armin van Buuren', 'David Guetta', 'Dimitri Vegas & Like Mike', 'Martin Garrix', 
  'Steve Aoki', 'Tiësto', 'Alesso', 'Afrojack', 'Hardwell', 'Nicky Romero', 
  'The Chainsmokers', 'Don Diablo', 'Oliver Heldens', 'W&W', 'KSHMR', 'Quintino', 
  'DVBBS', 'Danny Avila', 'Vini Vici', 'Timmy Trumpet', 'Steve Angello', 
  'Sebastian Ingrosso', 'Axwell /\\ Ingrosso', 'Swedish House Mafia'
];

async function verifyDjCategories() {
  try {
    console.log('🔍 Verifying DJ categories against expected list...\n');
    
    // Get all DJs from database
    const { data: djs, error } = await supabaseAdmin
      .from('djs')
      .select('stage_name, categories, rarity')
      .eq('is_active', true);
    
    if (error) {
      console.error('Error fetching DJs:', error);
      return;
    }
    
    console.log(`📊 Found ${djs.length} DJs in database\n`);
    
    // Check each category
    let totalIssues = 0;
    
    for (const [category, expectedDjs] of Object.entries(expectedCategories)) {
      console.log(`\n🎯 Checking ${category.toUpperCase()} category:`);
      console.log(`Expected: ${expectedDjs.length} DJs`);
      
      // Find DJs in database with this category
      const djsInCategory = djs.filter(dj => dj.categories.includes(category));
      console.log(`Found in DB: ${djsInCategory.length} DJs`);
      
      // Check for missing DJs
      const missingDjs = expectedDjs.filter(expectedDj => 
        !djsInCategory.some(dj => dj.stage_name === expectedDj)
      );
      
      // Check for extra DJs
      const extraDjs = djsInCategory.filter(dj => 
        !expectedDjs.includes(dj.stage_name)
      );
      
      if (missingDjs.length > 0) {
        console.log(`❌ Missing DJs: ${missingDjs.join(', ')}`);
        totalIssues += missingDjs.length;
      }
      
      if (extraDjs.length > 0) {
        console.log(`⚠️  Extra DJs: ${extraDjs.map(dj => dj.stage_name).join(', ')}`);
      }
      
      if (missingDjs.length === 0 && extraDjs.length === 0) {
        console.log('✅ Perfect match!');
      }
    }
    
    // Check rarity assignments
    console.log('\n\n🎯 Checking Rarity Assignments:');
    
    // Check iconic headliners should be LEGENDARY or EPIC
    console.log('\n📈 Iconic Headliners (should be LEGENDARY or EPIC):');
    const iconicInDb = djs.filter(dj => iconicHeadliners.includes(dj.stage_name));
    iconicInDb.forEach(dj => {
      if (!['LEGENDARY', 'EPIC'].includes(dj.rarity)) {
        console.log(`❌ ${dj.stage_name}: ${dj.rarity} (should be LEGENDARY or EPIC)`);
        totalIssues++;
      } else {
        console.log(`✅ ${dj.stage_name}: ${dj.rarity}`);
      }
    });
    
    // Check breakout stars should be UNCOMMON or RARE
    console.log('\n📈 Breakout Stars (should be UNCOMMON or RARE):');
    const breakoutInDb = djs.filter(dj => breakoutStars.includes(dj.stage_name));
    breakoutInDb.forEach(dj => {
      if (!['UNCOMMON', 'RARE'].includes(dj.rarity)) {
        console.log(`❌ ${dj.stage_name}: ${dj.rarity} (should be UNCOMMON or RARE)`);
        totalIssues++;
      } else {
        console.log(`✅ ${dj.stage_name}: ${dj.rarity}`);
      }
    });
    
    // Check for DJs in expected list but not in database
    console.log('\n\n🎯 Checking for Missing DJs from Expected List:');
    const allExpectedDjs = [...new Set([
      ...expectedCategories.mainstage,
      ...expectedCategories.asot,
      ...expectedCategories.core,
      ...expectedCategories.elixir,
      ...expectedCategories.qdance,
      ...expectedCategories.liveact
    ])];
    
    const dbDjNames = djs.map(dj => dj.stage_name);
    const missingFromDb = allExpectedDjs.filter(expectedDj => 
      !dbDjNames.includes(expectedDj)
    );
    
    if (missingFromDb.length > 0) {
      console.log(`❌ Missing from database: ${missingFromDb.join(', ')}`);
      totalIssues += missingFromDb.length;
    } else {
      console.log('✅ All expected DJs found in database!');
    }
    
    // Summary
    console.log('\n\n📊 VERIFICATION SUMMARY:');
    console.log(`Total issues found: ${totalIssues}`);
    
    if (totalIssues === 0) {
      console.log('🎉 PERFECT! All DJs match the expected categories and rarity assignments!');
    } else {
      console.log('⚠️  Some issues found. Review the details above.');
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error);
  }
}

// Run the verification
verifyDjCategories();
