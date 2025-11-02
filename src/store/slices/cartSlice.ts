import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, Order, CartState } from '../../types';

const initialState: CartState = {
  cart: null,
  orders: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearCart: (state) => {
      state.cart = null;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setCart,
  clearCart,
  setOrders,
  addOrder,
  updateOrder,
} = cartSlice.actions;

export default cartSlice.reducer;

