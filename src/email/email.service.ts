// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY no está definida en el archivo .env');
    }
    this.resend = new Resend(apiKey);
  }

  /**
   * Envía un correo de confirmación de cuenta usando Resend.
   * @param to - El email del destinatario.
   * @param token - El token de confirmación.
   * @param userName - El nombre del usuario.
   */
  async sendConfirmationEmail(to: string, token: string, userName: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      throw new Error('BACKEND_URL no está definida en el archivo .env');
    }
    const confirmationUrl = `${frontendUrl}/auth/confirm-email/${token}`;

    // Leemos la plantilla HTML (igual que antes)
    const templatePath = path.join(
      __dirname,
      '..', // Sube un nivel desde 'dist/email' a 'dist'
      'email/templates',
      'confirmation-email.html',
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Reemplazamos las variables en la plantilla
    htmlContent = htmlContent
      .replace('{{userName}}', userName)
      .replace(new RegExp('{{confirmationUrl}}', 'g'), confirmationUrl);

    const fromEmail = this.configService.get<string>('FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('FROM_EMAIL no está definida en el archivo .env');
    }

    try {
      console.log(`Intentando enviar correo de confirmación a: ${to}`);
      await this.resend.emails.send({
        from: `Actas de Entrega <${fromEmail}>`,
        to: [to],
        subject: 'Confirma tu correo electrónico en Universitas',
        html: htmlContent,
      });
      console.log(`Correo de confirmación enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error(`Error al enviar correo de confirmación a: ${to}`, error);
      throw error;
    }
  }

  /**
   * Envía un correo con el código OTP para reseteo de contraseña.
   * @param to - El email del destinatario.
   * @param otp - El código de 6 dígitos.
   * @param userName - El nombre del usuario.
   */
  async sendPasswordResetOtp(to: string, otp: string, userName: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #001A70; text-align: center;">Recuperación de Contraseña</h2>
        <p>Hola, <strong>${userName}</strong>,</p>
        <p>Usa el siguiente código para restablecer tu contraseña. Es válido por 10 minutos.</p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f2f2f2; padding: 15px; border-radius: 5px; display: inline-block;">
            ${otp}
          </p>
        </div>
      </div>
    `;

    const fromEmail = this.configService.get<string>('FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('FROM_EMAIL no está definida en el archivo .env');
    }
    try {
      console.log(`Intentando enviar OTP de reseteo de contraseña a: ${to}`);
      await this.resend.emails.send({
        from: `Soporte <${fromEmail}>`,
        to: [to],
        subject: 'Tu código para restablecer la contraseña',
        html: htmlContent,
      });
      console.log(`OTP de reseteo de contraseña enviado exitosamente a: ${to}`);
    } catch (error) {
      console.error(
        `Error al enviar OTP de reseteo de contraseña a: ${to}`,
        error,
      );
      throw error;
    }
  }
  // ---
  // --- 1. AÑADE ESTE NUEVO MÉTODO ---
  // ---
  /**
   * Envía un correo con un adjunto en PDF.
   * @param to El email del destinatario.
   * @param userName El nombre del usuario.
   * @param subject El asunto del correo.
   * @param pdfBuffer El buffer del archivo PDF.
   * @param fileName El nombre del archivo adjunto.
   */
  async sendReportWithAttachment(
    to: string,
    userName: string,
    subject: string,
    pdfBuffer: Buffer,
    fileName: string,
  ) {
    const fromEmail = this.configService.get<string>('FROM_EMAIL');
    if (!fromEmail) {
      throw new Error('FROM_EMAIL no está definida en el archivo .env');
    }

    try {
      console.log(`Intentando enviar reporte con adjunto a: ${to}`);
      await this.resend.emails.send({
        from: `Reportes Universitas <${fromEmail}>`, //
        to: [to], //
        subject: subject,
        html: `<p>Hola, ${userName},</p><p>Adjunto encontrarás tu reporte de auditoría generado.</p>`,
        attachments: [
          {
            filename: fileName,
            content: pdfBuffer, // Resend/Nodemailer aceptan Buffers
          },
        ],
      });
      console.log(`Reporte enviado exitosamente a: ${to}`); //
      console.log('PDF Buffer:', pdfBuffer);
      console.log('File Name:', fileName);
      console.log('PDF Buffer:', pdfBuffer);
      console.log('File Name:', fileName);
    } catch (error) {
      console.error(`Error al enviar reporte con adjunto a: ${to}`, error); //
      throw error;
    }
  }
}
