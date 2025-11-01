import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { salesApi } from '../api/salesApi';
import { Sale, PaginationParams } from '../../../types';

export const useSales = () => {
  const dispatch = useAppDispatch();
  const { sales, currentSale, loading, error } = useAppSelector((state) => state.sales);

  const fetchSales = useCallback(
    async (params?: PaginationParams & { status?: string; customerId?: string }) => {
      dispatch({ type: 'sales/setLoading', payload: true });
      try {
        const response = await salesApi.getSales(params);
        if (response.success && response.data) {
          dispatch({ type: 'sales/setSales', payload: response.data.data });
          dispatch({ type: 'sales/setError', payload: null });
        } else {
          dispatch({ type: 'sales/setError', payload: response.error || 'Erro ao buscar vendas' });
        }
      } catch (err) {
        dispatch({ type: 'sales/setError', payload: 'Erro ao buscar vendas' });
      } finally {
        dispatch({ type: 'sales/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const createSale = useCallback(
    async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'sales/setLoading', payload: true });
      try {
        const response = await salesApi.createSale(saleData);
        if (response.success && response.data) {
          dispatch({ type: 'sales/addSale', payload: response.data });
          dispatch({ type: 'sales/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'sales/setError', payload: response.error || 'Erro ao registrar venda' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao registrar venda';
        dispatch({ type: 'sales/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'sales/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const fetchStats = useCallback(async () => {
    const response = await salesApi.getSalesStats();
    return response.success ? response.data : null;
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'sales/setError', payload: null });
  }, [dispatch]);

  return {
    sales,
    currentSale,
    loading,
    error,
    fetchSales,
    createSale,
    fetchStats,
    clearError,
  };
};

