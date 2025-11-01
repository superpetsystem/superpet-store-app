import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vaccination, VaccinationsState } from '../../types';

const initialState: VaccinationsState = {
  vaccinations: [],
  selectedVaccination: null,
  loading: false,
  error: null,
};

const vaccinationsSlice = createSlice({
  name: 'vaccinations',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Vaccinations
    setVaccinations: (state, action: PayloadAction<Vaccination[]>) => {
      state.vaccinations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addVaccination: (state, action: PayloadAction<Vaccination>) => {
      state.vaccinations.push(action.payload);
    },
    updateVaccination: (state, action: PayloadAction<Vaccination>) => {
      const index = state.vaccinations.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.vaccinations[index] = action.payload;
      }
    },
    deleteVaccination: (state, action: PayloadAction<string>) => {
      state.vaccinations = state.vaccinations.filter(v => v.id !== action.payload);
      if (state.selectedVaccination?.id === action.payload) {
        state.selectedVaccination = null;
      }
    },
    selectVaccination: (state, action: PayloadAction<Vaccination | null>) => {
      state.selectedVaccination = action.payload;
    },

    // Clear
    clearVaccinations: (state) => {
      state.vaccinations = [];
      state.selectedVaccination = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setVaccinations,
  addVaccination,
  updateVaccination,
  deleteVaccination,
  selectVaccination,
  clearVaccinations,
} = vaccinationsSlice.actions;

export default vaccinationsSlice.reducer;

