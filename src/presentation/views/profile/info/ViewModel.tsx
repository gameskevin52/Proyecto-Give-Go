import { useState } from 'react';
import { RemoveUserLocalUseCase } from '../../../../domain/useCases/userLocal/RemoveUserLocal';
import { useUserLocal } from '../../../hooks/useUserLocal';
import { ApiDelivery } from '../../../../data/sources/remote/api/ApiDelivery';

export const ProfileInfoViewModel = (onSessionRemoved?: () => void) => {
  const { user, getUserSession } = useUserLocal();
  const [loggingOut, setLoggingOut] = useState(false);

  const removeSession = async () => {
    setLoggingOut(true);
    try {
      if (user?.session_token || user?.token) {
        await ApiDelivery.post('/logout', {
          token: user.session_token || user.token,
          id_usuario: user.id || user.id_usuario,
        }).catch(() => {});
      }
      await RemoveUserLocalUseCase();
      await getUserSession();
      if (onSessionRemoved) {
        onSessionRemoved();
      }
    } catch (err) {
      console.log('Error removing session:', err);
      await RemoveUserLocalUseCase();
      if (onSessionRemoved) {
        onSessionRemoved();
      }
    } finally {
      setLoggingOut(false);
    }
  };

  return {
    user,
    loggingOut,
    removeSession,
    getUserSession,
  };
};

export default ProfileInfoViewModel;
