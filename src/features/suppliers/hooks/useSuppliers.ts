import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  selectSupplier,
} from '../../../store/slices/suppliersSlice';
import { suppliersApi } from '../api/suppliersApi';
import { Supplier, SupplierCategory } from '../../../types';

export const useSuppliers = () => {
  const dispatch = useAppDispatch();
  const { suppliers, selectedSupplier, loading, error } = useAppSelector(
    (state) => state.suppliers
  );

  const loadSuppliers = useCallback(
    async (params?: { category?: SupplierCategory; active?: boolean; search?: string }) => {
      dispatch(setLoading(true));
      try {
        const response = await suppliersApi.getAll(params);
        if (response.success && response.data) {
          dispatch(setSuppliers(response.data));
        } else {
          dispatch(setError('Erro ao carregar fornecedores'));
        }
      } catch (err) {
        dispatch(setError('Erro ao conectar com o servidor'));
      }
    },
    [dispatch]
  );

  const createSupplier = useCallback(
    async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await suppliersApi.create(data);
        if (response.success && response.data) {
          dispatch(addSupplier(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar fornecedor'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao criar fornecedor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  const editSupplier = useCallback(
    async (id: string, data: Partial<Supplier>) => {
      dispatch(setLoading(true));
      try {
        const response = await suppliersApi.update(id, data);
        if (response.success && response.data) {
          dispatch(updateSupplier(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar fornecedor'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar fornecedor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  const removeSupplier = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await suppliersApi.delete(id);
        if (response.success) {
          dispatch(deleteSupplier(id));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao deletar fornecedor'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao deletar fornecedor';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  const getStatistics = useCallback(async () => {
    try {
      const response = await suppliersApi.getStatistics();
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar estatísticas' };
    }
  }, []);

  const setSelectedSupplier = useCallback(
    (supplier: Supplier | null) => {
      dispatch(selectSupplier(supplier));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    suppliers,
    selectedSupplier,
    loading,
    error,
    loadSuppliers,
    createSupplier,
    editSupplier,
    removeSupplier,
    getStatistics,
    setSelectedSupplier,
    clearError,
  };
};

