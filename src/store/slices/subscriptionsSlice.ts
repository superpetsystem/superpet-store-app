import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionDelivery, SubscriptionsState } from '../../types';

const initialState: SubscriptionsState = {
  subscriptions: [],
  deliveries: [],
  selectedSubscription: null,
  loading: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscriptions.unshift(action.payload);
    },
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.subscriptions[index] = action.payload;
      }
    },
    deleteSubscription: (state, action: PayloadAction<string>) => {
      state.subscriptions = state.subscriptions.filter(s => s.id !== action.payload);
    },
    selectSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.selectedSubscription = action.payload;
    },
    setDeliveries: (state, action: PayloadAction<SubscriptionDelivery[]>) => {
      state.deliveries = action.payload;
    },
    addDelivery: (state, action: PayloadAction<SubscriptionDelivery>) => {
      state.deliveries.unshift(action.payload);
    },
    updateDelivery: (state, action: PayloadAction<SubscriptionDelivery>) => {
      const index = state.deliveries.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.deliveries[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  selectSubscription,
  setDeliveries,
  addDelivery,
  updateDelivery,
} = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;

