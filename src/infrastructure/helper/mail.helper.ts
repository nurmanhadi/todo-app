import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer"
import { v4 as uuid } from "uuid";
import { MailtrapEmail, MailtrapHost, MailtrapPassword, MailtrapPort, MailtrapUsername } from "../config/env.config";

@Injectable()
export class MailHelper {
    private transporter: nodemailer.Transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: MailtrapHost.secret,
            port: Number(MailtrapPort.secret),
            secure: false,
            auth: {
                user: MailtrapUsername.secret,
                pass: MailtrapPassword.secret
            }
        })
    }
    async EmailVerification(email: string, token: string): Promise<void>{
        const urlResetPassword = `http://localhost:5173/auth/reset-password?token=${token}`
        const mailOptions = {
            from: MailtrapEmail.secret,
            to: email,
            subject: "Reset your Password",
            html:`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f7f7f7;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        }
                        .email-header {
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                        .email-body {
                            padding: 20px;
                            color: #333;
                        }
                        .email-body h1 {
                            color: #4CAF50;
                        }
                        .email-body p {
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .reset-button {
                            display: inline-block;
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 12px 25px;
                            text-decoration: none;
                            font-size: 16px;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .email-footer {
                            text-align: center;
                            font-size: 14px;
                            padding: 20px;
                            color: #777;
                        }
                    </style>
                </head>
                <body>

                <div class="email-container">
                    <div class="email-header">
                        <h2>Password Reset Request</h2>
                    </div>

                    <div class="email-body">
                        <h1>Hello,</h1>
                        <p>We received a request to reset your password. Click the button below to create a new password.</p>
                        <p><a href="${urlResetPassword}" class="reset-button">Reset Password</a></p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                    </div>

                    <div class="email-footer">
                        <p>Best regards,</p>
                        <p>The {{appName}} Team</p>
                        <p>If you have any questions, feel free to contact us at support@{{appDomain}}.</p>
                    </div>
                </div>

                </body>
                </html>

            `,
        }
        try {
            const info = await this.transporter.sendMail(mailOptions)
            console.info(JSON.stringify(`email sent: ${info.messageId}`))
        } catch (error) {
            console.error(JSON.stringify(`error sending email: ${error}`))
        }
    }
}