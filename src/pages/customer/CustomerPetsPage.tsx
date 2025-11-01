import React from 'react';
import { useAppSelector } from '../../store/hooks';
import PetsPage from '../../features/pets/components/PetsPage';

const CustomerPetsPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  // Para customer, mostra apenas pets do próprio usuário
  return <PetsPage customerId={user?.id} />;
};

export default CustomerPetsPage;

