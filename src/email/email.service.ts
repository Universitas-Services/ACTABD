// src/email/email.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend, CreateEmailOptions } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

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

    const templatePath = path.join(__dirname, 'templates', 'confirmation-email.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    htmlContent = htmlContent.replace(/{{userName}}/g, name);
    htmlContent = htmlContent.replace(/{{confirmationUrl}}/g, confirmationLink);

    await this.resend.emails.send({
      from: `Actas de Entrega <${this.fromEmail}>`,
      to: [to],
      subject: 'Confirma tu cuenta',
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
   * @param isPro - Bool para indicar si es acta Pro (usa plantilla diferente)
   */
  async sendActaDocxAttachment(
    to: string,
    fileBuffer: Buffer,
    fileName: string,
    userName: string,
    actaCode: string,
    isPro: boolean = false, // <-- NUEVO PARÁMETRO
  ) {
    let htmlContent = '';
    let subject = '';

    if (isPro) {
      // --- LÓGICA PARA USUARIO PRO ---
      const templatePath = path.join(__dirname, 'templates', 'acta-pro.html');

      try {
        // Leemos la plantilla del archivo
        htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Reemplazamos los placeholders básicos
        htmlContent = htmlContent.replace(/{{actaCode}}/g, actaCode);
        htmlContent = htmlContent.replace(/{{userName}}/g, userName);

        // Asunto específico para Pro
        subject = `✅ ¡Misión cumplida! Tu ${actaCode} ha sido generada y está lista para la firma.`;

      } catch (error) {
        console.warn('No se encontró acta-pro.html, usando fallback.', error);
        // Fallback simple si falla la lectura del archivo
        htmlContent = `<p>Tu acta Pro ${actaCode} está lista.</p>`;
        subject = `Tu Acta Pro ${actaCode}`;
      }

    } else {
      // --- LÓGICA EXISTENTE PARA USUARIO GRATIS ---
      subject = `Has completado el primer paso. Aquí está tu acta express: ${actaCode}`;

      htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
        
        <!-- Título Principal -->
        <h2 style="color: #001A70; text-align: left; font-size: 18px;">
          ¡Excelente trabajo!
        </h2>
  
        <!-- Mensaje de Éxito -->
        <p style="color: #333; font-size: 16px;">
          Has generado con éxito tu borrador de Acta de Entrega (<strong>${actaCode}</strong>). Lo encontrarás adjunto en este correo.
        </p>
  
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
  
        <!-- Próximos Pasos -->
        <h3 style="color: #001A70; font-size: 16px;">
          Próximos pasos (Instrucciones Clave):
        </h3>
        
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;">
            📌 Descarga y revisa el documento adjunto.
          </li>
          <li style="margin-bottom: 10px;">
            📌 Imprime las copias necesarias (original y tres copias).
          </li>
          <li style="margin-bottom: 10px;">
            📌 Procede con la firma y distribuirlas según la normativa.
          </li>
        </ul>
  
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
  
        <!-- Sección PRO -->
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center;">
          <h3 style="color: #001A70; font-size: 16px; margin-top: 0;">
            ¿Sabías que este es solo el comienzo?
          </h3>
          <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
            Un proceso de entrega formal implica mucho más: anexos detallados, análisis de riesgos y la verificación de cada punto para evitar futuras responsabilidades.
          </p>
          
          <a href="https://universitas.myflodesk.com/ae-pro" style="background-color: #FF8C00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
            ¡Quiero actualizar a la versión PRO!
          </a>
        </div>
  
        <br>
        
        <!-- Footer -->
        <div style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
          <p>Si tienes alguna pregunta, nuestro equipo está listo para ayudarte.</p>
          <p>Atentamente,<br>El equipo de Universitas Legal</p>
        </div>
  
      </div>
      `;
    }

    const emailOptions: CreateEmailOptions = {
      from: `Actas de Entrega <${this.fromEmail}>`, // Remitente actualizado
      to: [to],
      subject: subject,
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

  /**
   * NUEVA FUNCIÓN: Envía el Reporte de Compliance
   */
  async sendComplianceReport(
    to: string,
    fileBuffer: Buffer,
    fileName: string,
    complianceId: string,
    complianceScore: number,
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'acta-compliance.html',
    );
    let htmlContent = '';
    const subject =
      '📊 Resultados de Compliance: Tu Acta de Entrega ya fue analizada. Revisa tu reporte de fallas y riesgos.';

    console.log('--- DEBUG EMAIL ---');
    console.log('Intentando leer plantilla desde:', templatePath);
    console.log('__dirname actual:', __dirname);

    try {
      if (!fs.existsSync(templatePath)) {
        console.error('¡EL ARCHIVO NO EXISTE EN LA RUTA ESPECIFICADA!');
      }
      htmlContent = fs.readFileSync(templatePath, 'utf8');
      htmlContent = htmlContent.replace(/{{complianceId}}/g, complianceId);
      htmlContent = htmlContent.replace(
        /{{complianceScore}}/g,
        complianceScore.toFixed(2),
      );
    } catch (error) {
      console.error('ERROR LEYENDO PLANTILLA:', error);
      console.warn(
        'No se encontró acta-compliance.html, usando fallback.',
        error,
      );
      htmlContent = `<p>Tu reporte de compliance ${complianceId} está listo. Puntaje: ${complianceScore}%</p>`;
    }

    await this.resend.emails.send({
      from: `Universitas Legal <${this.fromEmail}>`,
      to: [to],
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          content: fileBuffer,
        },
      ],
    });
  }

  /**
   * NOTIFICACIÓN AL ADMIN: Plazos de entrega
   */
  async sendAdminNotificationDeadline(
    to: string[],
    actaNumero: string,
    daysPassed: number,
  ) {
    if (!to || to.length === 0) return;

    const subject = `ALERTA: Acta ${actaNumero} ha cumplido ${daysPassed} días hábiles`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #D32F2F;">Notificación de Plazo Vencido</h2>
        <p>Estimado Administrador,</p>
        <p>El Acta <strong>${actaNumero}</strong> ha cumplido <strong>${daysPassed} días hábiles</strong> desde su fecha de suscripción.</p>
        <p>Por favor, tome las medidas pertinentes.</p>
      </div>
    `;

    await this.resend.emails.send({
      from: `Plataforma Actas <${this.fromEmail}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });
  }
}
