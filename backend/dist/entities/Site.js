"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Site = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../types/enums");
const Company_1 = require("./Company");
const User_1 = require("./User");
let Site = class Site {
};
exports.Site = Site;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'site_id' }),
    __metadata("design:type", String)
], Site.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id', type: 'uuid' }),
    __metadata("design:type", String)
], Site.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Site.prototype, "siteName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "siteCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_address', type: 'text' }),
    __metadata("design:type", String)
], Site.prototype, "siteAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "siteDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Site.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Site.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Site.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_completion_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Site.prototype, "estimatedCompletionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_completion_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Site.prototype, "actualCompletionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'site_status',
        type: 'enum',
        enum: enums_1.SiteStatus,
        default: enums_1.SiteStatus.PLANNING
    }),
    __metadata("design:type", String)
], Site.prototype, "siteStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_value', type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Site.prototype, "siteValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contract_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "contractNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "emergencyContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meeting_point_coordinates', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "meetingPointCoordinates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'site_manager_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "siteManagerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'safety_officer_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Site.prototype, "safetyOfficerId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Site.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Site.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_1.Company, (company) => company.sites, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", Company_1.Company)
], Site.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'site_manager_id' }),
    __metadata("design:type", User_1.User)
], Site.prototype, "siteManager", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'safety_officer_id' }),
    __metadata("design:type", User_1.User)
], Site.prototype, "safetyOfficer", void 0);
exports.Site = Site = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'sites' })
], Site);
