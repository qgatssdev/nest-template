import { BaseEmailGenerator } from "./base-email-generator";

export interface PasswordResetData {
  friendlyName: string;
  otp: string;
  expiresInMinutes: number;
  expiryDisplay: string;
}

export class PasswordResetGenerator extends BaseEmailGenerator {
  generate(data: PasswordResetData): string {
    const content = `
      <!-- Greeting -->
      <p
        style="
          font-size: 14px;
          font-weight: 700;
          color: #001c1d;
          margin: 32px 0 20px 0;
        "
      >
        Hello ${data.friendlyName},
      </p>
      
      <!-- Main Message -->
      <p
        style="
          font-size: 14px;
          color: #001c1dc2;
          margin: 0 0 12px;
          line-height: 1.5;
          font-weight: 400;
        "
      >
        You requested to reset your password. To verify this request, please use the OTP code below.
      </p>
      
      <p
        style="
          font-size: 14px;
          color: #001c1dc2;
          margin: 0 0 25px;
          line-height: 1.5;
          font-weight: 400;
        "
      >
        This OTP is valid for ${data.expiresInMinutes} minutes (expires at ${data.expiryDisplay}).
      </p>

      <!-- OTP Code Display -->
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="margin: 25px 0"
      >
        <tr>
          <td
            style="
              background-color: #fef7e6;
              padding: 9px 30px;
              border-radius: 8px;
              text-align: center;
            "
          >
            <div
              style="
                font-size: 24px;
                font-weight: 700;
                color: #b8860b;
                letter-spacing: 8px;
                font-family: Arial, Helvetica, sans-serif;
              "
            >
                    ${data.otp}
            </div>
          </td>
        </tr>
      </table>

      <!-- Security Warning -->
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="margin-bottom: 25px"
      >
        <tr>
          <td
            style="
              background-color: #f5f7f67a;
              padding: 15px;
              border-radius: 12px;
              border: 0.8px solid #e1e5eb;
            "
          >
            <p
              style="
                font-size: 13px;
                color: #001c1d7a;
                margin: 0;
                line-height: 1.4;
                font-family: Arial, Helvetica, sans-serif;
              "
            >
              <span style="font-weight: 500; color: #013335"
                >BEWARE!</span
              >
              that your OTP should never be shared with anyone. Our
              staff will never request your password or OTP under any
              circumstances.
            </p>
          </td>
        </tr>
      </table>

      <!-- Transaction Note -->
      <div style="margin-bottom: 20px">
        <p
          style="
            font-size: 14px;
            font-weight: normal;
            color: #001c1dc2;
            margin: 0;
          "
        >
          If you didn't request a password reset, please ignore this email or contact our support team.
        </p>
      </div>

      <!-- Signature -->
      <div style="margin-bottom: 25px">
        <p
          style="
            font-size: 14px;
            font-weight: normal;
            color: #333;
            margin: 0;
          "
        >
          Best Regards,
        </p>
        <p
          style="
            font-size: 14px;
            color: #001c1d;
            margin: 0;
            font-weight: 600;
          "
        >
          The Yadsale Team
        </p>
      </div>
    `;

    const html = this.generateEmailStructure('Password Reset OTP', content);
    return html;
  }
}
