-- =====================================================
-- TML COLLECT - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This file contains the complete database schema for TML Collect
-- Import this into Supabase SQL Editor to set up the entire database
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USER ROLES AND PERMISSIONS
-- =====================================================

-- Create custom user roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'vip_user', 'user');

-- Create user status enum
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- =====================================================
-- MAIN USERS TABLE
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'pending_verification',
    
    -- Profile Information
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    
    -- Account Settings
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    notifications_enabled BOOLEAN DEFAULT TRUE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    theme_preference VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- DJ ARTISTS TABLE
-- =====================================================

CREATE TABLE djs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    stage_name VARCHAR(255) NOT NULL,
    real_name VARCHAR(255), -- Optional, not displayed on cards
    nationality VARCHAR(100),
    biography TEXT,
    
    -- Music Information
    genres TEXT[] DEFAULT '{}',
    record_label VARCHAR(255),
    debut_year INTEGER,
    
    -- Tomorrowland Specific
    total_appearances INTEGER DEFAULT 0,
    years_active INTEGER DEFAULT 0,
    rarity VARCHAR(20) NOT NULL DEFAULT 'COMMON' CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    
    -- Media
    image_url TEXT,
    image_alt_text TEXT,
    social_links JSONB DEFAULT '{}',
    
    -- Metadata
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- EVENTS TABLE
-- =====================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Information
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    location VARCHAR(255),
    country VARCHAR(100),
    
    -- Dates
    start_date DATE,
    end_date DATE,
    
    -- Event Details
    description TEXT,
    total_attendees INTEGER,
    stages_count INTEGER DEFAULT 0,
    
    -- Media
    image_url TEXT,
    banner_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- STAGES TABLE
-- =====================================================

CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Stage Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER,
    
    -- Stage Details
    stage_type VARCHAR(50) DEFAULT 'main', -- main, side, special
    is_main_stage BOOLEAN DEFAULT FALSE,
    
    -- Media
    image_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- PERFORMANCES TABLE
-- =====================================================

CREATE TABLE performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dj_id UUID NOT NULL REFERENCES djs(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    
    -- Performance Information
    performance_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    
    -- Performance Details
    set_type VARCHAR(50) DEFAULT 'regular', -- regular, closing, opening, special
    is_headliner BOOLEAN DEFAULT FALSE,
    crowd_size INTEGER,
    
    -- Media
    set_recording_url TEXT,
    photos JSONB DEFAULT '[]',
    
    -- Status
    is_confirmed BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    
    -- Unique constraint
    UNIQUE(dj_id, event_id, performance_date, start_time)
);

-- =====================================================
-- USER CARDS COLLECTION
-- =====================================================

CREATE TABLE user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dj_id UUID NOT NULL REFERENCES djs(id) ON DELETE CASCADE,
    
    -- Card Information
    card_rarity VARCHAR(20) NOT NULL CHECK (card_rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    card_serial_number VARCHAR(50),
    is_foil BOOLEAN DEFAULT FALSE,
    is_limited_edition BOOLEAN DEFAULT FALSE,
    
    -- Collection Status
    acquisition_method VARCHAR(50) DEFAULT 'pack_opening', -- pack_opening, trade, purchase, reward
    acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT FALSE,
    is_tradeable BOOLEAN DEFAULT TRUE,
    
    -- Trade Information
    trade_value_points INTEGER DEFAULT 0,
    last_trade_offer TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint (one card per user per DJ)
    UNIQUE(user_id, dj_id)
);

-- =====================================================
-- CARD PACKS TABLE
-- =====================================================

CREATE TABLE card_packs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Pack Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pack_type VARCHAR(50) NOT NULL, -- starter, premium, legendary, special
    price_points INTEGER NOT NULL DEFAULT 0,
    price_usd DECIMAL(10,2) DEFAULT 0.00,
    
    -- Pack Contents
    cards_per_pack INTEGER NOT NULL DEFAULT 5,
    guaranteed_rarity VARCHAR(20), -- minimum rarity guaranteed
    special_drop_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage for special cards
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    total_quantity INTEGER, -- NULL for unlimited
    sold_quantity INTEGER DEFAULT 0,
    
    -- Media
    image_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- USER PACK PURCHASES
-- =====================================================

