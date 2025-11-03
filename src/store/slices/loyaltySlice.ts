import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoyaltyProgram, PointsTransaction, LoyaltyReward, LoyaltyState } from '../../types';

const initialState: LoyaltyState = {
  programs: [],
  transactions: [],
  rewards: [],
  loading: false,
  error: null,
};

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPrograms: (state, action: PayloadAction<LoyaltyProgram[]>) => {
      state.programs = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProgram: (state, action: PayloadAction<LoyaltyProgram>) => {
      const index = state.programs.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.programs[index] = action.payload;
      } else {
        state.programs.push(action.payload);
      }
    },
    setTransactions: (state, action: PayloadAction<PointsTransaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<PointsTransaction>) => {
      state.transactions.unshift(action.payload);
    },
    setRewards: (state, action: PayloadAction<LoyaltyReward[]>) => {
      state.rewards = action.payload;
    },
    addReward: (state, action: PayloadAction<LoyaltyReward>) => {
      state.rewards.push(action.payload);
    },
    updateReward: (state, action: PayloadAction<LoyaltyReward>) => {
      const index = state.rewards.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rewards[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setPrograms,
  updateProgram,
  setTransactions,
  addTransaction,
  setRewards,
  addReward,
  updateReward,
} = loyaltySlice.actions;

export default loyaltySlice.reducer;

