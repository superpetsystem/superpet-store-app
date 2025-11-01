import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder, ReminderTemplate, RemindersState } from '../../types';

const initialState: RemindersState = {
  reminders: [],
  templates: [],
  selectedReminder: null,
  loading: false,
  error: null,
};

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTemplates: (state, action: PayloadAction<ReminderTemplate[]>) => {
      state.templates = action.payload;
    },
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(r => r.id !== action.payload);
      if (state.selectedReminder?.id === action.payload) {
        state.selectedReminder = null;
      }
    },
    selectReminder: (state, action: PayloadAction<Reminder | null>) => {
      state.selectedReminder = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setReminders,
  setTemplates,
  addReminder,
  updateReminder,
  deleteReminder,
  selectReminder,
} = remindersSlice.actions;

export default remindersSlice.reducer;

