// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend, CreateEmailOptions } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.fromEmail = this.configService.get<string>('FROM_EMAIL')!;
  }

  // --- Tus funciones de email existentes ---

  async sendConfirmationEmail(to: string, token: string, name: string) {
    const confirmationLink = `${this.configService.get<string>('FRONTEND_URL')}/verificar-email?token=${token}`;

    // (Tu lógica de leer la plantilla confirmation-email.html va aquí)
    // ...
    const htmlContent = `<p>Hola ${name}, haz clic <a href="${confirmationLink}">aquí</a> para confirmar tu correo.</p>`; // Simplificado

    await this.resend.emails.send({
      from: `Plataforma Actas <${this.fromEmail}>`,
      to: [to],
      subject: 'Confirma tu dirección de correo electrónico',
      html: htmlContent,
    });
  }

  async sendPasswordResetOtp(to: string, otp: string) {
    // (Tu lógica de email para OTP va aquí)
    // ...
    const htmlContent = `<p>Tu código de reseteo de contraseña es: <strong>${otp}</strong></p>`; // Simplificado

    await this.resend.emails.send({
      from: `Plataforma Actas <${this.fromEmail}>`,
      to: [to],
      subject: 'Tu código de reseteo de contraseña',
      html: htmlContent,
    });
  }

  async sendReportWithAttachment(
    to: string,
    reportBuffer: Buffer,
    fileName: string,
    userName: string,
    reportDate: string, // El 5to argumento que causaba el error
  ) {
    // (Tu lógica de email para el Reporte de Compliance va aquí)
    // ...
    const htmlContent = `<p>Hola ${userName}, adjunto encontrarás tu reporte de cumplimiento de fecha ${reportDate}.</p>`; // Simplificado

    await this.resend.emails.send({
      from: `Plataforma Actas <${this.fromEmail}>`,
      to: [to],
      subject: `Tu Reporte de Cumplimiento: ${fileName}`,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: reportBuffer,
        },
      ],
    });
  }

  // ---
  // --- 👇 ¡ESTA ES LA FUNCIÓN NUEVA QUE FALTA! 👇 ---
  // ---

  /**
   * NUEVA FUNCIÓN: Envía el Acta .docx como adjunto
   */
  async sendActaDocxAttachment(
    to: string,
    fileBuffer: Buffer, // <-- 1. AÑADE ESTE PARÁMETRO
    fileName: string,
    userName: string,
  ) {
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #001A70; text-align: center;">Tu Acta de Entrega está Lista</h2>
      <p>Hola, <strong>${userName}</strong>,</p>
      <p>Hemos generado tu documento de Acta de Entrega.</p>
      <p>Encontrarás el archivo (<strong>${fileName}</strong>) adjunto a este correo.</p>
      <br>
      <p>Gracias por utilizar nuestros servicios.</p>
    </div>
    `;

    const emailOptions: CreateEmailOptions = {
      from: `Plataforma Actas <${this.fromEmail}>`,
      to: [to],
      subject: `Tu Acta de Entrega Generada: ${fileName}`,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: fileBuffer,
        },
      ],
    };

    await this.resend.emails.send(emailOptions);
  }
}
