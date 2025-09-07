import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration');
}

// Create admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  try {
    const [djCount, userCount, cardCount] = await Promise.all([
      supabaseAdmin.from('djs').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_cards').select('*', { count: 'exact', head: true })
    ]);

    // Check if any of the queries failed
    if (djCount.error || userCount.error || cardCount.error) {
      console.error('Database error in stats:', { djCount: djCount.error, userCount: userCount.error, cardCount: cardCount.error });
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const stats = {
      totalDjs: djCount.count || 0,
      totalUsers: userCount.count || 0,
      totalCards: cardCount.count || 0,
      activeUsers: userCount.count || 0
    };
    
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
