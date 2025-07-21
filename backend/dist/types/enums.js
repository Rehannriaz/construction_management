"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityType = exports.ActivityType = exports.NotificationType = exports.RequestStatus = exports.LeaveType = exports.ReportType = exports.SiteStatus = exports.SubscriptionStatus = exports.SubscriptionTier = exports.SiteRole = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["SITE_MANAGER"] = "site_manager";
    UserRole["WORKER"] = "worker";
    UserRole["CLIENT"] = "client";
})(UserRole || (exports.UserRole = UserRole = {}));
var SiteRole;
(function (SiteRole) {
    SiteRole["WORKER"] = "worker";
    SiteRole["SITE_MANAGER"] = "site_manager";
    SiteRole["SUPERVISOR"] = "supervisor";
    SiteRole["SUBCONTRACTOR"] = "subcontractor";
})(SiteRole || (exports.SiteRole = SiteRole = {}));
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["FREE"] = "free";
    SubscriptionTier["STANDARD"] = "standard";
    SubscriptionTier["PLUS"] = "plus";
    SubscriptionTier["ENTERPRISE"] = "enterprise";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["CANCELLED"] = "cancelled";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["INCOMPLETE"] = "incomplete";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var SiteStatus;
(function (SiteStatus) {
    SiteStatus["PLANNING"] = "planning";
    SiteStatus["ACTIVE"] = "active";
    SiteStatus["ON_HOLD"] = "on_hold";
    SiteStatus["COMPLETED"] = "completed";
    SiteStatus["CANCELLED"] = "cancelled";
})(SiteStatus || (exports.SiteStatus = SiteStatus = {}));
var ReportType;
(function (ReportType) {
    ReportType["DAILY"] = "daily";
    ReportType["WEEKLY"] = "weekly";
})(ReportType || (exports.ReportType = ReportType = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL_LEAVE"] = "annual_leave";
    LeaveType["SICK_LEAVE"] = "sick_leave";
    LeaveType["PERSONAL_LEAVE"] = "personal_leave";
    LeaveType["UNPAID_LEAVE"] = "unpaid_leave";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["DAILY_REPORT_MISSING"] = "daily_report_missing";
    NotificationType["LEAVE_REQUEST"] = "leave_request";
    NotificationType["LEAVE_APPROVED"] = "leave_approved";
    NotificationType["LEAVE_REJECTED"] = "leave_rejected";
    NotificationType["DELIVERY_SCHEDULED"] = "delivery_scheduled";
    NotificationType["TOOL_MAINTENANCE_DUE"] = "tool_maintenance_due";
    NotificationType["MESSAGE_RECEIVED"] = "message_received";
    NotificationType["INDUCTION_DUE"] = "induction_due";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["LOGIN"] = "login";
    ActivityType["LOGOUT"] = "logout";
    ActivityType["REPORT_SUBMITTED"] = "report_submitted";
    ActivityType["REPORT_APPROVED"] = "report_approved";
    ActivityType["LEAVE_REQUESTED"] = "leave_requested";
    ActivityType["LEAVE_APPROVED"] = "leave_approved";
    ActivityType["LEAVE_REJECTED"] = "leave_rejected";
    ActivityType["TOOL_ASSIGNED"] = "tool_assigned";
    ActivityType["DOCUMENT_UPLOADED"] = "document_uploaded";
    ActivityType["MESSAGE_SENT"] = "message_sent";
    ActivityType["INDUCTION_COMPLETED"] = "induction_completed";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var EntityType;
(function (EntityType) {
    EntityType["DAILY_REPORT"] = "daily_report";
    EntityType["WEEKLY_REPORT"] = "weekly_report";
    EntityType["WHS_REPORT"] = "whs_report";
    EntityType["LEAVE_REQUEST"] = "leave_request";
    EntityType["DELIVERY_REQUEST"] = "delivery_request";
    EntityType["TOOL"] = "tool";
    EntityType["SITE"] = "site";
    EntityType["MESSAGE"] = "message";
    EntityType["INDUCTION"] = "induction";
})(EntityType || (exports.EntityType = EntityType = {}));
