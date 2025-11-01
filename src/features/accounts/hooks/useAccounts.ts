import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLoading, setError, setAccounts, addAccount, updateAccount, deleteAccount } from '../../../store/slices/accountsSlice';
import { accountsApi } from '../api/accountsApi';
import { AccountReceivable, AccountStatus, PaymentType } from '../../../types';

export const useAccounts = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector((state) => state.accounts);

  const loadAccounts = useCallback(async (params?: { status?: AccountStatus; customerId?: string }) => {
    dispatch(setLoading(true));
    try {
      const response = await accountsApi.getAll(params);
      if (response.success && response.data) {
        dispatch(setAccounts(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar contas'));
    }
  }, [dispatch]);

  const createAccount = useCallback(async (data: Omit<AccountReceivable, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(setLoading(true));
    try {
      const response = await accountsApi.create(data);
      if (response.success && response.data) {
        dispatch(addAccount(response.data));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao criar conta' };
    }
  }, [dispatch]);

  const markAsPaid = useCallback(async (id: string, paymentType: PaymentType) => {
    dispatch(setLoading(true));
    try {
      const response = await accountsApi.markAsPaid(id, paymentType);
      if (response.success && response.data) {
        dispatch(updateAccount(response.data));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao marcar como paga' };
    }
  }, [dispatch]);

  const getStatistics = useCallback(async () => {
    try {
      const response = await accountsApi.getStatistics();
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar estatísticas' };
    }
  }, []);

  return { accounts, loading, error, loadAccounts, createAccount, markAsPaid, getStatistics };
};

