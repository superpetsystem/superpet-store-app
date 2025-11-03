import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommissionRule, Commission, CommissionsState } from '../../types';

const initialState: CommissionsState = {
  rules: [],
  commissions: [],
  selectedRule: null,
  loading: false,
  error: null,
};

const commissionsSlice = createSlice({
  name: 'commissions',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRules: (state, action: PayloadAction<CommissionRule[]>) => {
      state.rules = action.payload;
      state.loading = false;
      state.error = null;
    },
    addRule: (state, action: PayloadAction<CommissionRule>) => {
      state.rules.push(action.payload);
    },
    updateRule: (state, action: PayloadAction<CommissionRule>) => {
      const index = state.rules.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.rules[index] = action.payload;
      }
    },
    deleteRule: (state, action: PayloadAction<string>) => {
      state.rules = state.rules.filter(r => r.id !== action.payload);
    },
    selectRule: (state, action: PayloadAction<CommissionRule | null>) => {
      state.selectedRule = action.payload;
    },
    setCommissions: (state, action: PayloadAction<Commission[]>) => {
      state.commissions = action.payload;
    },
    updateCommission: (state, action: PayloadAction<Commission>) => {
      const index = state.commissions.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.commissions[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setRules,
  addRule,
  updateRule,
  deleteRule,
  selectRule,
  setCommissions,
  updateCommission,
} = commissionsSlice.actions;

export default commissionsSlice.reducer;

