# Database Fix Guide - RLS Policy Issue

## Current Problem

The admin dashboard is not showing real data from the database due to a **Row Level Security (RLS) policy error**:

```
Error Code: 42P17
Message: "infinite recursion detected in policy for relation 'users'"
```

## Quick Fix (Recommended)

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `ngquunzrscytljlzufpu`

### Step 2: Disable RLS Policies
1. Go to **Authentication** → **Policies**
2. Find the `users` table
3. Click **Disable RLS** for the `users` table
4. Find the `djs` table  
5. Click **Disable RLS** for the `djs` table
6. Find the `user_cards` table
7. Click **Disable RLS** for the `user_cards` table

### Step 3: Enable Real-time (Optional)
1. Go to **Database** → **Replication**
2. Enable replication for:
   - `djs` table
   - `users` table
   - `user_cards` table

## Alternative: Fix RLS Policies

If you prefer to keep RLS enabled, create proper policies:

### For Users Table
```sql
-- Allow all users to read users table
CREATE POLICY "Allow read users" ON users
  FOR SELECT USING (true);

-- Allow admins to manage users
CREATE POLICY "Allow admin manage users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

### For DJs Table
```sql
-- Allow all users to read DJs
CREATE POLICY "Allow read djs" ON djs
  FOR SELECT USING (true);

-- Allow admins to manage DJs
CREATE POLICY "Allow admin manage djs" ON djs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

### For User Cards Table
```sql
-- Allow all users to read user cards
CREATE POLICY "Allow read user_cards" ON user_cards
  FOR SELECT USING (true);

-- Allow admins to manage user cards
CREATE POLICY "Allow admin manage user_cards" ON user_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

## Testing the Fix

After fixing the RLS policies, test the database connection:

```bash
# Run this command to test
node test-direct-access.js
```

You should see:
- ✅ Success! Found 7 DJs in database
- ✅ Users query worked! Found X users
- No RLS policy errors

## Expected Results

Once fixed, the admin dashboard will:
- ✅ Show all 7 DJs from the database
- ✅ Display real user data
- ✅ Show accurate statistics
- ✅ Sync in real-time when data changes
- ✅ Allow full CRUD operations on DJs

## Current Status

- ❌ **Database Access**: Blocked by RLS policies
- ✅ **Admin Dashboard**: Functional with error handling
- ✅ **Real-time Sync**: Ready (will work once RLS is fixed)
- ✅ **Error Handling**: Proper error messages shown

The admin dashboard is ready to work with real data as soon as the RLS policies are fixed!
