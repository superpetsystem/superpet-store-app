import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setLoading, setError, setReminders, setTemplates, addReminder, updateReminder, deleteReminder } from '../../../store/slices/remindersSlice';
import { remindersApi } from '../api/remindersApi';
import { Reminder, ReminderTemplate, ReminderStatus, ReminderType } from '../../../types';

export const useReminders = () => {
  const dispatch = useAppDispatch();
  const { reminders, templates, loading, error } = useAppSelector((state) => state.reminders);

  const loadReminders = useCallback(async (params?: { status?: ReminderStatus; type?: ReminderType }) => {
    dispatch(setLoading(true));
    try {
      const response = await remindersApi.getAll(params);
      if (response.success && response.data) {
        dispatch(setReminders(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar lembretes'));
    }
  }, [dispatch]);

  const loadTemplates = useCallback(async () => {
    try {
      const response = await remindersApi.templates.getAll();
      if (response.success && response.data) {
        dispatch(setTemplates(response.data));
      }
    } catch (err) {
      dispatch(setError('Erro ao carregar templates'));
    }
  }, [dispatch]);

  const createReminder = useCallback(async (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch(setLoading(true));
    try {
      const response = await remindersApi.create(data);
      if (response.success && response.data) {
        dispatch(addReminder(response.data));
        return { success: true, data: response.data };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao criar lembrete' };
    }
  }, [dispatch]);

  const sendReminder = useCallback(async (id: string) => {
    try {
      const response = await remindersApi.send(id);
      if (response.success && response.data) {
        dispatch(updateReminder(response.data));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: 'Erro ao enviar lembrete' };
    }
  }, [dispatch]);

  return { reminders, templates, loading, error, loadReminders, loadTemplates, createReminder, sendReminder };
};

