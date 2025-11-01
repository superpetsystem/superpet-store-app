import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { serviceOrdersApi } from '../api/serviceOrdersApi';
import { ServiceOrder, PaginationParams } from '../../../types';

export const useServiceOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, selectedOrder, loading, error } = useAppSelector(
    (state) => state.serviceOrders
  );

  const fetchServiceOrders = useCallback(
    async (params?: PaginationParams & { status?: string; customerId?: string; petId?: string }) => {
      dispatch({ type: 'serviceOrders/setLoading', payload: true });
      try {
        const response = await serviceOrdersApi.getServiceOrders(params);
        if (response.success && response.data) {
          dispatch({ type: 'serviceOrders/setOrders', payload: response.data.data });
          dispatch({ type: 'serviceOrders/setError', payload: null });
        } else {
          dispatch({ type: 'serviceOrders/setError', payload: response.error || 'Erro ao buscar ordens' });
        }
      } catch (err) {
        dispatch({ type: 'serviceOrders/setError', payload: 'Erro ao buscar ordens' });
      } finally {
        dispatch({ type: 'serviceOrders/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const createServiceOrder = useCallback(
    async (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'serviceOrders/setLoading', payload: true });
      try {
        const response = await serviceOrdersApi.createServiceOrder(orderData);
        if (response.success && response.data) {
          dispatch({ type: 'serviceOrders/addOrder', payload: response.data });
          dispatch({ type: 'serviceOrders/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'serviceOrders/setError', payload: response.error || 'Erro ao criar ordem' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao criar ordem';
        dispatch({ type: 'serviceOrders/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'serviceOrders/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const updateServiceOrder = useCallback(
    async (id: string, orderData: Partial<ServiceOrder>) => {
      dispatch({ type: 'serviceOrders/setLoading', payload: true });
      try {
        const response = await serviceOrdersApi.updateServiceOrder(id, orderData);
        if (response.success && response.data) {
          dispatch({ type: 'serviceOrders/updateOrder', payload: response.data });
          dispatch({ type: 'serviceOrders/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'serviceOrders/setError', payload: response.error || 'Erro ao atualizar ordem' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar ordem';
        dispatch({ type: 'serviceOrders/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'serviceOrders/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const deleteServiceOrder = useCallback(
    async (id: string) => {
      dispatch({ type: 'serviceOrders/setLoading', payload: true });
      try {
        const response = await serviceOrdersApi.deleteServiceOrder(id);
        if (response.success) {
          dispatch({ type: 'serviceOrders/deleteOrder', payload: id });
          dispatch({ type: 'serviceOrders/setError', payload: null });
          return { success: true };
        } else {
          dispatch({ type: 'serviceOrders/setError', payload: response.error || 'Erro ao excluir ordem' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao excluir ordem';
        dispatch({ type: 'serviceOrders/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'serviceOrders/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  const checkIn = useCallback(
    async (id: string) => {
      const response = await serviceOrdersApi.checkIn(id);
      if (response.success && response.data) {
        dispatch({ type: 'serviceOrders/updateOrder', payload: response.data });
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    },
    [dispatch]
  );

  const checkOut = useCallback(
    async (id: string, groomerNotes?: string, afterPhotos?: string[]) => {
      const response = await serviceOrdersApi.checkOut(id, groomerNotes, afterPhotos);
      if (response.success && response.data) {
        dispatch({ type: 'serviceOrders/updateOrder', payload: response.data });
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    },
    [dispatch]
  );

  const markAsPaid = useCallback(
    async (id: string) => {
      const response = await serviceOrdersApi.markAsPaid(id);
      if (response.success && response.data) {
        dispatch({ type: 'serviceOrders/updateOrder', payload: response.data });
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    },
    [dispatch]
  );

  const fetchStats = useCallback(async () => {
    const response = await serviceOrdersApi.getServiceOrderStats();
    return response.success ? response.data : null;
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'serviceOrders/setError', payload: null });
  }, [dispatch]);

  return {
    orders,
    selectedOrder,
    loading,
    error,
    fetchServiceOrders,
    createServiceOrder,
    updateServiceOrder,
    deleteServiceOrder,
    checkIn,
    checkOut,
    markAsPaid,
    fetchStats,
    clearError,
  };
};

