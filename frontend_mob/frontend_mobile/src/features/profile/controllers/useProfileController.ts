import { useState, useEffect } from 'react';
import { useAuth } from '../../../store/auth/AuthContext';
import { profileFeatureService } from '../services/profile.service';
import { UserProfile } from '../models/profile.models';

export const useProfileController = (navigation: any) => {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(user as UserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileFeatureService.getProfile();
      if (data) {
        setProfile(data);
        updateUser(data);
      }
    } catch (e) {
      console.warn('Error al cargar perfil:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const navigateToEdit = () => {
    navigation.navigate('EditProfile', { profile });
  };

  const handleLogout = async () => {
    await logout();
  };

  return {
    user: profile || (user as UserProfile),
    isLoading,
    fetchProfile,
    navigateToEdit,
    handleLogout,
  };
};

export default useProfileController;
