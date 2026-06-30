import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RequestService } from '../../services/db';
import { Solicitud } from '../../types';
import { Button, Input, Select, Card, Table, Badge, Modal, ConfirmDialog, Textarea, Alert, EmptyState, formatDate } from '../../components/UI';
import { Plus, Edit, Trash2, Calendar, FileText, CheckCircle } from 'lucide-react';

interface SolicitudFormData {
  titulo: string;
  descripcion: string;
}

export const BeneficiaryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState<Solicitud[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<Solicitud | null>(null);
  
  // Confirm Delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reqToDelete, setReqToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SolicitudFormData>();

  useEffect(() => {
    loadRequests();
  }, [user]);

  useEffect(() => {
    // Escuchar si se abre desde la sidebar para crear directamente (?action=create)
    const action = searchParams.get('action');
    if (action === 'create') {
      handleOpenCreate();
      setSearchParams({}); // Limpiar parámetro
    }
  }, [searchParams]);

  async function loadRequests() {
    if (!user) return;
    const list = await RequestService.getByBeneficiary(user.id);
    setRequests(list);
  }

  const handleOpenCreate = () => {
    setEditingReq(null);
    reset({ titulo: '', descripcion: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (req: Solicitud) => {
    setEditingReq(req);
    setValue('titulo', req.titulo);
    setValue('descripcion', req.descripcion);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: SolicitudFormData) => {
    if (!user) return;

    if (editingReq) {
      await RequestService.update(editingReq.id, {
        titulo: data.titulo,
        descripcion: data.descripcion
      });
    } else {
      await RequestService.create({
        beneficiarioId: user.id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        estado: 'pendiente'
      });
    }

    loadRequests();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setReqToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reqToDelete) {
      await RequestService.delete(reqToDelete);
      loadRequests();
    }
  };

  const statusBadgeMap: Record<string, 'warning' | 'success' | 'danger' | 'neutral'> = {
    pendiente: 'warning',
    aprobada: 'success',
    rechazada: 'danger',
    completada: 'neutral',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Mis Solicitudes de Apoyo</h1>
          <p className="text-xs text-neutral-500 mt-1">Crea y gestiona tus solicitudes de ayuda en alimentos, apoyo escolar o medicamentos.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Nueva Solicitud
        </Button>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="Sin Solicitudes"
          description="Aún no has registrado ninguna solicitud de apoyo humanitario. Haz clic en el botón de arriba para registrar tu primera necesidad."
          actionText="Crear Solicitud"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <Table<Solicitud>
            headers={['Código', 'Título de la Solicitud', 'Descripción del Caso', 'Fecha de Registro', 'Estado Actual', 'Acciones']}
            data={requests}
            renderRow={(item) => (
              <tr key={item.id} className="hover:bg-neutral-50 text-xs">
                <td className="px-5 py-3 font-mono text-neutral-400">{item.id}</td>
                <td className="px-5 py-3 font-bold text-neutral-900">{item.titulo}</td>
                <td className="px-5 py-3 text-neutral-600 max-w-sm font-medium">{item.descripcion}</td>
                <td className="px-5 py-3 text-neutral-500 font-medium">{formatDate(item.fecha)}</td>
                <td className="px-5 py-3">
                  <Badge variant={statusBadgeMap[item.estado] || 'neutral'}>
                    {item.estado}
                  </Badge>
                </td>
                <td className="px-5 py-3 flex gap-2">
                  {item.estado === 'pendiente' ? (
                    <>
                      <button onClick={() => handleOpenEdit(item)} className="p-1 rounded text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenDelete(item.id)} className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-neutral-400 italic">No editable</span>
                  )}
                </td>
              </tr>
            )}
          />
        </div>
      )}

      {/* Modal Formulario Solicitud */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReq ? 'Editar Caso / Solicitud' : 'Registrar Nueva Solicitud de Apoyo'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Título de la Solicitud"
            placeholder="Ej: Apoyo alimentario familiar"
            error={errors.titulo?.message}
            {...register('titulo', { 
              required: 'El título de la solicitud es requerido',
              minLength: { value: 5, message: 'El título debe ser más descriptivo' }
            })}
          />

          <Textarea
            label="Describe detalladamente tus necesidades"
            placeholder="Por favor, especifica qué materiales necesitas, cuántas personas integran tu núcleo familiar o qué situación puntual atraviesas..."
            error={errors.descripcion?.message}
            rows={5}
            {...register('descripcion', { 
              required: 'La descripción del caso es obligatoria',
              minLength: { value: 15, message: 'Por favor, proporciona más detalles del caso (min. 15 caracteres)' }
            })}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Solicitud
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Retirar Solicitud de Ayuda"
        message="¿Está completamente seguro de retirar esta solicitud de apoyo? El equipo de asistencia dejará de procesar su solicitud inmediatamente."
      />
    </div>
  );
};