CREATE TABLE user_pack_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pack_id UUID NOT NULL REFERENCES card_packs(id) ON DELETE CASCADE,
    
    -- Purchase Information
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method VARCHAR(50), -- points, usd, free
    amount_paid_points INTEGER DEFAULT 0,
    amount_paid_usd DECIMAL(10,2) DEFAULT 0.00,
    
    -- Pack Opening
    is_opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRADING SYSTEM
-- =====================================================

CREATE TABLE trade_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Trade Participants
    offerer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Trade Details
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Trade Items (JSON arrays of card IDs)
    offered_cards JSONB NOT NULL DEFAULT '[]',
    requested_cards JSONB NOT NULL DEFAULT '[]',
    
    -- Trade Value
    total_offer_value INTEGER DEFAULT 0,
    total_request_value INTEGER DEFAULT 0,
    
    -- Messages
    offer_message TEXT,
    response_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- USER POINTS AND ACHIEVEMENTS
-- =====================================================

CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Points Information
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    spent_points INTEGER DEFAULT 0,
    
    -- VIP Status
    is_vip BOOLEAN DEFAULT FALSE,
    vip_level INTEGER DEFAULT 0,
    vip_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    transaction_type VARCHAR(50) NOT NULL, -- earned, spent, bonus, penalty
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Transaction Context
    description TEXT,
    reference_type VARCHAR(50), -- pack_purchase, daily_login, achievement, trade
    reference_id UUID,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACHIEVEMENTS SYSTEM
-- =====================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Achievement Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- collection, trading, social, special
    rarity VARCHAR(20) NOT NULL DEFAULT 'COMMON' CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    
    -- Requirements
    requirement_type VARCHAR(50) NOT NULL, -- card_count, dj_count, trade_count, etc.
    requirement_value INTEGER NOT NULL,
    requirement_data JSONB DEFAULT '{}',
    
    -- Rewards
    points_reward INTEGER DEFAULT 0,
    special_reward JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE,
    
    -- Media
    icon_url TEXT,
    badge_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Achievement Status
    is_unlocked BOOLEAN DEFAULT FALSE,
    progress INTEGER DEFAULT 0,
    progress_max INTEGER DEFAULT 100,
    
    -- Timestamps
    unlocked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- ADMIN UPLOADS AND MEDIA
-- =====================================================

CREATE TABLE admin_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Upload Information
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Upload Context
    upload_type VARCHAR(50) NOT NULL, -- dj_image, event_image, pack_image, etc.
    reference_type VARCHAR(50), -- dj, event, pack, etc.
    reference_id UUID,
    
    -- Upload Status
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    uploaded_by UUID REFERENCES users(id)
);

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Setting Information
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    
    -- Setting Context
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- =====================================================
-- AUDIT LOG
-- =====================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Audit Information
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- DJs indexes
CREATE INDEX idx_djs_stage_name ON djs(stage_name);
CREATE INDEX idx_djs_rarity ON djs(rarity);
CREATE INDEX idx_djs_total_appearances ON djs(total_appearances);
CREATE INDEX idx_djs_is_featured ON djs(is_featured);

-- Events indexes
CREATE INDEX idx_events_year ON events(year);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_is_active ON events(is_active);

-- Performances indexes
CREATE INDEX idx_performances_dj_id ON performances(dj_id);
CREATE INDEX idx_performances_event_id ON performances(event_id);
CREATE INDEX idx_performances_date ON performances(performance_date);

-- User cards indexes
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_dj_id ON user_cards(dj_id);
CREATE INDEX idx_user_cards_rarity ON user_cards(card_rarity);
CREATE INDEX idx_user_cards_acquisition_date ON user_cards(acquisition_date);

-- Trade offers indexes
CREATE INDEX idx_trade_offers_offerer ON trade_offers(offerer_user_id);
CREATE INDEX idx_trade_offers_receiver ON trade_offers(receiver_user_id);
CREATE INDEX idx_trade_offers_status ON trade_offers(status);
CREATE INDEX idx_trade_offers_created_at ON trade_offers(created_at);

-- Point transactions indexes
CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_type ON point_transactions(transaction_type);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);

