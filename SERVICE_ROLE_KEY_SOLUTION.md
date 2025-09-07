# 🔑 Service Role Key Solution

## Quick Fix: Use Service Role Key to Bypass RLS

Since the RLS policies are causing infinite recursion, you can use a **service role key** to bypass RLS entirely for admin operations.

## Step 1: Get Service Role Key

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `ngquunzrscytljlzufpu`
3. **Go to**: Settings → API
4. **Copy the service_role key** (not the anon key)
   - It should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - It's much longer than the anon key

## Step 2: Add to Environment

Add the service role key to your `.env.local` file:

```env
# Existing keys
NEXT_PUBLIC_SUPABASE_URL=https://ngquunzrscytljlzufpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add this new line
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Test the Fix

After adding the service role key:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Test the database connection**:
   ```bash
   node test-database-fix.js
   ```

3. **Expected output**:
   ```
   ✅ Success! Found 7 DJs
   ✅ Success! Found X users
   🎉 ALL TESTS PASSED!
   ```

4. **Check admin dashboard**:
   - Go to: http://localhost:3000/admin
   - Should see: "Database Connected" (green status)
   - Should see: 7 DJs from database

## How It Works

- **Service Role Key**: Bypasses all RLS policies
- **Admin Operations**: Full access to all tables
- **Security**: Only used for admin dashboard operations
- **Real-time Sync**: Works perfectly with service role

## Alternative: Fix RLS Policies

If you prefer to fix the RLS policies instead:

1. **Go to**: Authentication → Policies
2. **Disable RLS** for: users, djs, user_cards tables
3. **Or create simple policies**:
   ```sql
   CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON djs FOR ALL USING (true);
   CREATE POLICY "Allow all operations" ON user_cards FOR ALL USING (true);
   ```

## Security Note

The service role key has full database access, so:
- ✅ **Safe for admin dashboard** - only you have access
- ✅ **Bypasses RLS** - perfect for admin operations
- ⚠️ **Keep it secret** - don't commit to public repos
- ✅ **Production ready** - standard practice for admin tools

## Current Status

- ❌ **RLS Policies**: Blocking access with infinite recursion
- ✅ **Service Role Solution**: Ready to implement
- ✅ **Admin Dashboard**: Updated to use service role when available
- ✅ **Real-time Sync**: Will work with service role

The admin dashboard will automatically use the service role key once you add it to `.env.local`!
