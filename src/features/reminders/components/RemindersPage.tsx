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
  ListItemAvatar,
  Avatar,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications,
  CheckCircle,
  Schedule,
  Error,
  Email,
  Sms,
  WhatsApp,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { remindersApi } from '../api/remindersApi';
import { Reminder, ReminderTemplate, ReminderStatus } from '../../../types';

const RemindersPage = () => {
  const { isDark } = useThemeMode();
  const [tabValue, setTabValue] = useState(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [remindersRes, templatesRes] = await Promise.all([
      remindersApi.getAll(),
      remindersApi.templates.getAll(),
    ]);

    if (remindersRes.success && remindersRes.data) setReminders(remindersRes.data);
    if (templatesRes.success && templatesRes.data) setTemplates(templatesRes.data);
    setLoading(false);
  };

  const getStatusColor = (status: ReminderStatus) => {
    const colors = {
      pending: '#FF9800',
      sent: '#4CAF50',
      failed: '#F44336',
      cancelled: '#757575',
    };
    return colors[status];
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      email: <Email />,
      sms: <Sms />,
      whatsapp: <WhatsApp />,
      push: <Notifications />,
    };
    return icons[channel as keyof typeof icons] || <Notifications />;
  };

  const stats = {
    total: reminders.length,
    pending: reminders.filter(r => r.status === 'pending').length,
    sent: reminders.filter(r => r.status === 'sent').length,
    failed: reminders.filter(r => r.status === 'failed').length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
          >
            📲 Lembretes e Notificações
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Envie lembretes automáticos aos clientes
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            fontWeight: 600,
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Novo Lembrete
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0E6A6B', icon: <Notifications /> },
          { label: 'Pendentes', value: stats.pending, color: '#FF9800', icon: <Schedule /> },
          { label: 'Enviados', value: stats.sent, color: '#4CAF50', icon: <CheckCircle /> },
          { label: 'Falharam', value: stats.failed, color: '#F44336', icon: <Error /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? `1px solid ${stat.color}` : 'none',
              borderLeft: `4px solid ${stat.color}`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 40, height: 40 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            borderBottom: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
            '& .MuiTab-root': {
              color: isDark ? '#E6E1D6' : '#666',
              '&.Mui-selected': { color: '#E47B24' },
            },
            '& .MuiTabs-indicator': { bgcolor: '#E47B24' },
          }}
        >
          <Tab label="Lembretes" />
          <Tab label="Templates" />
        </Tabs>

        <CardContent>
          {/* Tab 1: Lembretes */}
          {tabValue === 0 && (
            <List sx={{ p: 0 }}>
              {reminders.map((reminder, index) => (
                <ListItem
                  key={reminder.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < reminders.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    '&:hover': { borderColor: '#E47B24' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(reminder.status) }}>
                      {getChannelIcon(reminder.channel)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                          {reminder.title}
                        </Typography>
                        <Chip
                          label={reminder.status}
                          size="small"
                          sx={{ bgcolor: getStatusColor(reminder.status), color: '#FFF' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                          👤 {reminder.customerName} {reminder.petName && `• 🐾 ${reminder.petName}`}
                        </Typography>
                        <Typography component="span" variant="caption" sx={{ color: isDark ? '#12888A' : '#999', display: 'block' }}>
                          📅 {new Date(reminder.scheduledDate).toLocaleDateString('pt-BR')} às {reminder.scheduledTime} • {reminder.channel.toUpperCase()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Tab 2: Templates */}
          {tabValue === 1 && (
            <List sx={{ p: 0 }}>
              {templates.map((template, index) => (
                <ListItem
                  key={template.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < templates.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2196F3' }}>
                      {getChannelIcon(template.channel)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>{template.name}</Typography>}
                    secondary={
                      <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                        {template.message.substring(0, 100)}...
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RemindersPage;

