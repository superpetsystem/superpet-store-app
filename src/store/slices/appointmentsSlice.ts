import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, TimeBlock, AppointmentsState } from '../../types';

const initialState: AppointmentsState = {
  appointments: [],
  timeBlocks: [],
  selectedAppointment: null,
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
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

    // Appointments
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
      if (state.selectedAppointment?.id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    selectAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },

    // Time Blocks
    setTimeBlocks: (state, action: PayloadAction<TimeBlock[]>) => {
      state.timeBlocks = action.payload;
    },
    addTimeBlock: (state, action: PayloadAction<TimeBlock>) => {
      state.timeBlocks.push(action.payload);
    },
    deleteTimeBlock: (state, action: PayloadAction<string>) => {
      state.timeBlocks = state.timeBlocks.filter(tb => tb.id !== action.payload);
    },

    // Clear
    clearAppointments: (state) => {
      state.appointments = [];
      state.selectedAppointment = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  selectAppointment,
  setTimeBlocks,
  addTimeBlock,
  deleteTimeBlock,
  clearAppointments,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;

