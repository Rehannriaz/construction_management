-- Site Tasker Enhanced Database Schema for PostgreSQL
-- Using UUIDs for all primary keys for better scalability and security
-- Enhanced with messaging, inductions, activity logging, and improved multi-tenancy

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types for enums
CREATE TYPE user_role AS ENUM ('admin', 'site_manager', 'worker', 'client');
CREATE TYPE site_role AS ENUM (
    'worker',
    'site_manager',
    'supervisor',
    'subcontractor'
);
CREATE TYPE subscription_tier AS ENUM ('free', 'standard', 'plus', 'enterprise');
CREATE TYPE subscription_status AS ENUM (
    'active',
    'cancelled',
    'past_due',
    'trialing',
    'incomplete'
);
CREATE TYPE site_status AS ENUM (
    'planning',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);
CREATE TYPE report_type AS ENUM ('daily', 'weekly');
CREATE TYPE leave_type AS ENUM (
    'annual_leave',
    'sick_leave',
    'personal_leave',
    'unpaid_leave'
);
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE tool_type AS ENUM (
    'hand_tool',
    'power_tool',
    'heavy_machinery',
    'vehicle',
    'safety_equipment'
);
CREATE TYPE condition_rating AS ENUM (
    'excellent',
    'good',
    'fair',
    'poor',
    'out_of_service'
);
CREATE TYPE delivery_request_type AS ENUM ('pickup', 'delivery', 'vehicle_request');
CREATE TYPE vehicle_type AS ENUM (
    'tip_truck',
    'excavator',
    'crane',
    'flatbed',
    'other'
);
CREATE TYPE delivery_status AS ENUM (
    'pending',
    'approved',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);
CREATE TYPE document_type AS ENUM (
    'construction_plan',
    'whs_plan',
    'subcontractor_agreement',
    'permit',
    'induction_material',
    'other'
);
CREATE TYPE safety_rating AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE milestone_type AS ENUM (
    'foundation',
    'framing',
    'roofing',
    'electrical',
    'plumbing',
    'finishing',
    'handover'
);
CREATE TYPE notification_type AS ENUM (
    'daily_report_missing',
    'leave_request',
    'leave_approved',
    'leave_rejected',
    'delivery_scheduled',
    'tool_maintenance_due',
    'message_received',
    'induction_due'
);
CREATE TYPE entity_type AS ENUM (
    'daily_report',
    'weekly_report',
    'whs_report',
    'leave_request',
    'delivery_request',
    'tool',
    'site',
    'message',
    'induction'
);
CREATE TYPE activity_type AS ENUM (
    'login',
    'logout',
    'report_submitted',
    'report_approved',
    'leave_requested',
    'leave_approved',
    'leave_rejected',
    'tool_assigned',
    'document_uploaded',
    'message_sent',
    'induction_completed'
);
CREATE TYPE induction_type AS ENUM (
    'safety_induction',
    'site_specific',
    'equipment_training',
    'whs_training',
    'emergency_procedures'
);
CREATE TYPE induction_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'expired'
);
CREATE TYPE weather_delay_reason AS ENUM (
    'rain',
    'extreme_heat',
    'wind',
    'storm',
    'flooding',
    'other'
);

-- 1. Core User Management
-- Companies table
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) UNIQUE NOT NULL,
    company_phone VARCHAR(20),
    company_address TEXT,
    company_abn VARCHAR(20), -- Australian Business Number
    company_logo_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    billing_email VARCHAR(255), -- Separate billing contact
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney', -- Company timezone
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMP WITH TIME ZONE, -- Trial expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_email CHECK (
        company_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    )
);

-- Subscriptions table for SaaS billing management
CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE, -- Stripe subscription ID
    stripe_customer_id VARCHAR(255), -- Stripe customer ID
    plan_name VARCHAR(100) NOT NULL, -- 'free', 'standard', 'plus', 'enterprise'
    billing_interval VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
    amount_cents INTEGER, -- Price in cents
    currency VARCHAR(3) DEFAULT 'AUD',
    status subscription_status NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    employee_id VARCHAR(50), -- Company's internal employee ID
    avatar_url TEXT,
    emergency_contact_name VARCHAR(255), -- Emergency contact for workers
    emergency_contact_phone VARCHAR(20),
    date_of_birth DATE, -- For age verification in construction
    license_number VARCHAR(100), -- Professional license if applicable
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50), -- User-specific timezone override
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_valid_user_email CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT check_phone_format CHECK (
        phone IS NULL OR phone ~ '^\+?[0-9\s\-\(\)]{8,20}$'
    )
);

