import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServicesState, Service, ServiceAppointment } from '../../types';

const initialState: ServicesState = {
  services: [],
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
      state.loading = false;
      state.error = null;
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.services.unshift(action.payload);
    },
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter((s) => s.id !== action.payload);
    },
    setAppointments: (state, action: PayloadAction<ServiceAppointment[]>) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAppointment: (state, action: PayloadAction<ServiceAppointment>) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<ServiceAppointment>) => {
      const index = state.appointments.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.selectedAppointment?.id === action.payload.id) {
        state.selectedAppointment = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter((a) => a.id !== action.payload);
      if (state.selectedAppointment?.id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    setSelectedAppointment: (state, action: PayloadAction<ServiceAppointment | null>) => {
      state.selectedAppointment = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setServices,
  addService,
  updateService,
  deleteService,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setSelectedAppointment,
} = servicesSlice.actions;

export default servicesSlice.reducer;



