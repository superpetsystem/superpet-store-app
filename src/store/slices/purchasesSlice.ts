import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PurchaseOrder, PurchaseOrdersState } from '../../types';

const initialState: PurchaseOrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
    },
    selectOrder: (state, action: PayloadAction<PurchaseOrder | null>) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  selectOrder,
} = purchasesSlice.actions;

export default purchasesSlice.reducer;