-- 2. Site Management
-- Sites table
CREATE TABLE sites (
    site_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    site_name VARCHAR(255) NOT NULL,
    site_code VARCHAR(50), -- Internal site reference code
    site_address TEXT NOT NULL,
    site_description TEXT,
    latitude DECIMAL(10, 8), -- GPS coordinates
    longitude DECIMAL(11, 8),
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    site_status site_status DEFAULT 'planning',
    site_value DECIMAL(15, 2), -- Project value in AUD
    contract_number VARCHAR(100), -- Legal contract reference
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    meeting_point_coordinates VARCHAR(100), -- Emergency assembly point
    site_manager_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- Primary site manager
    safety_officer_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- Designated safety officer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_site_value CHECK (site_value >= 0),
    CONSTRAINT check_completion_dates CHECK (
        actual_completion_date IS NULL OR actual_completion_date >= start_date
    ),
    CONSTRAINT check_estimated_dates CHECK (
        estimated_completion_date IS NULL OR estimated_completion_date >= start_date
    )
);

-- Client assignments table (Many-to-Many: Sites ↔ Clients)
CREATE TABLE client_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_by_user_id UUID NOT NULL REFERENCES users(user_id),
    assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_primary_client BOOLEAN DEFAULT FALSE, -- One primary client per site
    access_level VARCHAR(50) DEFAULT 'standard', -- 'standard', 'limited', 'full'
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Site assignments table (Enhanced with site-specific roles)
CREATE TABLE site_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_by_user_id UUID NOT NULL REFERENCES users(user_id),
    site_role site_role NOT NULL, -- Role at this specific site
    assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    hourly_rate DECIMAL(8, 2), -- Pay rate for this assignment
    is_active BOOLEAN DEFAULT TRUE,
    assignment_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_assignment_dates CHECK (
        end_date IS NULL OR end_date >= assignment_date
    ),
    CONSTRAINT check_hourly_rate CHECK (
        hourly_rate IS NULL OR hourly_rate >= 0
    )
);

-- 3. WHS Induction and Training System
-- Inductions table
CREATE TABLE inductions (
    induction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(site_id) ON DELETE CASCADE, -- NULL for company-wide inductions
    induction_name VARCHAR(255) NOT NULL,
    induction_type induction_type NOT NULL,
    description TEXT,
    content_url TEXT, -- Link to training materials/videos
    duration_minutes INTEGER, -- Expected completion time
    is_mandatory BOOLEAN DEFAULT TRUE,
    requires_renewal BOOLEAN DEFAULT FALSE,
    renewal_period_days INTEGER, -- Days before renewal required
    created_by_user_id UUID NOT NULL REFERENCES users(user_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_duration CHECK (
        duration_minutes IS NULL OR duration_minutes > 0
    ),
    CONSTRAINT check_renewal_period CHECK (
        renewal_period_days IS NULL OR renewal_period_days > 0
    )
);

-- User induction completions
CREATE TABLE user_inductions (
    completion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    induction_id UUID NOT NULL REFERENCES inductions(induction_id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(site_id) ON DELETE CASCADE, -- Site where induction was completed
    status induction_status DEFAULT 'not_started',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE, -- For renewable inductions
    score DECIMAL(5, 2), -- Test score if applicable (0-100)
    certificate_url TEXT, -- Link to completion certificate
    supervisor_user_id UUID REFERENCES users(user_id), -- Who verified completion
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_completion_order CHECK (
        completed_at IS NULL OR completed_at >= started_at
    ),
    CONSTRAINT check_score_range CHECK (
        score IS NULL OR (score >= 0 AND score <= 100)
    )
);

-- 4. Reporting System
-- Daily reports table
CREATE TABLE daily_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    hours_worked DECIMAL(4, 2) NOT NULL,
    start_time TIME, -- Work start time
    end_time TIME, -- Work end time
    break_duration_minutes INTEGER DEFAULT 0, -- Break time in minutes
    weather_conditions VARCHAR(255),
    temperature_celsius DECIMAL(4, 1), -- Daily temperature
    materials_used TEXT,
    work_completed TEXT NOT NULL,
    challenges_issues TEXT,
    next_day_plan TEXT,
    sub_trades_on_site TEXT,
    materials_delivered TEXT,
    visitors_to_site TEXT,
    safety_observations TEXT, -- Daily safety notes
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_by_user_id UUID REFERENCES users(user_id), -- Manager approval
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_hours_worked CHECK (
        hours_worked >= 0 AND hours_worked <= 24
    ),
    CONSTRAINT check_break_duration CHECK (
        break_duration_minutes >= 0 AND break_duration_minutes <= 480
    ),
    CONSTRAINT check_work_times CHECK (
        end_time IS NULL OR start_time IS NULL OR end_time >= start_time
    )
);

-- Weekly reports table
CREATE TABLE weekly_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    site_manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    total_hours_worked DECIMAL(6, 2),
    total_workers INTEGER, -- Number of workers on site this week
    weather_summary TEXT,
    materials_used_summary TEXT,
    work_completed_summary TEXT NOT NULL,
    challenges_issues_summary TEXT,
    next_week_plan TEXT,
    sub_trades_summary TEXT,
    materials_delivered_summary TEXT,
    visitors_summary TEXT,
    safety_summary TEXT, -- Weekly safety overview
    quality_issues TEXT, -- Quality control notes
    client_feedback TEXT, -- Any client comments
    admin_notes TEXT, -- Added by admin before sending to client
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    sent_to_client BOOLEAN DEFAULT FALSE,
    sent_to_client_at TIMESTAMP WITH TIME ZONE,
    approved_by_user_id UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_total_hours CHECK (
        total_hours_worked IS NULL OR total_hours_worked >= 0
    ),
    CONSTRAINT check_total_workers CHECK (
        total_workers IS NULL OR total_workers >= 0
    ),
    CONSTRAINT check_week_dates CHECK (week_end_date >= week_start_date)
);

