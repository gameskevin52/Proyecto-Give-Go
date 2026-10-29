import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Evento, DonacionCompleta } from '../types';
import { formatCOP, formatDate } from '../components/UI';

interface ExportReportOptions {
  title?: string;
  subtitle?: string;
  filtersApplied?: string;
  generatedBy?: string;
}

/**
 * Agrega el encabezado institucional y pie de página en los reportes Give&Go
 */
function applyDocumentTheme(
  doc: jsPDF,
  title: string,
  subtitle: string,
  reportType: string,
  filtersApplied?: string,
  generatedBy: string = 'Administrador Give&Go'
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Barra superior decorativa roja Give&Go
  doc.setFillColor(224, 36, 36); // #E02424
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Encabezado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39); // #111827
  doc.text('GIVE&GO', 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(224, 36, 36);
  doc.text('| REPORTE OFICIAL DE GESTION', 52, 18);

  // Título principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text(title, 14, 27);

  // Subtítulo e información de generación
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // #64748B
  doc.text(subtitle, 14, 33);

  // Metadatos a la derecha
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Fecha: ${dateStr}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Emisor: ${generatedBy}`, pageWidth - 14, 23, { align: 'right' });
  doc.text(`Tipo: ${reportType}`, pageWidth - 14, 28, { align: 'right' });

  // Línea divisoria
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 37, pageWidth - 14, 37);

  if (filtersApplied) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 40, pageWidth - 28, 7, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Filtros aplicados: ${filtersApplied}`, 18, 44.5);
  }
}

/**
 * Agrega el pie de página numerado a todas las páginas
 */
function applyFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Give&Go - Plataforma Comunitaria de Gestion Social y Convocatorias',
      14,
      pageHeight - 7
    );

    doc.text(
      `Pagina ${i} de ${pageCount}`,
      pageWidth - 14,
      pageHeight - 7,
      { align: 'right' }
    );
  }
}

/**
 * Exporta el Resumen de Eventos y Campañas a PDF
 */
