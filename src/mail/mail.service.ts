import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    // Generic SMTP config (Resend, Brevo, Microsoft 365, Gmail, etc.).
    const host = this.config.get<string>('MAIL_HOST') || 'smtp.zoho.com';
    const port = parseInt(this.config.get<string>('MAIL_PORT') || '465', 10);
    const secure = (this.config.get<string>('MAIL_SECURE') ?? 'true') === 'true';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  // Sender + admin inbox. MAIL_FROM is needed when the SMTP username isn't an
  // email address (e.g. Resend uses the literal username "resend").
  private get fromAddress(): string {
    return this.config.get<string>('MAIL_FROM') || this.config.get<string>('MAIL_USER') || '';
  }

  async sendLeadNotification(opts: {
    type: 'facility' | 'partner';
    name: string;
    email: string;
    phone: string;
  }): Promise<void> {
    const adminEmail = this.fromAddress;
    const label = opts.type === 'facility' ? 'Facility / RAL Home' : 'Founding Partner';

    try {
      await this.transporter.sendMail({
        from: `"RAL Connect" <${adminEmail}>`,
        to: adminEmail,
        subject: `New ${label} Lead: ${opts.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #E2E8F0;border-radius:12px;">
            <h2 style="color:#09488B;margin:0 0 16px">New ${label} Lead</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#64748B;width:120px">Name</td><td style="padding:8px 0;font-weight:600;color:#0F172A">${opts.name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748B">Email</td><td style="padding:8px 0;font-weight:600;color:#0F172A">${opts.email}</td></tr>
              <tr><td style="padding:8px 0;color:#64748B">Phone</td><td style="padding:8px 0;font-weight:600;color:#0F172A">${opts.phone || 'N/A'}</td></tr>
            </table>
            <p style="margin:16px 0 0;font-size:13px;color:#94A3B8;">Review this lead in your RAL Connect admin dashboard.</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send lead notification email', err);
    }
  }

  async sendAvailabilityBroadcast(opts: {
    to: string;
    recipientName: string;
    requestId: string;
    preferredArea: string;
    careTypes: string[];
    paymentType: string;
    moveTimeline: string;
    landingUrl: string;
  }): Promise<void> {
    const adminEmail = this.fromAddress;
    const base = opts.landingUrl.replace(/\/$/, '');
    const interestedUrl = `${base}/respond?requestId=${opts.requestId}&action=interested`;
    const moreInfoUrl   = `${base}/respond?requestId=${opts.requestId}&action=more_info`;
    const noUrl         = `${base}/respond?requestId=${opts.requestId}&action=not_interested`;

    const careList = opts.careTypes.join(', ') || 'Not specified';
    const subjectArea = opts.preferredArea;

    try {
      await this.transporter.sendMail({
        from: `"RAL Connect" <${adminEmail}>`,
        to: opts.to,
        subject: `${opts.moveTimeline === 'Immediate' ? 'Immediate ' : ''}RAL Availability Request — ${subjectArea} Area`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
            <div style="background:#09488B;padding:24px 28px;">
              <p style="margin:0;color:#ffffff;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">RAL Connect</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">RAL Availability Request</h1>
            </div>

            <div style="padding:28px;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Hi ${opts.recipientName},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#0F172A;line-height:1.6;">A discharge planner or family is looking for RAL availability. Please review the details below and respond <strong>only if you currently have availability and believe you may be a fit.</strong></p>
              <p style="margin:0 0 24px;font-size:13px;color:#475569;line-height:1.6;">If you click Interested, you'll enter your contact details. We email them to the requester, and you'll see the requester's contact details right away. If you click Not Interested, nothing is shared.</p>

              <table style="width:100%;border-collapse:collapse;background:#F8FAFC;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;width:160px;border-bottom:1px solid #E2E8F0;">Preferred Area</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:1px solid #E2E8F0;">${opts.preferredArea}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;border-bottom:1px solid #E2E8F0;">Care Type</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:1px solid #E2E8F0;">${careList}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;border-bottom:1px solid #E2E8F0;">Payment</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:1px solid #E2E8F0;">${opts.paymentType}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;">Move Timeline</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;">${opts.moveTimeline}</td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#0F172A;">Please click one of the options below:</p>

              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:0 6px 0 0;">
                    <a href="${interestedUrl}" style="display:block;background:#09488B;color:#ffffff;text-align:center;padding:14px 10px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">
                      ✓ Interested
                    </a>
                  </td>
                  <td style="padding:0 3px;">
                    <a href="${moreInfoUrl}" style="display:block;background:#F0F7FF;color:#09488B;text-align:center;padding:14px 10px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1px solid #09488B40;">
                      ? Need More Info
                    </a>
                  </td>
                  <td style="padding:0 0 0 6px;">
                    <a href="${noUrl}" style="display:block;background:#F8FAFC;color:#64748B;text-align:center;padding:14px 10px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1px solid #E2E8F0;">
                      ✕ Not Interested
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:11px;color:#94A3B8;line-height:1.6;border-top:1px solid #E2E8F0;padding-top:20px;">
                This message was sent via RAL Connect — Arizona's RAL Availability Request Broadcast System.<br>
                No patient names, dates of birth, SSNs, or identifying medical information are included in this request.
              </p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send broadcast email to ${opts.to}`, err);
    }
  }

  async forwardInterestedResponse(opts: {
    plannerEmail: string;
    plannerName: string;
    requestArea: string;
    requestCareTypes: string[];
    facilityName: string;
    facilityContact: string;
    facilityPhone: string;
    facilityEmail: string;
    availableBedCount?: number;
    notes?: string;
  }): Promise<void> {
    const adminEmail = this.fromAddress;

    try {
      await this.transporter.sendMail({
        from: `"RAL Connect" <${adminEmail}>`,
        to: opts.plannerEmail,
        subject: `Facility Response: ${opts.facilityName} is Interested — ${opts.requestArea} Area`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
            <div style="background:#09488B;padding:24px 28px;">
              <p style="margin:0;color:#ffffff;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">RAL Connect</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">A Facility Has Responded</h1>
            </div>

            <div style="padding:28px;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Hi ${opts.plannerName},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#0F172A;line-height:1.6;">A RAL facility has responded to your availability request for the <strong>${opts.requestArea}</strong> area. Their details are below.</p>

              <div style="background:#E8F1FB;border-radius:8px;padding:6px 0;margin-bottom:24px;">
                <p style="margin:0;padding:6px 16px;font-size:11px;font-weight:700;color:#09488B;letter-spacing:1px;text-transform:uppercase;">Facility Response</p>
              </div>

              <table style="width:100%;border-collapse:collapse;background:#F8FAFC;border-radius:8px;overflow:hidden;margin-bottom:${opts.notes ? '20px' : '28px'};">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;width:160px;border-bottom:1px solid #E2E8F0;">Facility Name</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#0F172A;border-bottom:1px solid #E2E8F0;">${opts.facilityName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;border-bottom:1px solid #E2E8F0;">Contact Name</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:1px solid #E2E8F0;">${opts.facilityContact}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;border-bottom:1px solid #E2E8F0;">Phone</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:1px solid #E2E8F0;"><a href="tel:${opts.facilityPhone}" style="color:#09488B;text-decoration:none;">${opts.facilityPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;border-bottom:${opts.availableBedCount !== undefined ? '1px solid #E2E8F0' : 'none'};">Email</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0F172A;border-bottom:${opts.availableBedCount !== undefined ? '1px solid #E2E8F0' : 'none'};"><a href="mailto:${opts.facilityEmail}" style="color:#09488B;text-decoration:none;">${opts.facilityEmail}</a></td>
                </tr>
                ${opts.availableBedCount !== undefined ? `
                <tr>
                  <td style="padding:12px 16px;font-size:13px;color:#64748B;">Available Beds</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#09488B;">${opts.availableBedCount}</td>
                </tr>
                ` : ''}
              </table>

              ${opts.notes ? `
              <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px 16px;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;">Notes from Facility</p>
                <p style="margin:0;font-size:14px;color:#0F172A;line-height:1.6;">${opts.notes}</p>
              </div>
              ` : ''}

              <p style="margin:0;font-size:14px;color:#0F172A;">Please follow up with the facility directly at the contact information above.</p>

              <p style="margin:28px 0 0;font-size:11px;color:#94A3B8;line-height:1.6;border-top:1px solid #E2E8F0;padding-top:20px;">
                This message was sent via RAL Connect — Arizona's RAL Availability Request Broadcast System.
              </p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to forward interested response to ${opts.plannerEmail}`, err);
    }
  }

  async sendAccountApproved(opts: { to: string; name: string; loginUrl: string }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"RAL Connect" <${this.fromAddress}>`,
        to: opts.to,
        subject: 'Your RAL Connect account is approved',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #E2E8F0;border-radius:12px;">
            <h2 style="color:#09488B;margin:0 0 8px">You're approved</h2>
            <p style="color:#475569;font-size:14px;margin:0 0 24px">Hi ${opts.name}, the RAL Connect team has approved your account. You can now sign in with the email and password you chose when you signed up.</p>
            <a href="${opts.loginUrl}" style="display:inline-block;background:#09488B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Sign In</a>
            <p style="margin:20px 0 0;font-size:12px;color:#94A3B8;">Facility owners: after signing in, choose Update Availability to enter your open beds.</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send account approved email to ${opts.to}`, err);
    }
  }

  async sendAccountCredentials(opts: {
    to: string;
    name: string;
    tempPassword: string;
    loginUrl: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"RAL Connect" <${this.fromAddress}>`,
        to: opts.to,
        subject: 'Welcome to RAL Connect — Your Login Details',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #E2E8F0;border-radius:12px;">
            <h2 style="color:#09488B;margin:0 0 8px">Welcome to RAL Connect</h2>
            <p style="color:#475569;font-size:14px;margin:0 0 24px">Hi ${opts.name}, your account has been approved. Here are your login details:</p>
            <div style="background:#E8F1FB;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748B">Email</p>
              <p style="margin:0 0 16px;font-weight:700;color:#0F172A;font-size:15px">${opts.to}</p>
              <p style="margin:0 0 8px;font-size:13px;color:#64748B">Temporary Password</p>
              <p style="margin:0;font-weight:700;color:#09488B;font-size:18px;letter-spacing:2px">${opts.tempPassword}</p>
            </div>
            <a href="${opts.loginUrl}" style="display:inline-block;background:#09488B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Log In Now</a>
            <p style="margin:20px 0 0;font-size:12px;color:#94A3B8;">Please change your password after your first login.</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send account credentials email', err);
    }
  }
}
