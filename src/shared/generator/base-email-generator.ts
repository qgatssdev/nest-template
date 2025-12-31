import { Config } from 'src/config';

export interface EmailGeneratorData {
  assetsBaseUrl: string;
  frontendUrl: string;
  currentYear: number;
}

export class BaseEmailGenerator {
  protected getBaseData(): EmailGeneratorData {
    return {
      assetsBaseUrl: `https://${Config.DIGITAL_OCEAN_SPACES_BUCKET}.${Config.DIGITAL_OCEAN_SPACES_CDN_ENDPOINT}`,
      frontendUrl: Config.FRONTEND_URL,
      currentYear: new Date().getFullYear(),
    };
  }

  protected getBaseStyles(assetsBaseUrl: string): string {
    return `
      @font-face {
        font-family: 'Satoshi';
        src: url('${assetsBaseUrl}/fonts/Satoshi-Bold.otf') format('opentype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Satoshi';
        src: url('${assetsBaseUrl}/fonts/Satoshi-Medium.otf') format('opentype');
        font-weight: 500;
        font-style: normal;
      }
      @font-face {
        font-family: 'Satoshi';
        src: url('${assetsBaseUrl}/fonts/Satoshi-Regular.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
      }
      body {
        font-family: 'Satoshi', Arial, sans-serif;
        color-scheme: light;
      }

      @media (prefers-color-scheme: dark) {
        body {
          background-color: #121212 !important;
        }
        p {
          color: #ffffff;
        }
      }
    `;
  }

  protected getHeader(assetsBaseUrl: string): string {
    return `
      <!-- Header -->
      <tr>
        <td style="padding: 20px 20px 0 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="left" valign="middle">
                <img
                  src="${assetsBaseUrl}/images/logo.png"
                  alt="Yadsale Logo"
                  width="120"
                  style="
                    display: block;
                    border: 0;
                    outline: none;
                    text-decoration: none;
                  "
                />
              </td>
              <td align="right" valign="middle" style="font-size: 0">
                <a
                  href="https://instagram.com/yadsalehq"
                  style="
                    display: inline-block;
                    margin-left: 8px;
                    text-decoration: none;
                  "
                  ><img
                    src="${assetsBaseUrl}/images/insta.png"
                    width="18"
                    height="18"
                    style="display: block; border: 0"
                /></a>
                <a
                  href="https://twitter.com/yadsale"
                  style="
                    display: inline-block;
                    margin-left: 8px;
                    text-decoration: none;
                  "
                  ><img
                    src="${assetsBaseUrl}/images/twitter.png"
                    width="18"
                    height="18"
                    style="display: block; border: 0"
                /></a>
                <a
                  href="#"
                  style="
                    display: inline-block;
                    margin-left: 8px;
                    text-decoration: none;
                  "
                  ><img
                    src="${assetsBaseUrl}/images/facebook.png"
                    width="18"
                    height="18"
                    style="display: block; border: 0"
                /></a>
                <a
                  href="https://tiktok.com/@yadsalehq"
                  style="
                    display: inline-block;
                    margin-left: 8px;
                    text-decoration: none;
                  "
                  ><img
                    src="${assetsBaseUrl}/images/tiktok.png"
                    width="18"
                    height="18"
                    style="display: block; border: 0"
                /></a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="height: 12px; line-height: 12px; font-size: 12px">
          &nbsp;
        </td>
      </tr>
    `;
  }

  protected getFooter(currentYear: number): string {
    return `
      <!-- Contact Info -->
      <tr>
        <td
          style="
            padding: 0 20px 20px 20px;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <p style="font-size: 12px; color: #001c1d7a; margin: 0 0 6px">
            Got any issues? Send us a message at
          </p>
          <a
            href="mailto:contact@yadsale.com"
            style="
              color: #009834;
              font-size: 12px;
              text-decoration: none;
              display: inline-block;
              margin-bottom: 8px;
            "
            >contact@yadsale.com</a
          >
          <div style="margin: 12px 0; font-size: 12px; color: #013335">
            <a
              href="#"
              style="color: #013335; text-decoration: none; margin: 0 5px"
              >Privacy Policy</a
            >
            <span style="color: #013335">|</span>
            <a
              href="#"
              style="color: #013335; text-decoration: none; margin: 0 5px"
              >Terms of Use</a
            >
            <span style="color: #013335">|</span>
            <span style="color: #001c1d7a; margin: 0 5px"
              >Copyright © ${currentYear}</span
            >
          </div>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td
          style="
            background-color: #0098340a;
            padding: 20px;
            text-align: center;
            border-top: 2px solid #009834;
          "
        >
          <p
            style="
              margin: 10px 0 0;
              font-style: italic;
              color: #013335;
              font-size: 11px;
              line-height: 1.4;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            Yadsale, a curated collection of finds each with its own
            story, waiting to be discovered.
          </p>
        </td>
      </tr>
    `;
  }

  protected generateEmailStructure(title: string, content: string): string {
    const baseData = this.getBaseData();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
          <style>
            ${this.getBaseStyles(baseData.assetsBaseUrl)}
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fff">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            bgcolor="#FDFAFF"
          >
            <tr>
              <td align="center" style="padding: 24px 0">
                <table
                  role="presentation"
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                  "
                >
                  ${this.getHeader(baseData.assetsBaseUrl)}

                  <!-- Content -->
                  <tr>
                    <td
                      style="
                        padding: 0 20px 10px 20px;
                        font-family: Arial, Helvetica, sans-serif;
                      "
                    >
                      ${content}
                    </td>
                  </tr>

                  ${this.getFooter(baseData.currentYear)}
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