export function exportEventsToPDF(
  events: Evento[],
  options: ExportReportOptions = {}
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const title = options.title || 'Resumen de Eventos y Campañas Comunitarias';
  const subtitle = options.subtitle || 'Reporte de convocatorias activas, cronograma y cobertura comunitaria';

  applyDocumentTheme(doc, title, subtitle, 'Eventos', options.filtersApplied, options.generatedBy);

  // Métricas de resumen rápido
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.estado === 'activo').length;
  const finishedEvents = events.filter(e => e.estado === 'finalizado').length;
  const totalVolVacancies = events.reduce((sum, e) => sum + (e.vacantesVoluntarios || e.cupo || 0), 0);
  const totalBenVacancies = events.reduce((sum, e) => sum + (e.vacantesBeneficiarios || 0), 0);

  // Tarjetas métricas superiores
  const startY = options.filtersApplied ? 50 : 42;
  const cardWidth = 50;
  const cardHeight = 14;
  const gap = 6;
  let curX = 14;

  const summaryCards = [
    { label: 'Total Convocatorias', value: String(totalEvents), color: [17, 24, 39] },
    { label: 'Eventos Activos', value: String(activeEvents), color: [22, 163, 74] },
    { label: 'Finalizados', value: String(finishedEvents), color: [59, 130, 246] },
    { label: 'Vacantes Voluntarios', value: String(totalVolVacancies), color: [217, 119, 6] },
    { label: 'Cupos Beneficiarios', value: String(totalBenVacancies), color: [147, 51, 234] }
  ];

  summaryCards.forEach(card => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(curX, startY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(curX, startY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(card.label.toUpperCase(), curX + 4, startY + 5);

    doc.setFont('helvetica', 'black');
    doc.setFontSize(11);
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    doc.text(card.value, curX + 4, startY + 11);

    curX += cardWidth + gap;
  });

  // Filas para la tabla
  const tableRows = events.map((evt, idx) => {
    return [
      String(idx + 1),
      evt.nombre || 'Sin nombre',
      evt.categoria || 'General',
      formatDate(evt.fecha),
      (evt.estado || 'activo').toUpperCase(),
      evt.direccion || evt.barrio || 'No especificada',
      String(evt.vacantesVoluntarios || evt.cupo || 0),
      evt.ayudaOfrecida || 'Apoyo general'
    ];
  });

  autoTable(doc, {
    startY: startY + cardHeight + 6,
    head: [[
      '#',
      'Campaña / Convocatoria',
      'Categoría',
      'Fecha Programada',
      'Estado',
      'Ubicación / Sede',
      'Cupo Vol.',
      'Beneficio Ofrecido'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 30 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24, halign: 'center' },
      5: { cellWidth: 50 },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 'auto' }
    },
    didDrawCell: (data) => {
      // Estilizar badge de estado en la columna de Estado (índice 4)
      if (data.section === 'body' && data.column.index === 4) {
        const estado = String(data.cell.raw).toLowerCase();
        if (estado === 'activo') {
          doc.setTextColor(22, 163, 74);
        } else if (estado === 'finalizado') {
          doc.setTextColor(59, 130, 246);
        } else {
          doc.setTextColor(100, 116, 139);
        }
      }
    }
  });

  applyFooters(doc);

  const cleanFileName = `GiveAndGo_Reporte_Eventos_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}

/**
 * Exporta el Resumen de Donaciones a PDF
 */
export function exportDonationsToPDF(
  donations: DonacionCompleta[],
  options: ExportReportOptions = {}
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const title = options.title || 'Resumen de Donaciones y Fondos Comunitarios';
  const subtitle = options.subtitle || 'Auditoría detallada de aportes monetarios y donaciones en especie';

  applyDocumentTheme(doc, title, subtitle, 'Donaciones', options.filtersApplied, options.generatedBy);

  // Métricas clave
  const totalDonations = donations.length;
  const monetaryDonations = donations.filter(d => d.tipo === 'monetaria' && d.monetaria);
  const totalMonetaryAmount = monetaryDonations.reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);
  const objectDonations = donations.filter(d => d.tipo === 'objeto');
  const totalObjectUnits = objectDonations.reduce((sum, d) => sum + (d.objeto?.cantidad || 0), 0);

  const startY = options.filtersApplied ? 50 : 42;
  const cardWidth = 62;
  const cardHeight = 14;
  const gap = 6;
  let curX = 14;

  const summaryCards = [
    { label: 'Total Donaciones Registradas', value: `${totalDonations} aportes`, color: [17, 24, 39] },
    { label: 'Total Fondos Monetarios', value: formatCOP(totalMonetaryAmount), color: [22, 163, 74] },
    { label: 'Donaciones en Especie', value: `${objectDonations.length} donaciones (${totalObjectUnits} u.)`, color: [59, 130, 246] },
    { label: 'Donaciones Monetarias', value: `${monetaryDonations.length} transferencias`, color: [217, 119, 6] }
  ];

  summaryCards.forEach(card => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(curX, startY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(curX, startY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(card.label.toUpperCase(), curX + 4, startY + 5);

    doc.setFont('helvetica', 'black');
    doc.setFontSize(11);
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    doc.text(card.value, curX + 4, startY + 11);

    curX += cardWidth + gap;
  });

  // Filas para la tabla
  const tableRows = donations.map((don, idx) => {
    const isMonetaria = don.tipo === 'monetaria';
    const detalle = isMonetaria
      ? `${formatCOP(don.monetaria?.valor || 0)} (${don.monetaria?.metodo || 'Transf.'})`
      : `${don.objeto?.cantidad || 0} x ${don.objeto?.categoria || 'Artículos'}: ${don.objeto?.descripcion || 'Sin descripción'}`;

    return [
      String(idx + 1),
      don.usuarioNombre || 'Donante Anónimo',
      don.organizacionNombre || 'Sede General',
      isMonetaria ? 'MONETARIA' : 'ESPECIE',
      don.categoria || 'General',
      formatDate(don.fecha),
      detalle
    ];
  });

  autoTable(doc, {
    startY: startY + cardHeight + 6,
    head: [[
      '#',
      'Donante / Voluntario',
      'Organización Destino',
      'Tipo de Apoyo',
      'Causa / Categoría',
      'Fecha',
      'Valor / Detalle de la Donación'
    ]],
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 48 },
      3: { cellWidth: 26, halign: 'center' },
      4: { cellWidth: 32 },
      5: { cellWidth: 28 },
      6: { cellWidth: 'auto', fontStyle: 'bold' }
    }
  });

  applyFooters(doc);

  const cleanFileName = `GiveAndGo_Reporte_Donaciones_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}

