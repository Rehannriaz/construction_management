# CLAUDE Instructions - Site Tasker Construction Management Software

## Project Files Reference
- **Claude Code Instructions**: See `CLAUDE.md` for development commands and current project status
- **Database Schema**: See `db-schema.sql` for complete PostgreSQL database structure

## Project Overview
Site Tasker is a construction project management software designed for small to medium-sized construction companies in the AUS/NZ region. The platform assists with project management, worker management, client management, and job management.

### Key Goals
- Create an MVP with modern, user-friendly UI suitable for sale to customers
- Target market: Small to medium construction companies
- Focus on user experience - must be easy for older, less tech-savvy users
- Daily reports and photo uploads should take less than 1 minute
- Competitive advantage: High customization capabilities and continuous improvement

## Technical Stack

### Current Implementation Status
**Frontend**: ✅ Implemented
- **Framework**: Next.js 15.4.2 with React 19 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion
- **Architecture**: App Router with grouped routes
  - `(landing)/` - Landing page routes
  - `(no-navbar)/` - Authentication pages
  - `(navbar)/` - Main application routes

**Backend**: 🚧 Planned (Not Yet Implemented)
- **Runtime**: Node.js
- **Architecture**: Controller-Service-Repository pattern
- **Status**: Only database schema exists, backend implementation pending

**Database**: ✅ Schema Ready
- **Database**: PostgreSQL with comprehensive schema
- **File**: `db-schema.sql` contains production-ready schema
- **Features**: Multi-tenant SaaS architecture, role-based access, audit trails

## User Hierarchy & Access Control

### Company Structure
1. **Admin/Owner** (Top Level)
   - Full system access
   - Manages all sites, workers, and site managers
   - Approves leave requests
   - Views all reports and analytics

2. **Site Manager** (Middle Level)
   - Manages assigned sites
   - Oversees workers on their sites
   - Creates weekly and WHS reports
   - Can view worker daily reports

3. **Worker** (Base Level)
   - Access only to assigned sites
   - Submits daily reports
   - Uploads photos
   - Applies for leave

4. **Client** (External - Post MVP)
   - View-only access to their project
   - See progress, photos, and reports

## Core Features for MVP

### Worker Portal
**Priority**: High - Must be extremely user-friendly

#### Features:
- **Dashboard**: Overview of assigned sites and pending tasks
- **Daily Reports**:
  - Site selection (multiple sites if worked split day)
  - Hours tracking per site
  - Work completed description
  - Challenges/Issues reporting
  - Next day planning
  - Photo upload (up to 30 photos)
- **My Sites**: List of assigned construction sites
- **Photos**: Gallery view of uploaded photos by site
- **Apply for Leave**: Leave request system

### Site Manager Portal
**Priority**: High - Feature-rich for sales appeal

#### Features:
- **Dashboard**: Site overview and notifications
- **Daily Reports**: Enhanced version with additional fields:
  - Weather conditions
  - Materials used
  - Sub-trades on site
  - Materials delivered
  - Site visitors
- **Weekly Reports**: Comprehensive site summary
- **WHS Reports**: Weekly health and safety documentation
- **Tool Tracker**: Company equipment location tracking
- **Delivery/Pickup Requests**: Company vehicle/equipment booking
- **Site Documents**: Storage for plans, contracts, WHS documents
- **Worker Report Review**: View and approve worker reports

### Admin/Owner Portal
**Priority**: High - Central management hub

#### Features:
- **Dashboard**: Company-wide overview and analytics
- **Site Management**: Create, assign, and track all sites
- **Site Assignments**: Assign workers and managers to sites
- **User Management**: Invite and manage all users
- **Reports Hub**: Access all daily/weekly reports
- **Worker Hours**: Payroll preparation and time tracking
- **Leave Management**: Approve/decline leave requests
- **Photo Management**: Site-organized photo galleries
- **Tool Tracker**: Company asset management
- **Site Progress**: Timeline and milestone tracking

## Technical Implementation Guidelines

### Backend Architecture (Node.js) - To Be Implemented

**Target Structure:**
```javascript
backend/src/
├── controllers/     # Handle HTTP requests/responses
├── services/       # Business logic
├── repositories/   # Database access layer
├── models/         # Data models/schemas
├── middleware/     # Auth, validation, error handling
├── routes/         # API route definitions
├── utils/          # Helper functions
└── config/         # Database, environment config
```

**Current Status**: Backend not implemented - only `db-schema.sql` exists

#### Key Controllers:
- `AuthController` - Login, registration, password management
- `UserController` - User CRUD operations
- `SiteController` - Site management
- `ReportController` - Daily/weekly/WHS reports
- `PhotoController` - Image upload and management
- `LeaveController` - Leave request management

#### Key Services:
- `UserService` - User business logic
- `SiteService` - Site assignment and management
- `ReportService` - Report generation and processing
- `NotificationService` - Email/in-app notifications
- `FileService` - Photo/document handling

