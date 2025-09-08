import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client with service role key (only if available)
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

// Mock data for demo purposes (currently unused but kept for fallback)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockDjs = [
  {
    id: 'dimitri-vegas-like-mike',
    stage_name: 'Dimitri Vegas & Like Mike',
    nationality: 'Belgian',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    total_appearances: 15,
    years_active: 14,
    image_url: '/cards/FRONT.png',
    back_image_url: '/cards/BACK.png',
    rarity: 'LEGENDARY',
    biography: 'Belgian DJ duo and brothers known for their explosive energy and Tomorrowland residency. They have headlined major festivals worldwide and are recognized for their crowd interaction and festival anthems.',
    first_tomorrowland_year: 2010,
    record_label: 'Smash The House',
    awards: ['DJ Mag Top 100 #1 (2015, 2019)', 'Tomorrowland Residents', 'Best Festival Performance 2018'],
    categories: ['mainstage'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'martin-garrix',
    stage_name: 'Martin Garrix',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Future Bass', 'Electro House'],
    total_appearances: 12,
    years_active: 11,
    image_url: '/cards/FRONT.png',
    rarity: 'LEGENDARY',
    biography: 'Dutch DJ and producer who became the youngest DJ to reach #1 in DJ Mag Top 100 at age 17. Known for his melodic big room sound and massive festival performances.',
    first_tomorrowland_year: 2014,
    record_label: 'STMPD RCRDS',
    awards: ['DJ Mag Top 100 #1 (2016, 2017, 2018)', 'Tomorrowland Residents', 'Youngest #1 DJ Ever'],
    categories: ['mainstage'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'armin-van-buuren',
    stage_name: 'Armin van Buuren',
    nationality: 'Dutch',
    genres: ['Trance', 'Progressive House', 'Uplifting Trance', 'Psytrance'],
    total_appearances: 18,
    years_active: 19,
    image_url: '/cards/FRONT.png',
    rarity: 'LEGENDARY',
    biography: 'Dutch trance legend and producer, host of the iconic A State of Trance radio show. Known as the "King of Trance" with over 20 years of experience.',
    first_tomorrowland_year: 2005,
    record_label: 'Armada Music',
    awards: ['DJ Mag Top 100 #1 (2007-2010, 2012)', 'Tomorrowland Legends', 'Trance Hall of Fame'],
    categories: ['mainstage', 'asot'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'hardwell',
    stage_name: 'Hardwell',
    nationality: 'Dutch',
    genres: ['Big Room', 'Progressive House', 'Electro House', 'Future Rave'],
    total_appearances: 8,
    years_active: 13,
    image_url: '/cards/FRONT.png',
    rarity: 'EPIC',
    biography: 'Dutch DJ and producer, founder of Revealed Recordings. Known for his energetic big room sound and spectacular live performances with incredible stage production.',
    first_tomorrowland_year: 2012,
    record_label: 'Revealed Recordings',
    awards: ['DJ Mag Top 100 #1 (2013, 2014)', 'Best Big Room Producer', 'Ultra Music Festival Headliner'],
    categories: ['mainstage'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'afrojack',
    stage_name: 'Afrojack',
    nationality: 'Dutch',
    genres: ['Big Room', 'Electro House', 'Future Bass', 'Trap'],
    total_appearances: 9,
    years_active: 14,
    image_url: '/cards/FRONT.png',
    rarity: 'EPIC',
    biography: 'Dutch DJ and producer, founder of Wall Recordings. Known for his distinctive sound and collaborations with major pop artists. Pioneer of the Dutch house movement.',
    first_tomorrowland_year: 2010,
    record_label: 'Wall Recordings',
    awards: ['DJ Mag Top 100 #8 (2011)', 'Grammy Winner', 'Best Dutch DJ 2015'],
    categories: ['mainstage'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'don-diablo',
    stage_name: 'Don Diablo',
    nationality: 'Dutch',
    genres: ['Future House', 'Progressive House', 'Future Bass', 'Trap'],
    total_appearances: 4,
    years_active: 8,
    image_url: '/cards/FRONT.png',
    rarity: 'RARE',
    biography: 'Dutch DJ and producer, pioneer of the future house genre. Known for his innovative sound design and cinematic approach to electronic music production.',
    first_tomorrowland_year: 2017,
    record_label: 'Hexagon',
    awards: ['DJ Mag Top 100 #11 (2018)', 'Future House Pioneer', 'Best New Artist 2017'],
    categories: ['elixir'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'charlotte-de-witte',
    stage_name: 'Charlotte de Witte',
    nationality: 'Belgian',
    genres: ['Techno', 'Industrial Techno', 'Dark Techno', 'Acid Techno'],
    total_appearances: 1,
    years_active: 5,
    image_url: '/cards/FRONT.png',
    rarity: 'COMMON',
    biography: 'Belgian techno DJ and producer, founder of KNTXT label. Rising star in the techno scene known for her dark, industrial sound and powerful performances.',
    first_tomorrowland_year: 2018,
    record_label: 'KNTXT',
    awards: ['DJ Mag Top 100 #13 (2020)', 'Best Techno DJ 2021', 'Rising Star Award'],
    categories: ['core'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    console.log('Fetching DJs from Supabase database...');
    const { data, error } = await supabaseAdmin
      .from('djs')
      .select('*')
      .eq('is_active', true)
      .order('total_appearances', { ascending: false });
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Map database fields to frontend interface
    const mappedData = data?.map(dj => ({
      ...dj,
      first_tomorrowland_year: dj.debut_year, // Map debut_year to first_tomorrowland_year
      // Ensure image_url is properly formatted
      image_url: dj.image_url || null,
      back_image_url: dj.back_image_url || '/cards/BACK.png' // Default to back card image
    })) || [];
    
    console.log(`✅ Successfully loaded ${mappedData.length} DJs from database`);
    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    
    // Map frontend fields to database fields
    const dbData = {
      ...body,
      debut_year: body.first_tomorrowland_year, // Map first_tomorrowland_year to debut_year
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Remove first_tomorrowland_year from dbData since it doesn't exist in database
    delete dbData.first_tomorrowland_year;
    
    const { data, error } = await supabaseAdmin
      .from('djs')
      .insert(dbData)
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Map response back to frontend format
    const mappedData = data?.[0] ? {
      ...data[0],
      first_tomorrowland_year: data[0].debut_year,
      image_url: data[0].image_url || null,
      back_image_url: data[0].back_image_url || '/cards/BACK.png'
    } : null;
    
    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Map frontend fields to database fields
    const dbData = {
      ...updateData,
      debut_year: updateData.first_tomorrowland_year, // Map first_tomorrowland_year to debut_year
      updated_at: new Date().toISOString()
    };
    
    // Remove first_tomorrowland_year from dbData since it doesn't exist in database
    delete dbData.first_tomorrowland_year;
    
    const { data, error } = await supabaseAdmin
      .from('djs')
      .update(dbData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Map response back to frontend format
    const mappedData = data?.[0] ? {
      ...data[0],
      first_tomorrowland_year: data[0].debut_year,
      image_url: data[0].image_url || null,
      back_image_url: data[0].back_image_url || '/cards/BACK.png'
    } : null;
    
    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const { error } = await supabaseAdmin
      .from('djs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
