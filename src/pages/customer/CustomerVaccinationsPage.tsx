import React from 'react';
import VaccinationsPage from '../../features/vaccinations/components/VaccinationsPage';

const CustomerVaccinationsPage = () => {
  // Para customer, mostra vacinações de todos os seus pets (sem filtro específico)
  return <VaccinationsPage isCustomerView={true} />;
};

export default CustomerVaccinationsPage;



