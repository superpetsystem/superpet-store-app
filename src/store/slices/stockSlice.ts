import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockState, StockMovement } from '../../types';

const initialState: StockState = {
  movements: [],
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMovements: (state, action: PayloadAction<StockMovement[]>) => {
      state.movements = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMovement: (state, action: PayloadAction<StockMovement>) => {
      state.movements.unshift(action.payload);
    },
    clearMovements: (state) => {
      state.movements = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setMovements,
  addMovement,
  clearMovements,
} = stockSlice.actions;

export default stockSlice.reducer;



