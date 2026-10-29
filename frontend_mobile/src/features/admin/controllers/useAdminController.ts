import { useState, useEffect, useCallback, useMemo } from 'react';
import { AdminService } from '../services/admin.service';
import { AdminStats, AdminUserItem, AdminAuditItem, CreateUserPayload, SupportedRole } from '../models/admin.models';

export function useAdminController() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalDonations: 0,
    pendingVerifications: 0,
  });
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [audits, setAudits] = useState<AdminAuditItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Todos');

  const loadData = useCallback(async () => {
    try {
      const [statsRes, usersRes, auditsRes] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getAllUsers(),
        AdminService.getRecentAudits(),
      ]);
      setStats(statsRes);
      setUsers(usersRes);
      setAudits(auditsRes);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        `${u.nombre1} ${u.nombre2 || ''} ${u.apellido1} ${u.apellido2 || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.telefono && u.telefono.includes(searchTerm));

      const matchesRole =
        selectedRole === 'Todos' ||
        u.rol.toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const handleCreateUser = async (payload: CreateUserPayload) => {
    setIsSubmitting(true);
    try {
      const res = await AdminService.createUser(payload);
      if (res.success && res.data) {
        setUsers((prev) => [res.data!, ...prev]);
        setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
        return { success: true, message: res.message || 'Usuario registrado con éxito.' };
      }
      return { success: false, message: res.message || 'No se pudo crear el usuario.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await AdminService.updateUser(user.id, { estado: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, estado: nextStatus } : u))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const handleUpdateUser = async (id: string | number, payload: Partial<AdminUserItem> & { password?: string }) => {
    setIsSubmitting(true);
    try {
      const res = await AdminService.updateUser(id, payload);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, ...payload } : u))
        );
        return { success: true, message: res.message || 'Usuario actualizado correctamente.' };
      }
      return { success: false, message: res.message || 'No se pudo actualizar el usuario.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión.' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string | number) => {
    try {
      await AdminService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return {
    stats,
    users,
    filteredUsers,
    audits,
    isLoading,
    refreshing,
    isSubmitting,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    onRefresh,
    handleCreateUser,
    handleUpdateUser,
    handleToggleStatus,
    handleDeleteUser,
  };
}

export default useAdminController;