-- Audit log indexes
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON djs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performances_updated_at BEFORE UPDATE ON performances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_cards_updated_at BEFORE UPDATE ON user_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_card_packs_updated_at BEFORE UPDATE ON card_packs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trade_offers_updated_at BEFORE UPDATE ON trade_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('app_name', 'TML Collect', 'string', 'Application name', 'general', true),
('app_version', '1.0.0', 'string', 'Application version', 'general', true),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'system', false),
('registration_enabled', 'true', 'boolean', 'Allow new user registrations', 'auth', true),
('email_verification_required', 'true', 'boolean', 'Require email verification for new users', 'auth', false),
('default_user_points', '100', 'number', 'Starting points for new users', 'points', false),
('vip_monthly_cost', '9.99', 'number', 'Monthly VIP subscription cost in USD', 'vip', false),
('pack_starter_price', '50', 'number', 'Price in points for starter pack', 'packs', true),
('pack_premium_price', '200', 'number', 'Price in points for premium pack', 'packs', true),
('pack_legendary_price', '500', 'number', 'Price in points for legendary pack', 'packs', true);

-- Insert default achievements
INSERT INTO achievements (name, description, category, rarity, requirement_type, requirement_value, points_reward, is_active) VALUES
('First Card', 'Collect your first DJ card', 'collection', 'COMMON', 'card_count', 1, 10, true),
('Card Collector', 'Collect 10 different DJ cards', 'collection', 'RARE', 'card_count', 10, 50, true),
('DJ Enthusiast', 'Collect 25 different DJ cards', 'collection', 'EPIC', 'card_count', 25, 150, true),
('Master Collector', 'Collect 50 different DJ cards', 'collection', 'LEGENDARY', 'card_count', 50, 500, true),
('First Trade', 'Complete your first trade', 'trading', 'COMMON', 'trade_count', 1, 25, true),
('Trader', 'Complete 5 trades', 'trading', 'RARE', 'trade_count', 5, 100, true),
('Trade Master', 'Complete 20 trades', 'trading', 'EPIC', 'trade_count', 20, 300, true),
('Legendary Collector', 'Collect 5 legendary cards', 'collection', 'LEGENDARY', 'legendary_count', 5, 1000, true),
('Daily Login', 'Login for 7 consecutive days', 'social', 'RARE', 'consecutive_logins', 7, 100, true),
('VIP Member', 'Become a VIP member', 'special', 'EPIC', 'vip_status', 1, 200, true);

-- =====================================================
-- SUPER ADMIN ACCOUNT CREATION
-- =====================================================

-- Create super admin user (password: Admin123!)
-- Note: This password will be hashed using bcrypt in the application
-- The hash below is for the password "Admin123!" with salt rounds 12
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
    newsletter_subscribed
) VALUES (
    'info@000-it.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', -- Admin123!
    'super_admin',
    'active',
    'superadmin',
    'Super',
    'Admin',
    true,
    true,
    true
);

-- Create initial points record for super admin
INSERT INTO user_points (user_id, total_points, available_points, is_vip, vip_level)
SELECT id, 10000, 10000, true, 5 FROM users WHERE email = 'info@000-it.com';

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample events
INSERT INTO events (name, year, location, country, start_date, end_date, description, total_attendees, stages_count, is_active) VALUES
('Tomorrowland 2024', 2024, 'Boom', 'Belgium', '2024-07-19', '2024-07-21', 'The magical world of Tomorrowland returns to De Schorre in Boom, Belgium', 600000, 15, true),
('Tomorrowland 2023', 2023, 'Boom', 'Belgium', '2023-07-21', '2023-07-23', 'Amicorum Spectaculum - The magical world of friendship', 600000, 15, true),
('Tomorrowland 2022', 2022, 'Boom', 'Belgium', '2022-07-15', '2022-07-17', 'The magical world returns after the pandemic', 600000, 15, true),
('Tomorrowland Winter 2024', 2024, 'Alpe d''Huez', 'France', '2024-03-16', '2024-03-23', 'The magical world in the mountains', 30000, 8, true);

-- Insert sample stages
INSERT INTO stages (event_id, name, description, capacity, stage_type, is_main_stage, is_active)
SELECT 
    e.id,
    'Mainstage',
    'The iconic mainstage of Tomorrowland',
    100000,
    'main',
    true,
    true
FROM events e WHERE e.name = 'Tomorrowland 2024';

INSERT INTO stages (event_id, name, description, capacity, stage_type, is_main_stage, is_active)
SELECT 
    e.id,
    'Freedom Stage',
    'The Freedom stage featuring various genres',
    50000,
    'main',
    false,
    true
FROM events e WHERE e.name = 'Tomorrowland 2024';

