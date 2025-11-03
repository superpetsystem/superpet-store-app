import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setCustomers,
  addCustomer as addCustomerAction,
  updateCustomer as updateCustomerAction,
  deleteCustomer as deleteCustomerAction,
  setSelectedCustomer,
} from '../../../store/slices/customersSlice';
import { customersApi } from '../api/customersApi';
import { Customer, PaginationParams } from '../../../types';

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const { customers, selectedCustomer, loading, error } = useAppSelector((state) => state.customers);

  // Carregar clientes
  const fetchCustomers = useCallback(async (params?: PaginationParams) => {
    dispatch(setLoading(true));
    try {
      const response = await customersApi.getCustomers(params);
      if (response.success && response.data) {
        dispatch(setCustomers(response.data.data));
      } else {
        dispatch(setError(response.error || 'Erro ao carregar clientes'));
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
    }
  }, [dispatch]);

  // Buscar cliente por ID
  const fetchCustomerById = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      const response = await customersApi.getCustomerById(id);
      if (response.success && response.data) {
        dispatch(setSelectedCustomer(response.data));
        return response.data;
      } else {
        dispatch(setError(response.error || 'Cliente não encontrado'));
        return null;
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
      return null;
    }
  }, [dispatch]);

  // Criar cliente
  const createCustomer = useCallback(
    async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await customersApi.createCustomer(customerData);
        if (response.success && response.data) {
          dispatch(addCustomerAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar cliente'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao conectar com o servidor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Atualizar cliente
  const updateCustomer = useCallback(
    async (id: string, customerData: Partial<Customer>) => {
      dispatch(setLoading(true));
      try {
        const response = await customersApi.updateCustomer(id, customerData);
        if (response.success && response.data) {
          dispatch(updateCustomerAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar cliente'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao conectar com o servidor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Deletar cliente
  const deleteCustomer = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await customersApi.deleteCustomer(id);
        if (response.success) {
          dispatch(deleteCustomerAction(id));
          dispatch(setError(null));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao excluir cliente'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao conectar com o servidor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Buscar CEP
  const searchZipCode = useCallback(async (zipCode: string) => {
    try {
      const response = await customersApi.searchZipCode(zipCode);
      return response;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao buscar CEP',
      };
    }
  }, []);

  // Selecionar cliente
  const selectCustomer = useCallback(
    (customer: Customer | null) => {
      dispatch(setSelectedCustomer(customer));
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    customers,
    selectedCustomer,
    loading,
    error,
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchZipCode,
    selectCustomer,
    clearError,
  };
};




