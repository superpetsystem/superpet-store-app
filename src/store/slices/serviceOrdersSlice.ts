import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceOrdersState, ServiceOrder } from '../../types';

const initialState: ServiceOrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const serviceOrdersSlice = createSlice({
  name: 'serviceOrders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setOrders: (state, action: PayloadAction<ServiceOrder[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<ServiceOrder>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<ServiceOrder>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      if (state.selectedOrder?.id === action.payload) {
        state.selectedOrder = null;
      }
    },
    setSelectedOrder: (state, action: PayloadAction<ServiceOrder | null>) => {
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
  setSelectedOrder,
} = serviceOrdersSlice.actions;

export default serviceOrdersSlice.reducer;



