// Formatadores para dados de clientes

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // (11) 91234-5678
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    // (11) 1234-5678
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone;
};

export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // 123.456.789-00
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

export const formatZipCode = (zipCode: string): string => {
  const cleaned = zipCode.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    // 01234-567
    return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  
  return zipCode;
};

export const unformatPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

export const unformatZipCode = (zipCode: string): string => {
  return zipCode.replace(/\D/g, '');
};

export const formatFullAddress = (address: any): string => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
    address.zipCode ? formatZipCode(address.zipCode) : null,
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const getInitials = (name: string): string => {
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};



