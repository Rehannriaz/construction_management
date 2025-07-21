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
exports.Company = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../types/enums");
const User_1 = require("./User");
const Site_1 = require("./Site");
const Subscription_1 = require("./Subscription");
let Company = class Company {
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'company_id' }),
    __metadata("design:type", String)
], Company.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Company.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_email', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Company.prototype, "companyEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "companyPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "companyAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_abn', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "companyAbn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_logo_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "companyLogoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'subscription_tier',
        type: 'enum',
        enum: enums_1.SubscriptionTier,
        default: enums_1.SubscriptionTier.FREE
    }),
    __metadata("design:type", String)
], Company.prototype, "subscriptionTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_email', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "billingEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'timezone', type: 'varchar', length: 50, default: 'Australia/Sydney' }),
    __metadata("design:type", String)
], Company.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Company.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_ends_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Company.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.company),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Site_1.Site, (site) => site.company),
    __metadata("design:type", Array)
], Company.prototype, "sites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.Subscription, (subscription) => subscription.company),
    __metadata("design:type", Array)
], Company.prototype, "subscriptions", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'companies' })
], Company);
