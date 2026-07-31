import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { DonationService, OrganizationService, CategoryService } from '../services/db';
import { Organizacion, Categoria } from '../types';
import { Button, Input, Select, Card, Alert, ConfirmDialog, Textarea, Radio } from '../components/UI';
import { Heart, CreditCard, Box, Landmark } from 'lucide-react';

interface DonationFormData {
  organizacionId: string;
  categoria: string;
  tipo: 'monetaria' | 'objeto';
  // Monetario
  metodo?: string;
  cuenta?: string;
  valor?: number;
  // Objeto
  objetoCategoria?: string;
  objetoDescripcion?: string;
  objetoCantidad?: number;
}

export const Donations: React.FC = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organizacion[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tempFormData, setTempFormData] = useState<DonationFormData | null>(null);

  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<DonationFormData>({
    defaultValues: {
      tipo: 'monetaria',
      metodo: 'tarjeta',
    }
  });

  const selectedTipo = watch('tipo');

  useEffect(() => {
    async function loadResources() {
      const orgs = await OrganizationService.getAll();
      setOrganizations(orgs);

      const cats = await CategoryService.getAll();
      setCategories(cats.filter(c => c.estado === 'activo'));
    }
    loadResources();
  }, []);

  const handlePreSubmit = (data: DonationFormData) => {
    setTempFormData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirmDonation = async () => {
    if (!tempFormData) return;
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const donorId = user ? user.id : 'anonimo';
      
      if (tempFormData.tipo === 'monetaria') {
        await DonationService.createMonetary(
          {
            categoria: tempFormData.categoria,
            usuarioId: donorId,
            organizacionId: tempFormData.organizacionId,
          },
          {
            metodo: tempFormData.metodo || 'tarjeta',
            cuenta: tempFormData.cuenta || 'Anonimo',
            valor: Number(tempFormData.valor || 0),
          }
        );
      } else {
        await DonationService.createObject(
          {
            categoria: tempFormData.categoria,
            usuarioId: donorId,
            organizacionId: tempFormData.organizacionId,
          },
          {
            categoria: tempFormData.objetoCategoria || tempFormData.categoria,
            descripcion: tempFormData.objetoDescripcion || '',
            cantidad: Number(tempFormData.objetoCantidad || 1),
          }
        );
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
      setTempFormData(null);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-wider">Centro de Donaciones</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Apoya de forma segura a nuestras organizaciones. Tu aportación directa es vital para mantener activos los proyectos sociales.
        </p>
      </div>

      {isSuccess && (
        <Alert 
          type="success" 
          message="¡Muchas gracias! Tu donación se ha registrado correctamente y el importe u objeto está asignado a la organización seleccionada." 
        />
      )}

      <Card
        title="Formulario de Aportación Solidaria"
        subtitle={user ? `Registrado como donante: ${user.nombre1} ${user.apellido1}` : 'Hacer una donación anónima (sin iniciar sesión)'}
      >
        <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destino */}
            <Select
              label="Organización Destino"
              error={errors.organizacionId?.message}
              options={[
                { value: '', label: 'Seleccionar Organización' },
                ...organizations.map(o => ({ value: o.id, label: o.nombre }))
              ]}
              {...register('organizacionId', { required: 'Debe seleccionar una organización de destino' })}
            />

            {/* Categoría General */}
            <Select
              label="Categoría de la causa"
              error={errors.categoria?.message}
              options={[
                { value: '', label: 'Seleccionar Categoría' },
                ...categories.map(c => ({ value: c.nombre, label: c.nombre }))
              ]}
              {...register('categoria', { required: 'Debe seleccionar una categoría' })}
            />
          </div>

          {/* Tipo de donación */}
          <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
            <span className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">Tipo de Donación</span>
            <div className="flex gap-8">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="monetaria"
                  className="w-4 h-4 text-red-600 border-neutral-300 focus:ring-red-500"
                  {...register('tipo')}
                />
                <span className="ml-2 text-sm text-neutral-800 font-semibold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-neutral-500" />
                  Monetaria (Económica)
                </span>
              </label>

              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="objeto"
                  className="w-4 h-4 text-red-600 border-neutral-300 focus:ring-red-500"
                  {...register('tipo')}
                />
                <span className="ml-2 text-sm text-neutral-800 font-semibold flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-neutral-500" />
                  Objetos / Insumos
                </span>
              </label>
            </div>
          </div>

          {/* Secciones Dinámicas */}
          {selectedTipo === 'monetaria' ? (
            <div className="border border-neutral-200 p-5 rounded space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide border-b border-neutral-100 pb-2">Detalle de Aportación Económica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Método de Pago"
                  options={[
                    { value: 'tarjeta', label: 'Tarjeta de Crédito / Débito' },
                    { value: 'transferencia', label: 'Transferencia Bancaria' },
                    { value: 'paypal', label: 'PayPal' }
                  ]}
                  {...register('metodo')}
                />

                <Input
                  type="number"
                  label="Valor (€ Euros)"
                  placeholder="Ej: 50"
                  error={errors.valor?.message}
                  {...register('valor', { 
                    required: selectedTipo === 'monetaria' ? 'El valor es requerido' : false,
                    min: { value: 1, message: 'La donación mínima es de 1€' }
                  })}
                />
              </div>

              <Input
                label="Identificador de Cuenta / Tarjeta"
                placeholder="Ej: ES12 3456 ... o número de tarjeta"
                error={errors.cuenta?.message}
                {...register('cuenta', { 
                  required: selectedTipo === 'monetaria' ? 'La cuenta o método identificativo es requerido' : false,
                  minLength: { value: 4, message: 'Formato demasiado corto' }
                })}
              />
            </div>
          ) : (
            <div className="border border-neutral-200 p-5 rounded space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide border-b border-neutral-100 pb-2">Detalle de Objetos / Materiales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Categoría del Objeto"
                  options={[
                    { value: 'Alimentos no perecederos', label: 'Alimentos no perecederos' },
                    { value: 'Material Escolar', label: 'Material Escolar' },
                    { value: 'Ropa y Calzado', label: 'Ropa y Calzado' },
                    { value: 'Medicamentos e Higiene', label: 'Medicamentos e Higiene' },
                    { value: 'Juguetes', label: 'Juguetes' },
                  ]}
                  {...register('objetoCategoria')}
                />

                <Input
                  type="number"
                  label="Cantidad / Peso (unidades o kg)"
                  placeholder="Ej: 10"
                  error={errors.objetoCantidad?.message}
                  {...register('objetoCantidad', {
                    required: selectedTipo === 'objeto' ? 'Especifique la cantidad' : false,
                    min: { value: 1, message: 'La cantidad mínima es de 1 unidad' }
                  })}
                />
              </div>

              <Textarea
                label="Descripción detallada"
                placeholder="Escriba marca, estado físico de conservación o fecha de vencimiento si aplica..."
                error={errors.objetoDescripcion?.message}
                {...register('objetoDescripcion', { 
                  required: selectedTipo === 'objeto' ? 'Escriba una descripción de los materiales' : false,
                  minLength: { value: 5, message: 'Proporcione más detalles' }
                })}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="primary" type="submit" isLoading={isLoading} className="w-full md:w-auto">
              Confirmar y Donar
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDonation}
        title="Confirmar Donación Solidaria"
        message={`¿Está seguro de registrar esta donación? Al confirmar, los fondos o los materiales descritos se registrarán a nombre de la organización beneficiaria.`}
        confirmText="Confirmar Donación"
        cancelText="Revisar Datos"
        type="primary"
      />
    </div>
  );
};
