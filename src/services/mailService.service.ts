import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  email: string,
  payload: {
    subject: string;
    text: string;
  }
) => {
  const { subject, text } = payload;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text,
  });
};
