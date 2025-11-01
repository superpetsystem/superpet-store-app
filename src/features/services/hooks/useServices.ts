import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setServices,
  addService as addServiceAction,
  updateService as updateServiceAction,
  deleteService as deleteServiceAction,
  setAppointments,
  addAppointment as addAppointmentAction,
  updateAppointment as updateAppointmentAction,
  deleteAppointment as deleteAppointmentAction,
  setSelectedAppointment,
} from '../../../store/slices/servicesSlice';
import { servicesApi } from '../api/servicesApi';
import { Service, ServiceAppointment, PaginationParams } from '../../../types';

export const useServices = () => {
  const dispatch = useAppDispatch();
  const { services, appointments, selectedAppointment, loading, error } = useAppSelector((state) => state.services);

  // ========== SERVIÇOS ==========

  // Carregar serviços
  const fetchServices = useCallback(async (params?: PaginationParams) => {
    dispatch(setLoading(true));
    try {
      const response = await servicesApi.getServices(params);
      if (response.success && response.data) {
        dispatch(setServices(response.data.data));
      } else {
        dispatch(setError(response.error || 'Erro ao carregar serviços'));
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
    }
  }, [dispatch]);

  // Buscar serviço por ID
  const fetchServiceById = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      const response = await servicesApi.getServiceById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        dispatch(setError(response.error || 'Serviço não encontrado'));
        return null;
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Criar serviço
  const createService = useCallback(
    async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.createService(serviceData);
        if (response.success && response.data) {
          dispatch(addServiceAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar serviço'));
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

  // Atualizar serviço
  const updateService = useCallback(
    async (id: string, serviceData: Partial<Service>) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.updateService(id, serviceData);
        if (response.success && response.data) {
          dispatch(updateServiceAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar serviço'));
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

  // Deletar serviço
  const deleteService = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.deleteService(id);
        if (response.success) {
          dispatch(deleteServiceAction(id));
          dispatch(setError(null));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao excluir serviço'));
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

  // ========== AGENDAMENTOS ==========

  // Carregar agendamentos
  const fetchAppointments = useCallback(
    async (params?: PaginationParams & { date?: string; status?: string; customerId?: string }) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.getAppointments(params);
        if (response.success && response.data) {
          dispatch(setAppointments(response.data.data));
        } else {
          dispatch(setError(response.error || 'Erro ao carregar agendamentos'));
        }
      } catch (err) {
        dispatch(setError('Erro ao conectar com o servidor'));
      }
    },
    [dispatch]
  );

  // Buscar agendamento por ID
  const fetchAppointmentById = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      const response = await servicesApi.getAppointmentById(id);
      if (response.success && response.data) {
        dispatch(setSelectedAppointment(response.data));
        return response.data;
      } else {
        dispatch(setError(response.error || 'Agendamento não encontrado'));
        return null;
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Criar agendamento
  const createAppointment = useCallback(
    async (appointmentData: Omit<ServiceAppointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.createAppointment(appointmentData);
        if (response.success && response.data) {
          dispatch(addAppointmentAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar agendamento'));
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

  // Atualizar agendamento
  const updateAppointment = useCallback(
    async (id: string, appointmentData: Partial<ServiceAppointment>) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.updateAppointment(id, appointmentData);
        if (response.success && response.data) {
          dispatch(updateAppointmentAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar agendamento'));
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

  // Cancelar agendamento
  const cancelAppointment = useCallback(
    async (id: string) => {
      return updateAppointment(id, { status: 'cancelled' });
    },
    [updateAppointment]
  );

  // Deletar agendamento
  const deleteAppointment = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await servicesApi.deleteAppointment(id);
        if (response.success) {
          dispatch(deleteAppointmentAction(id));
          dispatch(setError(null));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao excluir agendamento'));
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

  // Buscar horários disponíveis
  const fetchAvailableSlots = useCallback(async (date: string, serviceId: string) => {
    try {
      const response = await servicesApi.getAvailableSlots(date, serviceId);
      return response;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao buscar horários disponíveis',
      };
    }
  }, []);

  // Selecionar agendamento
  const selectAppointment = useCallback(
    (appointment: ServiceAppointment | null) => {
      dispatch(setSelectedAppointment(appointment));
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    services,
    appointments,
    selectedAppointment,
    loading,
    error,
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    fetchAvailableSlots,
    selectAppointment,
    clearError,
  };
};



