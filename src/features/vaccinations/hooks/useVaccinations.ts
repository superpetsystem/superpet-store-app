import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setVaccinations,
  addVaccination,
  updateVaccination,
  deleteVaccination,
  selectVaccination,
} from '../../../store/slices/vaccinationsSlice';
import { vaccinationsApi } from '../api/vaccinationsApi';
import { Vaccination, VaccineStatus } from '../../../types';

export const useVaccinations = () => {
  const dispatch = useAppDispatch();
  const { vaccinations, selectedVaccination, loading, error } = useAppSelector(
    (state) => state.vaccinations
  );

  // Carregar todas as vacinações
  const loadVaccinations = useCallback(
    async (params?: {
      petId?: string;
      status?: VaccineStatus;
      startDate?: string;
      endDate?: string;
    }) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.getAll(params);
        if (response.success && response.data) {
          dispatch(setVaccinations(response.data));
        } else {
          dispatch(setError(response.error || 'Erro ao carregar vacinações'));
        }
      } catch (err) {
        dispatch(setError('Erro ao conectar com o servidor'));
      }
    },
    [dispatch]
  );

  // Buscar vacinação por ID
  const loadVaccinationById = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.getById(id);
        if (response.success && response.data) {
          dispatch(selectVaccination(response.data));
        } else {
          dispatch(setError(response.error || 'Vacinação não encontrada'));
        }
      } catch (err) {
        dispatch(setError('Erro ao carregar vacinação'));
      }
    },
    [dispatch]
  );

  // Buscar vacinações por Pet
  const loadVaccinationsByPet = useCallback(
    async (petId: string) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.getByPet(petId);
        if (response.success && response.data) {
          dispatch(setVaccinations(response.data));
        } else {
          dispatch(setError(response.error || 'Erro ao carregar vacinações'));
        }
      } catch (err) {
        dispatch(setError('Erro ao carregar vacinações'));
      }
    },
    [dispatch]
  );

  // Criar nova vacinação
  const createVaccination = useCallback(
    async (data: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.create(data);
        if (response.success && response.data) {
          dispatch(addVaccination(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar vacinação'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao criar vacinação';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Atualizar vacinação
  const editVaccination = useCallback(
    async (id: string, data: Partial<Vaccination>) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.update(id, data);
        if (response.success && response.data) {
          dispatch(updateVaccination(response.data));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar vacinação'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar vacinação';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Deletar vacinação
  const removeVaccination = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await vaccinationsApi.delete(id);
        if (response.success) {
          dispatch(deleteVaccination(id));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao deletar vacinação'));
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao deletar vacinação';
        dispatch(setError(errorMsg));
        return { success: false, error: errorMsg };
      }
    },
    [dispatch]
  );

  // Obter vacinas próximas do vencimento
  const getUpcomingVaccinations = useCallback(async (days: number = 30) => {
    try {
      const response = await vaccinationsApi.getUpcoming(days);
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar vacinas próximas' };
    }
  }, []);

  // Obter vacinas vencidas
  const getOverdueVaccinations = useCallback(async () => {
    try {
      const response = await vaccinationsApi.getOverdue();
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar vacinas vencidas' };
    }
  }, []);

  // Obter estatísticas
  const getStatistics = useCallback(async (petId?: string) => {
    try {
      const response = await vaccinationsApi.getStatistics(petId);
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao carregar estatísticas' };
    }
  }, []);

  // Exportar carteira de vacinação
  const exportVaccinationCard = useCallback(async (petId: string) => {
    try {
      const response = await vaccinationsApi.exportVaccinationCard(petId);
      return response;
    } catch (err) {
      return { success: false, error: 'Erro ao exportar carteira' };
    }
  }, []);

  // Selecionar vacinação
  const setSelectedVaccination = useCallback(
    (vaccination: Vaccination | null) => {
      dispatch(selectVaccination(vaccination));
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    vaccinations,
    selectedVaccination,
    loading,
    error,
    loadVaccinations,
    loadVaccinationById,
    loadVaccinationsByPet,
    createVaccination,
    editVaccination,
    removeVaccination,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    getStatistics,
    exportVaccinationCard,
    setSelectedVaccination,
    clearError,
  };
};