-- WHS reports table
CREATE TABLE whs_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    site_manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    safety_incidents TEXT,
    incident_count INTEGER DEFAULT 0, -- Number of incidents
    near_miss_count INTEGER DEFAULT 0, -- Number of near misses
    safety_meetings_held TEXT,
    meeting_attendance_count INTEGER, -- Number of attendees
    ppe_compliance_check TEXT,
    ppe_compliance_percentage DECIMAL(5, 2), -- Compliance percentage
    site_hazards_identified TEXT,
    hazards_resolved_count INTEGER DEFAULT 0,
    corrective_actions_taken TEXT,
    safety_training_conducted TEXT,
    training_hours_delivered DECIMAL(5, 2) DEFAULT 0,
    emergency_procedures_reviewed BOOLEAN DEFAULT FALSE,
    first_aid_incidents TEXT,
    first_aid_incident_count INTEGER DEFAULT 0,
    near_miss_reports TEXT,
    overall_safety_rating safety_rating NOT NULL,
    recommendations TEXT,
    regulatory_compliance_notes TEXT, -- Compliance with local regulations
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_by_user_id UUID REFERENCES users(user_id), -- Safety officer review
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_incident_counts CHECK (
        incident_count >= 0 AND near_miss_count >= 0 AND
        hazards_resolved_count >= 0 AND first_aid_incident_count >= 0
    ),
    CONSTRAINT check_compliance_percentage CHECK (
        ppe_compliance_percentage IS NULL OR
        (ppe_compliance_percentage >= 0 AND ppe_compliance_percentage <= 100)
    ),
    CONSTRAINT check_training_hours CHECK (training_hours_delivered >= 0)
);

-- 5. Photo Management
-- Report photos table
CREATE TABLE report_photos (
    photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type report_type NOT NULL,
    report_id UUID NOT NULL, -- References daily_reports.report_id or weekly_reports.report_id
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT, -- Optimized thumbnail
    photo_filename VARCHAR(255) NOT NULL,
    photo_description VARCHAR(500),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    upload_order SMALLINT, -- 1-30 for report photos
    gps_latitude DECIMAL(10, 8), -- Photo location
    gps_longitude DECIMAL(11, 8),
    taken_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE, -- For content moderation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_upload_order CHECK (
        upload_order >= 1 AND upload_order <= 30
    ),
    CONSTRAINT check_file_size CHECK (
        file_size_bytes IS NULL OR file_size_bytes > 0
    )
);

-- 6. Document Management
-- Site documents table
CREATE TABLE site_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    uploaded_by_user_id UUID NOT NULL REFERENCES users(user_id),
    document_name VARCHAR(255) NOT NULL,
    document_type document_type NOT NULL,
    document_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    version_number SMALLINT DEFAULT 1,
    previous_version_id UUID REFERENCES site_documents(document_id),
    description TEXT,
    expiry_date DATE, -- For permits, certificates
    is_confidential BOOLEAN DEFAULT FALSE, -- Restricted access
    is_active BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_version_number CHECK (version_number >= 1),
    CONSTRAINT check_file_size_docs CHECK (
        file_size_bytes IS NULL OR file_size_bytes > 0
    )
);

-- Document permissions (Role-based access control for documents)
CREATE TABLE document_permissions (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES site_documents(document_id) ON DELETE CASCADE,
    role user_role NOT NULL, -- Which role can access this document
    can_view BOOLEAN DEFAULT TRUE,
    can_download BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    granted_by_user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. In-App Messaging System
-- Messages table
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(user_id) ON DELETE CASCADE, -- NULL for broadcast messages
    site_id UUID REFERENCES sites(site_id) ON DELETE CASCADE, -- Site-specific messages
    parent_message_id UUID REFERENCES messages(message_id), -- For threaded conversations
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'direct', -- 'direct', 'broadcast', 'site_announcement'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    attachment_url TEXT, -- File attachment
    attachment_filename VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary announcements
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_message_length CHECK (LENGTH(message_body) <= 10000),
    CONSTRAINT check_subject_length CHECK (
        subject IS NULL OR LENGTH(subject) <= 255
    )
);

