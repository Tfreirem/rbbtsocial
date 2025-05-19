-- Meta Ads Dashboard Database Schema

-- Dimension Tables
CREATE TABLE accounts (
    account_id VARCHAR(50) PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    campaign_id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50) NOT NULL REFERENCES accounts(account_id),
    campaign_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    objective VARCHAR(100),
    buying_type VARCHAR(50),
    start_time TIMESTAMP,
    stop_time TIMESTAMP,
    budget_remaining DECIMAL(20, 2),
    daily_budget DECIMAL(20, 2),
    lifetime_budget DECIMAL(20, 2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ad_sets (
    ad_set_id VARCHAR(50) PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL REFERENCES campaigns(campaign_id),
    ad_set_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bid_strategy VARCHAR(100),
    daily_budget DECIMAL(20, 2),
    lifetime_budget DECIMAL(20, 2),
    targeting JSON,
    optimization_goal VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ads (
    ad_id VARCHAR(50) PRIMARY KEY,
    ad_set_id VARCHAR(50) NOT NULL REFERENCES ad_sets(ad_set_id),
    ad_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    creative_id VARCHAR(50),
    preview_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Fact Table
CREATE TABLE ads_performance_daily (
    id BIGSERIAL PRIMARY KEY,
    date_start DATE NOT NULL,
    account_id VARCHAR(50) NOT NULL REFERENCES accounts(account_id),
    campaign_id VARCHAR(50) REFERENCES campaigns(campaign_id),
    ad_set_id VARCHAR(50) REFERENCES ad_sets(ad_set_id),
    ad_id VARCHAR(50) REFERENCES ads(ad_id),
    
    -- Breakdown dimensions
    age_range VARCHAR(50),
    gender VARCHAR(20),
    platform VARCHAR(50),
    placement VARCHAR(100),
    device_platform VARCHAR(50),
    country_code VARCHAR(10),
    region VARCHAR(100),
    
    -- Core metrics
    impressions BIGINT NOT NULL DEFAULT 0,
    reach BIGINT DEFAULT 0,
    frequency DECIMAL(10, 2) DEFAULT 0,
    spend DECIMAL(20, 2) NOT NULL DEFAULT 0,
    
    -- Click metrics
    clicks BIGINT DEFAULT 0,
    link_clicks BIGINT DEFAULT 0,
    unique_clicks BIGINT DEFAULT 0,
    unique_link_clicks BIGINT DEFAULT 0,
    ctr DECIMAL(10, 6) DEFAULT 0,
    cpc DECIMAL(10, 6) DEFAULT 0,
    cpp DECIMAL(10, 6) DEFAULT 0,
    cpm DECIMAL(10, 6) DEFAULT 0,
    
    -- Conversion metrics (website conversion specific)
    purchases BIGINT DEFAULT 0,
    purchase_value DECIMAL(20, 2) DEFAULT 0,
    leads BIGINT DEFAULT 0,
    add_to_carts BIGINT DEFAULT 0,
    checkouts_initiated BIGINT DEFAULT 0,
    cost_per_purchase DECIMAL(10, 6) DEFAULT 0,
    cost_per_lead DECIMAL(10, 6) DEFAULT 0,
    roas DECIMAL(10, 6) DEFAULT 0,
    
    -- Video metrics
    video_3s_views BIGINT DEFAULT 0,
    video_10s_views BIGINT DEFAULT 0,
    video_avg_watch_time DECIMAL(10, 2) DEFAULT 0,
    video_p25_watched BIGINT DEFAULT 0,
    video_p50_watched BIGINT DEFAULT 0,
    video_p75_watched BIGINT DEFAULT 0,
    video_p95_watched BIGINT DEFAULT 0,
    video_p100_watched BIGINT DEFAULT 0,
    
    -- Engagement metrics
    post_reactions BIGINT DEFAULT 0,
    post_comments BIGINT DEFAULT 0,
    post_shares BIGINT DEFAULT 0,
    page_engagement BIGINT DEFAULT 0,
    
    -- Data management
    last_fetched_time TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Enforce uniqueness for granular data
    CONSTRAINT unique_daily_ad_breakdown UNIQUE (
        date_start, account_id, campaign_id, ad_set_id, ad_id, 
        COALESCE(age_range, ''), COALESCE(gender, ''), COALESCE(platform, ''),
        COALESCE(placement, ''), COALESCE(device_platform, ''), COALESCE(country_code, ''),
        COALESCE(region, '')
    )
);

-- Utility Tables for Data Sync and Dashboard Preferences

-- Track data synchronization status
CREATE TABLE data_sync_logs (
    id BIGSERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL, -- 'accounts', 'campaigns', 'ads', 'performance', etc.
    account_id VARCHAR(50) REFERENCES accounts(account_id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL, -- 'success', 'failure', 'in_progress'
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    sync_end_time TIMESTAMP
);

-- User dashboard preferences
CREATE TABLE dashboard_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL, -- from your auth system
    preference_name VARCHAR(100) NOT NULL,
    preference_value JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, preference_name)
);

-- KPI definitions that can be selected for dashboard display
CREATE TABLE available_kpis (
    id BIGSERIAL PRIMARY KEY,
    kpi_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    calculation_formula TEXT, -- e.g., 'spend / purchases'
    is_primary BOOLEAN DEFAULT FALSE,
    default_format VARCHAR(50), -- 'currency', 'percentage', 'number', etc.
    category VARCHAR(50), -- 'performance', 'engagement', 'conversion', etc.
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Dashboard saved views
CREATE TABLE saved_dashboard_views (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filter_settings JSONB NOT NULL, -- date range, accounts, campaigns, etc.
    layout_settings JSONB NOT NULL, -- which cards, charts, etc.
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Indexes for the fact table to optimize dashboard queries
CREATE INDEX idx_ads_perf_date ON ads_performance_daily(date_start);
CREATE INDEX idx_ads_perf_account ON ads_performance_daily(account_id);
CREATE INDEX idx_ads_perf_campaign ON ads_performance_daily(campaign_id);
CREATE INDEX idx_ads_perf_adset ON ads_performance_daily(ad_set_id);
CREATE INDEX idx_ads_perf_ad ON ads_performance_daily(ad_id);

-- Indexes for common breakdown queries
CREATE INDEX idx_ads_perf_platform ON ads_performance_daily(platform);
CREATE INDEX idx_ads_perf_country ON ads_performance_daily(country_code);
CREATE INDEX idx_ads_perf_date_account ON ads_performance_daily(date_start, account_id);
CREATE INDEX idx_ads_perf_gender_age ON ads_performance_daily(gender, age_range);

-- Index for time-series data extraction
CREATE INDEX idx_ads_perf_date_metrics ON ads_performance_daily(date_start, account_id, campaign_id, ad_set_id, ad_id);

-- Add a combination index for common filtering operations
CREATE INDEX idx_ads_perf_hierarchy ON ads_performance_daily(account_id, campaign_id, ad_set_id, ad_id, date_start); 