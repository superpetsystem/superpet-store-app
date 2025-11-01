import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalesState, Sale, SaleItem } from '../../types';

const initialState: SalesState = {
  sales: [],
  currentSale: null,
  loading: false,
  error: null,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSales: (state, action: PayloadAction<Sale[]>) => {
      state.sales = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSale: (state, action: PayloadAction<Sale>) => {
      state.sales.unshift(action.payload);
    },
    updateSale: (state, action: PayloadAction<Sale>) => {
      const index = state.sales.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sales[index] = action.payload;
      }
    },
    setCurrentSale: (state, action: PayloadAction<Sale | null>) => {
      state.currentSale = action.payload;
    },
    addItemToCurrentSale: (state, action: PayloadAction<SaleItem>) => {
      if (!state.currentSale) {
        return;
      }
      
      // Verifica se o item já existe
      const existingItemIndex = state.currentSale.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      
      if (existingItemIndex !== -1) {
        // Atualiza quantidade
        state.currentSale.items[existingItemIndex].quantity += action.payload.quantity;
        state.currentSale.items[existingItemIndex].total = 
          state.currentSale.items[existingItemIndex].quantity * 
          state.currentSale.items[existingItemIndex].unitPrice;
      } else {
        // Adiciona novo item
        state.currentSale.items.push(action.payload);
      }
      
      // Recalcula totais
      state.currentSale.subtotal = state.currentSale.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
      state.currentSale.total = state.currentSale.subtotal - state.currentSale.discount;
    },
    removeItemFromCurrentSale: (state, action: PayloadAction<string>) => {
      if (!state.currentSale) {
        return;
      }
      
      state.currentSale.items = state.currentSale.items.filter(
        (item) => item.id !== action.payload
      );
      
      // Recalcula totais
      state.currentSale.subtotal = state.currentSale.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
      state.currentSale.total = state.currentSale.subtotal - state.currentSale.discount;
    },
    updateItemQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      if (!state.currentSale) {
        return;
      }
      
      const item = state.currentSale.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.total = item.quantity * item.unitPrice;
        
        // Recalcula totais
        state.currentSale.subtotal = state.currentSale.items.reduce(
          (sum, item) => sum + item.total,
          0
        );
        state.currentSale.total = state.currentSale.subtotal - state.currentSale.discount;
      }
    },
    applyDiscount: (state, action: PayloadAction<number>) => {
      if (state.currentSale) {
        state.currentSale.discount = action.payload;
        state.currentSale.total = state.currentSale.subtotal - action.payload;
      }
    },
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSales,
  addSale,
  updateSale,
  setCurrentSale,
  addItemToCurrentSale,
  removeItemFromCurrentSale,
  updateItemQuantity,
  applyDiscount,
  clearCurrentSale,
} = salesSlice.actions;

export default salesSlice.reducer;