-- Message recipients for broadcast messages
CREATE TABLE message_recipients (
    recipient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Leave Management
-- Leave requests table
CREATE TABLE leave_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES users(user_id), -- Usually same as user_id
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days SMALLINT NOT NULL,
    total_hours DECIMAL(5, 2), -- For partial days
    reason TEXT,
    supporting_document_url TEXT, -- Medical certificate, etc.
    status request_status DEFAULT 'pending',
    reviewed_by_user_id UUID REFERENCES users(user_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    approval_notes TEXT, -- Specific approval/rejection reason
    affects_sites UUID[], -- Array of site IDs affected by this leave
    replacement_worker_id UUID REFERENCES users(user_id), -- Covering worker
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_leave_dates CHECK (end_date >= start_date),
    CONSTRAINT check_total_days CHECK (total_days > 0),
    CONSTRAINT check_total_hours CHECK (
        total_hours IS NULL OR total_hours >= 0
    )
);

-- 9. Tool and Vehicle Tracking
-- Tools table
CREATE TABLE tools (
    tool_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_type tool_type NOT NULL,
    tool_code VARCHAR(100), -- Company barcode/QR code
    serial_number VARCHAR(255),
    manufacturer VARCHAR(255),
    model VARCHAR(255),
    purchase_date DATE,
    purchase_value DECIMAL(10, 2),
    current_condition condition_rating DEFAULT 'good',
    last_service_date DATE,
    next_service_date DATE,
    maintenance_due_date DATE,
    insurance_expiry_date DATE, -- For vehicles/machinery
    registration_number VARCHAR(100), -- For vehicles
    description TEXT,
    operating_instructions TEXT, -- Safety/usage instructions
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_purchase_value CHECK (
        purchase_value IS NULL OR purchase_value >= 0
    ),
    CONSTRAINT check_service_dates CHECK (
        next_service_date IS NULL OR last_service_date IS NULL OR
        next_service_date >= last_service_date
    )
);

-- Tool assignments table
CREATE TABLE tool_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_id UUID NOT NULL REFERENCES tools(tool_id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    assigned_by_user_id UUID NOT NULL REFERENCES users(user_id),
    assigned_to_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- NULL if assigned to site only
    assignment_date DATE NOT NULL,
    expected_return_date DATE,
    actual_return_date DATE,
    assignment_notes TEXT,
    return_condition condition_rating,
    return_notes TEXT,
    damages_reported TEXT, -- Any damage during assignment
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_assignment_return_dates CHECK (
        actual_return_date IS NULL OR actual_return_date >= assignment_date
    )
);

-- 10. Delivery and Vehicle Requests
-- Delivery requests table
CREATE TABLE delivery_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES users(user_id),
    request_type delivery_request_type NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    requested_date DATE NOT NULL,
    requested_time TIME,
    estimated_duration_hours DECIMAL(3, 1),
    pickup_location TEXT, -- Specific pickup address
    delivery_location TEXT, -- Specific delivery address
    special_instructions TEXT,
    weight_kg DECIMAL(8, 2), -- Load weight
    requires_crane BOOLEAN DEFAULT FALSE,
    status delivery_status DEFAULT 'pending',
    approved_by_user_id UUID REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    scheduled_date DATE,
    scheduled_time TIME,
    driver_user_id UUID REFERENCES users(user_id), -- Assigned driver
    vehicle_registration VARCHAR(20), -- Actual vehicle used
    completed_at TIMESTAMP WITH TIME ZONE,
    completion_notes TEXT,
    admin_notes TEXT,
    actual_cost DECIMAL(8, 2), -- Actual delivery cost
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_duration CHECK (
        estimated_duration_hours IS NULL OR estimated_duration_hours > 0
    ),
    CONSTRAINT check_weight CHECK (
        weight_kg IS NULL OR weight_kg >= 0
    ),
    CONSTRAINT check_cost CHECK (
        actual_cost IS NULL OR actual_cost >= 0
    )
);

-- 11. Site Progress Tracking
-- Site progress updates table
CREATE TABLE site_progress_updates (
    update_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    updated_by_user_id UUID NOT NULL REFERENCES users(user_id),
    progress_percentage DECIMAL(5, 2) NOT NULL CHECK (
        progress_percentage >= 0 AND progress_percentage <= 100
    ),
    milestone_description VARCHAR(255),
    estimated_completion_date DATE,
    days_lost_weather SMALLINT DEFAULT 0,
    weather_delay_reason weather_delay_reason, -- Enhanced weather tracking
    days_lost_other SMALLINT DEFAULT 0,
    other_delay_reason TEXT, -- Reason for non-weather delays
    reason_for_delays TEXT,
    update_notes TEXT,
    cost_impact DECIMAL(10, 2), -- Financial impact of delays
    schedule_impact_days INTEGER, -- Days added to schedule
    mitigation_actions TEXT, -- Actions taken to address delays
    is_milestone BOOLEAN DEFAULT FALSE,
    milestone_type milestone_type,
    milestone_date DATE, -- When milestone was actually reached
    update_date DATE NOT NULL DEFAULT CURRENT_DATE,
    photos_attached INTEGER DEFAULT 0, -- Count of progress photos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_delay_days CHECK (
        days_lost_weather >= 0 AND days_lost_other >= 0
    ),
    CONSTRAINT check_schedule_impact CHECK (
        schedule_impact_days IS NULL OR schedule_impact_days >= 0
    )
);

