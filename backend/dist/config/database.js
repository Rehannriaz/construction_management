"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Company_1 = require("../entities/Company");
const User_1 = require("../entities/User");
const RefreshToken_1 = require("../entities/RefreshToken");
const Subscription_1 = require("../entities/Subscription");
const Site_1 = require("../entities/Site");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Don't sync in production
    logging: process.env.NODE_ENV === 'development',
    entities: [
        Company_1.Company,
        User_1.User,
        RefreshToken_1.RefreshToken,
        Subscription_1.Subscription,
        Site_1.Site
    ],
    migrations: ['src/migrations/*.ts'],
    subscribers: ['src/subscribers/*.ts'],
});
// Initialize database connection
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('✅ Database connection established successfully');
    }
    catch (error) {
        console.error('❌ Error during database initialization:', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
