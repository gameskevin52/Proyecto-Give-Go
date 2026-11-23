import { useState, useEffect } from 'react';
import { Evento } from '../models/event.models';
import { eventFeatureService } from '../services/event.service';
import { useAuth } from '../../../store/auth/AuthContext';

export const useEventDetailController = (navigation: any, eventId: number) => {
  const { user } = useAuth();
  const [event, setEvent] = useState<Evento | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const data = await eventFeatureService.getById(eventId);
      setEvent(data);
    } catch (e: any) {
      setErrorMessage(e.message || 'Error al cargar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (tipo: 'voluntario' | 'beneficiario') => {
    if (!event) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const uid = user?.id_usuario || user?.id || '';
      const res =
        tipo === 'beneficiario'
          ? await eventFeatureService.applyBeneficiaryPostulacion(event.id_evento, uid)
          : await eventFeatureService.registerParticipant(event.id_evento, tipo, uid);
      if (res.success) {
        setSuccessMessage(
          tipo === 'beneficiario'
            ? 'Postulación enviada en estado En Revisión para aprobación de la organización.'
            : 'Inscripción como voluntario registrada con éxito.'
        );
        fetchEvent();
      } else {
        setErrorMessage(res.message || 'No se pudo completar la inscripción.');
      }
    } catch (e: any) {
      setErrorMessage(e.response?.data?.message || e.message || 'Error al inscribirse.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    user,
    event,
    isLoading,
    isSubmitting,
    successMessage,
    errorMessage,
    handleRegister,
    goBack,
  };
};

export default useEventDetailController;
