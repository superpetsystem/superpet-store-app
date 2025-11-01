import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setLoading,
  setError,
  setPets,
  addPet as addPetAction,
  updatePet as updatePetAction,
  deletePet as deletePetAction,
  setSelectedPet,
} from '../../../store/slices/petsSlice';
import { petsApi } from '../api/petsApi';
import { Pet, PaginationParams } from '../../../types';

export const usePets = () => {
  const dispatch = useAppDispatch();
  const { pets, selectedPet, loading, error } = useAppSelector((state) => state.pets);

  // Carregar pets
  const fetchPets = useCallback(async (params?: PaginationParams & { customerId?: string }) => {
    dispatch(setLoading(true));
    try {
      const response = await petsApi.getPets(params);
      if (response.success && response.data) {
        dispatch(setPets(response.data.data));
      } else {
        dispatch(setError(response.error || 'Erro ao carregar pets'));
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
    }
  }, [dispatch]);

  // Buscar pet por ID
  const fetchPetById = useCallback(async (id: string) => {
    dispatch(setLoading(true));
    try {
      const response = await petsApi.getPetById(id);
      if (response.success && response.data) {
        dispatch(setSelectedPet(response.data));
        return response.data;
      } else {
        dispatch(setError(response.error || 'Pet não encontrado'));
        return null;
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
      return null;
    }
  }, [dispatch]);

  // Buscar pets por cliente
  const fetchPetsByCustomer = useCallback(async (customerId: string) => {
    dispatch(setLoading(true));
    try {
      const response = await petsApi.getPetsByCustomer(customerId);
      if (response.success && response.data) {
        dispatch(setPets(response.data));
        return response.data;
      } else {
        dispatch(setError(response.error || 'Erro ao carregar pets'));
        return [];
      }
    } catch (err) {
      dispatch(setError('Erro ao conectar com o servidor'));
      return [];
    }
  }, [dispatch]);

  // Criar pet
  const createPet = useCallback(
    async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setLoading(true));
      try {
        const response = await petsApi.createPet(petData);
        if (response.success && response.data) {
          dispatch(addPetAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao criar pet'));
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

  // Atualizar pet
  const updatePet = useCallback(
    async (id: string, petData: Partial<Pet>) => {
      dispatch(setLoading(true));
      try {
        const response = await petsApi.updatePet(id, petData);
        if (response.success && response.data) {
          dispatch(updatePetAction(response.data));
          dispatch(setError(null));
          return { success: true, data: response.data };
        } else {
          dispatch(setError(response.error || 'Erro ao atualizar pet'));
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

  // Deletar pet
  const deletePet = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const response = await petsApi.deletePet(id);
        if (response.success) {
          dispatch(deletePetAction(id));
          dispatch(setError(null));
          return { success: true };
        } else {
          dispatch(setError(response.error || 'Erro ao excluir pet'));
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

  // Obter estatísticas
  const fetchPetStats = useCallback(async () => {
    try {
      const response = await petsApi.getPetStats();
      return response;
    } catch (err) {
      return {
        success: false,
        error: 'Erro ao buscar estatísticas',
      };
    }
  }, []);

  // Selecionar pet
  const selectPet = useCallback(
    (pet: Pet | null) => {
      dispatch(setSelectedPet(pet));
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  return {
    pets,
    selectedPet,
    loading,
    error,
    fetchPets,
    fetchPetById,
    fetchPetsByCustomer,
    createPet,
    updatePet,
    deletePet,
    fetchPetStats,
    selectPet,
    clearError,
  };
};



