// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASS');
    const secure = this.configService.get<boolean>('EMAIL_SECURE');

    if (!host || !port || !user || !pass) {
      throw new Error('Missing email configuration in .env file');
    }

    // The following lines are disabled because of a persistent ESLint error
    // that seems to be a tooling issue, as the types are correctly installed.

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Envía un correo de confirmación de cuenta.
   * @param to - El email del destinatario.
   * @param token - El token de confirmación.
   * @param userName - El nombre del usuario.
   */
  async sendConfirmationEmail(to: string, token: string, userName: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const confirmationUrl = `${frontendUrl}/verificar-email?token=${token}`;
    const emailUser = this.configService.get<string>('EMAIL_USER');

    const templatePath = path.join(
      __dirname,
      'templates',
      'confirmation-email.html',
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    htmlContent = htmlContent
      .replace('{{userName}}', userName)
      .replace(new RegExp('{{confirmationUrl}}', 'g'), confirmationUrl);

    await this.transporter.sendMail({
      from: `"Universitas - Actas de Entrega" <${emailUser}>`,
      to,
      subject: 'Confirma tu correo electrónico en Universitas',
      html: htmlContent,
    });
  }
}
