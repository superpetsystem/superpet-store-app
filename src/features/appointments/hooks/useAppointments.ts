import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  selectAppointment,
  setTimeBlocks,
  addTimeBlock,
  deleteTimeBlock,
} from '../../../store/slices/appointmentsSlice';
import { appointmentsApi } from '../api/appointmentsApi';
import { Appointment, AppointmentStatus, TimeBlock } from '../../../types';

export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, timeBlocks, selectedAppointment, loading, error } = useAppSelector(
    (state) => state.appointments
  );

  // Carregar todos os agendamentos
  const loadAppointments = useCallback(
    async (params?: {
      date?: string;
      startDate?: string;
      endDate?: string;
      status?: AppointmentStatus;
      customerId?: string;
      petId?: string;
      employeeId?: string;
    }) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.getAll(params);
        if (response.success && response.data) {
          dispatch(setAppointments(response.data));
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
  const loadAppointmentById = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.getById(id);
        if (response.success && response.data) {
          dispatch(selectAppointment(response.data));
        } else {
          dispatch(setError(response.error || 'Agendamento não encontrado'));
        }
      } catch (err) {
        dispatch(setError('Erro ao carregar agendamento'));
      }
    },
    [dispatch]
  );

  // Criar novo agendamento
  const createAppointment = useCallback(
    async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.create(data);
        if (response.success && response.data) {
          dispatch(addAppointment(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar agendamento'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao criar agendamento';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Atualizar agendamento
  const editAppointment = useCallback(
    async (id: string, data: Partial<Appointment>) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.update(id, data);
        if (response.success && response.data) {
          dispatch(updateAppointment(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar agendamento'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar agendamento';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Deletar agendamento
  const removeAppointment = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.delete(id);
        if (response.success) {
          dispatch(deleteAppointment(id));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao deletar agendamento'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao deletar agendamento';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Atualizar status
  const changeStatus = useCallback(
    async (id: string, status: AppointmentStatus) => {
      dispatch(setLoading(true));
      try {
        const response = await appointmentsApi.updateStatus(id, status);
        if (response.success && response.data) {
          dispatch(updateAppointment(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar status'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar status';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Verificar disponibilidade
  const checkAvailability = useCallback(
    async (date: string, startTime: string, endTime: string, excludeId?: string) => {
      try {
        const response = await appointmentsApi.checkAvailability(date, startTime, endTime, excludeId);
        return response;
      } catch (err) {
        return { success: false, error: 'Erro ao verificar disponibilidade' };
      }
    },
    []
  );

  // Carregar bloqueios de horário
  const loadTimeBlocks = useCallback(
    async (date?: string) => {
      try {
        const response = await appointmentsApi.timeBlocks.getAll(date);
        if (response.success && response.data) {
          dispatch(setTimeBlocks(response.data));
        }
      } catch (err) {
        dispatch(setError('Erro ao carregar bloqueios'));
      }
    },
    [dispatch]
  );

  // Criar bloqueio de horário
  const createTimeBlock = useCallback(
    async (data: Omit<TimeBlock, 'id' | 'createdAt'>) => {
      try {
        const response = await appointmentsApi.timeBlocks.create(data);
        if (response.success && response.data) {
          dispatch(addTimeBlock(response.data));
          return { success: true, data: response.data };
        } else {
          return { success: false, error: response.error };
        }
      } catch (err) {
        return { success: false, error: 'Erro ao criar bloqueio' };
      }
    },
    [dispatch]
  );

  // Deletar bloqueio de horário
  const removeTimeBlock = useCallback(
    async (id: string) => {
      try {
        const response = await appointmentsApi.timeBlocks.delete(id);
        if (response.success) {
          dispatch(deleteTimeBlock(id));
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch (err) {
        return { success: false, error: 'Erro ao deletar bloqueio' };
      }
    },
    [dispatch]
  );

  // Obter estatísticas
  const getStatistics = useCallback(async (startDate: string, endDate: string) => {
    try {
      const response = await appointmentsApi.getStatistics(startDate, endDate);
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar estatísticas' };
    }
  }, []);

  // Selecionar agendamento
  const setSelectedAppointment = useCallback(
    (appointment: Appointment | null) => {
      dispatch(selectAppointment(appointment));
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    appointments,
    timeBlocks,
    selectedAppointment,
    loading,
    error,
    loadAppointments,
    loadAppointmentById,
    createAppointment,
    editAppointment,
    removeAppointment,
    changeStatus,
    checkAvailability,
    loadTimeBlocks,
    createTimeBlock,
    removeTimeBlock,
    getStatistics,
    setSelectedAppointment,
    clearError,
  };
};

