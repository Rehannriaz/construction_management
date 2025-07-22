-- Enhanced Site Tasker Database Schema with Authentication
-- PostgreSQL Database Schema for Construction Management Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update function for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS sites;
CREATE SCHEMA IF NOT EXISTS reports;
CREATE SCHEMA IF NOT EXISTS documents;
CREATE SCHEMA IF NOT EXISTS messaging;
CREATE SCHEMA IF NOT EXISTS tracking;

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'site_manager', 'worker', 'client');
CREATE TYPE site_role AS ENUM ('site_manager', 'safety_officer', 'worker', 'supervisor');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'unpaid', 'trialing');
CREATE TYPE site_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'whs', 'incident');
CREATE TYPE leave_type AS ENUM ('annual_leave', 'sick_leave', 'personal_leave', 'unpaid_leave');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE tool_type AS ENUM ('hand_tool', 'power_tool', 'machinery', 'vehicle', 'safety_equipment', 'measuring_tool');
CREATE TYPE condition_rating AS ENUM ('excellent', 'good', 'fair', 'poor', 'out_of_service');
CREATE TYPE delivery_request_type AS ENUM ('material_delivery', 'equipment_pickup', 'equipment_delivery', 'waste_removal');
CREATE TYPE vehicle_type AS ENUM ('ute', 'truck', 'van', 'trailer', 'crane', 'excavator');
CREATE TYPE delivery_status AS ENUM ('pending', 'approved', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE document_type AS ENUM ('plan', 'contract', 'permit', 'whs', 'insurance', 'certificate', 'photo', 'other');
CREATE TYPE safety_rating AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE milestone_type AS ENUM ('foundation', 'framing', 'roofing', 'electrical', 'plumbing', 'finishing', 'inspection');
CREATE TYPE notification_type AS ENUM ('report_overdue', 'leave_request', 'tool_request', 'delivery_update', 'safety_alert', 'message', 'system');
CREATE TYPE entity_type AS ENUM ('daily_report', 'weekly_report', 'whs_report', 'leave_request', 'delivery_request', 'tool', 'site', 'message', 'induction');
CREATE TYPE activity_type AS ENUM ('login', 'logout', 'report_submitted', 'report_approved', 'leave_requested', 'leave_approved', 'leave_rejected', 'tool_assigned', 'document_uploaded', 'message_sent', 'induction_completed');
CREATE TYPE induction_type AS ENUM ('general_safety', 'site_specific', 'equipment_training', 'emergency_procedures', 'environmental');
CREATE TYPE induction_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');
CREATE TYPE weather_delay_reason AS ENUM ('rain', 'wind', 'extreme_heat', 'storm', 'flooding', 'other');

-- CORE SCHEMA TABLES

-- Companies table
CREATE TABLE core.companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL UNIQUE,
    company_phone VARCHAR(20),
    company_address TEXT,
    company_abn VARCHAR(20),
    company_logo_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    billing_email VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_email CHECK (company_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Subscriptions table
CREATE TABLE core.subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES core.companies(company_id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'trialing',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    price_per_month DECIMAL(10,2),
    max_users INTEGER DEFAULT 5,
    max_sites INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- AUTH SCHEMA TABLES

-- Pending registrations for unverified users
CREATE TABLE auth.pending_registrations (
    registration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(255),
    company_email VARCHAR(255),
    company_phone VARCHAR(20),
    company_abn VARCHAR(20),
    verification_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- OTPs table for verification codes
CREATE TABLE auth.otps (
    otp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL, -- 'email_verification', 'password_reset', 'login'
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Refresh tokens table
CREATE TABLE auth.refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Will reference core.users after creation
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMPTZ,
    user_agent TEXT,
    ip_address INET,
    is_revoked BOOLEAN DEFAULT FALSE
);

-- Users table
CREATE TABLE core.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES core.companies(company_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'worker',
    employee_id VARCHAR(50),
    avatar_url TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    date_of_birth DATE,
    license_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add foreign key constraint to refresh_tokens after users table creation
ALTER TABLE auth.refresh_tokens 
ADD CONSTRAINT refresh_tokens_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES core.users(user_id) ON DELETE CASCADE;

-- SITES SCHEMA TABLES

-- Sites table
CREATE TABLE sites.sites (
    site_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES core.companies(company_id) ON DELETE CASCADE,
    site_name VARCHAR(255) NOT NULL,
    site_code VARCHAR(50) NOT NULL,
    site_address TEXT NOT NULL,
    site_manager_id UUID REFERENCES core.users(user_id),
    safety_officer_id UUID REFERENCES core.users(user_id),
    status site_status DEFAULT 'planning',
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    project_value DECIMAL(12,2),
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Site assignments table
CREATE TABLE sites.site_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    site_role site_role NOT NULL DEFAULT 'worker',
    assigned_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    hourly_rate DECIMAL(8,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Client assignments table  
CREATE TABLE sites.client_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    assigned_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    is_primary_contact BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'view_only',
    can_view_reports BOOLEAN DEFAULT TRUE,
    can_view_photos BOOLEAN DEFAULT TRUE,
    can_receive_updates BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS SCHEMA TABLES

-- Daily reports table
CREATE TABLE reports.daily_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME,
    end_time TIME,
    total_hours DECIMAL(4,2),
    weather_conditions TEXT,
    temperature_celsius INTEGER,
    work_completed TEXT NOT NULL,
    materials_used TEXT,
    equipment_used TEXT,
    sub_trades_on_site TEXT,
    materials_delivered TEXT,
    site_visitors TEXT,
    challenges_issues TEXT,
    tomorrow_plan TEXT,
    safety_incidents TEXT,
    safety_observations TEXT,
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by_user_id UUID REFERENCES core.users(user_id),
    approved_at TIMESTAMPTZ,
    approval_notes TEXT,
    weather_delay_hours DECIMAL(4,2) DEFAULT 0,
    weather_delay_reason weather_delay_reason,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    overtime_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Weekly reports table
CREATE TABLE reports.weekly_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    site_manager_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    week_starting DATE NOT NULL,
    week_ending DATE NOT NULL,
    overall_progress_percentage SMALLINT CHECK (overall_progress_percentage >= 0 AND overall_progress_percentage <= 100),
    work_completed_summary TEXT NOT NULL,
    next_week_plan TEXT,
    materials_delivered TEXT,
    equipment_status TEXT,
    weather_impact TEXT,
    safety_summary TEXT,
    quality_issues TEXT,
    budget_status TEXT,
    milestone_updates TEXT,
    client_communications TEXT,
    sub_contractor_updates TEXT,
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by_user_id UUID REFERENCES core.users(user_id),
    approved_at TIMESTAMPTZ,
    client_sent BOOLEAN DEFAULT FALSE,
    client_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- WHS reports table
CREATE TABLE reports.whs_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    site_manager_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    week_starting DATE NOT NULL,
    week_ending DATE NOT NULL,
    safety_meetings_held INTEGER DEFAULT 0,
    safety_training_conducted TEXT,
    incidents_count INTEGER DEFAULT 0,
    near_misses_count INTEGER DEFAULT 0,
    safety_inspections_completed INTEGER DEFAULT 0,
    safety_issues_identified TEXT,
    corrective_actions_taken TEXT,
    ppe_compliance_rating safety_rating DEFAULT 'medium',
    housekeeping_rating safety_rating DEFAULT 'medium',
    overall_safety_rating safety_rating DEFAULT 'medium',
    recommendations TEXT,
    next_week_focus TEXT,
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    reviewed_by_user_id UUID REFERENCES core.users(user_id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Report photos table
CREATE TABLE reports.report_photos (
    photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID, -- Can be null for standalone photos
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    photo_date DATE DEFAULT CURRENT_DATE,
    photo_time TIME DEFAULT CURRENT_TIME,
    file_size_kb INTEGER,
    image_width INTEGER,
    image_height INTEGER,
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by_user_id UUID REFERENCES core.users(user_id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- DOCUMENTS SCHEMA TABLES

-- Site documents table
CREATE TABLE documents.site_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type document_type NOT NULL,
    file_url TEXT NOT NULL,
    file_size_kb INTEGER,
    version_number INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_confidential BOOLEAN DEFAULT FALSE,
    expiry_date DATE,
    uploaded_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Document permissions table
CREATE TABLE documents.document_permissions (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents.site_documents(document_id) ON DELETE CASCADE,
    user_role user_role NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_download BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    granted_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- MESSAGING SCHEMA TABLES

-- Messages table
CREATE TABLE messaging.messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    subject VARCHAR(255),
    message_content TEXT NOT NULL,
    site_id UUID REFERENCES sites.sites(site_id),
    parent_message_id UUID REFERENCES messaging.messages(message_id),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Message recipients table
CREATE TABLE messaging.message_recipients (
    recipient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messaging.messages(message_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- TRACKING SCHEMA TABLES

-- Leave requests table
CREATE TABLE tracking.leave_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days SMALLINT NOT NULL,
    total_hours DECIMAL(5,2),
    reason TEXT,
    supporting_document_url TEXT,
    status request_status DEFAULT 'pending',
    reviewed_by_user_id UUID REFERENCES core.users(user_id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    approval_notes TEXT,
    affects_sites UUID[],
    replacement_worker_id UUID REFERENCES core.users(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tools table
CREATE TABLE tracking.tools (
    tool_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES core.companies(company_id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_code VARCHAR(100) NOT NULL,
    tool_type tool_type NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(200),
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    current_condition condition_rating DEFAULT 'good',
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    maintenance_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tool assignments table
CREATE TABLE tracking.tool_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tracking.tools(tool_id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    assigned_to_user_id UUID REFERENCES core.users(user_id),
    assigned_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    assignment_notes TEXT,
    return_condition condition_rating,
    return_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Delivery requests table
CREATE TABLE tracking.delivery_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    request_type delivery_request_type NOT NULL,
    vehicle_type vehicle_type,
    pickup_location TEXT,
    delivery_location TEXT,
    requested_datetime TIMESTAMPTZ NOT NULL,
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    description TEXT NOT NULL,
    estimated_duration_hours DECIMAL(4,2),
    special_requirements TEXT,
    status delivery_status DEFAULT 'pending',
    approved_by_user_id UUID REFERENCES core.users(user_id),
    approved_at TIMESTAMPTZ,
    driver_user_id UUID REFERENCES core.users(user_id),
    actual_pickup_time TIMESTAMPTZ,
    actual_delivery_time TIMESTAMPTZ,
    completion_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Site progress updates table
CREATE TABLE tracking.site_progress_updates (
    update_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites.sites(site_id) ON DELETE CASCADE,
    milestone_type milestone_type,
    progress_percentage SMALLINT CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    update_description TEXT NOT NULL,
    updated_by_user_id UUID NOT NULL REFERENCES core.users(user_id),
    update_date DATE DEFAULT CURRENT_DATE,
    photos_attached BOOLEAN DEFAULT FALSE,
    client_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User activity logs table
CREATE TABLE tracking.user_activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES core.companies(company_id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    entity_type entity_type,
    entity_id UUID,
    description TEXT NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    site_id UUID REFERENCES sites.sites(site_id),
    session_id VARCHAR(255),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    duration_ms INTEGER,
    occurred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE tracking.notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES core.users(user_id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    site_id UUID REFERENCES sites.sites(site_id),
    entity_type entity_type,
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES

-- Core indexes
CREATE INDEX idx_companies_email ON core.companies(company_email);
CREATE INDEX idx_companies_active ON core.companies(is_active);
CREATE INDEX idx_companies_subscription ON core.companies(subscription_tier);

CREATE INDEX idx_subscriptions_company ON core.subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON core.subscriptions(status);

-- Auth indexes
CREATE INDEX idx_pending_registrations_email ON auth.pending_registrations(email);
CREATE INDEX idx_pending_registrations_token ON auth.pending_registrations(verification_token);
CREATE INDEX idx_pending_registrations_expires ON auth.pending_registrations(expires_at);

CREATE INDEX idx_otps_email ON auth.otps(email);
CREATE INDEX idx_otps_purpose ON auth.otps(purpose);
CREATE INDEX idx_otps_expires ON auth.otps(expires_at);

CREATE INDEX idx_refresh_tokens_user ON auth.refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON auth.refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_hash ON auth.refresh_tokens(token_hash);

-- User indexes
CREATE INDEX idx_users_email ON core.users(email);
CREATE INDEX idx_users_company_role ON core.users(company_id, role);
CREATE INDEX idx_users_active ON core.users(is_active);

-- Sites indexes
CREATE INDEX idx_sites_company ON sites.sites(company_id);
CREATE INDEX idx_sites_manager ON sites.sites(site_manager_id);
CREATE INDEX idx_sites_status ON sites.sites(status);

-- Reports indexes
CREATE INDEX idx_daily_reports_site_date ON reports.daily_reports(site_id, report_date);
CREATE INDEX idx_daily_reports_user_date ON reports.daily_reports(user_id, report_date);
CREATE INDEX idx_daily_reports_submitted ON reports.daily_reports(is_submitted);

-- Other commonly used indexes
CREATE INDEX idx_photos_site_date ON reports.report_photos(site_id, photo_date);
CREATE INDEX idx_leave_user_status ON tracking.leave_requests(user_id, status);
CREATE INDEX idx_tools_company ON tracking.tools(company_id);
CREATE INDEX idx_notifications_user_unread ON tracking.notifications(user_id, is_read);

-- UNIQUE CONSTRAINTS
ALTER TABLE core.users ADD CONSTRAINT unique_company_employee_id 
UNIQUE (company_id, employee_id);

ALTER TABLE sites.sites ADD CONSTRAINT unique_company_site_code 
UNIQUE (company_id, site_code);

-- TRIGGERS
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON core.companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON core.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON core.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites.sites 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_assignments_updated_at 
    BEFORE UPDATE ON sites.site_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_reports_updated_at 
    BEFORE UPDATE ON reports.daily_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at 
    BEFORE UPDATE ON tracking.leave_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Site Tasker Database Schema with Authentication Created Successfully!';
    RAISE NOTICE 'Schemas: core, auth, sites, reports, documents, messaging, tracking';
    RAISE NOTICE 'Authentication tables: pending_registrations, otps, refresh_tokens';
END $$;