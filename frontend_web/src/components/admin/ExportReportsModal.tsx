import React, { useState } from 'react';
import { Modal, Button, Select, Input } from '../UI';
import { Evento, DonacionCompleta } from '../../types';
import { exportEventsToPDF, exportDonationsToPDF, exportExecutiveReportToPDF } from '../../utils/pdfExport';
import { FileDown, Calendar, Heart, FileText, CheckCircle2 } from 'lucide-react';

interface ExportReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredEvents: Evento[];
  allEvents: Evento[];
  filteredDonations: DonacionCompleta[];
  allDonations: DonacionCompleta[];
  usersCount: number;
  orgsCount: number;
  monetaryTotal: number;
}

export const ExportReportsModal: React.FC<ExportReportsModalProps> = ({
  isOpen,
  onClose,
  filteredEvents,
  allEvents,
  filteredDonations,
  allDonations,
  usersCount,
  orgsCount,
  monetaryTotal,
}) => {
  const [reportType, setReportType] = useState<'eventos' | 'donaciones' | 'ejecutivo'>('ejecutivo');
  const [dataScope, setDataScope] = useState<'filtrados' | 'todos'>('filtrados');
  const [authorName, setAuthorName] = useState('Administración Central');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const eventsToUse = dataScope === 'filtrados' ? filteredEvents : allEvents;
      const donationsToUse = dataScope === 'filtrados' ? filteredDonations : allDonations;

      const filtersText = dataScope === 'filtrados'
        ? `Vista actual filtrada (${eventsToUse.length} eventos, ${donationsToUse.length} donaciones)`
        : 'Todos los registros históricos de la base de datos';

      if (reportType === 'eventos') {
        exportEventsToPDF(eventsToUse, {
          generatedBy: authorName,
          filtersApplied: filtersText
        });
      } else if (reportType === 'donaciones') {
        exportDonationsToPDF(donationsToUse, {
          generatedBy: authorName,
          filtersApplied: filtersText
        });
      } else {
        exportExecutiveReportToPDF({
          events: eventsToUse,
          donations: donationsToUse,
          usersCount,
          orgsCount,
          monetaryTotal,
          options: {
            generatedBy: authorName,
            filtersApplied: filtersText
          }
        });
      }

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error al exportar reporte a PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const currentEventsCount = dataScope === 'filtrados' ? filteredEvents.length : allEvents.length;
  const currentDonationsCount = dataScope === 'filtrados' ? filteredDonations.length : allDonations.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar Reportes Oficiales a PDF"
      size="md"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Reporte PDF</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {exportSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>El archivo PDF ha sido generado y descargado exitosamente.</span>
          </div>
        )}

        {/* Selector de Tipo de Reporte */}
        <div className="space-y-1.5">
          <label className="block font-black text-neutral-800 uppercase tracking-wider text-[11px]">
            Selecciona el Tipo de Reporte
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setReportType('ejecutivo')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                reportType === 'ejecutivo'
                  ? 'border-red-600 bg-red-50/70 text-red-950 shadow-xs ring-1 ring-red-500'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs">Informe Ejecutivo</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Métricas globales, eventos y donaciones consolidadas.</p>
            </button>

            <button
              type="button"
              onClick={() => setReportType('eventos')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                reportType === 'eventos'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-xs ring-1 ring-amber-500'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs">Eventos / Campañas</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Listado completo, sedes, cupos y estado de causas.</p>
            </button>

            <button
              type="button"
              onClick={() => setReportType('donaciones')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                reportType === 'donaciones'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                <Heart className="w-4 h-4" />
              </div>
              <p className="font-extrabold text-xs">Donaciones y Fondos</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Auditoría monetaria y donaciones de bienes en especie.</p>
            </button>
          </div>
        </div>

        {/* Alcance de los Datos */}
        <div className="space-y-1.5">
          <label className="block font-black text-neutral-800 uppercase tracking-wider text-[11px]">
            Alcance de Datos a Incluir
          </label>
          <Select
            value={dataScope}
            onChange={(e) => setDataScope(e.target.value as 'filtrados' | 'todos')}
            options={[
              { value: 'filtrados', label: `Datos actualmente filtrados en pantalla (${currentEventsCount} eventos, ${currentDonationsCount} donaciones)` },
              { value: 'todos', label: `Todos los registros históricos en base de datos (${allEvents.length} eventos, ${allDonations.length} donaciones)` }
            ]}
          />
        </div>

        {/* Emisor del Documento */}
        <div className="space-y-1.5">
          <Input
            label="Nombre o Cargo del Emisor para el Pie Institucional"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ej. Dirección de Auditoría Social / Administrador"
          />
        </div>

        {/* Cuadro informativo de especificaciones */}
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600 space-y-1">
          <div className="font-bold text-neutral-800 flex items-center justify-between">
            <span>Formato de Salida Oficial:</span>
            <span className="font-mono text-[10px] bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">PDF / A4</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            El archivo generado incluirá encabezados institucionales de Give&Go, tablas con formato estructurado, subtotales, numeración de páginas y marcas de tiempo de generación.
          </p>
        </div>
      </div>
    </Modal>
  );
};
