import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications,
  CheckCircle,
  Schedule,
  Error,
  Send,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { remindersApi } from '../api/remindersApi';
import { Reminder } from '../../../types';
import { customersApi } from '../../customers/api/customersApi';

const RemindersPage = () => {
  const { isDark } = useThemeMode();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dialog, setDialog] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'vaccination' as 'vaccination' | 'appointment' | 'birthday' | 'general',
    channel: 'whatsapp' as 'email' | 'sms' | 'whatsapp' | 'push',
    message: '',
    scheduledFor: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [remRes, custRes] = await Promise.all([
      remindersApi.getAll(),
      customersApi.getCustomers({ page: 1, limit: 1000 }),
    ]);
    if (remRes.success && remRes.data) setReminders(remRes.data);
    if (custRes.success && custRes.data) setCustomers(custRes.data.items);
  };

  const handleCreate = async () => {
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const res = await remindersApi.create({
      ...formData,
      customerName: customer.name,
      petId: '',
      petName: '',
      status: 'pending',
    });

    if (res.success) {
      setDialog(false);
      setFormData({ customerId: '', type: 'vaccination', channel: 'whatsapp', message: '', scheduledFor: new Date().toISOString().split('T')[0] });
      loadData();
      alert('✅ Lembrete agendado!');
    }
  };

  const handleSend = async (id: string) => {
    const res = await remindersApi.send(id);
    if (res.success) {
      loadData();
      alert('✅ Lembrete enviado!');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = { pending: '#FF9800', sent: '#4CAF50', failed: '#F44336', cancelled: '#757575' };
    return colors[status as keyof typeof colors];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
            📲 Lembretes e Notificações
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Envie lembretes automáticos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Novo Lembrete
        </Button>
      </Box>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <List sx={{ p: 0 }}>
            {reminders.map((reminder, index) => (
              <ListItem
                key={reminder.id}
                sx={{
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  borderRadius: 2,
                  mb: index < reminders.length - 1 ? 2 : 0,
                  border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                }}
                secondaryAction={
                  reminder.status === 'pending' && (
                    <Button size="small" startIcon={<Send />} onClick={() => handleSend(reminder.id)} sx={{ color: '#4CAF50' }}>
                      Enviar Agora
                    </Button>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                        {reminder.customerName}
                      </Typography>
                      <Chip label={reminder.status} size="small" sx={{ bgcolor: getStatusColor(reminder.status), color: '#FFF' }} />
                      <Chip label={reminder.channel} size="small" sx={{ bgcolor: '#2196F3', color: '#FFF' }} />
                    </Box>
                  }
                  secondary={
                    <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {reminder.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📲 Novo Lembrete
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cliente"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                {(customers || []).map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="vaccination">💉 Vacinação</MenuItem>
                <MenuItem value="appointment">📅 Agendamento</MenuItem>
                <MenuItem value="birthday">🎂 Aniversário</MenuItem>
                <MenuItem value="general">📝 Geral</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Canal"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="push">Push</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mensagem"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.customerId || !formData.message} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Agendar Lembrete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RemindersPage;
