import { useEffect, useState } from 'react';
import { User } from '../../domain/entities/User';
import { GetUserLocalUseCase } from '../../domain/useCases/userLocal/GetUserLocal';

export const useUserLocal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserSession = async () => {
    setLoading(true);
    const sessionUser = await GetUserLocalUseCase();
    setUser(sessionUser);
    setLoading(false);
  };

  useEffect(() => {
    getUserSession();
  }, []);

  return {
    user,
    loading,
    getUserSession,
  };
};
