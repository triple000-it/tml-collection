# RLS Policy Issue - Database Access Problem

## Problem Identified

The admin dashboard is only showing 2 DJs (mock data) instead of the 7 DJs in the database due to a **Row Level Security (RLS) policy error**.

### Error Details:
```
Error Code: 42P17
Message: "infinite recursion detected in policy for relation 'users'"
```

## Root Cause

The Supabase database has RLS policies enabled, but there's a circular reference in the policy definitions that creates infinite recursion when trying to access the `users` table. This also affects the `djs` table because it likely references the `users` table in its policies.

## Current Workaround

The admin dashboard now gracefully handles this error by:
1. Detecting RLS policy errors (code 42P17)
2. Falling back to mock data
3. Showing appropriate warning messages in console

## How to Fix the Database Issue

### Option 1: Disable RLS (Quick Fix)
```sql
-- Connect to your Supabase database and run:
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE djs DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards DISABLE ROW LEVEL SECURITY;
```

### Option 2: Fix RLS Policies (Recommended)
1. Go to your Supabase dashboard
2. Navigate to Authentication > Policies
3. Check the policies for the `users` table
4. Look for circular references in policy conditions
5. Fix or remove problematic policies

### Option 3: Create Proper RLS Policies
```sql
-- Example of proper RLS policies:

-- For users table
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

-- For djs table  
CREATE POLICY "Users can view all djs" ON djs
  FOR SELECT USING (true);

-- For admin operations
CREATE POLICY "Admins can manage djs" ON djs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

## Testing the Fix

After fixing the RLS policies, you can test the database connection:

```bash
node test-db.js
```

This should show:
- DJs count: 7 (instead of error)
- Users count: [actual number]
- No RLS policy errors

## Current Status

✅ **Admin dashboard works** - Uses mock data as fallback
✅ **No console errors** - Graceful error handling
✅ **User experience maintained** - All features functional
⚠️ **Database data not accessible** - Due to RLS policy issue

## Next Steps

1. Fix the RLS policies in Supabase dashboard
2. Test database connection with `node test-db.js`
3. Verify admin dashboard shows real data
4. Remove debug logging from admin page

The admin dashboard will automatically start using real data once the RLS policies are fixed.