-- Insert sample DJs (these will be populated by the scraper)
INSERT INTO djs (stage_name, nationality, biography, genres, record_label, debut_year, total_appearances, years_active, rarity, is_featured, is_active) VALUES
('Dimitri Vegas & Like Mike', 'Belgian', 'Belgian DJ duo and brothers known for their explosive energy and Tomorrowland residency.', ARRAY['Big Room', 'Progressive House', 'Electro House'], 'Smash The House', 2010, 15, 14, 'LEGENDARY', true, true),
('Martin Garrix', 'Dutch', 'Dutch DJ and producer who became the youngest DJ to reach #1 in DJ Mag Top 100.', ARRAY['Big Room', 'Progressive House', 'Future Bass'], 'STMPD RCRDS', 2013, 12, 11, 'LEGENDARY', true, true),
('Armin van Buuren', 'Dutch', 'Dutch trance legend and producer, host of the iconic A State of Trance radio show.', ARRAY['Trance', 'Progressive House', 'Uplifting Trance'], 'Armada Music', 2005, 18, 19, 'LEGENDARY', true, true),
('Hardwell', 'Dutch', 'Dutch DJ and producer, founder of Revealed Recordings.', ARRAY['Big Room', 'Progressive House', 'Electro House'], 'Revealed Recordings', 2011, 8, 13, 'EPIC', true, true),
('Afrojack', 'Dutch', 'Dutch DJ and producer, founder of Wall Recordings.', ARRAY['Big Room', 'Electro House', 'Future Bass'], 'Wall Recordings', 2010, 9, 14, 'EPIC', true, true),
('Don Diablo', 'Dutch', 'Dutch DJ and producer, pioneer of the future house genre.', ARRAY['Future House', 'Progressive House', 'Future Bass'], 'Hexagon', 2016, 4, 8, 'RARE', true, true),
('Charlotte de Witte', 'Belgian', 'Belgian techno DJ and producer, founder of KNTXT label.', ARRAY['Techno', 'Industrial Techno', 'Dark Techno'], 'KNTXT', 2019, 1, 5, 'COMMON', true, true);

-- Insert sample card packs
INSERT INTO card_packs (name, description, pack_type, price_points, cards_per_pack, guaranteed_rarity, special_drop_rate, is_available, image_url, created_by)
SELECT 
    'Starter Pack',
    'Perfect for beginners! Contains 5 cards with at least 1 rare card guaranteed.',
    'starter',
    50,
    5,
    'RARE',
    5.00,
    true,
    '/images/packs/starter-pack.jpg',
    u.id
FROM users u WHERE u.email = 'info@000-it.com';

INSERT INTO card_packs (name, description, pack_type, price_points, cards_per_pack, guaranteed_rarity, special_drop_rate, is_available, image_url, created_by)
SELECT 
    'Premium Pack',
    'For serious collectors! Contains 5 cards with at least 1 epic card guaranteed.',
    'premium',
    200,
    5,
    'EPIC',
    15.00,
    true,
    '/images/packs/premium-pack.jpg',
    u.id
FROM users u WHERE u.email = 'info@000-it.com';

INSERT INTO card_packs (name, description, pack_type, price_points, cards_per_pack, guaranteed_rarity, special_drop_rate, is_available, image_url, created_by)
SELECT 
    'Legendary Pack',
    'The ultimate pack! Contains 5 cards with at least 1 legendary card guaranteed.',
    'legendary',
    500,
    5,
    'LEGENDARY',
    25.00,
    true,
    '/images/packs/legendary-pack.jpg',
    u.id
FROM users u WHERE u.email = 'info@000-it.com';

-- =====================================================
-- SECURITY NOTES
-- =====================================================

-- IMPORTANT SECURITY CONSIDERATIONS:
-- 1. The super admin password hash above is for "Admin123!" - change this immediately after setup
-- 2. Never expose login credentials in client-side code
-- 3. Always use HTTPS in production
-- 4. Implement proper rate limiting for authentication endpoints
-- 5. Use environment variables for sensitive configuration
-- 6. Regularly audit user permissions and access logs
-- 7. Implement proper session management
-- 8. Use strong password policies
-- 9. Enable two-factor authentication for admin accounts
-- 10. Regularly backup the database

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This completes the TML Collect database schema setup
-- The database is now ready for the application to use
-- Remember to:
-- 1. Change the super admin password immediately
-- 2. Configure proper RLS policies based on your security requirements
-- 3. Set up regular database backups
-- 4. Monitor the audit log for security events
