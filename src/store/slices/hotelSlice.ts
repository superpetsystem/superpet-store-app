import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HotelRoom, HotelReservation, HotelActivity, HotelState } from '../../types';

const initialState: HotelState = {
  rooms: [],
  reservations: [],
  activities: [],
  selectedReservation: null,
  loading: false,
  error: null,
};

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRooms: (state, action: PayloadAction<HotelRoom[]>) => {
      state.rooms = action.payload;
    },
    setReservations: (state, action: PayloadAction<HotelReservation[]>) => {
      state.reservations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReservation: (state, action: PayloadAction<HotelReservation>) => {
      state.reservations.unshift(action.payload);
    },
    updateReservation: (state, action: PayloadAction<HotelReservation>) => {
      const index = state.reservations.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    selectReservation: (state, action: PayloadAction<HotelReservation | null>) => {
      state.selectedReservation = action.payload;
    },
    setActivities: (state, action: PayloadAction<HotelActivity[]>) => {
      state.activities = action.payload;
    },
    addActivity: (state, action: PayloadAction<HotelActivity>) => {
      state.activities.unshift(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setRooms,
  setReservations,
  addReservation,
  updateReservation,
  selectReservation,
  setActivities,
  addActivity,
} = hotelSlice.actions;

export default hotelSlice.reducer;

