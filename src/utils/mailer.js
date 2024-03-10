import nodemailer from "nodemailer";

export const mailer = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "OTP for admin verification",

        html: `
            <div style="text-align: center;">
            <p>This is a one time OTP for admin verification.</p>
            <p>It will expire immediately after login.</p>
            <p>Your OTP is <strong style="color: white; background-color: blue; width: 50px;">${otp}</strong>.</p>
            </div>
        `,
    };

    // Send the email.
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`OTP sent to ${email}`);
        }
    });

    return otp;
};
