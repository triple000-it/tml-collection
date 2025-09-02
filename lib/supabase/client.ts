import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Use the auth helpers client to avoid multiple instances
export const supabase = createClientComponentClient()
export const supabaseClient = supabase
