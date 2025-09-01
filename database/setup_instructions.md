# 🚀 TML Collect Database Setup Instructions

## 📋 Quick Setup Guide

### Step 1: Import Main Schema
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `complete_schema.sql`
4. Paste into the SQL Editor
5. Click **"Run"** to execute

### Step 2: Setup Admin Account & Security
1. In the SQL Editor, copy the contents of `admin_setup.sql`
2. Paste and click **"Run"**
3. This creates the super admin account and security policies

### Step 3: Verify Setup
Run this query to confirm everything is working:

```sql
-- Check super admin account
SELECT email, role, status, created_at FROM users WHERE email = 'info@000-it.com';

-- Check tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check initial data
SELECT COUNT(*) as dj_count FROM djs;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as achievement_count FROM achievements;
```

## 🔐 Super Admin Credentials

**⚠️ CHANGE THESE IMMEDIATELY AFTER SETUP!**

- **Email**: `info@000-it.com`
- **Password**: `Admin123!`
- **Role**: `super_admin`
- **Access**: Full system control

## 🛡️ Security Features Included

### User Roles
- **super_admin**: Complete system access
- **admin**: Manage users, content, and settings
- **vip_user**: Premium features and benefits
- **user**: Standard user access

### Security Measures
- ✅ Row Level Security (RLS) on all tables
- ✅ Password strength validation
- ✅ Audit logging for all changes
- ✅ Session management
- ✅ Rate limiting support
- ✅ File upload restrictions
- ✅ Admin action tracking

## 📊 Database Structure

### Core System
- **Users & Authentication**: Complete user management
- **DJ Artists**: Tomorrowland DJ information
- **Events & Stages**: Festival data structure
- **Performances**: DJ performance history

### Collection System
- **User Cards**: Personal card collections
- **Card Packs**: Available packs for purchase
- **Trading System**: Card trading between users
- **Points System**: User points and VIP status

### Admin Features
- **File Uploads**: Image management system
- **System Settings**: Application configuration
- **Audit Logs**: Security and change tracking
- **Achievements**: Gamification system

## 🔧 Configuration

### System Settings
The database includes 13 default system settings:
- Security configurations
- Application settings
- Feature toggles
- Limits and restrictions

### Customization
Modify settings using:
```sql
UPDATE system_settings 
SET setting_value = 'new_value' 
WHERE setting_key = 'setting_name';
```

## 🚨 Critical Security Checklist

After setup, ensure you:

- [ ] **Change super admin password immediately**
- [ ] **Enable HTTPS in production**
- [ ] **Set up environment variables**
- [ ] **Configure rate limiting**
- [ ] **Enable two-factor authentication**
- [ ] **Set up database backups**
- [ ] **Monitor audit logs**
- [ ] **Test RLS policies**
- [ ] **Review user permissions**
- [ ] **Update default settings**

## 🔄 Maintenance Tasks

### Daily
- Monitor audit logs for suspicious activity
- Check system performance
- Review error logs

### Weekly
- Backup database
- Review user registrations
- Check security settings

### Monthly
- Update system settings
- Review user permissions
- Clean up old data
- Security audit

## 🆘 Troubleshooting

### Common Issues

**"Permission denied" errors**
```sql
-- Check user role
SELECT email, role, status FROM users WHERE email = 'your-email@example.com';
```

**RLS policy issues**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

**Missing data**
```sql
-- Check if initial data exists
SELECT COUNT(*) FROM djs;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM achievements;
```

## 📞 Support

If you encounter issues:

1. Check the audit log: `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 10;`
2. Verify RLS policies are working
3. Ensure all tables were created successfully
4. Check user permissions and roles
5. Review system settings

## 🔒 Security Reminders

- **Never commit sensitive data** to version control
- **Use environment variables** for all configuration
- **Regular security updates** and dependency management
- **Monitor for vulnerabilities** and security threats
- **Keep backups encrypted** and secure
- **Use strong, unique passwords** for all accounts
- **Enable all available security features**

---

## ✅ Setup Complete!

Your TML Collect database is now ready with:
- Complete schema with all tables
- Super admin account created
- Security policies enabled
- Initial data populated
- Audit logging active
- User roles configured

**Next Steps:**
1. Change the super admin password
2. Configure your application environment
3. Test the authentication system
4. Set up regular backups
5. Monitor the audit logs

**Remember**: This is a production-ready database schema. Always test changes in development first!
