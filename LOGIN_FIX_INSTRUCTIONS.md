# Login Fix Instructions

## Problem Identified
The login is not working because:
1. **Email confirmation is required** - New users need to confirm their email before they can sign in
2. **Invalid email format** - The original admin email `admin@tmlcollect.com` was rejected by Supabase
3. **No admin user exists** - The admin user needs to be created first

## Solution Steps

### Step 1: Disable Email Confirmation (Recommended for Development)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ngquunzrscytljlzufpu`
3. Navigate to **Authentication** > **Settings**
4. Find **"Enable email confirmations"** and **disable it**
5. Click **Save**

### Step 2: Create Admin User

The admin user has been created with the email `admin@localhost.com`. You can now use these credentials:

- **Email:** `admin@localhost.com`
- **Password:** `admin123456`

### Step 3: Test Login

1. Start your development server: `npm run dev`
2. Go to the login page
3. Use the credentials above
4. You should now be able to log in successfully

## Alternative: Keep Email Confirmation Enabled

If you want to keep email confirmation enabled (recommended for production):

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Find the user `admin@localhost.com`
4. Click on the user
5. Click **"Confirm email"** button

## For Production

For production, you should:

1. **Keep email confirmation enabled** for security
2. **Use a real email address** (not localhost.com)
3. **Set up proper email templates** in Supabase
4. **Create admin users through the Supabase dashboard** with proper email addresses

## Testing the Fix

Run this command to test the login:

```bash
node test-login.js
```

This will verify that the admin user can sign in successfully.

## Files Modified

- `scripts/create-admin-user.js` - Updated to use valid email and handle confirmation
- `contexts/AuthContext.tsx` - Added better error handling for login issues
- `test-login.js` - Created test script to verify login works

## Next Steps

1. Disable email confirmation in Supabase dashboard
2. Test login with `admin@localhost.com` / `admin123456`
3. If working, you can re-enable email confirmation for production
4. Create proper admin users with real email addresses for production
