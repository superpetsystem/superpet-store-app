import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PetsState, Pet } from '../../types';

const initialState: PetsState = {
  pets: [],
  selectedPet: null,
  loading: false,
  error: null,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.unshift(action.payload);
    },
    updatePet: (state, action: PayloadAction<Pet>) => {
      const index = state.pets.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = action.payload;
      }
      if (state.selectedPet?.id === action.payload.id) {
        state.selectedPet = action.payload;
      }
    },
    deletePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((p) => p.id !== action.payload);
      if (state.selectedPet?.id === action.payload) {
        state.selectedPet = null;
      }
    },
    setSelectedPet: (state, action: PayloadAction<Pet | null>) => {
      state.selectedPet = action.payload;
    },
    clearPets: (state) => {
      state.pets = [];
      state.selectedPet = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPets,
  addPet,
  updatePet,
  deletePet,
  setSelectedPet,
  clearPets,
} = petsSlice.actions;

export default petsSlice.reducer;




