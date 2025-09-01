# TML Collect Database Setup

This directory contains the complete database schema and setup files for the TML Collect application.

## 📁 Files Overview

- `complete_schema.sql` - Complete database schema with all tables, indexes, and initial data
- `admin_setup.sql` - Super admin account setup and security configurations
- `README.md` - This setup guide

## 🚀 Quick Setup

### 1. Import Main Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `complete_schema.sql`
4. Click "Run" to execute the schema

### 2. Setup Admin Account

1. In the SQL Editor, copy and paste the contents of `admin_setup.sql`
2. Click "Run" to create the super admin account and security policies

### 3. Verify Setup

Run this query to verify the super admin account was created:

```sql
SELECT email, role, status, created_at FROM users WHERE email = 'info@000-it.com';
```

## 🔐 Super Admin Account

**IMPORTANT: Change these credentials immediately after setup!**

- **Email**: `info@000-it.com`
- **Password**: `Admin123!`
- **Role**: `super_admin`
- **Status**: `active`
- **VIP Level**: 5
- **Starting Points**: 10,000

## 🛡️ Security Features

### User Roles
- **super_admin**: Full system access, can manage everything
- **admin**: Can manage users, DJs, events, and content
- **vip_user**: Premium users with special privileges
- **user**: Standard users with basic access

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admins can access all data
- Public data (DJs, events) is readable by everyone

### Audit Logging
- All user changes are logged
- Admin actions are tracked
- Security events are recorded

## 📊 Database Structure

### Core Tables
- `users` - User accounts and profiles
- `djs` - DJ artist information
- `events` - Tomorrowland events
- `stages` - Event stages
- `performances` - DJ performances at events

### Collection System
- `user_cards` - User's card collection
- `card_packs` - Available card packs
- `user_pack_purchases` - Pack purchase history

### Trading System
- `trade_offers` - Card trading between users
- `user_points` - User points and VIP status
- `point_transactions` - Point transaction history

### Achievement System
- `achievements` - Available achievements
- `user_achievements` - User achievement progress

### Admin & System
- `admin_uploads` - File upload management
- `system_settings` - Application configuration
- `audit_log` - Security and change logging

## 🔧 Configuration

### System Settings
The database includes default system settings that can be modified:

```sql
SELECT * FROM system_settings WHERE category = 'security';
```

### Security Settings
- Password requirements
- Login attempt limits
- Session timeouts
- File upload restrictions

## 🚨 Security Checklist

After setup, ensure you:

- [ ] Change the super admin password
- [ ] Enable HTTPS in production
- [ ] Set up proper environment variables
- [ ] Configure rate limiting
- [ ] Enable two-factor authentication for admins
- [ ] Set up regular database backups
- [ ] Monitor audit logs
- [ ] Review and test RLS policies

## 🔄 Maintenance

### Regular Tasks
1. **Monitor audit logs** for suspicious activity
2. **Backup database** regularly
3. **Update system settings** as needed
4. **Review user permissions** periodically
5. **Clean up old data** (audit logs, expired sessions)

### Performance Monitoring
- Monitor query performance
- Check index usage
- Review slow queries
- Optimize as needed

## 🆘 Troubleshooting

### Common Issues

**RLS Policy Errors**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Permission Issues**
```sql
-- Check user role
SELECT email, role, status FROM users WHERE email = 'your-email@example.com';
```

**Missing Data**
```sql
-- Check if initial data was inserted
SELECT COUNT(*) FROM djs;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM achievements;
```

## 📞 Support

If you encounter issues:

1. Check the audit log for errors
2. Verify RLS policies are correct
3. Ensure all tables were created
4. Check user permissions
5. Review system settings

## 🔒 Security Reminders

- Never commit sensitive data to version control
- Use environment variables for configuration
- Regularly update dependencies
- Monitor for security vulnerabilities
- Keep backups encrypted
- Use strong, unique passwords
- Enable all available security features

---

**Remember**: This is a production-ready database schema. Always test changes in a development environment first!