-- 12. User Activity Logging
-- User activity logs table
CREATE TABLE user_activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    entity_type entity_type,
    entity_id UUID, -- ID of the related entity (report, site, etc.)
    description TEXT NOT NULL, -- Human-readable description
    metadata JSONB, -- Additional structured data
    ip_address INET, -- User's IP address
    user_agent TEXT, -- Browser/app information
    site_id UUID REFERENCES sites(site_id) ON DELETE SET NULL, -- Site context if applicable
    session_id VARCHAR(255), -- User session identifier
    success BOOLEAN DEFAULT TRUE, -- Whether the action succeeded
    error_message TEXT, -- Error details if action failed
    duration_ms INTEGER, -- Time taken for the action
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_duration CHECK (
        duration_ms IS NULL OR duration_ms >= 0
    )
);

-- 13. Notification System
-- Notifications table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type entity_type,
    related_entity_id UUID,
    site_id UUID REFERENCES sites(site_id) ON DELETE CASCADE, -- Site context
    action_url TEXT, -- Deep link to relevant page
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'critical'
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE, -- Auto-dismiss date
    send_email BOOLEAN DEFAULT FALSE, -- Also send email notification
    email_sent_at TIMESTAMP WITH TIME ZONE,
    send_sms BOOLEAN DEFAULT FALSE, -- Also send SMS notification
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_title_length CHECK (LENGTH(title) <= 255),
    CONSTRAINT check_message_length CHECK (LENGTH(message) <= 2000)
);

-- INDEXES FOR PERFORMANCE
-- Companies
CREATE INDEX idx_companies_email ON companies(company_email);
CREATE INDEX idx_companies_abn ON companies(company_abn);
CREATE INDEX idx_companies_active ON companies(is_active);
CREATE INDEX idx_companies_subscription ON companies(subscription_tier);

-- Subscriptions
CREATE INDEX idx_subscriptions_company ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_role ON users(company_id, role);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_last_login ON users(last_login_at DESC);

-- Sites
CREATE INDEX idx_sites_company ON sites(company_id);
CREATE INDEX idx_sites_manager ON sites(site_manager_id);
CREATE INDEX idx_sites_safety_officer ON sites(safety_officer_id);
CREATE INDEX idx_sites_status ON sites(site_status);
CREATE INDEX idx_sites_start_date ON sites(start_date);
CREATE INDEX idx_sites_completion_date ON sites(estimated_completion_date);
CREATE INDEX idx_sites_location ON sites(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Client assignments
CREATE INDEX idx_client_assignments_site ON client_assignments(site_id);
CREATE INDEX idx_client_assignments_client ON client_assignments(client_id);
CREATE INDEX idx_client_assignments_active ON client_assignments(is_active);
CREATE INDEX idx_client_assignments_primary ON client_assignments(site_id, is_primary_client);

-- Site assignments
CREATE INDEX idx_site_assignments_site ON site_assignments(site_id);
CREATE INDEX idx_site_assignments_user ON site_assignments(user_id);
CREATE INDEX idx_site_assignments_active ON site_assignments(site_id, user_id, is_active);
CREATE INDEX idx_site_assignments_role ON site_assignments(site_role);
CREATE INDEX idx_site_assignments_date ON site_assignments(assignment_date);

-- Inductions
CREATE INDEX idx_inductions_company ON inductions(company_id);
CREATE INDEX idx_inductions_site ON inductions(site_id);
CREATE INDEX idx_inductions_type ON inductions(induction_type);
CREATE INDEX idx_inductions_active ON inductions(is_active);
CREATE INDEX idx_inductions_mandatory ON inductions(is_mandatory);

-- User inductions
CREATE INDEX idx_user_inductions_user ON user_inductions(user_id);
CREATE INDEX idx_user_inductions_induction ON user_inductions(induction_id);
CREATE INDEX idx_user_inductions_status ON user_inductions(status);
CREATE INDEX idx_user_inductions_expires ON user_inductions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_inductions_site ON user_inductions(site_id);

-- Daily reports
CREATE INDEX idx_daily_reports_site_date ON daily_reports(site_id, report_date DESC);
CREATE INDEX idx_daily_reports_user_date ON daily_reports(user_id, report_date DESC);
CREATE INDEX idx_daily_reports_submitted ON daily_reports(is_submitted);
CREATE INDEX idx_daily_reports_approved ON daily_reports(approved_by_user_id, approved_at);

-- Weekly reports
CREATE INDEX idx_weekly_reports_site_week ON weekly_reports(site_id, week_start_date DESC);
CREATE INDEX idx_weekly_reports_manager ON weekly_reports(site_manager_id);
CREATE INDEX idx_weekly_reports_submitted ON weekly_reports(is_submitted);
CREATE INDEX idx_weekly_reports_client_sent ON weekly_reports(sent_to_client, sent_to_client_at);

-- WHS reports
CREATE INDEX idx_whs_reports_site_week ON whs_reports(site_id, week_start_date DESC);
CREATE INDEX idx_whs_reports_manager ON whs_reports(site_manager_id);
CREATE INDEX idx_whs_reports_submitted ON whs_reports(is_submitted);
CREATE INDEX idx_whs_reports_safety_rating ON whs_reports(overall_safety_rating);

-- Photos
CREATE INDEX idx_photos_report ON report_photos(report_type, report_id);
CREATE INDEX idx_photos_site_date ON report_photos(site_id, taken_at DESC);
CREATE INDEX idx_photos_user ON report_photos(user_id);
CREATE INDEX idx_photos_approved ON report_photos(is_approved);

-- Documents
CREATE INDEX idx_documents_site ON site_documents(site_id);
CREATE INDEX idx_documents_type ON site_documents(document_type);
CREATE INDEX idx_documents_active ON site_documents(is_active);
CREATE INDEX idx_documents_version ON site_documents(version_number);
CREATE INDEX idx_documents_expiry ON site_documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_documents_confidential ON site_documents(is_confidential);

-- Document permissions
CREATE INDEX idx_document_permissions_document ON document_permissions(document_id);
CREATE INDEX idx_document_permissions_role ON document_permissions(role);

-- Messages
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_site ON messages(site_id);
CREATE INDEX idx_messages_sent_date ON messages(sent_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read, sent_at DESC);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);
CREATE INDEX idx_messages_priority ON messages(priority);

