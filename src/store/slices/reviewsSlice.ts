import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewsState } from '../../types';

const initialState: ReviewsState = {
  reviews: [],
  selectedReview: null,
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.unshift(action.payload);
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const index = state.reviews.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = action.payload;
      }
    },
    selectReview: (state, action: PayloadAction<Review | null>) => {
      state.selectedReview = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setReviews,
  addReview,
  updateReview,
  selectReview,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;

