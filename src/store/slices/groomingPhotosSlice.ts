import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GroomingPhoto, GroomingPhotosState } from '../../types';

const initialState: GroomingPhotosState = {
  photos: [],
  loading: false,
  error: null,
};

const groomingPhotosSlice = createSlice({
  name: 'groomingPhotos',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPhotos: (state, action: PayloadAction<GroomingPhoto[]>) => {
      state.photos = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPhoto: (state, action: PayloadAction<GroomingPhoto>) => {
      state.photos.push(action.payload);
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setPhotos,
  addPhoto,
  deletePhoto,
} = groomingPhotosSlice.actions;

export default groomingPhotosSlice.reducer;