-- Message recipients
CREATE INDEX idx_message_recipients_message ON message_recipients(message_id);
CREATE INDEX idx_message_recipients_user ON message_recipients(user_id);
CREATE INDEX idx_message_recipients_unread ON message_recipients(user_id, is_read);

-- Leave requests
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_type ON leave_requests(leave_type);
CREATE INDEX idx_leave_reviewer ON leave_requests(reviewed_by_user_id);

-- Tools
CREATE INDEX idx_tools_company ON tools(company_id);
CREATE INDEX idx_tools_type ON tools(tool_type);
CREATE INDEX idx_tools_code ON tools(tool_code);
CREATE INDEX idx_tools_active ON tools(is_active);
CREATE INDEX idx_tools_condition ON tools(current_condition);
CREATE INDEX idx_tools_maintenance_due ON tools(maintenance_due_date) WHERE maintenance_due_date IS NOT NULL;

-- Tool assignments
CREATE INDEX idx_tool_assignments_tool ON tool_assignments(tool_id);
CREATE INDEX idx_tool_assignments_site ON tool_assignments(site_id);
CREATE INDEX idx_tool_assignments_user ON tool_assignments(assigned_to_user_id);
CREATE INDEX idx_tool_assignments_active ON tool_assignments(is_active);
CREATE INDEX idx_tool_assignments_date ON tool_assignments(assignment_date DESC);

-- Delivery requests
CREATE INDEX idx_delivery_site ON delivery_requests(site_id);
CREATE INDEX idx_delivery_requester ON delivery_requests(requested_by_user_id);
CREATE INDEX idx_delivery_status ON delivery_requests(status);
CREATE INDEX idx_delivery_date ON delivery_requests(requested_date);
CREATE INDEX idx_delivery_vehicle_type ON delivery_requests(vehicle_type);
CREATE INDEX idx_delivery_driver ON delivery_requests(driver_user_id);

-- Progress updates
CREATE INDEX idx_progress_site ON site_progress_updates(site_id);
CREATE INDEX idx_progress_date ON site_progress_updates(update_date DESC);
CREATE INDEX idx_progress_milestone ON site_progress_updates(is_milestone);
CREATE INDEX idx_progress_percentage ON site_progress_updates(progress_percentage);

-- Activity logs
CREATE INDEX idx_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_company ON user_activity_logs(company_id);
CREATE INDEX idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_occurred ON user_activity_logs(occurred_at DESC);
CREATE INDEX idx_activity_logs_entity ON user_activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_site ON user_activity_logs(site_id);
CREATE INDEX idx_activity_logs_session ON user_activity_logs(session_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read, sent_at DESC);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_site ON notifications(site_id);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- UNIQUE CONSTRAINTS
-- Users: unique employee_id per company (if provided)
CREATE UNIQUE INDEX idx_users_company_employee_unique ON users(company_id, employee_id)
WHERE employee_id IS NOT NULL;

-- Sites: unique site_code per company (if provided)
CREATE UNIQUE INDEX idx_sites_company_code_unique ON sites(company_id, site_code)
WHERE site_code IS NOT NULL;

-- Client assignments: only one primary client per site
CREATE UNIQUE INDEX idx_client_assignments_primary_unique ON client_assignments(site_id)
WHERE is_primary_client = TRUE AND is_active = TRUE;

