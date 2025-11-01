import React from 'react';
import AppointmentsPage from '../../features/appointments/components/AppointmentsPage';

const CustomerAppointmentsPage = () => {
  // Para customer, mostra apenas seus agendamentos
  // O componente AppointmentsPage pode ser usado tanto por owner quanto customer
  return <AppointmentsPage />;
};

export default CustomerAppointmentsPage;
