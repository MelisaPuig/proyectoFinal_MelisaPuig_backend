import nodemailer from 'nodemailer';

import CONFIG from '~/config';

const { ADMIN_EMAIL, MAIL_USER, MAIL_PASSWORD, MAIL_HOST } = CONFIG;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: 587,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

class Mails {
  sendToAdmin(subject: string, html: string) {
    return this.sendMail(ADMIN_EMAIL, subject, html);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      console.log(CONFIG);
      const options = { from: MAIL_USER, to, subject, html };
      const result = await transporter.sendMail(options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new Mails();
