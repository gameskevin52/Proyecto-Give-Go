import { Platform, Alert, Share } from 'react-native';
import { AdminDonationItem } from '../models/admin.models';

export const downloadDonationReceipt = async (donation: AdminDonationItem) => {
  try {
    const donorName = donation.usuarioNombre || 'Donante Solidario';
    const orgName = donation.organizacionNombre || `Organización #${donation.organizacionId || ''}`;
    const fecha = donation.fecha
      ? new Date(donation.fecha).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : 'Reciente';

    const isMonetary = donation.tipo === 'monetaria';
    const amountOrQty = isMonetary
      ? `$${Number(donation.monetaria?.valor || 0).toLocaleString('es-CO')} COP`
      : `${donation.objeto?.cantidad || 1} unidades de ${donation.objeto?.categoria || 'Insumo'}`;

    const paymentOrDetail = isMonetary
      ? `Método de Pago: ${(donation.monetaria?.metodo || 'Tarjeta / Transferencia').toUpperCase()}\nCuenta/Ref: ${donation.monetaria?.cuenta || 'N/A'}`
      : `Descripción de Insumo: ${donation.objeto?.descripcion || 'En buen estado'}`;

    const receiptText = `================================================
          GIVE & GO - KENNEDY SOLIDARIO
    COMPROBANTE OFICIAL DE DONACIÓN REGISTRADA
================================================
Registro de Donación: #${donation.id}
Fecha de Emisión: ${fecha}
Estado: Certificado e Inmutable en Libro Contable

--- DATOS DE LA APORTACIÓN ---
Donante Registrado:     ${donorName}
Organización Receptora: ${orgName}
Causa Comunitaria:      ${donation.categoria || 'Social'}
Modalidad:              ${isMonetary ? 'Aporte Económico / Monetario' : 'Donación en Especie'}
Valor / Elemento:       ${amountOrQty}
${paymentOrDetail}

================================================
Este comprobante digital certifica la trazabilidad,
transparencia y auditoría de la aportación en la
plataforma comunitaria Give&Go.
================================================`;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
      // In web browser: generate formatted printable HTML document
      const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante de Donación #${donation.id} - Give&Go</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #0F172A; background: #F8FAFC; }
    .card { max-width: 650px; margin: 0 auto; background: #FFF; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #DC2626; color: #FFF; padding: 24px; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
    .header p { margin: 4px 0 0; opacity: 0.9; font-size: 13px; }
    .body { padding: 24px; }
    .amount-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 20px; }
    .amount-val { font-size: 28px; font-weight: 900; color: #0F172A; margin: 4px 0; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
    .label { color: #64748B; font-weight: 500; }
    .val { color: #0F172A; font-weight: 700; text-align: right; }
    .footer { padding: 16px 24px; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>GIVE & GO · KENNEDY</h1>
      <p>Comprobante Oficial de Donación · Registro #${donation.id}</p>
    </div>
    <div class="body">
      <div class="amount-box">
        <div style="font-size:12px; font-weight:700; color:#64748B;">${isMonetary ? 'MONTO APORTADO' : 'CANTIDAD EN ESPECIE'}</div>
        <div class="amount-val">${amountOrQty}</div>
        <div style="font-size:12px; color:#16A34A; font-weight:600;">✓ Aportación Registrada en Libro Contable</div>
      </div>
      <div class="row"><span class="label">Donante:</span><span class="val">${donorName}</span></div>
      <div class="row"><span class="label">Organización:</span><span class="val">${orgName}</span></div>
      <div class="row"><span class="label">Causa / Categoría:</span><span class="val">${donation.categoria || 'Social'}</span></div>
      <div class="row"><span class="label">Modalidad:</span><span class="val">${isMonetary ? 'Monetaria' : 'En Especie'}</span></div>
      <div class="row"><span class="label">Fecha:</span><span class="val">${fecha}</span></div>
    </div>
    <div class="footer">
      Este comprobante digital certifica la trazabilidad y transparencia comunitaria en Give&Go.
    </div>
  </div>
  <script>window.print();</script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprobante_donacion_${donation.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Alert.alert('Comprobante Generado', 'Se ha descargado el comprobante oficial de la donación.');
    } else {
      // In native mobile (Android / iOS): trigger native Share sheet and confirm
      await Share.share({
        title: `Comprobante Donación #${donation.id} - Give&Go`,
        message: receiptText,
      });
    }
  } catch (err: any) {
    console.error('Error generating donation receipt:', err);
    Alert.alert('Error', 'No se pudo generar o compartir el comprobante de donación.');
  }
};
