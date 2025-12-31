import Mail from 'nodemailer/lib/mailer';

export interface EmailClient {
  send(mail: Mail.Options): Promise<any>;
}
