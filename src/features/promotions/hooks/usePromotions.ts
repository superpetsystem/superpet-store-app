import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLoading, setError, setPromotions, setPrices, addPromotion, updatePromotion, deletePromotion } from '../../../store/slices/promotionsSlice';
import { promotionsApi } from '../api/promotionsApi';
import { Promotion, PriceTable, PromotionType } from '../../../types';

export const usePromotions = () => {
  const dispatch = useAppDispatch();
  const { promotions, prices, loading, error } = useAppSelector((state) => state.promotions);

  const loadPromotions = useCallback(async (params?: { active?: boolean; type?: PromotionType }) => {
    dispatch(setLoading(true));
    try {
      const response = await promotionsApi.promotions.getAll(params);
      if (response.success && response.data) {
        dispatch(setPromotions(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar promoções'));
    }
  }, [dispatch]);

  const loadPrices = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await promotionsApi.prices.getAll();
      if (response.success && response.data) {
        dispatch(setPrices(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar preços'));
    }
  }, [dispatch]);

  const createPromotion = useCallback(async (data: Omit<Promotion, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
    dispatch(setLoading(true));
    try {
      const response = await promotionsApi.promotions.create(data);
      if (response.success && response.data) {
        dispatch(addPromotion(response.data));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao criar promoção' };
    }
  }, [dispatch]);

  return { promotions, prices, loading, error, loadPromotions, loadPrices, createPromotion };
};