/**
 * Exporta el Reporte Ejecutivo Completo (Eventos + Donaciones + Métricas) a PDF
 */
export function exportExecutiveReportToPDF(data: {
  events: Evento[];
  donations: DonacionCompleta[];
  usersCount: number;
  orgsCount: number;
  monetaryTotal: number;
  options?: ExportReportOptions;
}): void {
  const { events, donations, usersCount, orgsCount, monetaryTotal, options = {} } = data;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const title = options.title || 'Informe Ejecutivo de Gestión Give&Go';
  const subtitle = options.subtitle || 'Consolidado general de impacto comunitario, recursos e indicadores clave';

  applyDocumentTheme(doc, title, subtitle, 'Ejecutivo', options.filtersApplied, options.generatedBy);

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = options.filtersApplied ? 50 : 42;

  // 1. Panel de Indicadores Clave de Impacto (KPIs)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('1. INDICADORES CLAVE DE PARTICIPACION SOCIAL', 14, currentY);
  currentY += 4;

  const kpis = [
    { label: 'Eventos Activos', val: String(events.filter(e => e.estado === 'activo').length), sub: `de ${events.length} totales` },
    { label: 'Comunidad Registrada', val: String(usersCount), sub: 'voluntarios y beneficiarios' },
    { label: 'Organizaciones Aliadas', val: String(orgsCount), sub: 'fundaciones e instituciones' },
    { label: 'Fondos Recaudados', val: formatCOP(monetaryTotal), sub: `${donations.length} donaciones totales` }
  ];

  const colWidth = (pageWidth - 28 - 9) / 4;
  kpis.forEach((kpi, index) => {
    const kpiX = 14 + index * (colWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(kpiX, currentY, colWidth, 18, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(kpiX, currentY, colWidth, 18, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label.toUpperCase(), kpiX + 3, currentY + 4.5);

    doc.setFont('helvetica', 'black');
    doc.setFontSize(10);
    doc.setTextColor(224, 36, 36);
    doc.text(kpi.val, kpiX + 3, currentY + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(kpi.sub, kpiX + 3, currentY + 15);
  });

  currentY += 24;

  // 2. Tabla Resumen de Eventos Activos Principales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('2. PRINCIPALES CONVOCATORIAS COMUNITARIAS', 14, currentY);
  currentY += 2;

  const topEvents = events.slice(0, 10).map((e, idx) => [
    String(idx + 1),
    e.nombre,
    e.categoria,
    formatDate(e.fecha),
    (e.estado || 'activo').toUpperCase(),
    String(e.vacantesVoluntarios || e.cupo || 0)
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Convocatoria', 'Categoría', 'Fecha', 'Estado', 'Cupos']],
    body: topEvents,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 65, fontStyle: 'bold' },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 24, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' }
    }
  });

  // 3. Tabla Resumen de Donaciones Recientes
  const lastY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('3. ULTIMAS DONACIONES Y APORTES PROCESADOS', 14, lastY);

  const topDonations = donations.slice(0, 10).map((d, idx) => [
    String(idx + 1),
    d.usuarioNombre || 'Anónimo',
    d.organizacionNombre || 'Organización',
    d.tipo.toUpperCase(),
    formatDate(d.fecha),
    d.tipo === 'monetaria' ? formatCOP(d.monetaria?.valor || 0) : `${d.objeto?.cantidad || 0} u. (${d.objeto?.categoria || 'Especie'})`
  ]);

  autoTable(doc, {
    startY: lastY + 2,
    head: [['#', 'Donante', 'Organización', 'Tipo', 'Fecha', 'Valor / Cantidad']],
    body: topDonations,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 45 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 28 },
      5: { cellWidth: 'auto', fontStyle: 'bold' }
    }
  });

  applyFooters(doc);

  const cleanFileName = `GiveAndGo_Informe_Ejecutivo_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(cleanFileName);
}
