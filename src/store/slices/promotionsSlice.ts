import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Promotion, PriceTable, PromotionsState } from '../../types';

const initialState: PromotionsState = {
  prices: [],
  promotions: [],
  selectedPromotion: null,
  loading: false,
  error: null,
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPrices: (state, action: PayloadAction<PriceTable[]>) => {
      state.prices = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPromotion: (state, action: PayloadAction<Promotion>) => {
      state.promotions.push(action.payload);
    },
    updatePromotion: (state, action: PayloadAction<Promotion>) => {
      const index = state.promotions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.promotions[index] = action.payload;
      }
    },
    deletePromotion: (state, action: PayloadAction<string>) => {
      state.promotions = state.promotions.filter(p => p.id !== action.payload);
      if (state.selectedPromotion?.id === action.payload) {
        state.selectedPromotion = null;
      }
    },
    selectPromotion: (state, action: PayloadAction<Promotion | null>) => {
      state.selectedPromotion = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setPromotions,
  setPrices,
  addPromotion,
  updatePromotion,
  deletePromotion,
  selectPromotion,
} = promotionsSlice.actions;

export default promotionsSlice.reducer;

