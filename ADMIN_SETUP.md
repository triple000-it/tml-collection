# Admin Login Setup Instructions

## Quick Start (Demo Mode)

The app now works in demo mode without requiring Supabase configuration. You can login with any of these admin emails using any password:

- `admin@tmlcollect.com`
- `admin@example.com` 
- `info@000-it.com`
- `admin@tmlcollections.com`

## Production Setup

To set up proper authentication with Supabase:

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

3. Set up your Supabase database with the required tables (users, djs, user_cards, user_points)

## Fixed Issues

- ✅ Centralized admin email configuration
- ✅ Fixed email mismatch between components  
- ✅ Added demo mode for testing without Supabase
- ✅ Improved error handling and user feedback
- ✅ Consistent admin checking across all components

## Testing Admin Access

1. Go to `/login`
2. Use any admin email (e.g., `admin@tmlcollect.com`)
3. Enter any password
4. You should be redirected to `/admin` dashboard

The admin dashboard includes:
- DJ management
- User management  
- Statistics overview
- Settings configuration
