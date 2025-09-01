-- TML Collect Database Schema
-- PostgreSQL database schema for the Tomorrowland DJ card collection app

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE rarity_level AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');
CREATE TYPE event_type AS ENUM ('summer', 'winter', 'special');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

-- Events table
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type event_type NOT NULL DEFAULT 'summer',
    country VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stages table
CREATE TABLE stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
    capacity INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- DJs table
CREATE TABLE djs (
    id VARCHAR(100) PRIMARY KEY,
    stage_name VARCHAR(255) NOT NULL,
    real_name VARCHAR(255),
    biography TEXT,
    nationality VARCHAR(100),
    genres TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    debut_year INTEGER,
    total_appearances INTEGER DEFAULT 0,
    years_active INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    rarity rarity_level NOT NULL DEFAULT 'COMMON',
    rarity_percentage DECIMAL(5,2) DEFAULT 60.00,
    record_label VARCHAR(255),
    awards TEXT[] DEFAULT '{}',
    spotify_monthly_listeners INTEGER DEFAULT 0,
    instagram_followers INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performances table
CREATE TABLE performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dj_id VARCHAR(100) REFERENCES djs(id) ON DELETE CASCADE,
    event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
    performance_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    event_type VARCHAR(100) DEFAULT 'regular',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User cards collection table
CREATE TABLE user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dj_id VARCHAR(100) REFERENCES djs(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    is_favorite BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dj_id)
);

-- Card trades table
CREATE TABLE card_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dj_id VARCHAR(100) REFERENCES djs(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin uploads table
CREATE TABLE admin_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dj_id VARCHAR(100) REFERENCES djs(id) ON DELETE CASCADE,
    original_filename VARCHAR(255),
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_djs_rarity ON djs(rarity);
CREATE INDEX idx_djs_total_appearances ON djs(total_appearances);
CREATE INDEX idx_djs_nationality ON djs(nationality);
CREATE INDEX idx_djs_genres ON djs USING GIN(genres);
CREATE INDEX idx_djs_social_links ON djs USING GIN(social_links);

CREATE INDEX idx_performances_dj_id ON performances(dj_id);
CREATE INDEX idx_performances_event_id ON performances(event_id);
CREATE INDEX idx_performances_date ON performances(performance_date);

CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_user_cards_dj_id ON user_cards(dj_id);
CREATE INDEX idx_user_cards_acquired_at ON user_cards(acquired_at);

CREATE INDEX idx_events_year ON events(year);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_country ON events(country);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_djs_updated_at BEFORE UPDATE ON djs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performances_updated_at BEFORE UPDATE ON performances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_cards_updated_at BEFORE UPDATE ON user_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_trades_updated_at BEFORE UPDATE ON card_trades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_uploads_updated_at BEFORE UPDATE ON admin_uploads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW dj_stats AS
SELECT 
    d.id,
    d.stage_name,
    d.real_name,
    d.rarity,
    d.total_appearances,
    d.years_active,
    COUNT(p.id) as performance_count,
    COUNT(uc.id) as user_collection_count,
    MIN(p.performance_date) as first_performance,
    MAX(p.performance_date) as last_performance
FROM djs d
LEFT JOIN performances p ON d.id = p.dj_id
LEFT JOIN user_cards uc ON d.id = uc.dj_id
GROUP BY d.id, d.stage_name, d.real_name, d.rarity, d.total_appearances, d.years_active;

CREATE VIEW user_collection_summary AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(uc.id) as total_cards,
    COUNT(CASE WHEN d.rarity = 'LEGENDARY' THEN 1 END) as legendary_cards,
    COUNT(CASE WHEN d.rarity = 'EPIC' THEN 1 END) as epic_cards,
    COUNT(CASE WHEN d.rarity = 'RARE' THEN 1 END) as rare_cards,
    COUNT(CASE WHEN d.rarity = 'COMMON' THEN 1 END) as common_cards,
    COUNT(CASE WHEN uc.is_favorite = true THEN 1 END) as favorite_cards
FROM users u
LEFT JOIN user_cards uc ON u.id = uc.user_id
LEFT JOIN djs d ON uc.dj_id = d.id
GROUP BY u.id, u.username;

-- Insert sample data
INSERT INTO events (id, name, year, location, start_date, end_date, type, country) VALUES
('tml_2024_0', 'Tomorrowland 2024', 2024, 'Boom, Belgium', '2024-07-19', '2024-07-21', 'summer', 'Belgium'),
('tml_2023_0', 'Tomorrowland 2023', 2023, 'Boom, Belgium', '2023-07-21', '2023-07-23', 'summer', 'Belgium'),
('tml_2022_0', 'Tomorrowland 2022', 2022, 'Boom, Belgium', '2022-07-15', '2022-07-17', 'summer', 'Belgium');

-- Create admin user
INSERT INTO users (id, email, username, password_hash, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@tmlcollect.com', 'admin', '$2b$10$example_hash', 'admin');
