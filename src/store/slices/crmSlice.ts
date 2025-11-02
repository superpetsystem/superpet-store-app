import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerInteraction, CustomerTag, CRMState } from '../../types';

const initialState: CRMState = {
  interactions: [],
  tags: [],
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setInteractions: (state, action: PayloadAction<CustomerInteraction[]>) => {
      state.interactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addInteraction: (state, action: PayloadAction<CustomerInteraction>) => {
      state.interactions.unshift(action.payload);
    },
    setTags: (state, action: PayloadAction<CustomerTag[]>) => {
      state.tags = action.payload;
    },
    addTag: (state, action: PayloadAction<CustomerTag>) => {
      state.tags.push(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setInteractions,
  addInteraction,
  setTags,
  addTag,
} = crmSlice.actions;

export default crmSlice.reducer;

