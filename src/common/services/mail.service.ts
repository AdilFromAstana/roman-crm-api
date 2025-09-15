// src/common/services/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
      port: configService.get<number>('MAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from:
        this.configService.get<string>('MAIL_FROM') ||
        this.configService.get<string>('MAIL_USER'),
      to: email,
      subject: 'Восстановление пароля',
      text: `Ваш код для восстановления пароля: ${code}`,
      html: `
        <h2>Восстановление пароля</h2>
        <p>Ваш код для восстановления пароля: <strong>${code}</strong></p>
        <p>Код действителен в течение 15 минут.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendRegistrationEmail(email: string, password: string): Promise<void> {
    const mailOptions = {
      from:
        this.configService.get<string>('MAIL_FROM') ||
        this.configService.get<string>('MAIL_USER'),
      to: email,
      subject: 'Регистрация в системе',
      text: `Ваш временный пароль: ${password}`,
      html: `
        <h2>Добро пожаловать в систему!</h2>
        <p>Ваш временный пароль: <strong>${password}</strong></p>
        <p>Пожалуйста, измените пароль после первого входа.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
