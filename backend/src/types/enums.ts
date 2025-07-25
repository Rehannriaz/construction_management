export enum UserRole {
  ADMIN = 'admin',
  SITE_MANAGER = 'site_manager',
  WORKER = 'worker',
  CLIENT = 'client'
}

export enum SiteRole {
  WORKER = 'worker',
  SITE_MANAGER = 'site_manager',
  SUPERVISOR = 'supervisor',
  SUBCONTRACTOR = 'subcontractor'
}

export enum SubscriptionTier {
  FREE = 'free',
  STANDARD = 'standard',
  PLUS = 'plus',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
  INCOMPLETE = 'incomplete'
}

export enum SiteStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export enum LeaveType {
  ANNUAL_LEAVE = 'annual_leave',
  SICK_LEAVE = 'sick_leave',
  PERSONAL_LEAVE = 'personal_leave',
  UNPAID_LEAVE = 'unpaid_leave'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum NotificationType {
  DAILY_REPORT_MISSING = 'daily_report_missing',
  LEAVE_REQUEST = 'leave_request',
  LEAVE_APPROVED = 'leave_approved',
  LEAVE_REJECTED = 'leave_rejected',
  DELIVERY_SCHEDULED = 'delivery_scheduled',
  TOOL_MAINTENANCE_DUE = 'tool_maintenance_due',
  MESSAGE_RECEIVED = 'message_received',
  INDUCTION_DUE = 'induction_due'
}

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REPORT_SUBMITTED = 'report_submitted',
  REPORT_APPROVED = 'report_approved',
  LEAVE_REQUESTED = 'leave_requested',
  LEAVE_APPROVED = 'leave_approved',
  LEAVE_REJECTED = 'leave_rejected',
  TOOL_ASSIGNED = 'tool_assigned',
  DOCUMENT_UPLOADED = 'document_uploaded',
  MESSAGE_SENT = 'message_sent',
  INDUCTION_COMPLETED = 'induction_completed'
}

export enum EntityType {
  DAILY_REPORT = 'daily_report',
  WEEKLY_REPORT = 'weekly_report',
  WHS_REPORT = 'whs_report',
  LEAVE_REQUEST = 'leave_request',
  DELIVERY_REQUEST = 'delivery_request',
  TOOL = 'tool',
  SITE = 'site',
  MESSAGE = 'message',
  INDUCTION = 'induction'
}

export enum ToolType {
  HAND_TOOL = 'hand_tool',
  POWER_TOOL = 'power_tool',
  HEAVY_MACHINERY = 'heavy_machinery',
  VEHICLE = 'vehicle',
  SAFETY_EQUIPMENT = 'safety_equipment'
}

export enum ConditionRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum DeliveryRequestType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  VEHICLE_REQUEST = 'vehicle_request'
}

export enum VehicleType {
  TIP_TRUCK = 'tip_truck',
  EXCAVATOR = 'excavator',
  CRANE = 'crane',
  FLATBED = 'flatbed',
  OTHER = 'other'
}

export enum DeliveryStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DocumentType {
  CONSTRUCTION_PLAN = 'construction_plan',
  WHS_PLAN = 'whs_plan',
  SUBCONTRACTOR_AGREEMENT = 'subcontractor_agreement',
  PERMIT = 'permit',
  INDUCTION_MATERIAL = 'induction_material',
  OTHER = 'other'
}

export enum SafetyRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum MilestoneType {
  FOUNDATION = 'foundation',
  FRAMING = 'framing',
  ROOFING = 'roofing',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  FINISHING = 'finishing',
  HANDOVER = 'handover'
}

export enum InductionType {
  SAFETY_INDUCTION = 'safety_induction',
  SITE_SPECIFIC = 'site_specific',
  EQUIPMENT_TRAINING = 'equipment_training',
  WHS_TRAINING = 'whs_training',
  EMERGENCY_PROCEDURES = 'emergency_procedures'
}

export enum InductionStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired'
}

export enum WeatherDelayReason {
  RAIN = 'rain',
  EXTREME_HEAT = 'extreme_heat',
  WIND = 'wind',
  STORM = 'storm',
  FLOODING = 'flooding',
  OTHER = 'other'
}