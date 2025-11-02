import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentLink, PaymentTransaction, PaymentsState } from '../../types';

const initialState: PaymentsState = {
  paymentLinks: [],
  transactions: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPaymentLinks: (state, action: PayloadAction<PaymentLink[]>) => {
      state.paymentLinks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPaymentLink: (state, action: PayloadAction<PaymentLink>) => {
      state.paymentLinks.unshift(action.payload);
    },
    updatePaymentLink: (state, action: PayloadAction<PaymentLink>) => {
      const index = state.paymentLinks.findIndex(l => l.id === action.payload.id);
      if (index !== -1) {
        state.paymentLinks[index] = action.payload;
      }
    },
    setTransactions: (state, action: PayloadAction<PaymentTransaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<PaymentTransaction>) => {
      state.transactions.unshift(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setPaymentLinks,
  addPaymentLink,
  updatePaymentLink,
  setTransactions,
  addTransaction,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;

