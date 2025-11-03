import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryCount, InventoryAdjustment, InventoryState } from '../../types';

const initialState: InventoryState = {
  counts: [],
  adjustments: [],
  selectedCount: null,
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCounts: (state, action: PayloadAction<InventoryCount[]>) => {
      state.counts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCount: (state, action: PayloadAction<InventoryCount>) => {
      state.counts.unshift(action.payload);
    },
    updateCount: (state, action: PayloadAction<InventoryCount>) => {
      const index = state.counts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.counts[index] = action.payload;
      }
    },
    selectCount: (state, action: PayloadAction<InventoryCount | null>) => {
      state.selectedCount = action.payload;
    },
    setAdjustments: (state, action: PayloadAction<InventoryAdjustment[]>) => {
      state.adjustments = action.payload;
    },
    addAdjustment: (state, action: PayloadAction<InventoryAdjustment>) => {
      state.adjustments.unshift(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setCounts,
  addCount,
  updateCount,
  selectCount,
  setAdjustments,
  addAdjustment,
} = inventorySlice.actions;

export default inventorySlice.reducer;

