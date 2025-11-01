import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountReceivable, AccountsReceivableState } from '../../types';

const initialState: AccountsReceivableState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAccounts: (state, action: PayloadAction<AccountReceivable[]>) => {
      state.accounts = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAccount: (state, action: PayloadAction<AccountReceivable>) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<AccountReceivable>) => {
      const index = state.accounts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
      if (state.selectedAccount?.id === action.payload) {
        state.selectedAccount = null;
      }
    },
    selectAccount: (state, action: PayloadAction<AccountReceivable | null>) => {
      state.selectedAccount = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  selectAccount,
} = accountsSlice.actions;

export default accountsSlice.reducer;

