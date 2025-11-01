import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Supplier, SuppliersState } from '../../types';

const initialState: SuppliersState = {
  suppliers: [],
  selectedSupplier: null,
  loading: false,
  error: null,
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      if (state.selectedSupplier?.id === action.payload) {
        state.selectedSupplier = null;
      }
    },
    selectSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.selectedSupplier = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  selectSupplier,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;

