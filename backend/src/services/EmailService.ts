import sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      console.log('✅ SendGrid configured successfully');
    } else {
      console.log('⚠️  SendGrid API key not found - emails will not be sent');
    }
  }

  /**
   * Check if email service is properly configured
   */
  public isReady(): boolean {
    return this.isConfigured && process.env.SEND_EMAILS === 'true';
  }

  /**
   * Send an email using SendGrid
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.isReady()) {
      console.log(`[EMAIL] Service not ready - would send email to ${options.to}: ${options.subject}`);
      return;
    }

    try {
      const msg = {
        to: options.to,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@sitetasker.com',
          name: process.env.SENDGRID_FROM_NAME || 'Site Tasker'
        },
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      };

      const response = await sgMail.send(msg);
      console.log(`✅ Email sent successfully to ${options.to} - Status: ${response[0].statusCode}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send OTP verification email
   */
  public async sendOTPEmail(email: string, otpCode: string, type: 'email_verification' | 'password_reset' | 'two_factor'): Promise<void> {
    const subject = this.getEmailSubject(type);
    const html = this.createOTPEmailTemplate(otpCode, type);

    await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  /**
   * Send welcome email after successful verification
   */
  public async sendWelcomeEmail(email: string, firstName: string, companyName: string): Promise<void> {
    const subject = 'Welcome to Site Tasker!';
    const html = this.createWelcomeEmailTemplate(firstName, companyName);

    await this.sendEmail({
      to: email,
      subject,
      html
    });
  }

  /**
   * Get email subject based on OTP type
   */
  private getEmailSubject(type: string): string {
    switch (type) {
      case 'email_verification':
        return 'Verify Your Email - Site Tasker';
      case 'password_reset':
        return 'Reset Your Password - Site Tasker';
      case 'two_factor':
        return 'Two-Factor Authentication - Site Tasker';
      default:
        return 'Verification Code - Site Tasker';
    }
  }

  /**
   * Create professional OTP email template matching frontend design
   */
  private createOTPEmailTemplate(otpCode: string, type: string): string {
    const { title, message, actionText } = this.getEmailContent(type);
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Tasker - ${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #111827;
          background-color: #f9fafb;
        }
        
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .logo-icon {
          width: 48px;
          height: 48px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        
        .logo-text {
          font-size: 28px;
          font-weight: bold;
          color: white;
        }
        
        .header-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .email-content {
          padding: 40px 30px;
        }
        
        .content-title {
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .content-message {
          font-size: 16px;
          color: #4b5563;
          text-align: center;
          margin-bottom: 32px;
          line-height: 1.8;
        }
        
        .otp-container {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 2px solid #2563eb;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
        }
        
        .otp-label {
          font-size: 14px;
          font-weight: 600;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        
        .otp-code {
          font-size: 42px;
          font-weight: bold;
          color: #1d4ed8;
          letter-spacing: 8px;
          font-family: 'Courier New', Monaco, monospace;
          margin-bottom: 16px;
        }
        
        .otp-expiry {
          font-size: 14px;
          color: #6b7280;
        }
        
        .security-notice {
          background-color: #f9fafb;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 32px 0;
          border-radius: 8px;
        }
        
        .security-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        
        .security-text {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }
        
        .email-footer {
          background-color: #f9fafb;
          padding: 32px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }
        
        .footer-links {
          margin-top: 20px;
        }
        
        .footer-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
          margin: 0 12px;
        }
        
        .footer-link:hover {
          text-decoration: underline;
        }
        
        .company-info {
          margin-top: 24px;
          font-size: 12px;
          color: #9ca3af;
        }
        
        @media only screen and (max-width: 600px) {
          .email-content {
            padding: 30px 20px;
          }
          
          .otp-container {
            padding: 24px;
          }
          
          .otp-code {
            font-size: 32px;
            letter-spacing: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="email-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text">Site Tasker</div>
          </div>
          <div class="header-title">${title}</div>
          <div class="header-subtitle">Construction Management System</div>
        </div>
        
        <!-- Content -->
        <div class="email-content">
          <h2 class="content-title">${actionText}</h2>
          <p class="content-message">${message}</p>
          
          <!-- OTP Code -->
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otpCode}</div>
            <div class="otp-expiry">This code expires in 10 minutes</div>
          </div>
          
          <!-- Security Notice -->
          <div class="security-notice">
            <div class="security-title">🔒 Security Notice</div>
            <div class="security-text">
              • Never share this code with anyone<br>
              • Site Tasker will never ask for this code via phone or email<br>
              • If you didn't request this code, please ignore this email
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
          <p class="footer-text">
            Need help? Contact our support team
          </p>
          <div class="footer-links">
            <a href="mailto:support@sitetasker.com" class="footer-link">Support</a>
            <a href="https://sitetasker.com/help" class="footer-link">Help Center</a>
            <a href="https://sitetasker.com/privacy" class="footer-link">Privacy Policy</a>
          </div>
          <div class="company-info">
            © 2024 Site Tasker. Construction Management System.<br>
            This email was sent to verify your account. Please do not reply to this email.
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }

  /**
   * Create welcome email template
   */
  private createWelcomeEmailTemplate(firstName: string, companyName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Site Tasker!</title>
      <style>
        /* Same base styles as OTP email */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111827; background-color: #f9fafb; }
        .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .email-header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 30px; text-align: center; color: white; }
        .logo-container { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .logo-icon { width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 12px; }
        .logo-text { font-size: 28px; font-weight: bold; color: white; }
        .header-title { font-size: 24px; font-weight: 600; margin-bottom: 8px; }
        .email-content { padding: 40px 30px; }
        .welcome-message { font-size: 18px; color: #374151; text-align: center; margin-bottom: 32px; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 32px 0; }
        .feature-item { text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 12px; }
        .feature-icon { font-size: 32px; margin-bottom: 12px; }
        .feature-title { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: #6b7280; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 24px 0; }
        .email-footer { background-color: #f9fafb; padding: 32px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 14px; color: #6b7280; }
        @media only screen and (max-width: 600px) { .feature-grid { grid-template-columns: 1fr; } }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-header">
          <div class="logo-container">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text">Site Tasker</div>
          </div>
          <div class="header-title">Welcome to Site Tasker!</div>
        </div>
        
        <div class="email-content">
          <p class="welcome-message">
            Hi ${firstName},<br><br>
            Congratulations! Your Site Tasker account for <strong>${companyName}</strong> has been successfully created and verified. 
            You're now ready to streamline your construction project management!
          </p>
          
          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <div class="feature-title">Project Management</div>
              <div class="feature-desc">Track timelines, milestones, and progress</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <div class="feature-title">Team Collaboration</div>
              <div class="feature-desc">Manage workers and site managers</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📸</div>
              <div class="feature-title">Photo Reports</div>
              <div class="feature-desc">Daily photo uploads and documentation</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <div class="feature-title">Mobile Ready</div>
              <div class="feature-desc">Access from any device, anywhere</div>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="https://sitetasker.com/dashboard" class="cta-button">
              Get Started →
            </a>
          </div>
        </div>
        
        <div class="email-footer">
          <p class="footer-text">
            © 2024 Site Tasker. Construction Management System.<br>
            Need help getting started? Contact us at support@sitetasker.com
          </p>
        </div>
      </div>
    </body>
    </html>`;
  }

  /**
   * Get email content based on OTP type
   */
  private getEmailContent(type: string) {
    switch (type) {
      case 'email_verification':
        return {
          title: 'Email Verification Required',
          actionText: 'Verify Your Email Address',
          message: 'Please use the verification code below to complete your Site Tasker account setup. This code will expire in 10 minutes for your security.'
        };
      case 'password_reset':
        return {
          title: 'Password Reset Request',
          actionText: 'Reset Your Password',
          message: 'You requested to reset your password. Please use the verification code below to continue with the password reset process.'
        };
      case 'two_factor':
        return {
          title: 'Two-Factor Authentication',
          actionText: 'Complete Your Login',
          message: 'Please use the verification code below to complete your two-factor authentication and secure access to your account.'
        };
      default:
        return {
          title: 'Verification Required',
          actionText: 'Verify Your Action',
          message: 'Please use the verification code below to complete your request.'
        };
    }
  }

  /**
   * Strip HTML tags for plain text version
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

export const emailService = new EmailService();