-- Site assignments: prevent duplicate active assignments for same role
CREATE UNIQUE INDEX idx_site_assignments_unique_active ON site_assignments(site_id, user_id, site_role)
WHERE end_date IS NULL AND is_active = TRUE;

-- Daily reports: one report per user per site per day
CREATE UNIQUE INDEX idx_daily_reports_unique ON daily_reports(site_id, user_id, report_date);

-- Weekly reports: one report per site per week
CREATE UNIQUE INDEX idx_weekly_reports_unique ON weekly_reports(site_id, week_start_date);

-- WHS reports: one report per site per week
CREATE UNIQUE INDEX idx_whs_reports_unique ON whs_reports(site_id, week_start_date);

-- User inductions: prevent duplicate completions
CREATE UNIQUE INDEX idx_user_inductions_unique ON user_inductions(user_id, induction_id, site_id);

-- Tools: unique tool code per company (if provided)
CREATE UNIQUE INDEX idx_tools_company_code_unique ON tools(company_id, tool_code)
WHERE tool_code IS NOT NULL;

-- Document permissions: one permission per document per role
CREATE UNIQUE INDEX idx_document_permissions_unique ON document_permissions(document_id, role);

-- Message recipients: prevent duplicate recipients
CREATE UNIQUE INDEX idx_message_recipients_unique ON message_recipients(message_id, user_id);

-- TRIGGERS FOR UPDATED_AT
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all relevant tables
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_assignments_updated_at BEFORE UPDATE ON client_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_assignments_updated_at BEFORE UPDATE ON site_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inductions_updated_at BEFORE UPDATE ON inductions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_inductions_updated_at BEFORE UPDATE ON user_inductions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_reports_updated_at BEFORE UPDATE ON daily_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weekly_reports_updated_at BEFORE UPDATE ON weekly_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whs_reports_updated_at BEFORE UPDATE ON whs_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_assignments_updated_at BEFORE UPDATE ON tool_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_requests_updated_at BEFORE UPDATE ON delivery_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ADVANCED CONSTRAINTS AND BUSINESS RULES
-- Ensure site managers are actually managers
ALTER TABLE sites ADD CONSTRAINT check_site_manager_role CHECK (
    site_manager_id IS NULL OR EXISTS (
        SELECT 1 FROM users WHERE user_id = sites.site_manager_id AND role IN ('admin', 'site_manager')
    )
);

-- Ensure safety officers have appropriate role
ALTER TABLE sites ADD CONSTRAINT check_safety_officer_role CHECK (
    safety_officer_id IS NULL OR EXISTS (
        SELECT 1 FROM users WHERE user_id = sites.safety_officer_id AND role IN ('admin', 'site_manager')
    )
);

-- Ensure clients can only be assigned to sites in their company
ALTER TABLE client_assignments ADD CONSTRAINT check_client_company_match CHECK (
    EXISTS (
        SELECT 1 FROM sites s JOIN users u ON u.user_id = client_assignments.client_id
        WHERE s.site_id = client_assignments.site_id AND s.company_id = u.company_id
    )
);

-- Ensure workers are assigned to sites in their company
ALTER TABLE site_assignments ADD CONSTRAINT check_assignment_company_match CHECK (
    EXISTS (
        SELECT 1 FROM sites s JOIN users u ON u.user_id = site_assignments.user_id
        WHERE s.site_id = site_assignments.site_id AND s.company_id = u.company_id
    )
);

-- Ensure daily reports are for assigned sites
ALTER TABLE daily_reports ADD CONSTRAINT check_daily_report_assignment CHECK (
    EXISTS (
        SELECT 1 FROM site_assignments sa
        WHERE sa.site_id = daily_reports.site_id AND sa.user_id = daily_reports.user_id
        AND sa.is_active = TRUE
        AND (sa.end_date IS NULL OR sa.end_date >= daily_reports.report_date)
        AND sa.assignment_date <= daily_reports.report_date
    )
);

-- VIEWS FOR COMMON QUERIES
-- Active site assignments with user details
CREATE VIEW active_site_assignments AS
SELECT
    sa.assignment_id,
    sa.site_id,
    s.site_name,
    sa.user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.role as user_role,
    sa.site_role,
    sa.assignment_date,
    sa.hourly_rate
FROM site_assignments sa
JOIN sites s ON s.site_id = sa.site_id
JOIN users u ON u.user_id = sa.user_id
WHERE sa.is_active = TRUE
AND sa.end_date IS NULL
AND u.is_active = TRUE
AND s.site_status IN ('planning', 'active');

-- Current tool locations
CREATE VIEW current_tool_locations AS
SELECT
    t.tool_id,
    t.tool_name,
    t.tool_type,
    t.tool_code,
    ta.site_id,
    s.site_name,
    ta.assigned_to_user_id,
    CONCAT(u.first_name, ' ', u.last_name) as assigned_to_name,
    ta.assignment_date
