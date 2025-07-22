# OTP (One-Time Password) Implementation

This document outlines the complete OTP verification system implemented for Site Tasker's email verification during signup.

## Overview

The OTP system has been implemented to verify user email addresses during the registration process. Instead of directly activating users after signup, the system now:

1. Creates user account in inactive state
2. Generates and sends 6-digit OTP code
3. Requires email verification before account activation
4. Provides secure token-based authentication after successful verification

## Backend Implementation

### Database Schema

A new `otps` table has been created with the following structure:

```sql
CREATE TABLE core.otps (
  otp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES core.users(user_id),
  otp_code VARCHAR(10) NOT NULL,
  type otp_type NOT NULL, -- 'email_verification', 'password_reset', 'two_factor'
  status otp_status NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'expired', 'failed'
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### New Entities

- **OTP Entity** (`src/entities/OTP.ts`): TypeORM entity with enums for OTP types and statuses
- **OTPService** (`src/services/OTPService.ts`): Complete service for OTP management
- **Updated AuthService** (`src/services/AuthService.ts`): Modified signup flow and added OTP verification

### API Endpoints

#### 1. POST `/auth/signup` (Modified)
- Creates user account in inactive state
- Generates OTP and sends email (if enabled)
- Returns signup success with OTP requirement flag

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "ABC Construction",
  "companyEmail": "contact@abc.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification code.",
  "data": {
    "email": "user@example.com",
    "requiresOTP": true
  }
}
```

#### 2. POST `/auth/verify-otp` (New)
- Verifies OTP code and activates user account
- Returns JWT tokens for immediate login

**Request:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account verified successfully",
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "companyId": "uuid",
      "companyName": "ABC Construction",
      "isActive": true
    },
    "accessToken": "jwt_token_here"
  }
}
```

#### 3. POST `/auth/resend-otp` (New)
- Resends OTP to user's email
- Invalidates previous pending OTPs

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP has been resent to your email address."
}
```

### Environment Configuration

Add these environment variables to control OTP behavior:

```env
# OTP Configuration
SEND_EMAILS=false          # Enable/disable actual email sending
STATIC_OTP=123456         # Static OTP for development (when SEND_EMAILS=false)

# SendGrid Configuration (for production)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@sitetasker.com
SENDGRID_FROM_NAME=Site Tasker
```

### OTP Features

- **6-digit numeric codes** generated randomly (or static for development)
- **10-minute expiration** time
- **Maximum 5 verification attempts** per OTP
- **Email templates** with professional styling
- **Automatic cleanup** of expired OTPs
- **Security features**: Rate limiting, attempt tracking, token validation

## Frontend Implementation

### New Page

**Verify OTP Page** (`/verify-otp`): Modern, responsive OTP verification form with:
- 6-digit input fields with auto-focus and paste support
- Real-time validation and error handling
- Resend functionality with 60-second cooldown timer
- Loading states and success animations
- Automatic redirect after successful verification

### Updated Services

**Auth Service** (`src/services/auth.service.ts`):
- Updated `signUp()` to return OTP requirement instead of tokens
- Added `verifyOTP()` method for email verification
- Added `resendOTP()` method for code resending

### Updated Hooks

**Auth Hooks** (`src/hooks/api/use-auth.ts`):
- Modified `useSignUp` to redirect to OTP page
- Added `useVerifyOTP` hook for verification
- Added `useResendOTP` hook for resending codes
- Integrated with React Query for optimal caching and error handling

### User Flow

1. **Signup**: User fills registration form → redirected to OTP verification page
2. **Verification**: User enters 6-digit code → account activated and logged in automatically
3. **Resend**: If needed, user can request new code after 60-second cooldown
4. **Error Handling**: Clear feedback for invalid codes, expired tokens, etc.

## Security Features

### Backend Security
- **Automatic OTP expiration** (10 minutes)
- **Attempt limiting** (max 5 attempts per OTP)
- **Token invalidation** on successful verification
- **Database cleanup** of expired OTPs
- **Input validation** on all endpoints

### Frontend Security
- **No sensitive data storage** in localStorage during OTP flow
- **Automatic form clearing** on errors
- **Rate limiting** through backend integration
- **Secure redirect** handling

## Email System

### SendGrid Integration
- **Professional Email Templates**: Responsive HTML emails matching frontend design
- **Brand Consistency**: Uses Site Tasker colors (#2563eb primary blue, #1d4ed8 dark blue)
- **Mobile Responsive**: Optimized for all device types
- **Security Features**: Clear security notices and expiration warnings

### Email Types
1. **OTP Verification Email**: Sent during signup with 6-digit code
2. **Welcome Email**: Sent after successful verification with feature overview
3. **Password Reset**: (Future) Password reset codes
4. **Two-Factor Authentication**: (Future) 2FA codes

### Email Templates Feature:
- **Professional Header**: Site Tasker branding with gradient background
- **Clear OTP Display**: Large, monospace font with visual emphasis
- **Security Warnings**: Prominent security notices
- **Company Footer**: Professional footer with links and contact info
- **Responsive Design**: Mobile-first approach with media queries

## Development vs Production

### Development Mode (`SEND_EMAILS=false`)
- Uses static OTP code from environment (`STATIC_OTP=123456`)
- Logs OTP codes to console for testing
- Email templates are loaded but not sent
- Perfect for development and testing

### Production Mode (`SEND_EMAILS=true`)
- Generates random 6-digit codes
- Sends professional HTML emails via SendGrid
- Full security and rate limiting active
- Welcome emails sent after successful verification

## Database Migration

Run the migration script to create the OTP table:

```sql
-- Run migrations/001_create_otp_table.sql
psql -d site_tasker -f migrations/001_create_otp_table.sql
```

## Testing

### Manual Testing Steps

1. **Signup Flow**:
   - Register with valid details
   - Verify redirect to OTP page with email in URL
   - Check console/email for OTP code

2. **Verification Flow**:
   - Enter correct OTP → should redirect to dashboard
   - Enter incorrect OTP → should show error and clear fields
   - Test paste functionality with 6-digit codes

3. **Resend Flow**:
   - Wait for timer to expire
   - Click resend → should reset timer and send new code
   - Verify old codes are invalidated

### Error Scenarios
- Expired OTP codes
- Maximum attempts reached
- Invalid email addresses
- Network errors
- Non-existent users

## Future Enhancements

1. **SMS OTP Support**: Extend system to support SMS verification
2. **Two-Factor Authentication**: Use OTP system for 2FA during login
3. **Password Reset**: Integrate OTP verification for password resets
4. **Rate Limiting**: Add IP-based rate limiting for OTP requests
5. **Analytics**: Track OTP success/failure rates for improvements

## Files Modified/Created

### Backend Files
- `src/entities/OTP.ts` (NEW)
- `src/services/OTPService.ts` (NEW)
- `src/services/EmailService.ts` (NEW)
- `src/services/AuthService.ts` (MODIFIED)
- `src/controllers/AuthController.ts` (MODIFIED)
- `src/routes/auth.ts` (MODIFIED)
- `src/middleware/validations/authValidations.ts` (MODIFIED)
- `src/config/database.ts` (MODIFIED)
- `migrations/001_create_otp_table.sql` (NEW)
- `.env.example` (MODIFIED)

### Frontend Files
- `src/app/(no-navbar)/verify-otp/page.tsx` (NEW)
- `src/services/auth.service.ts` (MODIFIED)
- `src/hooks/api/use-auth.ts` (MODIFIED)

The implementation is now complete and ready for testing!