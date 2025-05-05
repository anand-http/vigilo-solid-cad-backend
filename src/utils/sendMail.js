import nodemailer from "nodemailer";

export const sendMail = async ({ email, subject, message }) => {
    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.MAIL_USER,
    //         pass: process.env.MAIL_PASS,
    //     },
    // });
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });

    // await transporter.sendMail({
    //     from: `Your App <${process.env.MAIL_USER}>`,
    //     to: email,
    //     subject: subject,
    //     text: message,
    // });

    async function mail() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: email,
            subject: subject,
            html: message
        });

    }

    mail().catch(console.error);
};


export const OTPMessage = ({ name, otp }) => {
    return `<div style="font-family: 'Arial', sans-serif; text-align: center; background-color: #f4f4f4; margin-top: 15px; padding: 0;">

      <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333333;">Hey ${name}! </h1>
        <p style="color: #666666;">Your verification code is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #009688; margin: 0;">${otp}</p>
          <p style="color: #666666;">
         This otp will expire in 10 minutes.
         </p>
        <p style="color: #666666;">
          If you did not request an otp , please ignore this email.
        </p>
      </div>

      <div style="color: #888888;">
        <p style="margin-bottom: 40px;">Regards, <span style="color:#b19cd9;">Team Solid Cad Security</span></p>
      </div>
    
    </div>`
}