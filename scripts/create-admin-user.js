// Script to create an admin user for testing
// Run this with: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use anon key for registration (no service key needed)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Use the correct admin email
    const adminEmail = 'info@000-it.com';
    const adminPassword = 'admin123456';
    
    // First, try to sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('Admin user already exists, checking if we can sign in...');
        
        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });
        
        if (signInError) {
          if (signInError.message.includes('email not confirmed')) {
            console.log('❌ Admin user exists but email is not confirmed.');
            console.log('📧 Please check your Supabase dashboard to confirm the email or disable email confirmation.');
            console.log('🔗 Go to: Authentication > Users > info@000-it.com > Confirm email');
            return;
          } else {
            console.error('Sign in error:', signInError.message);
            return;
          }
        } else {
          console.log('✅ Admin user can sign in successfully!');
          console.log('📧 Email confirmed:', !!signInData.user?.email_confirmed_at);
          return;
        }
      } else {
        console.error('Error creating admin user:', signUpError.message);
        return;
      }
    }

    console.log('✅ Admin user created successfully:', signUpData.user?.email);
    
    if (!signUpData.user?.email_confirmed_at) {
      console.log('⚠️  Email confirmation required!');
      console.log('📧 Please check your Supabase dashboard to confirm the email or disable email confirmation.');
      console.log('🔗 Go to: Authentication > Users > info@000-it.com > Confirm email');
      console.log('');
      console.log('To disable email confirmation:');
      console.log('1. Go to Supabase Dashboard > Authentication > Settings');
      console.log('2. Disable "Enable email confirmations"');
      console.log('3. Save changes');
    } else {
      console.log('✅ Email already confirmed!');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
