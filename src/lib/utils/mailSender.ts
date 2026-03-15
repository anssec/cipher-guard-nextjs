import nodemailer from "nodemailer";

export async function mailSender(email: string, title: string, body: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL) {
    console.log("SMTP is disabled, skipping email send");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
}
