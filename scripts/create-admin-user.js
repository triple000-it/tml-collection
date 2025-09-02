// Script to create an admin user for testing
// Run this with: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with your actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ngquunzrscytljlzufpu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@tmlcollect.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Admin user created successfully:', authData.user.email);

    // Create user in custom users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        email: 'admin@tmlcollect.com',
        role: 'admin',
        status: 'active',
        username: 'admin',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (userError) {
      console.error('Error creating user in custom table:', userError);
    } else {
      console.log('Admin user added to custom users table');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser();
