// Validadores para o cadastro de clientes

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  // Valida se tem 10 ou 11 dígitos (com DDD)
  return cleaned.length === 10 || cleaned.length === 11;
};

export const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

export const validateZipCode = (zipCode: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = zipCode.replace(/\D/g, '');
  // Valida se tem 8 dígitos
  return cleaned.length === 8;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateCustomerForm = (data: any): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Nome (obrigatório)
  if (!validateRequired(data.name)) {
    errors.name = 'Nome é obrigatório';
  }

  // Email (obrigatório e válido)
  if (!validateRequired(data.email)) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email inválido';
  }

  // Telefone (obrigatório e válido)
  if (!validateRequired(data.phone)) {
    errors.phone = 'Telefone é obrigatório';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Telefone inválido';
  }

  // CPF (opcional, mas se preenchido deve ser válido)
  if (data.cpf && !validateCPF(data.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  // CEP (opcional, mas se preenchido deve ser válido)
  if (data.address?.zipCode && !validateZipCode(data.address.zipCode)) {
    errors.zipCode = 'CEP inválido';
  }

  // Endereço - se um campo estiver preenchido, alguns são obrigatórios
  if (data.address) {
    const hasAnyAddress =
      data.address.street ||
      data.address.number ||
      data.address.neighborhood ||
      data.address.city ||
      data.address.state ||
      data.address.zipCode;

    if (hasAnyAddress) {
      if (!validateRequired(data.address.street)) {
        errors.street = 'Rua é obrigatória';
      }
      if (!validateRequired(data.address.number)) {
        errors.number = 'Número é obrigatório';
      }
      if (!validateRequired(data.address.neighborhood)) {
        errors.neighborhood = 'Bairro é obrigatório';
      }
      if (!validateRequired(data.address.city)) {
        errors.city = 'Cidade é obrigatória';
      }
      if (!validateRequired(data.address.state)) {
        errors.state = 'Estado é obrigatório';
      }
      if (!validateRequired(data.address.zipCode)) {
        errors.zipCode = 'CEP é obrigatório';
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};



