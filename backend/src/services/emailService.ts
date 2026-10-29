import nodemailer from 'nodemailer';
import crypto from 'crypto';

interface ResetEntry {
  email: string;
  code: string;
  token: string;
  expiresAt: number;
  userName: string;
}

// Almacenamiento seguro en memoria para códigos OTP y tokens temporales
const resetStore = new Map<string, ResetEntry>();

// Limpieza automática periódica de códigos expirados (cada 10 minutos)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of resetStore.entries()) {
    if (entry.expiresAt < now) {
      resetStore.delete(key);
    }
  }
}, 10 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

const smtpUser = (process.env.SMTP_USER || 'soportegiveandgo@gmail.com').trim();
const rawPass = (process.env.SMTP_PASS || 'yjwzcrjudqogsemx').trim();
const smtpPass = rawPass.replace(/\s+/g, '');

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

/**
 * Genera un código OTP de 6 dígitos y un token seguro, los guarda temporalmente y envía el correo.
 */
export async function createAndSendPasswordReset(
  email: string,
  userName: string,
  baseUrl?: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Generar código numérico de 6 dígitos y token criptográfico
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // Válido por 15 minutos

  resetStore.set(normalizedEmail, {
    email: normalizedEmail,
    code,
    token,
    expiresAt,
    userName,
  });

  const frontendUrl = baseUrl || process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetWebUrl = `${frontendUrl}/forgot-password?email=${encodeURIComponent(normalizedEmail)}&code=${code}&token=${token}`;

  const fromSender = process.env.EMAIL_FROM || `"Give&Go Soporte" <${smtpUser}>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contrasena - Give&Go</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Tarjeta Principal -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);">
          
          <!-- Banner Superior Verde Give&Go -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 36px 32px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border-radius: 9999px; padding: 6px 16px; margin-bottom: 12px;">
                      <span style="color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Seguridad de la Cuenta</span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">Give&amp;Go</h1>
                    <p style="color: #d1fae5; font-size: 13px; margin: 0; font-weight: 500;">Plataforma Comunitaria de Voluntariado y Donaciones</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo del Mensaje -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Recuperacion de Contrasena</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                Hola <strong>${userName}</strong>,
              </p>
              <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                Hemos recibido una solicitud para restablecer la contrasena de acceso a tu cuenta asociada a <strong>${normalizedEmail}</strong>.
              </p>

              <!-- Bloque del Codigo de Verificacion -->
              <table role="presentation" width="100%" style="background-color: #f1f5f9; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 24px 20px; text-align: center;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; margin-bottom: 8px;">
                      Tu Codigo de Verificacion (Valido para Web y Movil)
                    </div>
                    <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #047857; padding: 4px 0;">
                      ${code}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                      Ingresa este codigo en la aplicacion movil o en la pantalla web.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- O Boton de Enlace Directo para la Web -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 12px 0;">O si estas en el navegador, puedes ingresar directamente con este boton:</p>
                    <a href="${resetWebUrl}" style="background-color: #059669; color: #ffffff; padding: 14px 32px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block;">
                      Restablecer Contrasena en la Web
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Caja de Advertencia de Seguridad -->
              <table role="presentation" width="100%" style="background-color: #ecfdf5; border-left: 4px solid #059669; border-radius: 6px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="color: #065f46; font-size: 13px; line-height: 1.5; margin: 0;">
                      <strong>Informacion de Seguridad:</strong> Este codigo y enlace expiraran automaticamente en <strong>15 minutos</strong>. Si no solicitaste este cambio, no te preocupes: tu contrasena actual sigue protegida y puedes ignorar este mensaje.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Enlace de Respaldo -->
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                Si el boton no abre la pagina, copia y pega este enlace en tu navegador:<br>
                <a href="${resetWebUrl}" style="color: #059669; text-decoration: underline; word-break: break-all;">${resetWebUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Pie de Pagina -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
                Mensaje automatico emitido por <strong>Give&amp;Go</strong>. Por favor, no respondas a este correo.
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                Remitente: soportegiveandgo@gmail.com | Plataforma Give&amp;Go
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: fromSender,
    to: normalizedEmail,
    subject: 'Recuperacion de Contrasena - Give&Go',
    html: htmlContent,
  });

  return {
    success: true,
    message: 'Codigo de verificacion enviado a tu correo electronico.',
  };
}

/**
 * Valida si el código o token provisto es correcto y aún no ha vencido.
 */
export function verifyResetCode(email: string, codeOrToken: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = resetStore.get(normalizedEmail);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    resetStore.delete(normalizedEmail);
    return false;
  }

  const cleanInput = codeOrToken.trim();
  return cleanInput === entry.code || cleanInput === entry.token;
}

/**
 * Consume el código o token para evitar que sea reutilizado.
 */
export function consumeResetCode(email: string, codeOrToken: string): boolean {
  if (verifyResetCode(email, codeOrToken)) {
    resetStore.delete(email.trim().toLowerCase());
    return true;
  }
  return false;
}