### Database Schema Considerations

**Primary Schema File**: `db-schema.sql` (located in project root)

**Current Implementation**: Production-ready PostgreSQL schema with:
- Multi-tenant SaaS architecture with company isolation
- UUID-based primary keys for scalability
- Comprehensive indexes and constraints
- Role-based access control (admin, site_manager, worker, client)
- Complete construction management entities:
  - Site and project management with GPS tracking
  - Daily/weekly/WHS reporting systems
  - Tool and equipment tracking with assignments
  - Leave management workflows
  - In-app messaging and notifications
  - Document management with versioning
  - Activity logging and audit trails
  - Subscription and billing management

### Authentication & Security
- JWT-based authentication
- Role-based access control (RBAC)
- Route protection middleware
- Input validation and sanitization
- Secure file upload handling

### File Storage Strategy
- **MVP**: Supabase buckets (1GB free tier) - Not yet implemented
- **Future**: Migrate to Amazon S3 for scalability
- **Organization**: `company_id/site_id/date/photos/`
- **Features Needed**: Image optimization, compression, thumbnail generation

### Current Component Structure
```
frontend/src/
├── components/
│   ├── ui/           # shadcn/ui components (Button, Card, Input, etc.)
│   ├── landing/      # Landing page components
│   └── login/        # Authentication components (UI only)
├── app/
│   ├── (landing)/    # Landing page routes
│   ├── (no-navbar)/ # Auth pages (login, signup)
│   └── (navbar)/    # Main application routes
└── lib/             # Utility functions
```

## UI/UX Requirements

### Design Principles
- **Mobile-first**: Many workers will use phones
- **Simplicity**: Large buttons, clear navigation
- **Speed**: Quick access to daily reporting
- **Visual feedback**: Clear success/error states
- **Offline capability**: Consider for photo uploads

### Key UI Components
- **Photo Upload**: Drag-and-drop with preview
- **Site Selector**: Easy dropdown with search
- **Report Forms**: Step-by-step wizard approach
- **Dashboard Cards**: Visual overview of key metrics
- **Navigation**: Simple, icon-based menu

## Future Roadmap (Post-MVP)

### Phase 2 Features
- **In-app Messaging**: Real-time communication
- **Client Portal**: Project visibility for clients
- **Advanced Analytics**: Site performance metrics
- **Integration**: QuickBooks, Xero, payroll systems

### Phase 3 Features
- **AI Integration**: Report generation assistance
- **Plan Analysis**: AI-powered material estimation
- **Mobile App**: Native iOS/Android applications
- **Advanced Customization**: Custom features per client

## Development Priorities

### Current Status (Based on CLAUDE.md)
**✅ Completed:**
- Next.js 15.4.2 frontend with TypeScript
- shadcn/ui component library integration
- Basic routing structure with grouped routes
- Landing page and authentication UI (no backend integration)
- Production-ready PostgreSQL schema

**🚧 In Progress/Next Steps:**
1. **Backend API Implementation** (Priority 1)
   - Set up Node.js backend with Controller-Service-Repository pattern
   - Implement authentication system
   - Connect to PostgreSQL database
   - Create user management endpoints

2. **Frontend-Backend Integration** (Priority 2)
   - Connect authentication pages to backend
   - Implement protected routes
   - Add API client/state management

3. **Core Feature Implementation** (Priority 3)
   - Daily report system
   - Photo upload functionality
   - Dashboard implementation for each user role

## Success Metrics
- **User Adoption**: Daily active users per company
- **Report Completion**: Percentage of daily reports submitted
- **Time to Complete**: Average time for daily report submission
- **Customer Satisfaction**: Feedback scores and feature requests
- **Technical Performance**: Page load times, uptime

## Integration Considerations
- **Email Notifications**: For missing reports, leave approvals
- **SMS Alerts**: Critical updates (optional)
- **Payroll Systems**: Export hours for payroll processing
- **Cloud Storage**: Scalable file storage solution
- **Backup Strategy**: Regular database and file backups

---

## Important Notes for Development

1. **Project Status**: Frontend is implemented, backend needs to be built from scratch
2. **Database Schema**: Always refer to `db-schema.sql` - it's production-ready with comprehensive business rules
3. **Development Commands**: See `CLAUDE.md` for current npm scripts and development workflow
4. **Authentication**: Currently UI-only - backend integration is the next major milestone
5. **Design System**: Uses shadcn/ui with Tailwind CSS - maintain consistency with existing components
6. **User Experience First**: Every feature should prioritize ease of use for less tech-savvy construction workers
7. **Performance**: Fast loading is crucial for adoption
8. **Mobile-First**: Many users will access via phones on construction sites
9. **Australian Focus**: Designed for AUS/NZ construction industry (timezone, currency, regulations)
10. **Feedback Loop**: Plan for continuous improvement based on user feedback

This MVP should establish a strong foundation for a scalable, user-friendly construction management platform that can compete effectively in the AUS/NZ market.