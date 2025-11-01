import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLoading, setError, setUsers, setRoles, setAuditLogs, addUser, updateUser, deleteUser } from '../../../store/slices/usersSlice';
import { usersApi } from '../api/usersApi';
import { SystemUser, Role } from '../../../types';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, roles, auditLogs, loading, error } = useAppSelector((state) => state.users);

  const loadUsers = useCallback(async (params?: { roleId?: string; active?: boolean }) => {
    dispatch(setLoading(true));
    try {
      const response = await usersApi.getAll(params);
      if (response.success && response.data) {
        dispatch(setUsers(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar usuários'));
    }
  }, [dispatch]);

  const loadRoles = useCallback(async () => {
    try {
      const response = await usersApi.roles.getAll();
      if (response.success && response.data) {
        dispatch(setRoles(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar perfis'));
    }
  }, [dispatch]);

  const loadAuditLogs = useCallback(async (params?: { userId?: string; module?: string }) => {
    try {
      const response = await usersApi.auditLogs.getAll(params);
      if (response.success && response.data) {
        dispatch(setAuditLogs(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar logs'));
    }
  }, [dispatch]);

  const createUser = useCallback(async (data: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(setLoading(true));
    try {
      const response = await usersApi.create(data);
      if (response.success && response.data) {
        dispatch(addUser(response.data));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao criar usuário' };
    }
  }, [dispatch]);

  return { users, roles, auditLogs, loading, error, loadUsers, loadRoles, loadAuditLogs, createUser };
};

