"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Site Tasker API',
            version: '1.0.0',
            description: 'Construction Management API for Site Tasker application',
            contact: {
                name: 'Site Tasker Support',
                email: 'support@site-tasker.com'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.site-tasker.com'
                    : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique user identifier'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        firstName: {
                            type: 'string',
                            description: 'User first name'
                        },
                        lastName: {
                            type: 'string',
                            description: 'User last name'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'site_manager', 'worker', 'client'],
                            description: 'User role in the system'
                        },
                        companyId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Company identifier'
                        },
                        companyName: {
                            type: 'string',
                            description: 'Company name'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Whether user account is active'
                        }
                    }
                },
                Company: {
                    type: 'object',
                    properties: {
                        companyId: {
                            type: 'string',
                            format: 'uuid'
                        },
                        companyName: {
                            type: 'string'
                        },
                        companyEmail: {
                            type: 'string',
                            format: 'email'
                        },
                        subscriptionTier: {
                            type: 'string',
                            enum: ['free', 'standard', 'plus', 'enterprise']
                        },
                        isActive: {
                            type: 'boolean'
                        }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    $ref: '#/components/schemas/User'
                                },
                                accessToken: {
                                    type: 'string',
                                    description: 'JWT access token'
                                }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string'
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Authentication and user management endpoints'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Companies',
                description: 'Company management endpoints'
            },
            {
                name: 'Sites',
                description: 'Site management endpoints'
            },
            {
                name: 'Reports',
                description: 'Daily and weekly report endpoints'
            }
        ]
    },
    apis: [
        './src/controllers/AuthController.ts'
    ]
};
const specs = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Site Tasker API Documentation'
    }));
    // Make the swagger spec available as JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};
exports.setupSwagger = setupSwagger;