FROM tools t
LEFT JOIN tool_assignments ta ON ta.tool_id = t.tool_id AND ta.is_active = TRUE
LEFT JOIN sites s ON s.site_id = ta.site_id
LEFT JOIN users u ON u.user_id = ta.assigned_to_user_id
WHERE t.is_active = TRUE;

-- Overdue reports summary
CREATE VIEW overdue_reports AS
SELECT
    'daily' as report_type,
    s.site_id,
    s.site_name,
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as worker_name,
    CURRENT_DATE - 1 as expected_date,
    'Daily report missing' as status
FROM sites s
JOIN site_assignments sa ON sa.site_id = s.site_id
JOIN users u ON u.user_id = sa.user_id
WHERE s.site_status = 'active'
AND sa.is_active = TRUE
AND sa.end_date IS NULL
AND u.role IN ('worker', 'site_manager')
AND NOT EXISTS (
    SELECT 1 FROM daily_reports dr
    WHERE dr.site_id = s.site_id AND dr.user_id = u.user_id AND dr.report_date = CURRENT_DATE - 1
);

-- COMMENTS FOR DOCUMENTATION
COMMENT ON TABLE companies IS 'Construction companies using the Site Tasker platform with subscription management';
COMMENT ON TABLE subscriptions IS 'SaaS subscription billing information linked to payment providers';
COMMENT ON TABLE users IS 'All users in the system: admins, site managers, workers, and clients with enhanced profile data';
COMMENT ON TABLE sites IS 'Construction job sites with GPS coordinates and enhanced project tracking';
COMMENT ON TABLE client_assignments IS 'Many-to-many relationship between sites and clients with access control';
COMMENT ON TABLE site_assignments IS 'Assignment of workers and managers to specific sites with role-based permissions';
COMMENT ON TABLE inductions IS 'WHS training and induction programs for compliance tracking';
COMMENT ON TABLE user_inductions IS 'Individual completion tracking for induction programs with renewal support';
COMMENT ON TABLE daily_reports IS 'Enhanced daily work reports with time tracking and approval workflow';
COMMENT ON TABLE weekly_reports IS 'Comprehensive weekly summaries with client communication features';
COMMENT ON TABLE whs_reports IS 'Detailed health and safety reports with metrics and compliance tracking';
COMMENT ON TABLE report_photos IS 'Photos attached to reports with GPS location and approval status';
COMMENT ON TABLE site_documents IS 'Version-controlled document storage with expiry tracking';
COMMENT ON TABLE document_permissions IS 'Role-based access control for sensitive site documents';
COMMENT ON TABLE messages IS 'In-app messaging system with threading and broadcast capabilities';
COMMENT ON TABLE message_recipients IS 'Recipient tracking for broadcast messages with delivery confirmation';
COMMENT ON TABLE leave_requests IS 'Enhanced leave management with site impact tracking and replacement planning';
COMMENT ON TABLE tools IS 'Comprehensive tool and equipment inventory with maintenance scheduling';
COMMENT ON TABLE tool_assignments IS 'Tool allocation tracking with condition monitoring and damage reporting';
COMMENT ON TABLE delivery_requests IS 'Vehicle and equipment delivery scheduling with cost tracking';
COMMENT ON TABLE site_progress_updates IS 'Enhanced progress tracking with weather delays and cost impact analysis';
COMMENT ON TABLE user_activity_logs IS 'Comprehensive audit trail for all user actions with session tracking';
COMMENT ON TABLE notifications IS 'Multi-channel notification system with priority levels and expiration';

-- Performance optimization: Partial indexes for common filtered queries
CREATE INDEX idx_users_active_workers ON users(company_id, user_id)
WHERE is_active = TRUE AND role = 'worker';

CREATE INDEX idx_sites_active_with_manager ON sites(company_id, site_manager_id)
WHERE site_status IN ('planning', 'active') AND site_manager_id IS NOT NULL;

CREATE INDEX idx_daily_reports_pending_approval ON daily_reports(site_id, submitted_at)
WHERE is_submitted = TRUE AND approved_by_user_id IS NULL;

CREATE INDEX idx_tools_needs_maintenance ON tools(company_id, maintenance_due_date)
WHERE is_active = TRUE AND maintenance_due_date <= CURRENT_DATE + INTERVAL '30 days';

CREATE INDEX idx_inductions_expiring_soon ON user_inductions(user_id, expires_at)
WHERE status = 'completed' AND expires_at <= CURRENT_DATE + INTERVAL '30 days';

-- Final schema validation
DO $$
BEGIN
    RAISE NOTICE 'Site Tasker Enhanced Database Schema Created Successfully';
    RAISE NOTICE 'Total Tables: %', (
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    );
    RAISE NOTICE 'Total Indexes: %', (
        SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'
    );
    RAISE NOTICE 'Total Constraints: %', (
        SELECT COUNT(*) FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
    );
END $$;