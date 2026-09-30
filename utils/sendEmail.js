import nodemailer from 'nodemailer';

export const sendEmail = async (email, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"E-Learning Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
