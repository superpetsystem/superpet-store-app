import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { stockApi } from '../api/stockApi';
import { StockMovement, PaginationParams } from '../../../types';

export const useStock = () => {
  const dispatch = useAppDispatch();
  const { movements, loading, error } = useAppSelector((state) => state.stock);

  // Buscar movimentações
  const fetchMovements = useCallback(
    async (params?: PaginationParams & { productId?: string; type?: string }) => {
      dispatch({ type: 'stock/setLoading', payload: true });
      try {
        const response = await stockApi.getMovements(params);
        if (response.success && response.data) {
          dispatch({ type: 'stock/setMovements', payload: response.data.data });
          dispatch({ type: 'stock/setError', payload: null });
        } else {
          dispatch({
            type: 'stock/setError',
            payload: response.error || 'Erro ao buscar movimentações',
          });
        }
      } catch (err) {
        dispatch({
          type: 'stock/setError',
          payload: 'Erro ao buscar movimentações',
        });
      } finally {
        dispatch({ type: 'stock/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar movimentação por ID
  const fetchMovementById = useCallback(
    async (id: string) => {
      dispatch({ type: 'stock/setLoading', payload: true });
      try {
        const response = await stockApi.getMovementById(id);
        if (response.success && response.data) {
          dispatch({ type: 'stock/setError', payload: null });
          return response.data;
        } else {
          dispatch({
            type: 'stock/setError',
            payload: response.error || 'Movimentação não encontrada',
          });
          return null;
        }
      } catch (err) {
        dispatch({
          type: 'stock/setError',
          payload: 'Erro ao buscar movimentação',
        });
        return null;
      } finally {
        dispatch({ type: 'stock/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar movimentações por produto
  const fetchMovementsByProduct = useCallback(
    async (productId: string) => {
      dispatch({ type: 'stock/setLoading', payload: true });
      try {
        const response = await stockApi.getMovementsByProduct(productId);
        if (response.success && response.data) {
          dispatch({ type: 'stock/setMovements', payload: response.data });
          dispatch({ type: 'stock/setError', payload: null });
          return response.data;
        } else {
          dispatch({
            type: 'stock/setError',
            payload: response.error || 'Erro ao buscar movimentações',
          });
          return [];
        }
      } catch (err) {
        dispatch({
          type: 'stock/setError',
          payload: 'Erro ao buscar movimentações',
        });
        return [];
      } finally {
        dispatch({ type: 'stock/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Criar movimentação
  const createMovement = useCallback(
    async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
      dispatch({ type: 'stock/setLoading', payload: true });
      try {
        const response = await stockApi.createMovement(movementData);
        if (response.success && response.data) {
          dispatch({ type: 'stock/addMovement', payload: response.data });
          dispatch({ type: 'stock/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({
            type: 'stock/setError',
            payload: response.error || 'Erro ao registrar movimentação',
          });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao registrar movimentação';
        dispatch({ type: 'stock/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'stock/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Deletar movimentação
  const deleteMovement = useCallback(
    async (id: string) => {
      dispatch({ type: 'stock/setLoading', payload: true });
      try {
        const response = await stockApi.deleteMovement(id);
        if (response.success) {
          dispatch({ type: 'stock/deleteMovement', payload: id });
          dispatch({ type: 'stock/setError', payload: null });
          return { success: true };
        } else {
          dispatch({
            type: 'stock/setError',
            payload: response.error || 'Erro ao excluir movimentação',
          });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao excluir movimentação';
        dispatch({ type: 'stock/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'stock/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar estatísticas
  const fetchMovementStats = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        const response = await stockApi.getMovementStats(startDate, endDate);
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        return null;
      }
    },
    []
  );

  // Buscar relatório
  const fetchMovementReport = useCallback(
    async (startDate: string, endDate: string) => {
      try {
        const response = await stockApi.getMovementReport(startDate, endDate);
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        return null;
      }
    },
    []
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: 'stock/setError', payload: null });
  }, [dispatch]);

  return {
    movements,
    loading,
    error,
    fetchMovements,
    fetchMovementById,
    fetchMovementsByProduct,
    createMovement,
    deleteMovement,
    fetchMovementStats,
    fetchMovementReport,
    clearError,
  };
};

