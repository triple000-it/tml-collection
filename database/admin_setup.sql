-- =====================================================
-- TML COLLECT - ADMIN SETUP AND SECURITY
-- =====================================================
-- This file contains the super admin setup and security configurations
-- IMPORTANT: This file should be kept secure and not committed to public repositories
-- =====================================================

-- =====================================================
-- SUPER ADMIN ACCOUNT SETUP
-- =====================================================

-- Create super admin user with secure credentials
-- Email: info@000-it.com
-- Password: Admin123! (CHANGE THIS IMMEDIATELY AFTER SETUP)
-- Role: super_admin (full system access)

INSERT INTO users (
    email, 
    password_hash, 
    role, 
    status, 
    username, 
    first_name, 
    last_name, 
    email_verified,
    notifications_enabled,
    newsletter_subscribed,
    created_at,
    updated_at
) VALUES (
    'info@000-it.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- Admin123! (bcrypt hash)
    'super_admin',
    'active',
    'superadmin',
    'Super',
    'Admin',
    true,
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Create initial points record for super admin
INSERT INTO user_points (user_id, total_points, available_points, is_vip, vip_level, created_at, updated_at)
SELECT 
    u.id, 
    10000, 
    10000, 
    true, 
    5,
    NOW(),
    NOW()
FROM users u 
WHERE u.email = 'info@000-it.com'
ON CONFLICT (user_id) DO UPDATE SET
    total_points = EXCLUDED.total_points,
    available_points = EXCLUDED.available_points,
    is_vip = EXCLUDED.is_vip,
    vip_level = EXCLUDED.vip_level,
    updated_at = NOW();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- DJs table policies
CREATE POLICY "Everyone can view active DJs" ON djs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage DJs" ON djs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Events table policies
CREATE POLICY "Everyone can view active events" ON events
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- User cards policies
CREATE POLICY "Users can view their own cards" ON user_cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON user_cards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON user_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trade offers policies
CREATE POLICY "Users can view their own trade offers" ON trade_offers
    FOR SELECT USING (
        auth.uid() = offerer_user_id OR 
        auth.uid() = receiver_user_id
    );

CREATE POLICY "Users can create trade offers" ON trade_offers
    FOR INSERT WITH CHECK (auth.uid() = offerer_user_id);

CREATE POLICY "Users can update their own trade offers" ON trade_offers
    FOR UPDATE USING (
        auth.uid() = offerer_user_id OR 
        auth.uid() = receiver_user_id
    );

-- User points policies
CREATE POLICY "Users can view their own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all points" ON user_points
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Point transactions policies
CREATE POLICY "Users can view their own transactions" ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON point_transactions
    FOR INSERT WITH CHECK (true);

-- Card packs policies
CREATE POLICY "Everyone can view available packs" ON card_packs
    FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage packs" ON card_packs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- User pack purchases policies
CREATE POLICY "Users can view their own purchases" ON user_pack_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases" ON user_pack_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Everyone can view active achievements" ON achievements
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user achievements" ON user_achievements
    FOR ALL USING (true);

-- Admin uploads policies
CREATE POLICY "Admins can manage uploads" ON admin_uploads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- System settings policies
CREATE POLICY "Everyone can view public settings" ON system_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- Audit log policies
CREATE POLICY "Admins can view audit log" ON audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id 
        AND role IN ('super_admin', 'admin')
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id 
        AND role = 'super_admin'
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is vip
CREATE OR REPLACE FUNCTION is_vip_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_points 
        WHERE user_id = user_id 
        AND is_vip = true
        AND (vip_expires_at IS NULL OR vip_expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_table_name VARCHAR(100),
    p_record_id UUID,
    p_old_values JSONB,
    p_new_values JSONB,
    p_ip_address INET,
    p_user_agent TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_log (
        user_id, action, table_name, record_id, 
        old_values, new_values, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id,
        p_old_values, p_new_values, p_ip_address, p_user_agent
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SECURITY TRIGGERS
-- =====================================================

-- Trigger to log user changes
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (
            user_id, action, table_name, record_id, 
            old_values, new_values
        ) VALUES (
            NEW.id, 'UPDATE', 'users', NEW.id,
            to_jsonb(OLD), to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (
            user_id, action, table_name, record_id, 
            new_values
        ) VALUES (
            NEW.id, 'INSERT', 'users', NEW.id,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (
            user_id, action, table_name, record_id, 
            old_values
        ) VALUES (
            OLD.id, 'DELETE', 'users', OLD.id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_user_changes();

-- =====================================================
-- PASSWORD SECURITY FUNCTIONS
-- =====================================================

-- Function to validate password strength
CREATE OR REPLACE FUNCTION validate_password_strength(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Password must be at least 8 characters
    -- Must contain at least one uppercase letter
    -- Must contain at least one lowercase letter
    -- Must contain at least one number
    -- Must contain at least one special character
    RETURN LENGTH(password) >= 8 
        AND password ~ '[A-Z]'
        AND password ~ '[a-z]'
        AND password ~ '[0-9]'
        AND password ~ '[^A-Za-z0-9]';
END;
$$ LANGUAGE plpgsql;

-- Function to hash password (use this in your application)
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- This is a placeholder - use bcrypt in your application
    -- For now, return a simple hash (NOT SECURE FOR PRODUCTION)
    RETURN encode(digest(password, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECURITY SETTINGS
-- =====================================================

-- Update system settings with security configurations
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category, is_public, is_editable) VALUES
('password_min_length', '8', 'number', 'Minimum password length', 'security', false, true),
('password_require_uppercase', 'true', 'boolean', 'Require uppercase letters in password', 'security', false, true),
('password_require_lowercase', 'true', 'boolean', 'Require lowercase letters in password', 'security', false, true),
('password_require_numbers', 'true', 'boolean', 'Require numbers in password', 'security', false, true),
('password_require_special', 'true', 'boolean', 'Require special characters in password', 'security', false, true),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 'security', false, true),
('lockout_duration_minutes', '15', 'number', 'Account lockout duration in minutes', 'security', false, true),
('session_timeout_minutes', '60', 'number', 'Session timeout in minutes', 'security', false, true),
('require_email_verification', 'true', 'boolean', 'Require email verification for new accounts', 'security', false, true),
('enable_two_factor', 'false', 'boolean', 'Enable two-factor authentication', 'security', false, true),
('audit_log_retention_days', '365', 'number', 'Audit log retention period in days', 'security', false, true),
('max_file_upload_size_mb', '10', 'number', 'Maximum file upload size in MB', 'security', false, true),
('allowed_file_types', 'jpg,jpeg,png,webp', 'string', 'Allowed file types for uploads', 'security', false, true);

-- =====================================================
-- SECURITY WARNINGS AND NOTES
-- =====================================================

-- CRITICAL SECURITY REMINDERS:
-- 1. CHANGE THE SUPER ADMIN PASSWORD IMMEDIATELY AFTER SETUP
-- 2. Never commit this file to public repositories
-- 3. Use environment variables for all sensitive configuration
-- 4. Enable HTTPS in production
-- 5. Implement proper rate limiting
-- 6. Regular security audits and updates
-- 7. Monitor audit logs for suspicious activity
-- 8. Use strong, unique passwords for all admin accounts
-- 9. Enable two-factor authentication for admin accounts
-- 10. Regular database backups with encryption

-- The super admin account created:
-- Email: info@000-it.com
-- Password: Admin123! (MUST BE CHANGED IMMEDIATELY)
-- Role: super_admin (full system access)
-- Status: active
-- VIP: true (level 5)
-- Points: 10,000

-- To change the password, use your application's password change functionality
-- or update the password_hash field directly with a new bcrypt hash
