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
exports.Subscription = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../types/enums");
const Company_1 = require("./Company");
let Subscription = class Subscription {
};
exports.Subscription = Subscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'subscription_id' }),
    __metadata("design:type", String)
], Subscription.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id', type: 'uuid' }),
    __metadata("design:type", String)
], Subscription.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stripe_subscription_id', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Subscription.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plan_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Subscription.prototype, "planName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_interval', type: 'varchar', length: 20, default: 'monthly' }),
    __metadata("design:type", String)
], Subscription.prototype, "billingInterval", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_cents', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "amountCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', type: 'varchar', length: 3, default: 'AUD' }),
    __metadata("design:type", String)
], Subscription.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: enums_1.SubscriptionStatus }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_period_start', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_period_end', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_start', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trial_end', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "trialEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cancelled_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "cancelledAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Company_1.Company, (company) => company.subscriptions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", Company_1.Company)
], Subscription.prototype, "company", void 0);
exports.Subscription = Subscription = __decorate([
    (0, typeorm_1.Entity)({ schema: 'core', name: 'subscriptions' })
], Subscription);
