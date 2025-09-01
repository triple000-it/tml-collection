import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngquunzrscytljlzufpu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DJ {
  id: string
  stage_name: string
  real_name?: string
  biography?: string
  nationality: string
  genres: string[]
  social_links: Record<string, string>
  debut_year: number
  total_appearances: number
  years_active: number
  image_url?: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  rarity_percentage: number
  record_label?: string
  awards: string[]
  spotify_monthly_listeners?: number
  instagram_followers?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  year: number
  location: string
  start_date: string
  end_date: string
  type: 'summer' | 'winter' | 'special'
  country: string
  description?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'moderator'
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface UserCard {
  id: string
  user_id: string
  dj_id: string
  quantity: number
  is_favorite: boolean
  acquired_at: string
  created_at: string
  updated_at: string
}

// API functions
export const djApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .eq('is_active', true)
      .order('total_appearances', { ascending: false })
    
    if (error) throw error
    return data as DJ[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as DJ
  },

  async getByRarity(rarity: string) {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .eq('rarity', rarity)
      .eq('is_active', true)
      .order('total_appearances', { ascending: false })
    
    if (error) throw error
    return data as DJ[]
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('djs')
      .select('*')
      .or(`stage_name.ilike.%${query}%,real_name.ilike.%${query}%,nationality.ilike.%${query}%`)
      .eq('is_active', true)
      .order('total_appearances', { ascending: false })
    
    if (error) throw error
    return data as DJ[]
  }
}

export const userApi = {
  async getCollection(userId: string) {
    const { data, error } = await supabase
      .from('user_cards')
      .select(`
        *,
        djs (*)
      `)
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addCard(userId: string, djId: string) {
    const { data, error } = await supabase
      .from('user_cards')
      .upsert({
        user_id: userId,
        dj_id: djId,
        quantity: 1
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async toggleFavorite(userId: string, djId: string) {
    const { data, error } = await supabase
      .from('user_cards')
      .update({ is_favorite: true })
      .eq('user_id', userId)
      .eq('dj_id', djId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const adminApi = {
  async uploadDjImage(djId: string, imageUrl: string) {
    const { data, error } = await supabase
      .from('djs')
      .update({ image_url: imageUrl })
      .eq('id', djId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateDjRarity(djId: string, rarity: string) {
    const { data, error } = await supabase
      .from('djs')
      .update({ rarity })
      .eq('id', djId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getStats() {
    const [djCount, userCount, cardCount] = await Promise.all([
      supabase.from('djs').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('user_cards').select('*', { count: 'exact', head: true })
    ])

    return {
      totalDjs: djCount.count || 0,
      totalUsers: userCount.count || 0,
      totalCards: cardCount.count || 0
    }
  }
}
