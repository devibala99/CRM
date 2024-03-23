// services/emailServices.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your_email@gmail.com', // your Gmail email address
        pass: 'your_password' // your Gmail password
    }
});

const sendResetPasswordEmail = async (email, resetLink) => {
    try {
        const mailOptions = {
            from: 'devibalamaheshkannan@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            html: `
                <p>Hello,</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Reset password email sent successfully.');
    } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email.');
    }
};

module.exports = { sendResetPasswordEmail };
